#!/usr/bin/env bash
# Run the appropriate prebuilt server binary for this host
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN_DIR="$ROOT_DIR/bin"
OS=$(uname -s)
case "$OS" in
  Linux)
    exec "$BIN_DIR/linux-amd64/emulatrix-server"
    ;;

  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    exec "$BIN_DIR/windows-amd64/emulatrix-server.exe"
    ;;
  *)
    echo "Unsupported OS: $OS" >&2
    exit 1
    ;;
esac