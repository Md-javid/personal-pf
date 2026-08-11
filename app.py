"""
Ask-Javid backend
==================
A small RAG (Retrieval-Augmented Generation) chatbot that answers questions
ABOUT Javid, grounded in knowledge_base.json, generated through the Gemini API.

Architecture (deliberately simple — no vector DB needed for this dataset size):
  1. On startup, every chunk in knowledge_base.json is vectorized with TF-IDF.
  2. On each request, the user's message is vectorized the same way and
     compared against every chunk with cosine similarity.
  3. The top-K most relevant chunks are stuffed into the Gemini prompt as
     grounding context, alongside a persona system instruction.
  4. If the Gemini free-tier quota is exhausted (HTTP 429 / RESOURCE_EXHAUSTED),
     the backend still responds — in character — instead of throwing a
     generic 500 error at the frontend.

Run locally:
    pip install -r requirements.txt
    cp .env.example .env      # then paste your Gemini API key in
    uvicorn app:app --reload --port 8787

Swap GEMINI_MODEL in .env if you have access to a newer/cheaper model.
"""

import json
import os
import random
from pathlib import Path
from typing import List, Literal

import requests
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
# gemini-2.5-flash is a good stable default for a free-tier chatbot like this.
# If you have access to a newer model on your account, just change this.
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
)

TOP_K = 4  # how many knowledge chunks to retrieve per question

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = FastAPI(title="Ask Javid API")

# Allow configuring CORS origins for production deployment via ALLOWED_ORIGINS in .env
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Email & WhatsApp Notifications
# Configure SMTP_USER and SMTP_PASSWORD in .env for live email sending
# ---------------------------------------------------------------------------
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
JAVID_EMAIL = "connectjavid27@gmail.com"

WHATSAPP_PHONE = os.getenv("WHATSAPP_PHONE", "")
WHATSAPP_API_KEY = os.getenv("WHATSAPP_API_KEY", "")

def send_whatsapp_notification(message: str):
    """Send free WhatsApp notification to Javid's phone via CallMeBot API."""
    if not WHATSAPP_PHONE or not WHATSAPP_API_KEY:
        print(f"[WhatsApp Alert]: {message}")
        return
    try:
        url = "https://api.callmebot.com/whatsapp.php"
        params = {
            "phone": WHATSAPP_PHONE,
            "text": message,
            "apikey": WHATSAPP_API_KEY
        }
        requests.get(url, params=params, timeout=5)
    except Exception as e:
        print(f"Error sending WhatsApp notification: {e}")

def send_meeting_email(date: str, time: str, email: str, description: str):
    """Email notification sent to Javid when a meeting is booked."""
    subject = f"New Meeting Scheduled: {date} at {time}"
    body = (
        f"A new meeting has been arranged via your portfolio chatbot!\n\n"
        f"Date: {date}\n"
        f"Time: {time}\n"
        f"Visitor Email: {email}\n"
        f"Description / Topic: {description}\n"
    )
    
    send_whatsapp_notification(f"📅 New Meeting Scheduled!\nDate: {date}\nTime: {time}\nEmail: {email}\nTopic: {description}")

    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"[Meeting Email Logged - set SMTP_USER & SMTP_PASSWORD in .env to send live emails]:\n{body}")
        return

    try:
        import smtplib
        from email.mime.text import MIMEText
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = SMTP_USER
        msg['To'] = JAVID_EMAIL

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, [JAVID_EMAIL], msg.as_string())
    except Exception as e:
        print(f"Error sending meeting email: {e}")

# ---------------------------------------------------------------------------
# RAG index — built once at startup
# ---------------------------------------------------------------------------
KB_PATH = Path(__file__).parent / "knowledge_base.json"
with open(KB_PATH, "r", encoding="utf-8") as f:
    KNOWLEDGE_BASE = json.load(f)

CHUNK_TEXTS = [c["text"] for c in KNOWLEDGE_BASE]
VECTORIZER = TfidfVectorizer(stop_words="english")
CHUNK_MATRIX = VECTORIZER.fit_transform(CHUNK_TEXTS)


def retrieve(query: str, k: int = TOP_K) -> List[str]:
    """Return the k most relevant knowledge chunks for a query."""
    query_vec = VECTORIZER.transform([query])
    scores = cosine_similarity(query_vec, CHUNK_MATRIX).flatten()
    ranked = scores.argsort()[::-1][:k]
    # Drop near-zero matches so unrelated questions don't drag in noise.
    return [CHUNK_TEXTS[i] for i in ranked if scores[i] > 0.03] or CHUNK_TEXTS[:k]


