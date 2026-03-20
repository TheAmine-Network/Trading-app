#!/bin/bash

BRANCH="claude/gestionplex-saas-app-JWtgF"

echo "🚀 Démarrage du dev server + auto-pull..."

# Auto-pull en arrière-plan
(
  while true; do
    sleep 4
    git pull --ff-only origin "$BRANCH" --quiet 2>/dev/null && \
      echo "[auto-pull] ✅ $(date '+%H:%M:%S') — mis à jour"
  done
) &
WATCHER_PID=$!

# Démarrer le dev server
npm run dev

# Quand le dev server s'arrête (Ctrl+C), tuer le watcher aussi
kill $WATCHER_PID 2>/dev/null
