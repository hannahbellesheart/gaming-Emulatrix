<#
Start-LocalServer.ps1
Start a local static server and open the default browser.
Prefers Python 3; otherwise tries npx http-server.
#>
param(
    [int]$Port = (Get-Content ..\shared-config.json | ConvertFrom-Json).localServerPort
)
$root = Resolve-Path "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\.."
Set-Location $root

if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "Starting Python http.server on port $Port"
    $p = Start-Process -NoNewWindow -FilePath python -ArgumentList "-m", "http.server", "$Port" -PassThru
    $pid = $p.Id
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Host "Starting http-server via npx on port $Port"
    $p = Start-Process -NoNewWindow -FilePath npx -ArgumentList "http-server", "-p", "$Port", "." -PassThru
    $pid = $p.Id
} else {
    Write-Error "No Python or npx found. Install one of them to start a server."
    exit 1
}
Start-Sleep -Seconds 1
$url = "http://localhost:$Port"
Start-Process $url
Write-Host "Server PID: $pid"
Write-Host "Press Ctrl+C to stop."
while (Get-Process -Id $pid -ErrorAction SilentlyContinue) { Start-Sleep -Seconds 1 }