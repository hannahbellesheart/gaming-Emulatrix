#!/usr/bin/env bash
# Android APK helper (very high-level): creates a wrapper that loads local Emulatrix content in a WebView
# NOTE: This script does NOT produce a full APK by itself. It scaffolds an Android project and points to docs.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Scaffold Android WebView wrapper. Requires Android SDK, Gradle, and Java."
mkdir -p android-wrapper/app/src/main/assets/www
cp -r index.html Emulatrix.htm Emulatrix.css Emulatrix.json android-wrapper/app/src/main/assets/www/

cat > android-wrapper/README.md <<EOF
This scaffold copies Emulatrix into an Android project's assets/www and expects a simple WebView-based activity that loads 'file:///android_asset/www/index.html'.
To build a real APK, create a standard Android app (e.g., with Android Studio), copy these assets into 'app/src/main/assets/www', add an Activity with a WebView, and build the APK using Gradle.
EOF

echo "Created android-wrapper/ with assets. See README for next steps."