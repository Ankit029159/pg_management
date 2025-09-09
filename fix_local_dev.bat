@echo off
echo 🔧 Fixing Local Development Environment...
echo.

REM Setup Backend
echo 🔧 Setting up backend for local development...
cd backend
copy config.local.env config.env >nul
echo ✅ Backend configured for local development

REM Setup Frontend
echo 🔧 Setting up frontend for local development...
cd ..\frontend
echo VITE_API_URL=http://localhost:5001/api > .env
echo VITE_FRONTEND_URL=http://localhost:5173 >> .env
echo ✅ Frontend configured for local development

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
echo ✅ Local development environment fixed and started!
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:5173
echo    Backend: http://localhost:5001
echo    API: http://localhost:5001/api
echo.
echo 📝 What was fixed:
echo    - Frontend now uses http://localhost:5001/api
echo    - Backend configured for development mode
echo    - PhonePe in test mode (safe for development)
echo    - CORS allows localhost connections
echo.
echo 🔄 If you still see black screen:
echo    1. Wait 10-15 seconds for servers to fully start
echo    2. Refresh the browser page
echo    3. Check browser console for any errors
echo.
pause

