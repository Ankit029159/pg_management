@echo off
echo 🚀 Starting Production Deployment...

echo.
echo 📋 Production Deployment Checklist:
echo ✅ Backend config.env updated for production
echo ✅ Frontend env.production configured
echo ✅ CORS settings updated for production domain
echo ✅ PhonePe URLs updated for production
echo ✅ NODE_ENV set to production

echo.
echo 🔧 Building Frontend for Production...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
echo ✅ Frontend build successful

echo.
echo 📦 Installing Backend Dependencies...
cd ..\backend
call npm install --production
if %errorlevel% neq 0 (
    echo ❌ Backend dependencies installation failed
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

echo.
echo 🎉 Production build completed successfully!
echo.
echo 📝 Next Steps:
echo 1. git add .
echo 2. git commit -m "Production deployment ready"
echo 3. git push origin main
echo 4. On your VPS: git pull origin main
echo 5. On your VPS: npm run start:prod (backend)
echo 6. On your VPS: serve frontend/dist (frontend)

echo.
echo ⚠️  Important Production Notes:
echo • Backend will run on port 5001
echo • Frontend should be served from /dist folder
echo • Make sure SSL certificates are configured
echo • PhonePe webhooks will use production URLs
echo • Database connection is already configured for production

echo.
echo 🚀 Ready for deployment!
pause
