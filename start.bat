@echo off
echo ==========================================================
echo Starting CareNest - Better Care. Greater Independence.
echo ==========================================================
set PATH=%~dp0.tools\node-v20.18.0-win-x64;%PATH%
echo Launching CareNest Development Server on http://localhost:3000...
start http://localhost:3000
npm run dev
pause
