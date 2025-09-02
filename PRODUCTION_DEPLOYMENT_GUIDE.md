# 🚀 Production Deployment Guide

## Overview
This guide covers deploying the PG Management System to production servers:
- **Frontend**: https://pg.gradezy.in
- **Backend**: https://api.pg.gradezy.in

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │    Database     │
│                 │    │                  │    │                 │
│ pg.gradezy.in   │◄──►│api.pg.gradezy.in │◄──►│   MongoDB      │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 Pre-Deployment Checklist

### Frontend (pg.gradezy.in)
- [ ] Build production bundle
- [ ] Configure environment variables
- [ ] Set up domain and SSL
- [ ] Configure web server (Nginx/Apache)

### Backend (api.pg.gradezy.in)
- [ ] Set NODE_ENV=production
- [ ] Configure environment variables
- [ ] Set up domain and SSL
- [ ] Configure reverse proxy
- [ ] Set up PM2 or similar process manager

### Database
- [ ] MongoDB connection string configured
- [ ] Database indexes optimized
- [ ] Backup strategy in place

## 🚀 Deployment Steps

### 1. Frontend Deployment

#### Build Production Bundle
```bash
cd frontend
npm install
npm run build
```

#### Environment Configuration
Create `.env.production` file:
```env
VITE_API_URL=https://api.pg.gradezy.in/api
VITE_FRONTEND_URL=https://pg.gradezy.in
```

#### Web Server Configuration (Nginx Example)
```nginx
server {
    listen 80;
    server_name pg.gradezy.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pg.gradezy.in;
    
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    root /var/www/pg.gradezy.in/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass https://api.pg.gradezy.in;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. Backend Deployment

#### Environment Configuration
Update `backend/config.env`:
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pg_management
PHONEPE_CALLBACK_URL=https://api.pg.gradezy.in/api/payment/callback
PHONEPE_REDIRECT_URL=https://pg.gradezy.in/payment-success
PHONEPE_WEBHOOK_URL=https://api.pg.gradezy.in/api/payment/webhook
```

#### Start Production Server
```bash
cd backend
npm install
npm run prod
# or
npm run start:prod
```

#### Process Manager (PM2)
```bash
npm install -g pm2
pm2 start start_production.js --name "pg-backend"
pm2 startup
pm2 save
```

#### Reverse Proxy Configuration (Nginx)
```nginx
server {
    listen 80;
    server_name api.pg.gradezy.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.pg.gradezy.in;
    
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    location / {
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

## 🔧 Configuration Updates Made

### 1. Frontend Environment
- Created `env.production` with correct API URLs
- All components already use fallback to production URLs

### 2. Backend Environment
- Updated `NODE_ENV` to production
- PhonePe URLs already configured for production
- CORS configured for production domain only

### 3. Production Scripts
- Added `start_production.js` for production server
- Updated `package.json` with production scripts

## 🧪 Testing Production Deployment

### Health Check
```bash
curl https://api.pg.gradezy.in/api/test
```

### PhonePe Configuration Test
```bash
curl https://api.pg.gradezy.in/api/test-phonepe
```

### Frontend Test
- Visit: https://pg.gradezy.in
- Test booking flow
- Verify payment integration

## 📊 Monitoring & Maintenance

### Logs
```bash
# Backend logs
pm2 logs pg-backend

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Performance Monitoring
- Monitor server resources (CPU, Memory, Disk)
- Set up alerts for high usage
- Monitor API response times

### Backup Strategy
- Database backups (daily)
- File uploads backup (weekly)
- Configuration files backup (monthly)

## 🚨 Troubleshooting

### Common Issues

#### CORS Errors
- Verify CORS configuration in backend
- Check domain names match exactly

#### PhonePe Integration Issues
- Verify callback URLs are accessible
- Check webhook endpoints
- Verify merchant credentials

#### Database Connection Issues
- Check MongoDB connection string
- Verify network access
- Check authentication credentials

### Debug Commands
```bash
# Test database connection
curl https://api.pg.gradezy.in/api/test

# Check PhonePe config
curl https://api.pg.gradezy.in/api/test-phonepe

# Monitor server status
pm2 status
pm2 monit
```

## 🔐 Security Considerations

### SSL/TLS
- Use strong SSL certificates
- Enable HTTP/2
- Configure security headers

### Environment Variables
- Never commit sensitive data
- Use strong passwords
- Rotate keys regularly

### Access Control
- Restrict server access
- Use firewall rules
- Monitor access logs

## 📞 Support

For deployment issues:
1. Check logs for error messages
2. Verify configuration files
3. Test endpoints individually
4. Check server resources

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Environment**: Production
