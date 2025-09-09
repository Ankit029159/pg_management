# 🚀 VPS Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Production Configuration Applied:
- [x] Backend `config.env` updated for production
- [x] Frontend `env.production` configured
- [x] CORS settings updated for production domain
- [x] PhonePe URLs updated for production
- [x] NODE_ENV set to production

## 🔧 VPS Setup Commands

### 1. Update Your Code on VPS
```bash
# Pull latest changes
git pull origin main

# Install/update dependencies
cd backend
npm install --production

cd ../frontend
npm install
npm run build
```

### 2. Backend Deployment
```bash
# Navigate to backend directory
cd backend

# Start backend in production mode
npm run start:prod
# OR
NODE_ENV=production node index.js
```

### 3. Frontend Deployment
```bash
# Navigate to frontend directory
cd frontend

# Serve the built frontend (using serve package)
npx serve -s dist -l 3000

# OR using PM2 for process management
pm2 start "npx serve -s dist -l 3000" --name "pg-frontend"
```

### 4. Using PM2 (Recommended for Production)

#### Install PM2
```bash
npm install -g pm2
```

#### Start Backend with PM2
```bash
cd backend
pm2 start index.js --name "pg-backend" --env production
```

#### Start Frontend with PM2
```bash
cd frontend
pm2 start "npx serve -s dist -l 3000" --name "pg-frontend"
```

#### PM2 Management Commands
```bash
# View running processes
pm2 list

# Restart a process
pm2 restart pg-backend
pm2 restart pg-frontend

# Stop a process
pm2 stop pg-backend

# View logs
pm2 logs pg-backend
pm2 logs pg-frontend

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🌐 Nginx Configuration (Optional)

### Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/pg-management
```

### Nginx Configuration Content
```nginx
server {
    listen 80;
    server_name pg.gradezy.in api.pg.gradezy.in;

    # Frontend (pg.gradezy.in)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (api.pg.gradezy.in)
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Nginx Configuration
```bash
sudo ln -s /etc/nginx/sites-available/pg-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 SSL Certificate Setup

### Using Certbot (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d pg.gradezy.in -d api.pg.gradezy.in

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Production URLs

### Frontend
- **URL**: https://pg.gradezy.in
- **Port**: 3000 (internal)
- **Build**: `frontend/dist`

### Backend
- **URL**: https://api.pg.gradezy.in
- **Port**: 5001
- **Environment**: production

### PhonePe Integration
- **Callback URL**: https://api.pg.gradezy.in/api/payment/callback
- **Redirect URL**: https://pg.gradezy.in/payment-success
- **Webhook URL**: https://api.pg.gradezy.in/api/payment/webhook

## 🔍 Monitoring & Logs

### View Application Logs
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

### Health Check URLs
- Frontend: https://pg.gradezy.in
- Backend API: https://api.pg.gradezy.in/api/health
- Admin Panel: https://pg.gradezy.in/admin

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   sudo lsof -i :5001
   sudo kill -9 <PID>
   ```

2. **Permission Issues**
   ```bash
   sudo chown -R $USER:$USER /path/to/project
   chmod -R 755 /path/to/project
   ```

3. **SSL Certificate Issues**
   ```bash
   sudo certbot renew --dry-run
   ```

4. **Database Connection Issues**
   - Check MongoDB connection string in `config.env`
   - Verify network access to MongoDB Atlas

## 📝 Environment Variables Summary

### Backend (`config.env`)
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://...
PHONEPE_MERCHANT_ID=SU2508251500285640112856
PHONEPE_SALT_KEY=006c20b2-0a39-423a-9cd3-8e359879dd15
PHONEPE_CALLBACK_URL=https://api.pg.gradezy.in/api/payment/callback
PHONEPE_REDIRECT_URL=https://pg.gradezy.in/payment-success
PHONEPE_WEBHOOK_URL=https://api.pg.gradezy.in/api/payment/webhook
PHONEPE_TEST_MODE=false
```

### Frontend (`env.production`)
```env
VITE_API_URL=https://api.pg.gradezy.in/api
VITE_FRONTEND_URL=https://pg.gradezy.in
```

## ✅ Deployment Verification

After deployment, verify:

1. **Frontend loads**: https://pg.gradezy.in
2. **Backend API responds**: https://api.pg.gradezy.in/api/health
3. **Admin panel accessible**: https://pg.gradezy.in/admin
4. **Payment flow works**: Test booking and payment
5. **PhonePe integration**: Verify payment redirects to PhonePe
6. **SSL certificates**: Check for HTTPS lock icon

## 🎉 Success!

Your PG Management System is now live in production! 🚀
