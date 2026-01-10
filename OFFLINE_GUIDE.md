# Emulatrix — Offline Guide 📴

This document explains how to run Emulatrix completely offline, how to prepare an offline bundle, how to use joysticks and virtual controls while offline, how to persist saves, and practical packaging options (local server, PWA install, and native wrappers).

---

## Quick summary

- Emulatrix is a static PWA (HTML + JS + WASM). For full offline operation you should serve it from a local static server once to register the service worker and then use the registered PWA or the cached assets to run without network.
- There are three recommended offline modes:
  1. Local static server + PWA install (recommended for most users).
  2. Fully bundled portable archive (`.tar.gz` or `.zip`) served by a tiny local server (for devices without dev environments).
  3. Packaged native app (Electron/Tauri) for desktop distribution that works fully offline with native file access.

---

## Requirements & browser notes

- Modern browser with WebAssembly support (Chrome, Edge, Firefox, Chromium-based browsers). Some features may be limited on browsers that restrict the Gamepad API or service workers.
- Service workers require HTTPS except when served from `localhost`. For local testing use `http://localhost` or a proper HTTPS host.
- Gamepad API works offline — physical USB controllers are handled by the browser and Emscripten code.

---

## 1) Prepare the app for offline use (developer steps)

1. Ensure `worker.js` `filesToCache` includes every asset needed offline (`index.html`, `Emulatrix.htm`, all `Emulatrix_*.htm`, `*.js`, `*.wasm`, images, icons). If you add a core or asset, append it to `filesToCache`.
2. Bump the `staticCacheName` (e.g. `emulatrix-v2`) whenever you change the cache list so clients pick up updates.
3. (Optional) Precompress large assets (WASM/JS) with Brotli/gzip and serve compressed assets from the server with the correct `Content-Encoding`.

Examples:
- Add additional files in `worker.js`:
```js
const filesToCache = [
  '/', 'index.html', 'Emulatrix.htm', 'Emulatrix_MAME2003.wasm', ...
];
const staticCacheName = 'emulatrix-v2';
```

- Pre-compress (local machine):
```bash
# Brotli
brotli -q 11 Emulatrix_MAME2003.wasm
# gzip
gzip -9 -k Emulatrix_MAME2003.wasm
```
Configure your static host to serve `.wasm.br` or `.wasm.gz` when available.

---

## 2) Local server workflow (recommended for testing & local offline use)

1. Clone the repo and copy files to the offline machine (USB, LAN, etc.).
2. Start a static server from repository root:
   - Python: `python -m http.server 8000`
   - Node: `npx http-server -p 8000` or `npx serve -s .`
3. Open `http://localhost:8000` in the browser. Allow the page to fully load and **make sure the service worker registers** (DevTools → Application → Service Workers).
4. Use the site normally and test ROM load, save/load state, and joystick handling.
5. Once installed, disconnect network and confirm that the app still loads and the cores run from cache.

Notes:
- If the service worker fails to register, confirm that the browser allows service workers on `localhost` and that `worker.js` is accessible.
- If you update `filesToCache`, bump `staticCacheName` to force clients to refresh caches.

---

## 3) Creating a portable offline bundle (for distribution)

1. Build a copy of the repository with everything you want included.
2. Ensure `worker.js`'s `filesToCache` contains all the assets you packaged.
3. Create a tarball or zip for distribution:
```bash
# Zip
zip -r Emulatrix-offline.zip .
# or tar
tar czf Emulatrix-offline.tar.gz .
```
4. On the offline machine, extract and run a small static server (see commands above). Browsers do not reliably register service workers from `file://` URLs so run a local server.

Optional: Create a small start script (Linux/Windows) that starts a server and opens the browser on boot.

---

## 4) Running on Android offline

- Copy the offline bundle to the Android device.
- Option A (simple): install Termux or a static server app (Simple HTTP Server) and `cd` into the extracted folder and run `http-server` or `python -m http.server`. Then open `http://127.0.0.1:8000` in Chrome.
- Option B (installable PWA): using Chrome, visit the local server address, choose "Install" or "Add to Home screen". After install, you can launch the PWA without the browser UI and the cache will serve files offline.

