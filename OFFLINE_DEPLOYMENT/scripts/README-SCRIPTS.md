# OFFLINE_DEPLOYMENT scripts — quick reference

This file outlines the purpose of each script and the expected prerequisites.

Scripts:

- start-local-server.sh / .ps1 / .bat / start-local-server-node.js / start-local-server.go / start-local-server.cs
  - Start a local static server to serve the offline bundle. Use whichever fits your platform; the Go and C# versions compile to single executables.

- build-electron.*
  - Prepare a minimal Electron packaging scaffold (requires Node/npm and electron-builder). These scripts create a minimal package.json if missing and print next steps.

- build-tauri.sh
  - High-level helper and pointer to Tauri docs. Tauri requires Rust and Node.

- build-electron-fiddle.sh
  - Prepares a minimal "offline-fiddle" folder you can open in Electron Fiddle.

- build-android.sh
  - Scaffolds an Android assets folder for a WebView wrapper. Full APK requires Android SDK/Gradle.

- build-flatpak.sh
  - Generates a basic flatpak manifest file; use flatpak-builder to build.

- list-servers-and-urls.txt
  - Curated list of tiny servers and URLs for research.

- shared-config.json
  - Single source of truth used by scripts (port, cache name, files list, roms dir). Edit to customize.

Notes on packaging browsers: bundling full Chrome/Edge/Firefox builds is large and may be impractical. Instead, packaging a minimal Chromium-based WebView (via Electron/Tauri) is a recommended approach.
