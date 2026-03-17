# Deployment Notes

## Recommended: Docker

The Dockerfile includes all Manim system dependencies (ffmpeg, cairo, pango, LaTeX). Use Docker for production deployments.

```bash
docker build -t bytewave:latest .
docker run -p 8000:8000 -e ANTHROPIC_API_KEY=your_key bytewave:latest
```

## Oryx / Code Deploy

Oryx (Azure App Service code deployment) does **not** install Manim system dependencies. Manim rendering will fail. Use container-based deployment instead.

## Environment Variables

- `ANTHROPIC_API_KEY` — Required
- `JWT_SECRET` — Recommended for production
- `CORS_ORIGINS` — Set for your frontend origin
- `WEBSITES_PORT=8000` — For Azure App Service containers

## See Also

- [MANIM_DEPLOYMENT.md](./MANIM_DEPLOYMENT.md) — Manim setup by platform
- [DEPLOY_REPORT_MARCH10.md](./DEPLOY_REPORT_MARCH10.md) — Historical deployment notes
