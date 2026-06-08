# LAWA Leave &amp; FMLA — Proof of Concept

Standalone, integration-free AI-enabled leave compliance demo built for Los Angeles World Airports (HR Shared Services). Federal FMLA stacked with California CFRA and PDL, AI-assisted certification parsing and letter drafting, with every designation kept human-in-the-loop.

This is a proof of concept. The balance and eligibility figures are illustrative, and any outbound letter language should be reconciled against LAWA's approved templates and reviewed by counsel before real use.

## Stack

- React 18 + Vite frontend
- Express backend proxy (`server/index.js`) that holds the Anthropic API key server-side
- No database, no HRIS dependency. Case state is in-memory.
- Self-contained styling (Google Fonts via CSS import). No Tailwind or UI library.

## The two AI features

Two features make a live call to the Anthropic Messages API, both routed through the backend proxy (never the browser directly):

- The FMLA Assistant (chat)
- The "Review &amp; draft cure letter" generation

The frontend calls `POST /api/messages` with a `task` hint (`"chat"` or `"draft"`) instead of a model id. The proxy attaches the key, picks the model, and marks the assistant's grounding context as a prompt-cache breakpoint. If the key is missing or the call fails, the frontend falls back to a clean offline state so a demo never breaks.

**Model selection lives server-side** so a model swap never needs a frontend redeploy. Defaults: chat → `claude-haiku-4-5-20251001`, draft → `claude-sonnet-4-6`. Override with `ANTHROPIC_MODEL_CHAT` / `ANTHROPIC_MODEL_DRAFT`.

## Local development

Requires Node 22+. Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`, then run the frontend and backend in two terminals:

```bash
npm install
npm run server   # backend proxy on http://localhost:3001 (loads .env)
npm run dev      # frontend on http://localhost:5173 (proxies /api → :3001)
```

For a production-like check on one port:

```bash
npm run build    # outputs to dist/
npm start        # Express serves dist/ and /api on http://localhost:3001
```

## Deploy on DigitalOcean App Platform (web service)

This is now a **Web Service**, not a static site — the Express server serves the built frontend and the `/api` proxy from one process.

1. Push this repo to GitHub (see below).
2. In DigitalOcean: Create > Apps > pick this GitHub repo.
3. Configure the component as a **Web Service**:
   - Build command: `npm run build`
   - Run command: `npm start`
   - HTTP port: App Platform sets `PORT`; the server reads it automatically.
4. Add `ANTHROPIC_API_KEY` as an **encrypted** environment variable (optionally `ANTHROPIC_MODEL_CHAT` / `ANTHROPIC_MODEL_DRAFT`).
5. Deploy. Check `GET /api/health` returns `{"ok":true,"keyConfigured":true}`.

Never put an API key in client-side code or commit `.env`.

## PHI &amp; compliance note

The certification feature sends employee medical-certification details to the model. Before any real (non-demo) use, put a Business Associate Agreement / Zero Data Retention arrangement in place with the model provider and minimize/redact PHI in the backend before it leaves your infrastructure.

## Push to GitHub

```bash
git remote add origin git@github.com:<your-org-or-user>/lawa-fmla-tracker.git
git branch -M main
git push -u origin main
```

The repo is already initialized with an initial commit.