Caveats:
- Some mobile browsers place stricter limits on service workers and background execution which may reduce offline capabilities; Android (Chrome/Edge) generally works best for offline PWAs.

---

## 5) Persistent saves and ROMs (offline persistence)

- By design, emulator cores write save files and state files either to in-memory FS (ephemeral) or the browser's Downloads/virtual file manager. To make saves persistent across sessions, integrate Emscripten's IDBFS (IndexedDB-based FS) for saving and restoring files.

Example snippet to mount IDBFS and sync (add to emulator page bootstrap code):
```js
// Mount persistent folder and load it
FS.mkdir('/save');
FS.mount(IDBFS, {}, '/save');
// Load persisted files into memory at startup
FS.syncfs(true, function(err){
  if (err) console.error('syncfs load', err);
  // start core now
});

// Before closing / on save, write back
FS.syncfs(false, function(err){
  if (err) console.error('syncfs save', err);
});
```

- For immediate user exports, use the GUI's download/save state button to save to the user's Downloads folder.
- Note: Browser storage may be evicted under quota pressure. Encourage users to back up save files to Downloads or export separately.

---

## 6) Joystick & input offline

- **USB controllers (Gamepad API)**: work offline — just connect and use. The emulator's Emscripten glue reads `navigator.getGamepads()` which is available without network.
- **Virtual joystick (touch)**: implemented in the repo (`VirtualJoystick`). Works offline as it is local JS.
- **Mapping & config**: offline RetroArch cores get their config written to the virtual filesystem by the loader (see `loadRomIntoVD()` in `Emulatrix_MAME2003.htm`), so you can set default button mappings offline.

---

## 7) Packaging as a native desktop app (fully offline, optional)

If you want to distribute Emulatrix as a desktop app that always works offline without needing a local server, package it with **Electron** or **Tauri**.

High-level steps (Electron):
1. Add a minimal `main.js` that serves local `index.html` (or loads it via file protocol) and creates a BrowserWindow.
2. Bundle all files into the app's `resources` or a packaged `app.asar` package.
3. Add native menus and a small UI for ROM import/export using native file dialogs.

Pros: consistent offline experience and easier file access for users.
Cons: larger distribution size and licensing implications for cores/BINs.

---

## 8) Testing & troubleshooting

- Service worker not registering → confirm you are on `localhost` or `https` and check DevTools Application -> Service Workers.
- Assets not cached / missing WASM → open Network tab, reload while offline to see which files are missing; update `filesToCache` and bump cache version.
- Save files disappear after refresh → enable IDBFS persistence as shown above.
- Gamepad not detected → check `navigator.getGamepads()` in Console and ensure controller is connected and recognized by OS.
- Space / quota issues → browsers can evict caches; encourage users to export saves and ROMs to their filesystem if they need guaranteed long-term storage.

---

## 9) Legal & distribution notes

- Emulators and cores are typically open-source but may rely on BIOS or ROM files that are not freely redistributable. **Do not bundle ROMs, BIOS, or other copyrighted content** unless you have the legal right to distribute them.
- When distributing an offline package that includes cores with particular licenses, document those licenses and comply with attribution/requirements.

---

## Appendix — Useful commands

- Start a quick server (Python):
```bash
python -m http.server 8000
```
- Start a quick Node server (npm required):
```bash
npx http-server -p 8000
```
- Create portable archive:
```bash
tar czf Emulatrix-offline.tar.gz .
# or
zip -r Emulatrix-offline.zip .
```
- Precompress a WASM file with Brotli:
```bash
brotli -q 11 Emulatrix_MAME2003.wasm -o Emulatrix_MAME2003.wasm.br
```

---

If you'd like, I can:
- Add a `DEVELOPING.md` that references this offline guide and includes short start scripts, or
- Add a sample `package.json` scripts block and a simple GitHub Actions workflow that verifies service worker registration and that critical assets are present in the cache (smoke test).

Would you like me to add any of those as follow-up steps?