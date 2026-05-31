#!/usr/bin/env bash
set -euo pipefail

TAMOR_DIR=".tamor-ui"
TAMOR_REPO="git@github.com:tamorAI/ui.git"
BRANCH="main"

# Bootstrap tamor-ui if not set up yet
if [ ! -d "node_modules/@tamor/ui" ]; then
  echo "=== Setting up tamor-ui ==="
  if [ -d "$TAMOR_DIR" ]; then
    git -C "$TAMOR_DIR" pull origin "$BRANCH"
  else
    git clone --depth 1 --branch "$BRANCH" "$TAMOR_REPO" "$TAMOR_DIR"
  fi
  bun install --cwd "$TAMOR_DIR"
  bun install
fi

# Run the requested command
exec "$@"
