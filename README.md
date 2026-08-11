# Javid — Portfolio + "Ask Javid" RAG Chatbot

Two pieces:

```
index.html        — the portfolio site (open directly, or host anywhere static)
app.py            — FastAPI RAG chatbot, calls the Gemini API
```

## 1. Run the backend

```bash
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

Just open `index.html` in a browser — no build step. The chat
widget (bottom-right bubble) is already pointed at `http://localhost:8787`
via the `CHAT_API_BASE` constant near the bottom of the `<script>` tag.

## 3. How the chatbot actually works

- `knowledge_base.json` holds short factual chunks about Javid —
  his role, stack, projects, hackathons, working habits.
- On startup, those chunks are vectorized with TF-IDF (`scikit-learn`).
  This is genuine retrieval, not a hardcoded lookup table — no vector
  database needed at this scale.
- Every question is embedded the same way and compared by cosine
  similarity; the top 4 matching chunks get stuffed into the Gemini
  prompt as grounding context, alongside a persona system instruction.

## 4. Deploying for real

- **Backend**: any Python host works (Render, Railway, Fly.io, a small VPS). Set `GEMINI_API_KEY` as an environment variable there instead of a `.env` file.
- **Frontend**: any static host (Vercel, Netlify, GitHub Pages). Update `CHAT_API_BASE` in `index.html` to your deployed backend URL before publishing.

