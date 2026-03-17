# ByteWave

**AI-powered physics learning platform.** Ask any physics question — get a Manim animation, an interactive Matter.js simulation, adaptive caliber assessments, and a structured skill map.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Physics Chat** | Claude-powered tutor that generates custom Manim animations from natural language |
| **Interactive Simulations** | Matter.js physics engine for hands-on exploration |
| **Adaptive Assessments** | JEE-style MCQs with mastery-weighted difficulty and one-at-a-time flow |
| **Skill Map** | Visual constellation of physics topics with recency-weighted mastery tracking |
| **RAG Accuracy Layer** | ChromaDB + sentence-transformers for physics correctness and template matching |
| **Community Forum** | In-app discussion for students |

---

## Architecture

```
┌─────────────────┐     ┌──────────────────────────────────────────┐
│  React + Vite   │────▶│  FastAPI Backend                         │
│  (Frontend)     │     │  • Claude (plan + code gen)                │
└─────────────────┘     │  • Manim (video rendering)                │
                        │  • ChromaDB RAG (physics knowledge)       │
                        │  • Adaptive learning engine               │
                        └──────────────────────────────────────────┘
```

- **Frontend**: React 18, Vite, React Router, Framer Motion, KaTeX
- **Backend**: FastAPI, Uvicorn
- **AI**: Anthropic Claude (Opus/Sonnet)
- **Rendering**: Manim CE (Cairo, FFmpeg, LaTeX)
- **Data**: SQLite (learning DB), ChromaDB (RAG)

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React, Vite, React Router, Framer Motion, KaTeX, Matter.js, Spline |
| Backend | FastAPI, Python 3.12 |
| AI / LLM | Anthropic Claude |
| Animation | Manim Community Edition |
| RAG | ChromaDB, sentence-transformers |
| Auth | JWT, bcrypt |

---

## Quick Start

### 1. Clone and configure

```bash
git clone https://github.com/meghamshb/Bytewave.git
cd Bytewave
cp .env.example .env
```

**Required:** Add your Anthropic API key to `.env`. Get a free key at [console.anthropic.com](https://console.anthropic.com) → API Keys.

```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

Without this key, AI features (chat, animations, assessments) will not work.

### 2. Backend

```bash
pip install -r backend/requirements.txt
pip install -r backend/requirements-manim.txt   # for Manim animations
```

**macOS (Manim system deps):** `brew install cairo pkg-config ffmpeg`  
**Linux:** `sudo apt install libcairo2-dev pkg-config ffmpeg texlive-latex-base`

### 3. Frontend

```bash
cd frontend && npm install && cd ..
```

### 4. Run

```bash
./run.sh
```

- **Frontend** → http://localhost:5173  
- **Backend** → http://localhost:8000  

---

## Docker

```bash
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env
docker compose up --build -d
```

App is served at **http://localhost:8000** (backend serves the built frontend).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key ([console.anthropic.com](https://console.anthropic.com)) |
| `JWT_SECRET` | No | Fixed secret for production; ephemeral if unset |
| `CORS_ORIGINS` | No | Comma-separated allowed origins |
| `ADMIN_KEY` | No | For admin endpoints (e.g. prerender-clips) |
| `VITE_POSTHOG_KEY` | No | PostHog analytics (frontend) |

---

## Project Structure

```
├── frontend/           React + Vite app
│   ├── src/
│   │   ├── screens/    Page components (Home, Landing, Assess, …)
│   │   ├── components/ Shared UI
│   │   ├── hooks/      Auth, analytics, forum
│   │   └── data/       Team profiles, static data
│   └── public/         Static assets
├── backend/            FastAPI server
│   ├── main.py         API routes, SPA serving
│   ├── agent.py        Claude agent (plan, code, follow-up)
│   ├── learn.py        Adaptive learning, mastery
│   ├── manim_runner.py Manim subprocess runner
│   └── rag/            ChromaDB knowledge base
├── docs/               Documentation
├── media/              Screenshots, demo assets
├── run.sh              Dev/prod startup
├── Dockerfile          Multi-stage container build
└── docker-compose.yml  Container deployment
```

---

## Demo

- **Live**: Add your deployed URL here
- **Screenshots**: See `media/screenshots/`

---

## Status

- **Core**: AI chat, Manim rendering, adaptive assessments, skill map — implemented
- **Deployment**: Docker-ready; Azure App Service (container) supported
- **Manim**: Requires system deps (cairo, ffmpeg, LaTeX); use Docker for production

---

## Team

Built by Meghamsh Balantrapu, Jonnevan Chandra, Samanyu Gaur, Hanyang (Sonic) Liu, and Jonathan Chandra.

---

## License

MIT — see [LICENSE](LICENSE).
