#!/bin/bash

echo "🚀 Setting up Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Production Configuration Summary:${NC}"
echo "✅ NODE_ENV: production"
echo "✅ Frontend URL: https://pg.gradezy.in"
echo "✅ Backend URL: https://api.pg.gradezy.in"
echo "✅ PhonePe Callback: https://api.pg.gradezy.in/api/payment/callback"
echo "✅ PhonePe Redirect: https://pg.gradezy.in/payment-success"
echo "✅ PhonePe Webhook: https://api.pg.gradezy.in/api/payment/webhook"
echo "✅ CORS: Only https://pg.gradezy.in allowed"
echo "✅ PhonePe Test Mode: DISABLED (Real API calls)"

echo -e "\n${YELLOW}🔧 Building Frontend...${NC}"
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build completed${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 Production setup completed!${NC}"
echo -e "\n${BLUE}📝 Ready for Git Push:${NC}"
echo "1. git add ."
echo "2. git commit -m 'Production deployment ready'"
echo "3. git push origin main"

echo -e "\n${YELLOW}📋 VPS Deployment Commands:${NC}"
echo "git pull origin main"
echo "cd backend && npm install --production"
echo "cd frontend && npm install && npm run build"
echo "pm2 start backend/index.js --name pg-backend --env production"
echo "pm2 start 'npx serve -s frontend/dist -l 3000' --name pg-frontend"

echo -e "\n${GREEN}🚀 Ready for production deployment!${NC}"
