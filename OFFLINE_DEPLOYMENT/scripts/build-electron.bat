@echo off
REM Minimal Windows batch helper to scaffold Electron packaging
if not exist package.json (
  echo { > package.json
  echo   "name": "emulatrix-offline", >> package.json
  echo   "version": "0.1.0", >> package.json
  echo   "main": "index.html", >> package.json
  echo   "scripts": { >> package.json
  echo     "start": "electron .", >> package.json
  echo     "pack": "electron-builder --dir", >> package.json
  echo     "dist": "electron-builder" >> package.json
  echo   }, >> package.json
  echo   "devDependencies": { >> package.json
  echo     "electron": "latest", >> package.json
  echo     "electron-builder": "latest" >> package.json
  echo   } >> package.json
  echo } >> package.json
  echo Created package.json. Run npm install && npm run dist to build.
) else (
  echo package.json already exists.
)
pause