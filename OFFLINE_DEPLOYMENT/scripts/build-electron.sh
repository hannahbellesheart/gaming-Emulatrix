#!/usr/bin/env bash
# Minimal Electron packaging helper (requires npm and electron-builder)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required. Install Node.js and npm." >&2
  exit 1
fi
if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required. It comes with npm >= 5.2." >&2
  exit 1
fi

# create a minimal package.json for packaging if missing
if [ ! -f package.json ]; then
  cat > package.json <<EOF
{
  "name": "emulatrix-offline",
  "version": "0.1.0",
  "main": "index.html",
  "scripts": {
    "start": "electron .",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"
  },
  "devDependencies": {
    "electron": "latest",
    "electron-builder": "latest"
  }
}
EOF
  echo "Created minimal package.json. Run 'npm install' to fetch dependencies."
  echo "To build: npm install && npm run dist"
else
  echo "package.json already exists. Please ensure electron and electron-builder are installed."
fi