@echo off
echo 🚀 Building PG Management Frontend for Production...
echo 📍 Target: https://pg.gradezy.in
echo 📍 API: https://api.pg.gradezy.in

REM Check if we're in the frontend directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the frontend directory
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Create production environment file
echo 🔧 Creating production environment...
(
echo # Production Environment Variables
echo VITE_API_URL=https://api.pg.gradezy.in/api
echo VITE_FRONTEND_URL=https://pg.gradezy.in
) > env.production

REM Build production bundle
echo 🏗️ Building production bundle...
call npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 📁 Production files created in 'dist' directory
    echo.
    echo 🚀 Next steps:
    echo 1. Upload 'dist' folder contents to your web server
    echo 2. Configure web server (Nginx/Apache) for pg.gradezy.in
    echo 3. Set up SSL certificate
    echo 4. Test the deployment
    echo.
    echo 🔗 Test URLs:
    echo - Frontend: https://pg.gradezy.in
    echo - Backend: https://api.pg.gradezy.in/api/test
) else (
    echo ❌ Build failed!
)

pause
