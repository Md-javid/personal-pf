# Javid — Portfolio + "Ask Javid" RAG Chatbot

Two pieces:

```
frontend/index.html   — the portfolio site (open directly, or host anywhere static)
backend/               — FastAPI RAG chatbot, calls the Gemini API
```

## 1. Run the backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
cp .env.example .env
```

Open `.env` and paste in a free Gemini API key from
https://aistudio.google.com/apikey — takes about a minute.

```bash
uvicorn app:app --reload --port 8787
```

Check it's alive: open http://localhost:8787/api/health — you should see
`{"status": "ok", "chunks_indexed": 13}`.

## 2. Open the frontend

Just open `frontend/index.html` in a browser — no build step. The chat
widget (bottom-right bubble) is already pointed at `http://localhost:8787`
via the `CHAT_API_BASE` constant near the bottom of the `<script>` tag.

## 3. How the chatbot actually works

- `backend/knowledge_base.json` holds short factual chunks about Javid —
  his role, stack, projects, hackathons, working habits.
- On startup, those chunks are vectorized with TF-IDF (`scikit-learn`).
  This is genuine retrieval, not a hardcoded lookup table — no vector
  database needed at this scale, but you could swap in Chroma/pgvector
  later without changing the API contract.
- Every question is embedded the same way and compared by cosine
  similarity; the top 4 matching chunks get stuffed into the Gemini
  prompt as grounding context, alongside a persona system instruction.
- If the Gemini free tier runs out (HTTP 429 / `RESOURCE_EXHAUSTED`), the
  backend doesn't throw a raw error — it replies in character, with one
  of a few "Javid won't pay to raise the quota" jokes.

## 4. Updating what the chatbot knows

Add or edit an object in `backend/knowledge_base.json` — no code changes,
no retraining. Restart the server and the new fact is searchable
immediately.

## 5. Updating the portfolio content

Everything the portfolio renders (capabilities, stack, case studies,
terminal demos, about copy, socials) comes from the `CONFIG` object near
the bottom of `frontend/index.html`. Edit that object; the HTML never
needs to change.

## 6. Deploying for real

- **Backend**: any Python host works (Render, Railway, Fly.io, a small
  VPS). Set `GEMINI_API_KEY` as an environment variable there instead of
  a `.env` file, and lock `allow_origins` in `app.py` down to your actual
  domain instead of `"*"`.
- **Frontend**: any static host (Vercel, Netlify, GitHub Pages). Update
  `CHAT_API_BASE` in `index.html` to your deployed backend URL before
  publishing.

## 7. On the free tier

Gemini's free tier has real per-minute and per-day request limits. If
you're demoing this a lot, the "stingy about upgrading" fallback jokes
in `backend/app.py` (`QUOTA_JOKES`) will show up — that's expected
behavior, not a bug. Edit that list any time you want new jokes.
