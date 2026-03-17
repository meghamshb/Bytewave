# System Design

## Overview

ByteWave is a full-stack AI-powered physics learning platform. The system follows a client–server architecture with a React SPA frontend and a FastAPI backend that orchestrates LLM calls, Manim rendering, and RAG-based physics knowledge retrieval.

## Components

- **Frontend**: React + Vite, serves the main UI (landing, chat, assessments, skill map)
- **Backend**: FastAPI, handles API routes, static file serving, and business logic
- **Agent**: Claude (Anthropic) for plan generation, Manim code generation, and self-correction
- **Manim**: Subprocess-based video rendering from generated Python scripts
- **RAG**: ChromaDB + sentence-transformers for physics accuracy and template matching

## Data Flow

1. User submits a physics question → Backend receives request
2. Agent generates animation plan + Manim code → Claude API
3. Manim subprocess renders video → Returns MP4 path
4. Frontend displays video and supports follow-up chat

## See Also

- [architecture.md](./architecture.md) — UML diagrams and detailed component breakdown
- [api-overview.md](./api-overview.md) — API endpoints
