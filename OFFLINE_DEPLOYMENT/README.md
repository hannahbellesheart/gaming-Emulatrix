# OFFLINE_DEPLOYMENT — Emulatrix

This folder contains scripts and helper files to prepare an all-in-one offline bundle for Emulatrix. It includes cross-platform scripts (bash, PowerShell, batch, Node.js, Go, C#) and a shared configuration so you can: configure, serve, and launch a local static server + PWA installation, build desktop packages (Electron/Tauri/Electron-Fiddle), create a simple Android APK wrapper, and package a Flatpak or similar Linux bundle.

Important: These scripts are intended as a convenience and template. Some packaging processes (Electron, Tauri, Android, Flatpak) require platform-specific toolchains (Node/npm, Rust for Tauri, Android SDK/Gradle, Flatpak-builder/Meson, etc.). The scripts will attempt to validate prerequisites and will print clear instructions when a tool is missing.

Structure
- scripts/             — language-specific helper scripts
- shared-config.json   — central config used by the scripts
- roms/                — placeholder folder for bundling ROMs (empty by default)
- bin/                 — prebuilt cross-platform server binaries
- README.md            — this file

Quick start (local test server):
- Linux (POSIX):
  ./scripts/start-local-server.sh
- Windows PowerShell:
  ./scripts/start-local-server.ps1
- Windows (batch):
  scripts\start-local-server.bat
- Or run the prebuilt binary for your platform (Linux/Windows):
  ./scripts/run-binary.sh  (POSIX)
  ./scripts/run-binary.ps1 (PowerShell)

Binaries
- Ready-to-run server binaries were compiled and are available under `OFFLINE_DEPLOYMENT/bin/`:
  - `linux-amd64/emulatrix-server`
  - `windows-amd64/emulatrix-server.exe`
- Checksums are available at `OFFLINE_DEPLOYMENT/bin/checksums.sha256`.

Packaging & distribution notes
- The project is now focused on **Windows, Linux, and Android** targets; platform-specific artifacts and references were removed to simplify packaging and avoid platform-specific limitations.
- You can create compressed archives (`.zip`, `.tar.gz`) of `OFFLINE_DEPLOYMENT` (see `OFFLINE_DEPLOYMENT/dist/`) for distribution.
- For distribution where users cannot execute arbitrary binaries, package into native app formats (Electron/Tauri/APK/Flatpak) using the scripts in `scripts/` and follow the steps in `INSTALLERS.md` for signing and platform-specific details.

If you'd like, I can: add a working `package.json` and a GitHub Actions workflow to run smoke tests for service worker registration and asset presence.