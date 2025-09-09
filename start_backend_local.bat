@echo off
echo 🔧 Starting Backend Server in Local Development Mode...
echo.

cd backend

REM Copy local environment file
echo 📋 Loading local environment configuration...
copy config.local.env config.env
echo ✅ Local environment loaded

echo 🚀 Starting backend server...
echo 📍 Backend URL: http://localhost:5001
echo 📍 API Base URL: http://localhost:5001/api
echo 📍 Health Check: http://localhost:5001/api/test
echo.

npm run dev

