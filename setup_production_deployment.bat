@echo off
echo 🚀 Setting up Production Deployment...

echo.
echo 📋 Production Configuration Summary:
echo ✅ NODE_ENV: production
echo ✅ Frontend URL: https://pg.gradezy.in
echo ✅ Backend URL: https://api.pg.gradezy.in
echo ✅ PhonePe Callback: https://api.pg.gradezy.in/api/payment/callback
echo ✅ PhonePe Redirect: https://pg.gradezy.in/payment-success
echo ✅ PhonePe Webhook: https://api.pg.gradezy.in/api/payment/webhook
echo ✅ CORS: Only https://pg.gradezy.in allowed
echo ✅ PhonePe Test Mode: DISABLED (Real API calls)

echo.
echo 🔧 Building Frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
echo ✅ Frontend build completed

echo.
echo 🎉 Production setup completed!
echo.
echo 📝 Ready for Git Push:
echo 1. git add .
echo 2. git commit -m "Production deployment ready"
echo 3. git push origin main

echo.
echo 📋 VPS Deployment Commands:
echo git pull origin main
echo cd backend ^&^& npm install --production
echo cd frontend ^&^& npm install ^&^& npm run build
echo pm2 start backend/index.js --name pg-backend --env production
echo pm2 start "npx serve -s frontend/dist -l 3000" --name pg-frontend

echo.
echo 🚀 Ready for production deployment!
pause
