# 🚀 Mohamed Javid — AI Engineer Portfolio & RAG Architecture

> Production-grade Next.js 16 + React 19 + Tailwind CSS portfolio featuring an interactive LangGraph / MCP state machine, animated canvas fluid dynamics, and a local FastAPI SQLite RAG chatbot ("Ask Javid").

---

## ⚡ Tech Stack

* **Frontend:** Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS, Framer Motion, Lucide Icons
* **Backend:** Python 3.11, FastAPI, Uvicorn, SQLite, Scikit-Learn TF-IDF RAG
* **AI & LLM:** Google Gemini 2.5 Flash / Flash Lite, LangGraph State Machine Patterns, Model Context Protocol (MCP)
* **DevOps / Production:** Nginx Reverse Proxy, PM2 Process Manager, AWS EC2 / Vercel Ready

---

## 🏗️ Architecture Overview

```
                        [ User / Client ]
                               │
               (HTTPS - Let's Encrypt / Vercel CDN)
                               ▼
                    [ Nginx Reverse Proxy ]
                   ┌───────────┴───────────┐
                   ▼                       ▼
           [ Next.js 16 App ]      [ FastAPI Backend ]
               (Port 3000)             (Port 8787)
                   │                       │
           Interactive UI &        TF-IDF Retrieval &
           LangGraph Simulation    Gemini RAG Grounding
```

---

## 🛠️ Local Development Setup

### 1. Backend Setup (FastAPI)
```bash
# Setup Python virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
cp .env.example .env

# Run FastAPI backend
python -m uvicorn app:app --port 8787 --reload
```

### 2. Frontend Setup (Next.js)
```bash
# Install node dependencies
npm install

# Run Next.js development server
npm run dev -- -p 3000
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

---

## ☁️ AWS EC2 Free Tier Deployment

This project includes pre-configured deployment templates:
* **`ecosystem.config.js`**: PM2 process manager for 24/7 background running & auto-restarts on reboot.
* **`nginx.conf.example`**: Nginx configuration routing `/` to Next.js and `/api/` to FastAPI with gzip compression and SSL pass-through.

### Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📜 License
MIT License © 2026 Mohamed Javid.
