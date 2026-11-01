#!/usr/bin/env bash
# Deploy script: runs ON THE SERVER. Pulls latest code and rebuilds containers.
set -euo pipefail

APP_DIR=/opt/smart-elephant
cd "$APP_DIR"

echo "==> Pulling latest code"
git pull --ff-only

echo "==> Building and restarting containers"
docker compose up -d --build

echo "==> Removing old unused images"
docker image prune -f

echo "==> Container status"
docker compose ps

echo "==> Deploy finished: $(git log -1 --oneline)"