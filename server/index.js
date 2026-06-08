import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* ============================================================
   LAWA FMLA Tracker — backend proxy
   Holds the Anthropic API key server-side and forwards the two
   AI features (assistant chat + cure-letter drafting) to the
   Messages API. Also serves the built static frontend.

   Never ship the API key to the browser. The frontend calls
   POST /api/messages; this process attaches the key.
   ============================================================ */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

/* Model config lives server-side so swapping models never needs a
   frontend redeploy. The frontend sends a task hint, not a model id. */
const MODELS = {
  chat: process.env.ANTHROPIC_MODEL_CHAT || "claude-haiku-4-5-20251001",
  draft: process.env.ANTHROPIC_MODEL_DRAFT || "claude-sonnet-4-6",
};

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, keyConfigured: Boolean(API_KEY) });
});

app.post("/api/messages", async (req, res) => {
  if (!API_KEY) {
    return res.status(503).json({
      error: "ANTHROPIC_API_KEY is not configured on the server.",
    });
  }

  const { task = "chat", system, messages, max_tokens = 1000 } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages[] is required." });
  }

  const model = MODELS[task] || MODELS.chat;

  /* Mark the system prompt as a cache breakpoint. For the assistant the
     grounding context is identical across turns, so once it grows past the
     model's minimum cacheable size the prefix is served from cache —
     cheaper and faster. Below that threshold the API simply ignores it. */
  const systemBlocks = system
    ? [{ type: "text", text: system, cache_control: { type: "ephemeral" } }]
    : undefined;

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model,
        max_tokens,
        ...(systemBlocks ? { system: systemBlocks } : {}),
        messages,
      }),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error("Anthropic proxy error:", err);
    return res.status(502).json({ error: "Failed to reach the model." });
  }
});

/* Serve the production build. In dev, Vite serves the frontend on :5173 and
   proxies /api here, so this static handler is only exercised in production. */
const distDir = path.resolve(__dirname, "..", "dist");
app.use(express.static(distDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`LAWA FMLA server listening on :${PORT}`);
  if (!API_KEY) {
    console.warn(
      "⚠  ANTHROPIC_API_KEY not set — /api/messages will return 503 until it is."
    );
  }
});
