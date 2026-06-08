# LAWA Leave &amp; FMLA — Proof of Concept

Standalone, integration-free AI-enabled leave compliance demo built for Los Angeles World Airports (HR Shared Services). Federal FMLA stacked with California CFRA and PDL, AI-assisted certification parsing and letter drafting, with every designation kept human-in-the-loop.

This is a proof of concept. The balance and eligibility figures are illustrative, and any outbound letter language should be reconciled against LAWA's approved templates and reviewed by counsel before real use.

## Stack

- React 18 + Vite
- No backend, no database, no HRIS dependency. State is in-memory.
- Self-contained styling (Google Fonts via CSS import). No Tailwind or UI library.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Deploy on DigitalOcean App Platform (static site)

1. Push this repo to GitHub (see below).
2. In DigitalOcean: Create > Apps > pick this GitHub repo.
3. App Platform will detect a Node site. Configure as a Static Site:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

## IMPORTANT: the AI features need a backend before production

Two features make a live call to the Anthropic API:

- The FMLA Assistant (chat)
- The "Review &amp; draft cure letter" generation

In the current code these call `https://api.anthropic.com/v1/messages` directly from the browser with no API key. That works only inside the Claude artifact sandbox, which injects auth. On a real deployment those calls will fail, and the code falls back to a clean offline state so nothing breaks during a demo.

For production you need a small backend proxy that holds the key server-side. Never put an API key in client-side code.

### Next step (intended for Claude Code)

1. Add a backend endpoint (DigitalOcean App Platform service or function) that reads `ANTHROPIC_API_KEY` from an environment variable and forwards requests to the Anthropic Messages API.
2. In `src/App.jsx`, repoint the two `fetch("https://api.anthropic.com/v1/messages", ...)` calls to that proxy path (for example `/api/messages`).
3. Set `ANTHROPIC_API_KEY` as an encrypted environment variable in the App Platform settings.

The two fetch call sites are in `src/App.jsx`:
- `draftCureLetter()` (cure-letter generation)
- the `send()` handler inside the `Assistant` component (chat)

## Push to GitHub

```bash
git remote add origin git@github.com:<your-org-or-user>/lawa-fmla-tracker.git
git branch -M main
git push -u origin main
```

The repo is already initialized with an initial commit.
