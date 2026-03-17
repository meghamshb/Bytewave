# ByteWave Render Pipeline — Verification Report

**Date:** 2026-03-17  
**Status:** Manim rendering verified end-to-end (local environment)

---

## A. Exact Render Path (Request → MP4)

```
1. REQUEST
   POST /api/quick_render  { "question": "...", "quality": "low" }
   POST /api/render_async  { "code": "...", "plan": "...", "question": "..." }
   POST /api/render_video  (sync)
   POST /api/followup      (when type=animate)
   POST /api/generate_plan_and_code → then POST /api/render_async

2. ROUTING (main.py)
   quick_render → match_template() → generate_template_manim_code() → _render_job_safe()
   render_async → _render_job_safe()
   render_video → _render_with_retries() [sync]

3. RENDER ORCHESTRATION (main.py)
   _render_job_safe() → _render_with_retries() → run_manim_script()
   _render_with_retries: attempt 0 → run_manim_script; on failure → fix_manim_code (LLM) → attempt 1; on total failure → generate_template_manim_code (fallback) → run_manim_script

4. MANIM RUNNER (manim_runner.py)
   run_manim_script(code, quality):
     - Validate code has "PhysicsAnimation"
     - ast.parse(code)
     - cleanup_old_media()
     - Write code to media_output/{uuid}.py
     - subprocess.run([sys.executable, "-m", "manim", "-ql", "--media_dir", ..., script_path, "PhysicsAnimation"])
     - Find MP4 under media_output/media/videos/{uuid}/480p15/PhysicsAnimation.mp4
     - Return path

5. OUTPUT SERVING
   _video_path_to_url() converts path → /media/videos/{uuid}/480p15/PhysicsAnimation.mp4
   StaticFiles mount at /media → media_output/media/
   Client fetches GET /media/videos/.../PhysicsAnimation.mp4

6. CACHE (quick_render)
   _get_from_render_cache(question, params) → SHA-256 key, 24h TTL
   Cache hit → instant job with status=done
```

**Files involved:**
- `backend/main.py` — routes, _render_with_retries, _render_job_safe, cache, static mount
- `backend/agent.py` — generate_template_manim_code, generate_manim_code, generate_plan_and_code, fix_manim_code
- `backend/manim_runner.py` — run_manim_script, cleanup_old_media

---

## B. Exact Code Changes

| File | Change |
|------|--------|
| `requirements.txt` | Added `manim-physics>=0.17.0` |
| `backend/requirements-manim.txt` | Added `manim-physics>=0.17.0`, commented voiceover |
| `backend/main.py` | Health endpoint: granular `api_healthy`, `ai_healthy`, `manim_healthy`, `render_pipeline_healthy`, `healthy`; 503 when core broken |
| `backend/check_startup.py` | Rewritten: full validation (env, packages, system deps, dirs, smoke render, main import) |
| `backend/smoke_render.py` | New: minimal render smoke test |
| `Dockerfile` | Removed `|| true` from manim pip install |
| `.env.example` | Updated comments, no secrets |
| `MANIM_DEPLOYMENT.md` | New: install commands for macOS, Linux, Docker, Azure |

---

## C. Missing Dependencies Found

| Dependency | Status | Action |
|------------|--------|--------|
| manim_physics | Was missing from root requirements | Added to requirements.txt and backend/requirements-manim.txt |
| system deps (cairo, ffmpeg, latex) | Not in Azure Oryx by default | Documented in MANIM_DEPLOYMENT.md; Docker has them |

---

## D. Commands to Install/Fix

**Local (macOS):**
```bash
brew install cairo pkg-config ffmpeg
# Optional: brew install --cask mactex
pip install -r requirements.txt
```

**Local (Ubuntu):**
```bash
sudo apt-get install -y build-essential ffmpeg libcairo2-dev libpango1.0-dev pkg-config texlive-latex-base texlive-fonts-recommended texlive-latex-extra
pip install -r requirements.txt
```

**Verify:**
```bash
ANTHROPIC_API_KEY=yourkey python -m backend.check_startup
python -m backend.smoke_render
```

---

## E. Final Verdict

**Can ByteWave render Manim animations right now?**

- **Local (macOS/Linux with deps):** YES — verified end-to-end.
- **Docker:** YES — Dockerfile has all system deps.
- **Azure Oryx:** NO — Manim may install but cairo/ffmpeg/latex often missing. Use Docker on Azure.

**What blocks it on Azure Oryx?**
- System packages (cairo, ffmpeg, texlive) are not in the default Oryx build image.
- `pip install manim` succeeds but `python -m manim` fails at runtime when cairo/ffmpeg/latex are missing.

---

## F. Endpoint Behavior

| Endpoint | Status | Blocked By |
|----------|--------|------------|
| `POST /api/quick_render` | Fully working | — |
| `POST /api/render_async` | Fully working | — |
| `GET /api/job/{id}` | Fully working | — |
| `POST /api/render_video` | Fully working | — |
| `POST /api/generate_plan_and_code` | Fully working | ANTHROPIC_API_KEY |
| `POST /api/generate_plan` | Fully working | ANTHROPIC_API_KEY |
| `POST /api/generate_code` | Fully working | ANTHROPIC_API_KEY |
| `POST /api/followup` | Fully working (animate path) | ANTHROPIC_API_KEY, Manim |
| `POST /api/chat` | Text works | ANTHROPIC_API_KEY |
| `POST /api/admin/prerender-clips` | Fully working | Manim, ADMIN_KEY for protection |
| `GET /health` | Returns 503 if Manim or Anthropic missing | — |

---

## G. Priority Fix Plan

1. **Done:** Add manim_physics to requirements
2. **Done:** Strict check_startup
3. **Done:** Granular health endpoint
4. **Done:** Smoke test script
5. **Done:** MANIM_DEPLOYMENT.md
6. **For Azure:** Deploy via Docker (Container Apps or App Service with custom image) instead of Oryx
7. **For production:** Set JWT_SECRET in .env
