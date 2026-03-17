# ByteWave Backend — End-to-End Audit Report

**Audit date:** 2026-03-17  
**Scope:** Full backend validation — imports, startup, routes, dependencies, Manim pipeline, failure modes

---

## A. Backend Architecture Overview

### Entrypoints
| Entrypoint | File | Purpose |
|------------|------|---------|
| **Main app** | `backend/main.py` | FastAPI app, uvicorn serves `backend.main:app` |
| **Startup** | `main.py` `@app.on_event("startup")` | `init_databases()`, `prewarm_manim()` |

### Import Chain (module load order)
```
main.py
├── backend.agent (RAISES if ANTHROPIC_API_KEY missing)
│   ├── anthropic, dotenv, json, logging, os, time, path
│   ├── numpy
│   └── manim_voiceover (optional, try/except)
├── backend.manim_runner
│   └── stdlib only (ast, subprocess, shutil, etc.) — NO manim import
├── backend.learn
│   ├── anthropic, dotenv
│   └── sqlite3
├── backend.auth
│   ├── bcrypt, jwt
│   └── sqlite3
```

### Core Services
| Service | File | Depends On |
|---------|------|------------|
| **Agent** | `agent.py` | anthropic, numpy, RAG (lazy), manim_voiceover (optional) |
| **Manim Runner** | `manim_runner.py` | subprocess `python -m manim` — **Manim must be installed** |
| **Learning Engine** | `learn.py` | anthropic, SQLite |
| **Auth** | `auth.py` | bcrypt, jwt, SQLite |
| **RAG** | `rag/knowledge_base.py` | chromadb, sentence-transformers (lazy) |

### API Routes (35+)
- **Auth:** `/api/auth/signup`, `signin`, `guest`, `me`
- **Render:** `/api/generate_plan_and_code`, `generate_plan`, `generate_code`, `render_video`, `quick_render`, `render_async`, `/api/job/{id}`, `/api/followup`
- **Learn:** `/api/learn/skills`, `student`, `recommend`, `questions`, `submit`, `start-adaptive`, `submit-one`, `profile`
- **Progress:** `/api/progress/{user_id}`, `/api/recommendations/{user_id}`, `/api/cases/{skill_id}`
- **Assess:** `/api/assess`
- **Chat:** `/api/chat`
- **Forum:** `/api/forum/posts`, replies, upvote, edit, delete
- **Waitlist:** `/api/waitlist`, `/api/waitlist/count`
- **Admin:** `/api/admin/prerender-clips`, `/api/clips/status`
- **Misc:** `/api/upload`, `/api/animations`, `/api/rag/stats`, `/health`

### Required Environment Variables
| Variable | Required | Effect if Missing |
|----------|----------|-------------------|
| `ANTHROPIC_API_KEY` | **Yes** | `agent.py` raises `ValueError` at import — **app cannot start** |
| `JWT_SECRET` | No | Ephemeral secret generated; tokens invalid after restart |
| `ADMIN_KEY` | No | Admin endpoints unprotected |
| `CORS_ORIGINS` | No | Defaults to localhost |
| `VITE_POSTHOG_KEY` | No | Analytics no-op |

### External Libraries (must be installed)
| Package | Used By | Required For |
|---------|---------|--------------|
| `manim` | manim_runner (subprocess) | All animation rendering |
| `anthropic` | agent, learn | AI pipeline, questions, chat |
| `chromadb` | RAG | Few-shot code generation |
| `sentence-transformers` | RAG | Embeddings for ChromaDB |
| `fastapi`, `uvicorn` | main | Server |
| `bcrypt`, `jwt` | auth | Auth |
| `scipy`, `pymunk`, `numpy` | agent | Physics simulations in generated code |
| `manim_physics` | agent (in skeleton) | Optional — templates use `try/except ImportError` |

### Database Usage
- **SQLite:** `backend/learn.db` (single file)
- **Tables:** students, mastery, sessions, answers, animations, forum_posts, forum_replies, waitlist, users (auth)
- **Init:** `init_db()` and `init_auth_tables()` on startup — non-fatal on failure
- **Path:** `Path(__file__).resolve().parent / "learn.db"` — relative to backend/

