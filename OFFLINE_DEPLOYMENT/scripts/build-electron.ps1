<#
PowerShell helper to prepare an Electron packaging scaffold
#>
param()
$root = Resolve-Path "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\.."
Set-Location $root
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error "npm is required. Install Node.js and npm."
  exit 1
}
if (-not (Test-Path package.json)) {
  @'
{
  "name": "emulatrix-offline",
  "version": "0.1.0",
  "main": "index.html",
  "scripts": {
    "start": "electron .",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"
  },
  "devDependencies": {
    "electron": "latest",
    "electron-builder": "latest"
  }
}
'@ | Out-File -FilePath package.json -Encoding UTF8
  Write-Host "Created package.json. Run 'npm install' then 'npm run dist' to build."
} else {
  Write-Host "package.json already exists. Run 'npm install' and 'npm run dist' to package."
}