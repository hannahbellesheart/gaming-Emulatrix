#!/usr/bin/env bash
# Tauri build helper (requires node, npm, and Rust + cargo + tauri prerequisites)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Tauri packaging requires Rust toolchain (cargo) and Node.js. This script prepares a skeleton and points to docs."

if ! command -v cargo >/dev/null 2>&1; then
  echo "Rust/cargo is required. Install Rustup + cargo: https://www.rust-lang.org/tools/install" >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required. Install Node.js." >&2
  exit 1
fi

echo "See Tauri docs: https://tauri.app/v1/guides/ for step-by-step packaging instructions."

echo "This repository needs a Tauri scaffold. You can create one with 'npm create tauri-app' or follow the Tauri guide."