### Rendering Pipeline
```
Request (question) → sanitize_question → match_template?
├─ Template match → generate_template_manim_code → cache check → run_manim_script (subprocess)
└─ No template → generate_plan_and_code (LLM) → run_manim_script
   → On failure: fix_manim_code (LLM) → retry
   → On total failure: generate_template_manim_code (fallback) → run_manim_script
```

**Critical:** `run_manim_script()` runs `sys.executable -m manim` as subprocess. If `manim` is not installed in that Python environment, subprocess fails with `No module named manim`.

---

## B. Startup Blockers

| # | File | Section | Why It Breaks | Severity | Fix |
|---|------|---------|---------------|----------|-----|
| 1 | `agent.py` | Lines 14–16 | `if not ANTHROPIC_API_KEY: raise ValueError(...)` at module load | **CRITICAL** | Set `ANTHROPIC_API_KEY` in env before starting |
| 2 | `main.py` | `prewarm_manim()` | `_WARMUP_CODE` defines `class _WarmupScene` but `run_manim_script` requires `PhysicsAnimation` in code and passes `"PhysicsAnimation"` to manim CLI | **BUG** | Change warmup to use `class PhysicsAnimation(Scene)` |
| 3 | Azure/Oryx | Root `requirements.txt` | Manim was commented out — not installed in Azure env | **CRITICAL** (Azure) | Add `manim>=0.18.0` to root requirements.txt (already done) |

---

## C. Runtime Blockers

| # | File | Function/Route | Why It Breaks | Severity | Fix |
|---|------|----------------|---------------|----------|-----|
| 1 | `manim_runner.py` | `run_manim_script()` | Subprocess `python -m manim` fails if manim not installed | **CRITICAL** | Install manim in deployment env |
| 2 | `manim_runner.py` | `run_manim_script()` | Subprocess `cwd=ROOT_DIR` — if media_output not writable, script write fails | Medium | Ensure media_output dir exists and is writable |
| 3 | `learn.py` | Any LLM call | `_client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))` — empty key causes API error on first call | **CRITICAL** | Agent blocks startup first; ensure key set |
| 4 | `main.py` | `_video_path_to_url()` | Assumes path contains `"media_output"` — different deploy layouts could break | Low | Path is derived from manim output; generally stable |
| 5 | `main.py` | Static mounts | `MEDIA_DIR`, `_CLIPS_STATIC_DIR`, `_UPLOADS_DIR` — `mkdir(exist_ok=True)` can fail if parent read-only | Medium | Ensure project root is writable on Azure |

---

## D. Manim-Specific Issues

### All Code Paths That Call `run_manim_script`
| Location | Trigger | When |
|----------|---------|------|
| `main.py:212` | `prewarm_manim()` | Startup (non-fatal) |
| `main.py:313` | `_render_with_retries()` | Any render request |
| `main.py:340` | `_render_with_retries()` fallback | After 2 failed attempts |
| `main.py:1565–1567` | `prerender_clips` admin | Admin endpoint |
| Remediation jobs | `submit-one`, `submit` | When assessment score < 60% |

### Failure Modes When Manim Missing
1. **Startup:** `prewarm_manim` catches exception, logs warning, continues.
2. **Health:** `/health` returns `"manim": "missing"` — does not block.
3. **Render endpoints:** All fail with `ManimExecutionError` → HTTP 500.
4. **Remediation:** Jobs fail, user sees error in feedback screen.

### Agent Does NOT Import Manim
- `agent.py` uses Manim only as **string templates** (MANIM_SKELETON, etc.).
- No `import manim` at module level.
- Code generation and template logic work without Manim.
- **Only `run_manim_script` (subprocess) requires Manim.**

---

## E. API Health Assessment

