# Emulatrix

JavaScript and WebAssembly Emulator - Sega Genesis, Nintendo, Super Nintendo, GameBoy, GameBoy Color, GameBoy Advance, MAME32, DOSBox and Virtual Machines.

![alt screenshot](https://raw.githubusercontent.com/lrusso/Emulatrix/master/Emulatrix1.png)

## Web

https://www.emulatrix.com

## How does it work?

It's a Web project that is 50% in JavaScript and 50% in WebAssembly. It uses the HTML5 File API for reading a file from the computer, so the End User must select the ROM file from his computer. After that, it uses BrowserFS, which creates a virtual filesystem on the client side where the ROM file is uploaded. When using the DOS emulator, there is a Web File Manager that allows the End User to upload and download files to/from that virtual filesystem. The emulators are in WebAssembly and the content is rendered on a Canvas and for audio it uses an AudioContext. There is a JavaScript logic that handles the AudioContext (for mute/unmute) and another logic for pausing and resuming the emulation when the window is on blur or on focus.

## IMPORTANT - After clicking on the upload icon

| PLATFORM  | HOW TO PLAY A GAME?  | FILE FORMAT |
| :------------ |:---------------:| :-----:|
| Nintendo | Select the game file from your device. | NES |
| Super Nintendo | Select the game file from your device. | SMC, SFC, SRM |
| GameBoy | Select the game file from your device. | GB |
| GameBoy Color | Select the game file from your device. | GBC |
| GameBoy Advance | Select the game file from your device. | GBA |
| Sega Genesis | Select the game file from your device. | BIN, SMD, MD |
| MAME32 | Select the game file from your device. | ZIP |
| DOS | Select the game file from your device. | ZIP |
| Virtual Machines | Select the disk file from your device. | ZIP |

- When running DOS, Emulatrix will try to run ```AUTORUN.BAT``` from the ZIP file after booting.
- Regarding virtual machines, the ZIP file must contain a ```c.img``` file that will be mounted and booted.

## DOSBox useful commands

| TYPE IN THE PROMPT  | RESULT  |
| :------------ |:---------------:|
| mount d . -t cdrom | Mounting a path as a CD-ROM |
| imgmount d cd1.cue cd2.cue -t cdrom | Mounting two CD-ROM images |
| config -set "cycles=4000" | Default emulation speed |
| config -set "cycles=10000" | Faster emulation speed |
| config -set "cycles=15000" | Faster emulation speed |
| config -set "cycles=20000" | Fastest emulation speed |
| config -set "sbtype=none" | Sound Blaster disabled |
| pkzip folder.zip c:\myfolder\\*.\* -rp | Creates folder.zip with myfolder content |

- For switching CD-ROM images you must press ```Ctrl+F4``` on Windows or the equivalent key combination on other systems. This can also be used for refreshing the filesystem after uploading a file.

## Original core files

| PLATFORM  | URL  | CORE
| :------------ |:---------------:| :-----:|
| Nintendo | https://buildbot.libretro.com/stable | fceumm
| Super Nintendo | https://buildbot.libretro.com/stable | snes9x2010
| GameBoy | https://buildbot.libretro.com/stable | gambatte
| GameBoy Color | https://buildbot.libretro.com/stable | gambatte
| GameBoy Advance | https://buildbot.libretro.com/stable | vba_next
| Sega Genesis | https://buildbot.libretro.com/stable | genesis_plus_gx
| MAME32 | https://buildbot.libretro.com/stable | mame2003_plus
| MAME32 | https://buildbot.libretro.com/stable | fbalpha2012
| DOS | https://github.com/dreamlayers/em-dosbox | dosbox

## Core files modifications

| PLATFORM  | TYPE  | DETAILS |
| :------------ |:--------------- |:---------------|
| Libretro cores | Bugfix | Content resized to canvas |
| Libretro cores | Bugfix | Delayed compilation workaround |
| Libretro cores | Feature | Mute/unmute implementation |
| Libretro cores | Feature | Load/save state implementation |
| Libretro cores | Feature | Paused/resumed emulation on blur/focus |
| DOSBox core | Bugfix | Launching emulator on blur |
| DOSBox core | Bugfix | SimulateInfiniteLoop in 16 bits systems |
| DOSBox core | Bugfix | Removed black margin when trying fullscreen |
| DOSBox core | Feature | PKZip implementation |
| DOSBox core | Feature | Mute/unmute implementation |
| DOSBox core | Feature | Load/save file implementation |
| DOSBox core | Feature | Paused/resumed emulation on blur/focus |

## MAME 2003 Plus notes:

- Playing Killer Instinct: Create a zip file named ```kinst-chd.zip``` that must contain ```kinst.zip``` and ```kinst.chd```. Emulatrix will unzip those files in order to run the game (takes several seconds).
- Saving and loading states: In some games (Killer Instinct, Mortal Kombat 1, 2 and Ultimate) the saving function doesn't work (core issue).

## Final Burn Alpha 2012 note:

- Playing Samurai Shodown III: You must use the ```samsho3h.zip``` file.

## Emulatrix has mobile compatibility (Android only)

![alt screenshot](https://raw.githubusercontent.com/lrusso/Emulatrix/master/Emulatrix2.png)

## Playing Emulatrix on Android with a USB Keyboard:

Press ```C``` on the Main Menu in order to enable or disable the mobile controls.

## Virtual joystick code

https://github.com/lrusso/VirtualJoystick

## Banner generators

https://www.emulatrix.com/Banner1.htm

https://www.emulatrix.com/Banner2.htm

https://www.emulatrix.com/Banner3.htm

https://www.emulatrix.com/Banner4.htm

https://www.emulatrix.com/Banner5.htm

https://www.emulatrix.com/Banner6.htm

https://www.emulatrix.com/BannerTitle.htm

## Developer Guide 🔧

This section is for contributors and maintainers. It explains the repo structure, how to run and deploy Emulatrix locally, how joysticks (USB and virtual) are supported, what types of VMs are supported, and proposed optimizations.

---

### Project overview

- Emulatrix is a **static PWA** that runs multiple emulators compiled to WebAssembly and controlled through JavaScript. No server-side code is required; the app uses the HTML5 File API and an in-browser virtual filesystem (Emscripten/FS) to load ROMs and assets.
- Entry point: `index.html` → loads `Emulatrix.htm` into the iframe. `Emulatrix.htm` manages the main UI, file selection and chooses the correct emulator iframe (e.g., `Emulatrix_MAME2003.htm`, `Emulatrix_DOSBox.htm`, etc.).

### Important files & folders

- `index.html` — app wrapper and iframe loader
- `Emulatrix.htm` — main GUI, `runEmulator(files)` logic, ROM detection (by extension and ROM name lists)
- `Emulatrix_*.htm`, `Emulatrix_*.js`, `Emulatrix_*.wasm` — emulator frontends and WASM cores
- `worker.js` — service worker (cache + offline behavior)
- `Emulatrix.json` — PWA manifest
- `Emulatrix.css` — style and mobile layout rules
- `README.md` — user + developer documentation

---

### Running locally (dev)

1. Start a static server from repository root (service worker registers only on HTTPs or localhost):
   - Python: `python -m http.server 8000`
   - Node: `npx http-server` or `npx serve`
2. Open `http://localhost:8000`
3. Use browser DevTools to view console, sources, and network. WASM compile messages appear in Console.
4. Tip: If you change `worker.js`, unregister the service worker (Application → Service Workers) to avoid stale cache issues during development.

---

### Deployment recommendations

- Any static hosting with HTTPS works: **GitHub Pages**, **Netlify**, **Vercel**, S3+CloudFront, etc.
- Make sure HTTPS is enabled and, if you use **SharedArrayBuffer** for threading (see proposed optimizations), configure COOP/COEP headers.
- Keep `CNAME` (repo contains one) if publishing to a custom domain.
- Use compression (Brotli/gzip) for `.wasm` and JS assets to reduce load times.

---

### Joystick & controller support 🎮

USB / Physical controllers
- Browsers expose physical controllers via the **Gamepad API** (`navigator.getGamepads()`), and Emscripten builds already include helpers (e.g., `_emscripten_sample_gamepad_data`).
- Typical usage:
  - Connect the USB controller to your machine.
  - Open Emulatrix, then open DevTools to verify `navigator.getGamepads()` returns entries.
  - The emulator cores (Emscripten/RetroArch wrappers) read the gamepad state and forward axes/buttons into the core.
- Troubleshooting:
  - Some controllers require browser permissions or specific mappings. Chrome/Edge generally work well.
  - Some mobile browsers historically have limited Gamepad API support.

Virtual joystick (touch / mobile)
- The project includes a virtual joystick (see the `VirtualJoystick` link in the main README and usage in `Emulatrix_SuperNintendo.js`). Mobile users can toggle on-screen controls with `C` from the main menu (Android recommended).
- Virtual joystick implementation emulates key events and maps to the emulator's keyboard/gamepad input.

Mapping & RetroArch cores
- For RetroArch-based cores (e.g., MAME2003), the loader writes `retroarch.cfg` and `retroarch-core-options.cfg` into the virtual FS and populates sensible defaults for keyboard and UI navigation.

---

### Virtual machines & supported ZIP types 💾

- **DOS**: DOSBox core — upload a ZIP with DOS game files; Emulatrix will try to run `AUTORUN.BAT` if present.
- **Virtual machines**: ZIP must contain a disk image named `c.img`. Emulatrix mounts `c.img` and attempts to boot it.
- **MAME**: `mame2003` and `MAME32` are supported; CHD-based games require the CHD plus zip (e.g. `kinst-chd.zip` contains both `kinst.zip` and `kinst.chd`).

---

### How to add a new emulator/core

1. Add `.htm`, `.js`, `.wasm` core files in the repo.
2. Update `Emulatrix.htm`'s `runEmulator(...)` logic to detect the relevant file extension/ROM name and load your emulator page.
3. Add new static assets to `worker.js` `filesToCache` for offline availability.
4. Add configuration or FS writes (if your core requires `retroarch.cfg` like cores do).

---

### Debugging & testing tips

- Developer tools: Console for messages, Network for WASM/JS requests, Sources for scripts and `.wasm` (virtually shown).
- Check `FS` (Emscripten's virtual FS) from the console to ensure files are present.
- Service worker caching: update `staticCacheName` or unregister to clear stale caches.

---

### Optimization & improvement proposals (non-implementing suggestions) ⚡️

- **WebAssembly**: enable SIMD or threads (requires cross-origin isolation/COOP+COEP) and rebuild cores with appropriate Emscripten flags.
- **Lazy loading**: load emulator WASM/JS only when selected (reduce initial load). Use `WebAssembly.instantiateStreaming`.
- **Service worker tooling**: consider Workbox for advanced caching strategies and automatic revisioning.
- **Compression & delivery**: pre-compress `.wasm` and `.js` (Brotli/gzip) and serve with proper `Content-Encoding` headers.
- **Codebase hygiene**: migrate to ES modules/TS for incremental improvements and maintainability; add CI (GitHub Actions) for smoke tests.
- **Profiling/UX**: add optional FPS/latency overlays; consider OffscreenCanvas or WebCodecs where beneficial.

---

### Contribution & testing

- Describe changes in PRs and include reproduction steps.
- Add lightweight integration tests where possible (e.g., smoke tests that load a core and assert bootstrap completes).

### License
- See `license.txt`. When adding third-party libs/cores, ensure license compliance and document their licenses.

---

If you'd like, I can also add a `DEVELOPING.md` with quick commands and a sample GitHub Actions workflow for smoke testing (create a PR with the changes). 
