#!/usr/bin/env bash
# Create an Electron Fiddle-like package by bundling minimal files
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Creating a minimal Electron Fiddle package (requires electron-fiddle or manual steps)."

# Note: electron-fiddle is primarily an editor. We'll point to docs and create a minimal package folder.
mkdir -p offline-fiddle
cp -r index.html Emulatrix.htm Emulatrix.css Emulatrix.json offline-fiddle/ 2>/dev/null || true
cat > offline-fiddle/README.md <<EOF
This folder contains a minimal offline fiddle environment. Open in electron-fiddle or use Electron to run it.
EOF

echo "Package created in offline-fiddle/. Use electron-fiddle to open it or launch with Electron."