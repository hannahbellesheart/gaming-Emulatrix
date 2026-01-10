<#
A PowerShell helper that lists packaging steps and prerequisites for building optional artifacts.
Use this to generate checklists for the current platform.
#>
param()
$root = Resolve-Path "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\.."
Set-Location $root
Write-Host "This script lists optional packaging steps and prerequisites:`n"
Write-Host "- Electron: Node.js + npm; use build-electron.ps1 or build-electron.sh"
Write-Host "- Tauri: Rust toolchain + Node/npm (see Tauri docs)"
Write-Host "- Android APK: Android SDK + Java + Gradle (use Android Studio)"
Write-Host "- Flatpak: flatpak-builder and runtime SDKs"
Write-Host "- Electron Fiddle: install electron-fiddle to open offline-fiddle/"