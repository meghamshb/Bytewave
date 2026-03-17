# API Overview

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: Your deployed URL

## Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Serves the React SPA |
| GET | `/api/health` | Health check; reports Manim, RAG, backend status |
| POST | `/api/chat` | Chat with physics tutor (plan + code + render) |
| POST | `/api/render` | Render Manim code to video |
| GET | `/api/animations` | List saved animations |
| POST | `/api/assess/next` | Get next adaptive assessment question |

## Authentication

- JWT-based auth for protected routes
- Demo chat on landing page is rate-limited per IP

## Environment

Required: `ANTHROPIC_API_KEY` for all AI features.
