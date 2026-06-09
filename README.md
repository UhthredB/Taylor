<p align="center">
  <img src="https://img.shields.io/badge/VC-Intelligence-0d9488?style=for-the-badge&labelColor=111110&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHJ4PSIyIiBmaWxsPSIjNGY5OGEzIi8+PHJlY3QgeD0iMTYiIHk9IjIiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcng9IjIiIGZpbGw9IiM0Zjk4YTMiIG9wYWNpdHk9IjAuNyIvPjxyZWN0IHg9IjIiIHk9IjE2IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHJ4PSIyIiBmaWxsPSIjNGY5OGEzIiBvcGFjaXR5PSIwLjciLz48cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcng9IjIiIGZpbGw9IiM0Zjk4YTMiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==" alt="VC Intelligence" />
</p>

<h1 align="center">VC Intelligence</h1>

<p align="center">
  <strong>AI-powered investor due diligence — from startup name to full intelligence packet in minutes.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Zero_Build_Step-black?style=flat-square" alt="Zero Build" />
  <img src="https://img.shields.io/badge/Vercel_Edge-black?style=flat-square&logo=vercel" alt="Vercel Edge" />
  <img src="https://img.shields.io/badge/Vanilla_JS-black?style=flat-square&logo=javascript&logoColor=f7df1e" alt="Vanilla JS" />
  <img src="https://img.shields.io/badge/SSE_Streaming-black?style=flat-square" alt="SSE Streaming" />
  <img src="https://img.shields.io/badge/Dark_Mode-black?style=flat-square" alt="Dark Mode" />
</p>

---

## What It Does

VC Intelligence automates the research workflow a venture capital analyst performs before a founder call. Enter a startup name and basic context — the tool runs **4 sequential AI-powered research phases** and produces a downloadable intelligence packet.

| Phase | Name | What It Produces |
|-------|------|-----------------|
| 1 | **Brief Preparation** | Company snapshot, market sizing, team assessment, competitive landscape, 10 pre-call questions |
| 2 | **Red Team Due Diligence** | Adversarial claim analysis across 8 domains, risk matrix, fraud indicators |
| 3 | **Independent Verification** | Open-source evidence testing, claim scorecard, regulatory risk assessment |
| 4 | **Final Packet** | Executive brief, GO/HOLD/PASS signal, conviction score, term sheet considerations |

Each phase builds on the previous — the AI receives cumulative context, so Phase 4 synthesizes everything from Phases 1–3 into a final investment recommendation.

---

## Architecture

```
Browser                    Vercel                     LLM Provider
┌──────────┐   POST /api   ┌──────────────┐   POST    ┌──────────────┐
│          │──────────────→│  Edge Func   │─────────→│  OpenRouter / │
│  Single  │   SSE stream  │              │  SSE     │  Kimchi /     │
│  HTML    │←──────────────│  research.js │←─────────│  Any OpenAI-  │
│  File    │               │              │          │  compatible   │
│          │               │  • Rate limit│          │  provider     │
└──────────┘               │  • Honeypot  │          └──────────────┘
                           │  • Validation│
                           └──────────────┘
```

**Zero build step.** The entire frontend is a single `index.html` — no npm, no bundler, no framework. Fonts and libraries load from CDN. The Edge Function proxies LLM calls so the API key never touches the browser.

---

## Project Structure

```
├── index.html            # Complete frontend (HTML + CSS + JS)
├── vercel.json           # Routing rules + security headers
└── api/
    └── research.js       # Vercel Edge Function (API proxy)
```

**That's it.** Three files.

---

## Features

### Research Engine
- 🔄 **4-phase sequential analysis** with context chaining
- 📡 **Real-time SSE streaming** — watch the AI think token-by-token
- ⚡ **Phase stepper UI** with live status (pending → running → complete)
- 🔁 **Retry from failed phase** — completed work is never lost

### Output & Export
- 📋 **Tabbed results view** with rich markdown rendering
- 📄 **PDF export** — multi-page document with cover, colored phase headers, and table of contents
- 📝 **Markdown download** — all 4 phases concatenated
- 🏷️ **Signal badges** — visual chips for ✅ Verified, ⚠ Partial, ❌ Contradicted, 🔍 Investigate
- 🚨 **Severity cards** — color-coded CRITICAL / HIGH / MEDIUM risk callouts
- ✨ **Investment signal glow** — animated GO 🟢 / HOLD 🟡 / PASS 🔴

