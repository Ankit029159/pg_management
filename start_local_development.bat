@echo off
echo 🚀 Starting PG Management System in Local Development Mode...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

REM Start Backend Server
echo 🔧 Starting Backend Server...
echo 📍 Backend will run on: http://localhost:5001
echo 📍 API Base URL: http://localhost:5001/api
echo.

cd backend
start "Backend Server" cmd /k "echo 🔧 Loading local environment... && copy config.local.env config.env && echo ✅ Local environment loaded && echo 🚀 Starting backend server... && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo 🔧 Starting Frontend Server...
echo 📍 Frontend will run on: http://localhost:5173
echo 📍 API will connect to: http://localhost:5001/api
echo.

cd ..\frontend
start "Frontend Server" cmd /k "echo 🔧 Loading local environment... && copy env.local .env.local && echo ✅ Local environment loaded && echo 🚀 Starting frontend server... && npm run dev"

echo.
echo ✅ Both servers are starting...
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:5001/api
echo    Backend Health: http://localhost:5001/api/test
echo.
echo 📝 Development Notes:
echo    - Backend uses local environment (config.local.env)
echo    - Frontend uses local environment (env.local)
echo    - PhonePe is in TEST MODE (bypasses real payments)
echo    - CORS is configured for localhost
echo.
echo 🛑 To stop servers: Close the command windows or press Ctrl+C
echo.
pause

