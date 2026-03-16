#!/usr/bin/env bash
set -e

cd /home/site/wwwroot

# Decompress Oryx virtual env if it was compressed during build
if [ -f "antenv.tar.gz" ] && [ ! -d "antenv" ]; then
    echo "Extracting compressed virtual environment..."
    tar -xzf antenv.tar.gz
fi

if [ -d "antenv" ]; then
    echo "Activating virtual environment..."
    source antenv/bin/activate
fi

mkdir -p media_output/media media_output/clips

exec python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
