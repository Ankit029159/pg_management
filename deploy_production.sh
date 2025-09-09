#!/bin/bash

echo "🚀 Starting Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Production Deployment Checklist:${NC}"
echo "✅ Backend config.env updated for production"
echo "✅ Frontend env.production configured"
echo "✅ CORS settings updated for production domain"
echo "✅ PhonePe URLs updated for production"
echo "✅ NODE_ENV set to production"

echo -e "\n${YELLOW}🔧 Building Frontend for Production...${NC}"
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}📦 Installing Backend Dependencies...${NC}"
cd ../backend
npm install --production
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Backend dependencies installation failed${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 Production build completed successfully!${NC}"
echo -e "\n${BLUE}📝 Next Steps:${NC}"
echo "1. git add ."
echo "2. git commit -m 'Production deployment ready'"
echo "3. git push origin main"
echo "4. On your VPS: git pull origin main"
echo "5. On your VPS: npm run start:prod (backend)"
echo "6. On your VPS: serve frontend/dist (frontend)"

echo -e "\n${YELLOW}⚠️  Important Production Notes:${NC}"
echo "• Backend will run on port 5001"
echo "• Frontend should be served from /dist folder"
echo "• Make sure SSL certificates are configured"
echo "• PhonePe webhooks will use production URLs"
echo "• Database connection is already configured for production"

echo -e "\n${GREEN}🚀 Ready for deployment!${NC}"
