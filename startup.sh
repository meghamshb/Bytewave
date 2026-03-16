#!/usr/bin/env bash
set -e

cd /home/site/wwwroot

mkdir -p media_output/media media_output/clips

# Install heavy optional deps in background (RAG, Manim) so uvicorn starts fast
(pip install --no-cache-dir chromadb sentence-transformers manim 2>&1 | tail -5 || true) &

exec python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
