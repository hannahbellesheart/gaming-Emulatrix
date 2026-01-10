# Run-binary.ps1
$root = Resolve-Path "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\.."
$bin = Join-Path $root "bin"
if ($IsWindows) {
    $exe = Join-Path $bin "windows-amd64\emulatrix-server.exe"
    Start-Process -FilePath $exe -NoNewWindow -Wait
} else {
    $os = (uname)
    if ($os -eq "Linux") {
        & "$bin/linux-amd64/emulatrix-server"
    } else {
        Write-Error "Unsupported OS: $os"
        exit 1
    }
}