#!/bin/bash

echo "🚀 Building PG Management Frontend for Production..."
echo "📍 Target: https://pg.gradezy.in"
echo "📍 API: https://api.pg.gradezy.in"

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create production environment file
echo "🔧 Creating production environment..."
cat > env.production << EOF
# Production Environment Variables
VITE_API_URL=https://api.pg.gradezy.in/api
VITE_FRONTEND_URL=https://pg.gradezy.in
EOF

# Build production bundle
echo "🏗️ Building production bundle..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Production files created in 'dist' directory"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Upload 'dist' folder contents to your web server"
    echo "2. Configure web server (Nginx/Apache) for pg.gradezy.in"
    echo "3. Set up SSL certificate"
    echo "4. Test the deployment"
    echo ""
    echo "🔗 Test URLs:"
    echo "- Frontend: https://pg.gradezy.in"
    echo "- Backend: https://api.pg.gradezy.in/api/test"
else
    echo "❌ Build failed!"
    exit 1
fi
