@echo off
REM Start a local static server on Windows
setlocal
for /f "delims=" %%P in ('powershell -command "(Get-Content ..\shared-config.json | ConvertFrom-Json).localServerPort"') do set PORT=%%P
if not defined PORT set PORT=8000
powershell -Command "Start-Process http://localhost:%PORT%"
REM Prefer Python
where python >nul 2>nul
if %ERRORLEVEL%==0 (
  start /b python -m http.server %PORT%
) else (
  where npx >nul 2>nul
  if %ERRORLEVEL%==0 (
    start /b npx http-server -p %PORT%
  ) else (
    echo No Python or npx found. Install one to start a server.
    exit /b 1
  )
)

echo Server started on port %PORT%
pause