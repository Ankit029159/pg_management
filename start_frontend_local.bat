@echo off
echo 🔧 Starting Frontend Server in Local Development Mode...
echo.

cd frontend

REM Copy local environment file
echo 📋 Loading local environment configuration...
copy env.local .env.local
echo ✅ Local environment loaded

echo 🚀 Starting frontend server...
echo 📍 Frontend URL: http://localhost:5173
echo 📍 API will connect to: http://localhost:5001/api
echo.

npm run dev

