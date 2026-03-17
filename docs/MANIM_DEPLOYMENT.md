# ByteWave Manim Deployment Guide

Manim rendering is **core to the product**. This document describes system dependencies and deployment options.

## System Dependencies (Required for Manim)

| Dependency | Purpose | Install |
|------------|---------|---------|
| **ffmpeg** | Video encoding | Required |
| **cairo** | 2D graphics rendering | Required |
| **pango** | Text layout (often with cairo) | Required |
| **pkg-config** | Build configuration | Required for cairo |
| **LaTeX** (pdflatex/xelatex) | MathTex rendering | Optional but recommended |

## Install Commands

### Local Development (macOS)
```bash
brew install cairo pkg-config ffmpeg
# LaTeX (optional): brew install --cask mactex  # or BasicTeX for smaller install
pip install -r requirements.txt
```

### Local Development (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y \
  build-essential \
  ffmpeg \
  libcairo2-dev \
  libpango1.0-dev \
  pkg-config \
  texlive-latex-base \
  texlive-fonts-recommended \
  texlive-latex-extra
pip install -r requirements.txt
```

### Docker (Recommended for Production)
The Dockerfile already installs all dependencies. No extra steps.
```bash
docker compose up --build -d
```

### Azure App Service (Oryx Build)
**Warning:** Azure Oryx build may not include cairo, ffmpeg, or LaTeX. Manim rendering often fails.

Options:
1. **Use Docker on Azure** — Deploy the Docker image to Azure Container Apps or App Service (Linux container). This guarantees all deps.
2. **Custom startup script** — Add a `.apt` file or startup script to install system packages (if your plan supports it).
3. **Verify after deploy** — Run `python -m backend.check_startup` in SSH/console. If it fails, switch to Docker.

## Verification

Before deploy, run:
```bash
ANTHROPIC_API_KEY=yourkey python -m backend.check_startup
```

Minimal render smoke test only:
```bash
python -m backend.smoke_render
```

## Health Endpoint

`GET /health` returns:
- `healthy`: true only when both `anthropic_key` and `manim_available` are ok
- `api_healthy`, `ai_healthy`, `manim_healthy`, `render_pipeline_healthy`: granular status
- HTTP 503 when core product (AI + Manim) is broken

## Verdict

- **Docker:** Manim works. Use for production.
- **Local (macOS/Linux with deps):** Manim works.
- **Azure Oryx:** Unreliable. Prefer Docker deployment.
