#!/usr/bin/env bash
# Flatpak packaging helper (high-level). Requires flatpak-builder and a manifest.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

cat > com.emulatrix.Emulatrix.json <<EOF
{
  "app-id": "com.emulatrix.Emulatrix",
  "runtime": "org.freedesktop.Platform",
  "runtime-version": "21.08",
  "sdk": "org.freedesktop.Sdk",
  "command": "emulatrix",
  "modules": [
    {
      "name": "emulatrix-data",
      "buildsystem": "simple",
      "build-commands": ["install -Dm644 index.html /app/share/emulatrix/index.html", "install -Dm644 Emulatrix.htm /app/share/emulatrix/Emulatrix.htm"],
      "sources": []
    }
  ]
}
EOF

echo "Created a basic Flatpak manifest 'com.emulatrix.Emulatrix.json'. Use flatpak-builder to build:"
echo "flatpak-builder --force-clean --install-deps-from=flathub build-dir com.emulatrix.Emulatrix.json"
