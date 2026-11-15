# CareNest PowerShell Launch Script
$env:PATH = "$PSScriptRoot\.tools\node-v20.18.0-win-x64;" + $env:PATH
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " CareNest - Better Care. Greater Independence." -ForegroundColor Green
Write-Host " Starting local server at http://localhost:3000..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
Start-Process "http://localhost:3000"
npm run dev
