# ByteWave Redeploy Report — March 10 Baseline

**Date:** 2026-03-17  
**Goal:** Redeploy ByteWave exactly as it was deployed around March 10, reusing the prior deployment path.

---

## A. Previous Deployment Method Discovered

**Method:** **Azure App Service with Oryx build + custom startup script**

The March 10 deployment used:

1. **Azure App Service (Linux)** — Oryx build system for code deployment (not Docker)
2. **`startup.sh`** — Custom startup script that:
   - Extracts Oryx-compressed virtual env (`antenv.tar.gz`)
   - Activates the Python venv
   - Creates `media_output/media` and `media_output/clips`
   - Runs `python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000`
3. **Root `requirements.txt`** — Oryx detects Python and installs deps via `pip`
4. **Frontend pre-build** — React frontend must be built before deploy (Oryx `pre-build` or local build)
5. **Single-process** — FastAPI serves both API and built React SPA on port 8000

---

## B. Files Proving It

| File | Evidence |
|------|----------|
| `startup.sh` | Oryx-specific paths: `/home/site/wwwroot`, `antenv.tar.gz`, `antenv`; runs uvicorn |
| `.azure/config` | `group=rg-bytewave`, `sku=B2`, `appserviceplan=bytewave-plan`, `location=francecentral`, `web=bytewave-app` |
| `requirements.txt` | Root-level; comment: "Azure/Oryx uses root requirements.txt — Manim must be here for deployment" |
| `MANIM_DEPLOYMENT.md` | "Azure App Service (Oryx Build)" — documents Oryx path and warns about cairo/ffmpeg/latex |
| `BACKEND_AUDIT_REPORT.md` | "Azure (Manim was missing)" — confirms Oryx deployment was used |
| `Dockerfile` | Alternative path; Docker has all system deps (cairo, ffmpeg, latex) |

**Note:** `appsvc.yaml` was added in this report to make Oryx use `startup.sh` and run frontend pre-build. Previously, the startup command may have been set via Azure Portal or `az webapp config set --startup-file`.

---

## C. Exact Redeploy Steps

### Prerequisites

- Azure CLI installed and logged in: `az login`
- App and plan already exist (from March 10): `bytewave-app`, `bytewave-plan`, `rg-bytewave`

### Step 1: Build frontend locally (required for Oryx)

Oryx may not have Node in the Python build image. Build the frontend locally and include it in the deploy:

```bash
cd Bytewave
cd frontend && npm ci --no-audit --no-fund && npm run build && cd ..
```

### Step 2: Set environment variables in Azure

```bash
az webapp config appsettings set \
  --name bytewave-app \
  --resource-group rg-bytewave \
  --settings ANTHROPIC_API_KEY="<your-key>" \
  CORS_ORIGINS="https://bytewave-app.azurewebsites.net,http://localhost:8000"
```

**Required:** `ANTHROPIC_API_KEY` — app will not start without it.

### Step 3: Set startup command

```bash
az webapp config set \
  --name bytewave-app \
  --resource-group rg-bytewave \
  --startup-file "./startup.sh"
```

### Step 4: Deploy via `az webapp up`

```bash
cd Bytewave

az webapp up \
  --name bytewave-app \
  --resource-group rg-bytewave \
  --plan bytewave-plan \
  --runtime "PYTHON:3.12"
```

**Exact build command:** Oryx runs automatically during deploy (no separate build command).

**Exact run command:** `./startup.sh` → `exec python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000`

### Alternative: Zip deploy (if `az webapp up` fails)

```bash
cd Bytewave

# Build frontend first
cd frontend && npm ci && npm run build && cd ..

# Create zip (exclude node_modules, .venv, etc.)
zip -r ../bytewave-deploy.zip . -x "frontend/node_modules/*" -x ".venv/*" -x "*.pyc" -x "__pycache__/*" -x ".git/*" -x "media_output/*"

cd ..
az webapp deployment source config-zip \
  --name bytewave-app \
  --resource-group rg-bytewave \
  --src bytewave-deploy.zip
```

### Environment variables required

| Variable | Required | Set via |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | Yes | Azure Portal → App Service → Configuration → Application settings |
| `CORS_ORIGINS` | No | Defaults to localhost |
| `JWT_SECRET` | No | Ephemeral if unset |
| `ADMIN_KEY` | No | For admin endpoints |
| `WEBSITES_PORT` | No | Default 8000 (Azure may set from app) |

---

## D. What Must Be Updated From March 10 Setup

| Item | Status | Action |
|------|--------|--------|
| **Manim system deps** | Oryx image lacks cairo, ffmpeg, texlive | Manim rendering will likely fail on Oryx. Use Docker for full Manim support. |
| **`appsvc.yaml`** | Added | Ensures `run: ./startup.sh` and `pre-build` for frontend. |
| **`manim-physics`** | Added to requirements | Already in `requirements.txt` — no change needed. |
| **Health endpoint** | Returns 503 when Manim missing | App will start; `/health` may return 503 if Manim fails. |
| **ACR Tasks** | Disabled for subscription | Cannot use `az acr build`; use local Docker + push if switching to container. |

### Manim on Oryx — Known Limitation

The Oryx build image does **not** include:

- `libcairo2-dev`, `libpango1.0-dev`
- `ffmpeg`
- `texlive-latex-base`, `texlive-fonts-recommended`, `texlive-latex-extra`

**Result:** `pip install manim` may succeed, but `python -m manim` will fail at runtime. The app will start; AI chat and non-render features work; animation endpoints return 503.

**If Manim is required:** Deploy via **Docker** (see Section E).

---

## E. Final Verdict

### Will this restore the working deployment?

| Scenario | Verdict |
|----------|---------|
| **App starts, API + frontend serve** | Yes — Oryx + startup.sh will bring the app up. |
| **AI chat, assessments, skill map** | Yes — if `ANTHROPIC_API_KEY` is set. |
| **Manim animations** | No — Oryx lacks cairo/ffmpeg/latex. |

### If March 10 had working Manim

Then either:

1. **Docker was used** — Custom container with full system deps.
2. **Different Azure image** — A build image that included those packages (unlikely).
3. **Manim was not fully tested** — App “worked” but animations may have failed.

### Recommended path for full Manim support

Use **Docker on Azure App Service** (Web App for Containers):

1. Build image locally: `docker build -t bytewaveacr.azurecr.io/bytewave:latest .`
2. Push to ACR: `docker push bytewaveacr.azurecr.io/bytewave:latest` (after `az acr login`)
3. Configure web app: `az webapp config container set --name bytewave-app --resource-group rg-bytewave --docker-custom-image bytewaveacr.azurecr.io/bytewave:latest`

**Blocker:** ACR Tasks are disabled; you must build locally. If Docker is not installed locally, use a CI/CD pipeline (e.g. GitHub Actions) to build and push the image.

---

## Summary: Exact Commands for Oryx Redeploy

```bash
# 1. Build frontend
cd Bytewave
cd frontend && npm ci --no-audit --no-fund && npm run build && cd ..

# 2. Set env (replace <your-key>)
az webapp config appsettings set --name bytewave-app --resource-group rg-bytewave \
  --settings ANTHROPIC_API_KEY="<your-key>"

# 3. Set startup
az webapp config set --name bytewave-app --resource-group rg-bytewave \
  --startup-file "./startup.sh"

# 4. Deploy
az webapp up --name bytewave-app --resource-group rg-bytewave --plan bytewave-plan --runtime "PYTHON:3.12"
```

**Startup command used by the app:**  
`./startup.sh` → `exec python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000`