| Route Category | Works Without Manim? | Works Without Anthropic? | Notes |
|----------------|---------------------|---------------------------|------|
| `/`, `/health` | Yes | Partially (health returns anthropic_key: missing) | |
| `/api/auth/*` | Yes | Yes | |
| `/api/learn/skills` | Yes | Yes | Static data |
| `/api/learn/student` | Yes | Yes | |
| `/api/progress/{id}` | Yes | Yes | DB only |
| `/api/recommendations/{id}` | Yes | No | Uses Claude |
| `/api/cases/{id}` | Yes | Yes | Static data |
| `/api/learn/start-adaptive` | Yes | No | Generates questions via Claude |
| `/api/learn/submit-one` | Yes* | No | *Remediation job fails if Manim missing |
| `/api/forum/*` | Yes | Yes | |
| `/api/waitlist` | Yes | Yes | |
| `/api/chat` | Yes | No | Uses Claude |
| `/api/assess` | Yes | No | Uses Claude |
| `/api/rag/stats` | Yes | Yes | ChromaDB |
| `/api/upload` | Yes | Yes | |
| `/api/quick_render`, `render_async`, `render_video`, `followup` (animate) | **No** | No | Require Manim + Anthropic |

---

## F. What Still Works Without Manim

- Server startup
- Auth (signup, signin, guest)
- Skill map data (`/api/learn/skills`, `/api/cases`, `/api/progress`)
- Forum CRUD
- Waitlist
- File upload
- RAG stats
- Chat (text-only; no animation generation)
- Learning flow **except** remediation video generation

**Broken without Manim:**
- All animation generation (quick_render, render_async, render_video, followup with animate)
- Remediation videos after low assessment scores
- Pre-rendered clips (admin)

---

## G. Priority Fixes

| Priority | Fix | File | Action |
|----------|-----|------|--------|
| P0 | Install Manim in Azure | `requirements.txt` | Uncomment/add `manim>=0.18.0` ✅ (done) |
| P0 | Require ANTHROPIC_API_KEY | Docs / deployment | Document as required; app will not start without it |
| P1 | Fix warmup scene name | `main.py` | Change `_WarmupScene` → `PhysicsAnimation` in `_WARMUP_CODE` ✅ (done) |
| P2 | Graceful Manim unavailable | `main.py` | Add startup check; set `MANIM_AVAILABLE` flag; return 503 with clear message on render endpoints when Manim missing ✅ (done) |
| P2 | Fix SyntaxWarning | `agent.py:2131` | Fix invalid escape sequence `\,` in prompt string ✅ (done) |
| P3 | Optional manim_physics | - | Already optional via try/except in skeleton |
| P3 | JWT_SECRET for production | Docs | Document setting JWT_SECRET for token persistence |

---

## H. Recommended Smoke Tests

### 1. Startup Validation Script
**Implemented:** `backend/check_startup.py` — run with `python -m backend.check_startup`

### 2. Health Endpoint Enhancement
- Extend `/health` to return `"manim_available": bool` based on `import manim` success.
- Frontend can check and show "Animations unavailable" when false.

### 3. Graceful Fallback When Manim Unavailable
```python
# At startup, after imports:
MANIM_AVAILABLE = False
try:
    import manim
    MANIM_AVAILABLE = True
except ImportError:
    logger.warning("Manim not installed — animation endpoints will return 503")

# In render endpoints, before calling run_manim_script:
if not MANIM_AVAILABLE:
    raise HTTPException(503, "Animation service unavailable. Manim is not installed.")
```

### 4. Dependency Check Script (pre-deploy)
```bash
#!/bin/bash
python -c "
import sys
deps = [('anthropic','ANTHROPIC_API_KEY'), ('manim',None), ('chromadb',None), ('bcrypt',None)]
for mod, env in deps:
    try: __import__(mod)
    except ImportError: print(f'MISSING: {mod}'); sys.exit(1)
    if env and not __import__('os').environ.get(env): print(f'ENV: {env}'); sys.exit(1)
print('OK')
"
```

---

## Summary Verdict

| Environment | Status | Notes |
|-------------|--------|-------|
| **Local (Manim installed)** | **Demo-safe** | Server starts; animations work; warmup has minor bug |
| **Azure (Manim was missing)** | **Broken** | All animation requests fail with "No module named manim" |
| **Azure (after requirements fix)** | **Unverified** | Manim in requirements.txt; redeploy needed; system deps (cairo, ffmpeg, latex) may still be missing |
| **Production (Docker)** | **Production-safe** | Dockerfile installs system deps + Manim |

**Recommendation:** Use Docker deployment for production. For Azure Oryx build, add Manim to requirements.txt (done) and verify system libraries (cairo, ffmpeg, texlive) are available; if not, switch to Docker-based Azure deployment.
