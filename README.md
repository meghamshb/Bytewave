# ByteWave

> **Ask any physics question. Get a custom animation, an interactive simulation, and a personalized learning path.**

ByteWave is an AI-powered physics learning platform that turns natural language into Manim animations, Matter.js simulations, and adaptive JEE-style assessments. Built with Claude, React, and FastAPI.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/react-18-61dafb.svg)](https://reactjs.org/)

---

## ✨ What It Does

- **Ask** — Type a physics question in plain English (e.g. *"Show me projectile motion at 45°"*)
- **Animate** — Claude generates Manim code; the app renders a custom explainer video
- **Simulate** — Interact with Matter.js physics in real time
- **Assess** — Take adaptive MCQs that adjust to your mastery level
- **Track** — Visual skill map shows your progress across topics

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Physics Chat** | Claude-powered tutor that generates custom Manim animations from natural language |
| 🎮 **Interactive Simulations** | Matter.js physics engine for hands-on exploration |
| 📝 **Adaptive Assessments** | JEE-style MCQs with mastery-weighted difficulty and one-at-a-time flow |
| 🗺️ **Skill Map** | Visual constellation of physics topics with recency-weighted mastery tracking |
| 📚 **RAG Accuracy Layer** | ChromaDB + sentence-transformers for physics correctness and template matching |
| 💬 **Community Forum** | In-app discussion for students |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 18, Vite, React Router, Framer Motion, KaTeX, Matter.js, Spline |
| Backend | FastAPI, Python 3.12 |
| AI / LLM | Anthropic Claude (Opus/Sonnet) |
| Animation | Manim Community Edition |
| RAG | ChromaDB, sentence-transformers |
| Auth | JWT, bcrypt |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────────────────────────────┐
│  React + Vite   │────▶│  FastAPI Backend                         │
│  (Frontend)     │     │  • Claude (plan + code gen)               │
└─────────────────┘     │  • Manim (video rendering)               │
                        │  • ChromaDB RAG (physics knowledge)      │
                        │  • Adaptive learning engine               │
                        └──────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- [Anthropic API key](https://console.anthropic.com) (free tier available)

### 1. Clone and configure

```bash
git clone https://github.com/meghamshb/Bytewave.git
cd Bytewave
cp .env.example .env
```

Add your Anthropic API key to `.env`:

```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

> ⚠️ Without this key, AI features (chat, animations, assessments) will not work.

### 2. Backend

```bash
pip install -r backend/requirements.txt
pip install -r backend/requirements-manim.txt
```

**System deps for Manim (required for animations):**

- **macOS:** `brew install cairo pkg-config ffmpeg`
- **Linux:** `sudo apt install libcairo2-dev pkg-config ffmpeg texlive-latex-base`

### 3. Frontend

```bash
cd frontend && npm install && cd ..
```

### 4. Run

```bash
./run.sh
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |

---

## 🐳 Docker

```bash
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env
docker compose up --build -d
```

Served at **http://localhost:8000** — backend serves the built frontend.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key — [get one here](https://console.anthropic.com) |
| `JWT_SECRET` | No | Fixed secret for production; ephemeral if unset |
| `CORS_ORIGINS` | No | Comma-separated allowed origins |
| `ADMIN_KEY` | No | For admin endpoints |
| `VITE_POSTHOG_KEY` | No | PostHog analytics (frontend) |

---

## 📁 Project Structure

```
├── frontend/           React + Vite app
│   ├── src/screens/    Home, Landing, Assess, Chat, …
│   ├── src/components/ Shared UI
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

## 📸 Demo

Please refer to the [LinkedIn post](https://www.linkedin.com/in/meghamshbalantrapu/) for a demo and walkthrough.

---

## 👥 Team

Built by **Meghamsh Balantrapu**, **Jonnevan Chandra**, **Samanyu Gaur**, **Hanyang (Sonic) Liu**, and **Jonathan Chandra**.

---

## 📄 License

MIT — see [LICENSE](LICENSE).
