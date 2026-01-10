#!/usr/bin/env bash
# Start a local static server and open the default browser to the app
# Uses Python (3) if available, falls back to node http-server if installed
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
PORT=$(jq -r '.localServerPort' shared-config.json 2>/dev/null || echo 8000)

# prefer python3
if command -v python3 >/dev/null 2>&1; then
  echo "Starting Python http.server on port $PORT"
  PYTHON_CMD=(python3 -m http.server "$PORT")
  "${PYTHON_CMD[@]}" &
  SERVER_PID=$!
elif command -v npx >/dev/null 2>&1; then
  echo "Starting http-server via npx on port $PORT"
  npx http-server -p "$PORT" . &
  SERVER_PID=$!
else
  echo "No Python3 or npx available. Please install one of them to start a server." >&2
  exit 1
fi

sleep 1
URL="http://localhost:$PORT"
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 || true
elif command -v open >/dev/null 2>&1; then
  open "$URL" || true
else
  echo "Open your browser at: $URL"
fi

echo "Server PID: $SERVER_PID"
echo "Press Ctrl+C to stop."
wait $SERVER_PID