#!/bin/bash

echo "🚀 Setting up PG Management System for Production..."
echo

# Backup current configurations
echo "📋 Backing up current configurations..."
if [ -f "backend/config.env" ]; then
    cp "backend/config.env" "backend/config.env.backup"
    echo "✅ Backend config backed up"
fi

if [ -f "frontend/.env.local" ]; then
    cp "frontend/.env.local" "frontend/.env.local.backup"
    echo "✅ Frontend config backed up"
fi

# Setup Backend Production Configuration
echo "🔧 Setting up backend production configuration..."
cd backend

# Create production config.env
cat > config.env << 'EOF'
# Database Configuration
MONGODB_URI=mongodb+srv://fouriseindia1:7UeakpxvP9ZdpIaN@cluster0.gzaimcz.mongodb.net/pg_management?retryWrites=true&w=majority&appName=Cluster0

NODE_ENV=production

# Server Configuration
PORT=5001

# PhonePe Payment Gateway Configuration (PRODUCTION ENVIRONMENT)
PHONEPE_MERCHANT_ID=SU2508251500285640112856
PHONEPE_SALT_KEY=006c20b2-0a39-423a-9cd3-8e359879dd15
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg/checkout
PHONEPE_AUTH_TOKEN_URL=https://api.phonepe.com/apis/identity-manager/v1/oauth/token
PHONEPE_CALLBACK_URL=https://api.pg.gradezy.in/api/payment/callback
PHONEPE_REDIRECT_URL=https://pg.gradezy.in/payment-success
PHONEPE_WEBHOOK_URL=https://api.pg.gradezy.in/api/payment/webhook

# Development Test Mode (set to 'false' to use real PhonePe API calls)
PHONEPE_TEST_MODE=false

# Webhook Authentication
WEBHOOK_USERNAME=Fourise
WEBHOOK_PASSWORD=6pMzMtzUQi3nfKB

# JWT Configuration
JWT_SECRET=e4b3e3f4a1c5d9b8a3e7f6d2c1b4a9f8d5c3e2a1b4c9d8e7f6a2b1c4d9e8f7a6b5c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b
JWT_EXPIRE=30d
EOF

echo "✅ Backend production configuration created"

# Setup Frontend Production Configuration
echo "🔧 Setting up frontend production configuration..."
cd ../frontend

# Create production .env.production
cat > .env.production << 'EOF'
# Production Environment Variables
VITE_API_URL=https://api.pg.gradezy.in/api
VITE_FRONTEND_URL=https://pg.gradezy.in
EOF

echo "✅ Frontend production configuration created"

# Update CORS configuration for production
echo "🔧 Updating CORS configuration for production..."
cd ../backend

# Update index.js CORS to production only
sed -i.bak "s/origin: \['https:\/\/pg.gradezy.in', 'http:\/\/localhost:3000', 'http:\/\/localhost:5173'\]/origin: ['https:\/\/pg.gradezy.in']/" index.js

echo "✅ CORS configuration updated for production"

cd ..

echo
echo "✅ Production setup completed!"
echo
echo "🌐 Production URLs:"
echo "   Frontend: https://pg.gradezy.in"
echo "   Backend: https://api.pg.gradezy.in"
echo "   API Base: https://api.pg.gradezy.in/api"
echo
echo "🔧 Next steps:"
echo "   1. Deploy backend: cd backend && npm run prod"
echo "   2. Build frontend: cd frontend && npm run build"
echo "   3. Upload frontend build to web server"
echo
echo "📋 Configuration files created:"
echo "   - backend/config.env (production)"
echo "   - frontend/.env.production (production)"
echo "   - Backups saved as .backup files"
echo

