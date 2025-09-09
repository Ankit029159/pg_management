@echo off
echo 🚀 Setting up PG Management System for Production...
echo.

REM Backup current configurations
echo 📋 Backing up current configurations...
if exist "backend\config.env" (
    copy "backend\config.env" "backend\config.env.backup"
    echo ✅ Backend config backed up
)

if exist "frontend\.env.local" (
    copy "frontend\.env.local" "frontend\.env.local.backup"
    echo ✅ Frontend config backed up
)

REM Setup Backend Production Configuration
echo 🔧 Setting up backend production configuration...
cd backend

REM Create production config.env
(
echo # Database Configuration
echo MONGODB_URI=mongodb+srv://fouriseindia1:7UeakpxvP9ZdpIaN@cluster0.gzaimcz.mongodb.net/pg_management?retryWrites=true^&w=majority^&appName=Cluster0
echo.
echo NODE_ENV=production
echo.
echo # Server Configuration
echo PORT=5001
echo.
echo # PhonePe Payment Gateway Configuration (PRODUCTION ENVIRONMENT)
echo PHONEPE_MERCHANT_ID=SU2508251500285640112856
echo PHONEPE_SALT_KEY=006c20b2-0a39-423a-9cd3-8e359879dd15
echo PHONEPE_SALT_INDEX=1
echo PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg/checkout
echo PHONEPE_AUTH_TOKEN_URL=https://api.phonepe.com/apis/identity-manager/v1/oauth/token
echo PHONEPE_CALLBACK_URL=https://api.pg.gradezy.in/api/payment/callback
echo PHONEPE_REDIRECT_URL=https://pg.gradezy.in/payment-success
echo PHONEPE_WEBHOOK_URL=https://api.pg.gradezy.in/api/payment/webhook
echo.
echo # Development Test Mode (set to 'false' to use real PhonePe API calls)
echo PHONEPE_TEST_MODE=false
echo.
echo # Webhook Authentication
echo WEBHOOK_USERNAME=Fourise
echo WEBHOOK_PASSWORD=6pMzMtzUQi3nfKB
echo.
echo # JWT Configuration
echo JWT_SECRET=e4b3e3f4a1c5d9b8a3e7f6d2c1b4a9f8d5c3e2a1b4c9d8e7f6a2b1c4d9e8f7a6b5c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b
echo JWT_EXPIRE=30d
) > config.env

echo ✅ Backend production configuration created

REM Setup Frontend Production Configuration
echo 🔧 Setting up frontend production configuration...
cd ..\frontend

REM Create production .env.production
(
echo # Production Environment Variables
echo VITE_API_URL=https://api.pg.gradezy.in/api
echo VITE_FRONTEND_URL=https://pg.gradezy.in
) > .env.production

echo ✅ Frontend production configuration created

REM Update CORS configuration for production
echo 🔧 Updating CORS configuration for production...
cd ..\backend

REM Update index.js CORS to production only
powershell -Command "(Get-Content index.js) -replace 'origin: \[''https://pg.gradezy.in'', ''http://localhost:3000'', ''http://localhost:5173''\]', 'origin: [''https://pg.gradezy.in'']' | Set-Content index.js"

echo ✅ CORS configuration updated for production

cd ..

echo.
echo ✅ Production setup completed!
echo.
echo 🌐 Production URLs:
echo    Frontend: https://pg.gradezy.in
echo    Backend: https://api.pg.gradezy.in
echo    API Base: https://api.pg.gradezy.in/api
echo.
echo 🔧 Next steps:
echo    1. Deploy backend: cd backend ^&^& npm run prod
echo    2. Build frontend: cd frontend ^&^& npm run build
echo    3. Upload frontend build to web server
echo.
echo 📋 Configuration files created:
echo    - backend/config.env (production)
echo    - frontend/.env.production (production)
echo    - Backups saved as .backup files
echo.
pause