# ---------------------------------------------------------------------------
# Persona
# ---------------------------------------------------------------------------
SYSTEM_INSTRUCTION = """You are "Ask Javid" — a professional digital assistant embedded in Javid's portfolio site. You know Javid extremely well and answer questions about him (his work, skills, and projects) using ONLY the CONTEXT provided below plus these known facts. Never invent facts, employers, or projects that aren't in the context.

Personality & Background:
- He is an IT student and AI engineer who builds multi-agent workflows, RAG systems, and automations.
- He works with Python, FastAPI, LangGraph, n8n, and vector databases.

Voice: professional, clear, concise, courteous. Third person ("he", "Javid") unless the user clearly wants a direct first-person answer. Keep replies to 2-4 sentences. Do NOT use emojis. No markdown headers.
"""


def build_prompt(message: str, context_chunks: List[str], history: List[dict]) -> dict:
    context_block = "\n".join(f"- {c}" for c in context_chunks)
    contents = []

    # Fold prior turns into the conversation so the chat has memory.
    for turn in history[-6:]:
        role = "user" if turn.get("role") == "user" else "model"
        contents.append({"role": role, "parts": [{"text": turn.get("content", "")}]})

    user_turn = (
        f"CONTEXT (facts about Javid, only use what's relevant):\n{context_block}\n\n"
        f"Question: {message}"
    )
    contents.append({"role": "user", "parts": [{"text": user_turn}]})

    return {
        "system_instruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
        "contents": contents,
        "tools": [{
            "functionDeclarations": [
                {
                    "name": "schedule_meeting",
                    "description": "Schedule a meeting with Javid. Collect date, time, visitor email, and meeting topic/description sequentially.",
                    "parameters": {
                        "type": "OBJECT",
                        "properties": {
                            "date": {"type": "STRING", "description": "Date of meeting"},
                            "time": {"type": "STRING", "description": "Time of meeting"},
                            "email": {"type": "STRING", "description": "Visitor email address"},
                            "description": {"type": "STRING", "description": "Short description or purpose of the meeting"}
                        },
                        "required": ["date", "time", "email", "description"]
                    }
                }
            ]
        }],
        "generationConfig": {"temperature": 1.8, "maxOutputTokens": 240},
    }


# ---------------------------------------------------------------------------
# In-character fallbacks — used when Gemini itself is unreachable/out of quota
# ---------------------------------------------------------------------------
QUOTA_JOKES = [
    "The free tier quota is currently exhausted. Please try again in a short while.",
    "Gemini's free quota ran dry. Please wait a minute and submit your request again.",
]

NETWORK_ERROR_MSG = (
    "Couldn't reach Gemini backend just now. Please double-check GEMINI_API_KEY in .env."
)


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatTurn] = []


class ChatResponse(BaseModel):
    reply: str
    sources: List[str]


@app.get("/api/health")
def health():
    return {"status": "ok", "chunks_indexed": len(KNOWLEDGE_BASE)}


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if LIVE_MODE:
        LIVE_MESSAGES.append({"role": "user", "content": req.message})
        return ChatResponse(reply="", sources=[])

    context_chunks = retrieve(req.message)

    if not GEMINI_API_KEY:
        # No key configured — respond in character without calling out.
        return ChatResponse(
            reply=(
                "This demo isn't wired to a live Gemini key right now, but "
                "here's what's on file: " + context_chunks[0]
            ),
            sources=context_chunks,
        )

    payload = build_prompt(req.message, context_chunks, [t.dict() for t in req.history])

    try:
        resp = requests.post(
            GEMINI_URL,
            params={"key": GEMINI_API_KEY},
            json=payload,
            timeout=20,
        )
    except requests.RequestException:
        return ChatResponse(reply=NETWORK_ERROR_MSG, sources=context_chunks)

    if resp.status_code == 429:
        return ChatResponse(reply=random.choice(QUOTA_JOKES), sources=context_chunks)

    if resp.status_code != 200:
        # Gemini sometimes reports quota exhaustion as 400/403 RESOURCE_EXHAUSTED
        # depending on the failure mode — catch that here too.
        body_text = resp.text.lower()
        if "quota" in body_text or "resource_exhausted" in body_text:
            return ChatResponse(reply=random.choice(QUOTA_JOKES), sources=context_chunks)
        return ChatResponse(
            reply=f"Gemini returned an error (status {resp.status_code}). Check backend logs.",
            sources=context_chunks,
        )

    data = resp.json()
    try:
        parts = data["candidates"][0]["content"]["parts"]
        if "functionCall" in parts[0]:
            fc = parts[0]["functionCall"]
            if fc["name"] == "schedule_meeting":
                args = fc.get("args", {})
                date = args.get("date")
                time = args.get("time")
                email = args.get("email")
                description = args.get("description")
                
                # Ask parameters sequentially one by one
                if not date or str(date).lower() in ["tbd", "none", "not specified", "unknown"]:
                    return ChatResponse(
                        reply="I would be glad to schedule a meeting with Javid. What date works best for you?",
                        sources=context_chunks
                    )
                if not time or str(time).lower() in ["tbd", "none", "not specified", "unknown"]:
                    return ChatResponse(
                        reply=f"Got it for {date}. What time would you prefer?",
                        sources=context_chunks
                    )
                if not email or str(email).lower() in ["tbd", "none", "not specified", "unknown", "user@example.com"]:
                    return ChatResponse(
                        reply="Thank you. What is your email address so we can send the confirmation and calendar invitation?",
                        sources=context_chunks
                    )
                if not description or str(description).lower() in ["tbd", "none", "not specified", "unknown"]:
                    return ChatResponse(
                        reply="Could you please share a short description of the topic or purpose of the meeting?",
                        sources=context_chunks
                    )

                # All 4 collected! Save to SQLite
                conn = sqlite3.connect(DB_PATH)
                c = conn.cursor()
                c.execute('''CREATE TABLE IF NOT EXISTS meetings 
                             (date TEXT, time TEXT, email TEXT, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
                c.execute("INSERT INTO meetings (date, time, email, description) VALUES (?, ?, ?, ?)", (date, time, email, description))
                conn.commit()
                conn.close()
                
                # Send email notification to Javid (connectjavid27@gmail.com)
                send_meeting_email(date, time, email, description)
                
                # Generate Google Calendar link
                import urllib.parse
                gcal_title = urllib.parse.quote(f"Meeting with Javid - {description}")
                gcal_details = urllib.parse.quote(f"Meeting with {email}\nTopic: {description}\nDate: {date} at {time}")
                gcal_url = f"https://calendar.google.com/calendar/render?action=TEMPLATE&text={gcal_title}&details={gcal_details}"
                
                reply_text = (
                    f"Your meeting with Javid has been confirmed for {date} at {time}.\n\n"
                    f"Topic: {description}\n"
                    f"Contact: {email}\n\n"
                    f"An email notification has been sent to Javid. You can also add this directly to your calendar using this link:\n"
                    f"{gcal_url}"
                )
            else:
                reply_text = "I tried to call a function but it failed."
        else:
            reply_text = parts[0]["text"].strip()
    except (KeyError, IndexError):
        reply_text = (
            "Got an empty response from Gemini — possibly a safety filter "
            "trip. Try rephrasing the question."
        )

    return ChatResponse(reply=reply_text, sources=context_chunks)

# ---------------------------------------------------------------------------
# Subscribers
# ---------------------------------------------------------------------------
import sqlite3

DB_PATH = Path(__file__).parent / "database.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS subscribers (email TEXT UNIQUE)''')
    conn.commit()
    conn.close()