### Design
- 🌗 **Dark/light theme** toggle, persisted in localStorage
- 🎨 **Curated design system** — 20+ CSS custom properties, Geist typography
- 📱 **Fully responsive** — works on mobile, tablet, desktop
- 💫 **Micro-animations** — phase transitions, pulse effects, button states, star ratings

### Security
- 🔒 **Server-side API key** — never exposed to the browser
- 🍯 **Honeypot field** — silent bot rejection
- 🚦 **IP rate limiting** — 16 calls per cold-start instance
- 📏 **Input validation** — 40K character cap, required field checks
- 🛡️ **Security headers** — X-Frame-Options, nosniff, strict referrer, permissions policy

---

## Deploy to Vercel

### 1. Import

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/UhthredB/Taylor)

Or manually: [vercel.com/new](https://vercel.com/new) → Import `UhthredB/Taylor`

### 2. Set Environment Variables

In the Vercel dashboard under **Settings → Environment Variables**, add:

| Variable | Description | Example |
|----------|-------------|---------|
| `LLM_API_KEY` | Your API key (never exposed to users) | `sk-or-...` or Kimchi key |
| `LLM_BASE_URL` | OpenAI-compatible chat completions endpoint | `https://openrouter.ai/api/v1/chat/completions` |
| `LLM_MODEL` | Model identifier | `anthropic/claude-opus-4-5` |
| `LLM_SITE_URL` | Your deployed URL (used for CORS + referer) | `https://taylor.vercel.app` |

### 3. Deploy

Click **Deploy**. No build settings needed — Vercel serves `index.html` as static and `api/research.js` as an Edge Function automatically.

### Compatible LLM Providers

Any provider with an OpenAI-compatible `/chat/completions` endpoint works:

| Provider | Base URL | Notes |
|----------|----------|-------|
| [OpenRouter](https://openrouter.ai) | `https://openrouter.ai/api/v1/chat/completions` | Multi-model access, recommended |
| [Kimchi (Cast AI)](https://kimchi.dev) | `https://llm.kimchi.dev/openai/v1/chat/completions` | Managed inference |
| [Together AI](https://together.ai) | `https://api.together.xyz/v1/chat/completions` | Open-source models |
| [Groq](https://groq.com) | `https://api.groq.com/openai/v1/chat/completions` | Ultra-fast inference |

> **Tip:** Choose a model with a large context window (32K+ tokens). Phases 2–4 receive cumulative context from prior phases, which can reach ~30K tokens for thorough research.

---

## How It Works

```
User fills form → Submit
  │
  ├─ Phase 1: Brief Preparation
  │   └─ POST /api/research (streaming)
  │       └─ Output stored in state
  │
  ├─ Phase 2: Red Team DD
  │   └─ POST /api/research (streaming, includes Phase 1 output)
  │       └─ Output stored in state
  │
  ├─ Phase 3: Verification
  │   └─ POST /api/research (streaming, includes Phase 1+2 output)
  │       └─ Output stored in state
  │
  └─ Phase 4: Final Packet
      └─ POST /api/research (streaming, includes Phase 1+2+3 output)
          └─ Output stored in state
              │
              └─ Results screen → Tabs + PDF/MD export
```

Each phase sends a carefully engineered prompt that instructs the AI to operate as a specific analyst persona:
- Phase 1: **Research Analyst** — builds the factual foundation
- Phase 2: **Red Team Adversary** — attacks every claim
- Phase 3: **Verification Unit** — independently corroborates or contradicts
- Phase 4: **Investment Committee Advisor** — synthesizes into a decision

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS (ES2022), no framework |
| Fonts | [Geist](https://fonts.google.com/specimen/Geist) + Geist Mono |
| Markdown | [marked.js](https://marked.js.org/) v12 |
| PDF | [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) |
| Backend | Vercel Edge Function |
| Hosting | Vercel (static + edge) |

---

## Local Development

Since there's no build step, you can preview the frontend by opening `index.html` in a browser. However, the `/api/research` endpoint requires Vercel's runtime.

To run the full stack locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run locally
vercel dev
```

---

## License

Private and confidential. Internal use only.
