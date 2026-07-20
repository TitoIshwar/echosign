@echo off
REM EchoSign Production Startup Script
REM Run this from the project root: start-echosign.bat

echo ==========================================
echo   EchoSign - Starting Production Services
echo ==========================================

REM Kill any existing processes on port 8000
echo [1/4] Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :8000') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM Start backend
echo [2/4] Starting FastAPI backend on port 8000...
start "EchoSign Backend" /min cmd /c "backend\.venv\Scripts\python.exe backend\main.py"

REM Wait for backend to be ready (model loading takes ~60s)
echo [3/4] Waiting for backend to initialize (this takes ~60 seconds)...
:wait_loop
timeout /t 5 /nobreak >nul
backend\.venv\Scripts\python.exe -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health'); exit(0)" >nul 2>&1
if errorlevel 1 goto wait_loop
echo        Backend is ready!

REM Start frontend
echo [4/4] Starting frontend dev server on port 5173...
start "EchoSign Frontend" cmd /c "node_modules\.bin\vite.cmd"

echo.
echo ==========================================
echo   EchoSign is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   Health:   http://localhost:8000/health
echo ==========================================
echo.
echo Press any key to stop all services...
pause >nul

REM Cleanup
echo Stopping all EchoSign services...
taskkill /FI "WINDOWTITLE eq EchoSign Backend" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq EchoSign Frontend" /F >nul 2>&1
echo Done.