init_db()

class SubscribeRequest(BaseModel):
    email: str

@app.post("/api/subscribe")
def subscribe(req: SubscribeRequest):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("INSERT OR IGNORE INTO subscribers (email) VALUES (?)", (req.email,))
        conn.commit()
        conn.close()
        
        # Send free WhatsApp alert
        send_whatsapp_notification(f"🎉 New Subscriber Alert!\nEmail: {req.email}")
        
        return {"status": "success", "message": "Subscribed successfully! We saved your email in our local database."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ---------------------------------------------------------------------------
# Live Chat Endpoints
# ---------------------------------------------------------------------------
LIVE_MODE = False
LIVE_MESSAGES = []

class AdminReply(BaseModel):
    reply: str

@app.get("/api/admin/status")
def admin_status():
    return {"is_live": LIVE_MODE, "messages": LIVE_MESSAGES}

@app.post("/api/admin/toggle")
def admin_toggle():
    global LIVE_MODE
    LIVE_MODE = not LIVE_MODE
    return {"status": "ok", "is_live": LIVE_MODE}

@app.post("/api/admin/reply")
def admin_reply(req: AdminReply):
    LIVE_MESSAGES.append({"role": "Javid", "content": req.reply})
    return {"status": "ok"}

@app.get("/api/chat/poll")
def chat_poll():
    return {"is_live": LIVE_MODE, "messages": LIVE_MESSAGES}

# ---------------------------------------------------------------------------
# Project Enquiry Endpoint
# ---------------------------------------------------------------------------
class EnquiryRequest(BaseModel):
    name: str
    email: str
    service: str
    phone_code: str = "+1"
    phone_number: str = ""
    message: str = ""

@app.post("/api/enquiry")
def create_enquiry(req: EnquiryRequest):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS enquiries 
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, service TEXT, phone TEXT, message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        full_phone = f"{req.phone_code} {req.phone_number}".strip() if req.phone_number else "N/A"
        c.execute("INSERT INTO enquiries (name, email, service, phone, message) VALUES (?, ?, ?, ?, ?)",
                  (req.name, req.email, req.service, full_phone, req.message))
        conn.commit()
        conn.close()
        
        # Send free WhatsApp alert
        send_whatsapp_notification(f"🚀 New Project Enquiry!\nName: {req.name}\nEmail: {req.email}\nService: {req.service}\nPhone: {full_phone}\nMessage: {req.message}")
        
        return {"status": "success", "message": "Thank you! Your project enquiry has been submitted. Javid will reach out shortly."}
    except Exception as e:
        return {"status": "error", "message": str(e)}
