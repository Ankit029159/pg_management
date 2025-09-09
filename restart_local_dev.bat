@echo off
echo 🔄 Restarting Local Development Environment...
echo.

REM Stop any running processes (optional)
echo 🛑 Stopping any running processes...
taskkill /f /im node.exe >nul 2>&1

REM Setup local environment
echo 🔧 Setting up local environment...

REM Backend setup
cd backend
copy config.local.env config.env >nul
echo ✅ Backend local config loaded

REM Frontend setup  
cd ..\frontend
copy env.local .env.local >nul
echo ✅ Frontend local config loaded

echo.
echo 🚀 Starting Backend Server...
cd ..\backend
start "Backend Server" cmd /k "echo 🔧 Backend starting on http://localhost:5001 && npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

echo 🚀 Starting Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "echo 🔧 Frontend starting on http://localhost:5173 && npm run dev"

echo.
echo ✅ Local development environment restarted!
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:5173
echo    Backend: http://localhost:5001
echo    API: http://localhost:5001/api
echo.
echo 📝 Environment:
echo    - Frontend API: http://localhost:5001/api
echo    - Backend: Development mode
echo    - PhonePe: Test mode (safe)
echo.
pause

