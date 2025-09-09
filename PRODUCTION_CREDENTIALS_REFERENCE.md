# 🚀 Production Credentials & Configuration Reference

This document contains all production credentials, URLs, and configuration details for the PG Management System.

## 🌐 Production URLs

### Main Application URLs
- **Frontend**: https://pg.gradezy.in
- **Backend API**: https://api.pg.gradezy.in
- **API Base URL**: https://api.pg.gradezy.in/api

### Health Check & Test Endpoints
- **Backend Health**: https://api.pg.gradezy.in/api/test
- **PhonePe Config Test**: https://api.pg.gradezy.in/api/test-phonepe
- **Payment History**: https://api.pg.gradezy.in/api/pg-payment/history

## 🔐 Database Configuration

### MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://fouriseindia1:7UeakpxvP9ZdpIaN@cluster0.gzaimcz.mongodb.net/pg_management?retryWrites=true&w=majority&appName=Cluster0
```

**Database Details:**
- **Cluster**: Cluster0
- **Database Name**: pg_management
- **Username**: fouriseindia1
- **Password**: 7UeakpxvP9ZdpIaN
- **Connection**: MongoDB Atlas (Cloud)

## 💳 PhonePe Payment Gateway Configuration

### Production Credentials
```env
# PhonePe Merchant Details
PHONEPE_MERCHANT_ID=SU2508251500285640112856
PHONEPE_SALT_KEY=006c20b2-0a39-423a-9cd3-8e359879dd15
PHONEPE_SALT_INDEX=1

# PhonePe API URLs
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg/checkout
PHONEPE_AUTH_TOKEN_URL=https://api.phonepe.com/apis/identity-manager/v1/oauth/token

# Production Callback URLs
PHONEPE_CALLBACK_URL=https://api.pg.gradezy.in/api/payment/callback
PHONEPE_REDIRECT_URL=https://pg.gradezy.in/payment-success
PHONEPE_WEBHOOK_URL=https://api.pg.gradezy.in/api/payment/webhook

# Production Mode
PHONEPE_TEST_MODE=false
```

### PhonePe Integration Details
- **Merchant ID**: SU2508251500285640112856
- **Salt Key**: 006c20b2-0a39-423a-9cd3-8e359879dd15
- **Salt Index**: 1
- **Environment**: Production (Live Payments)
- **API Version**: v2

## 🔒 Security Configuration

### JWT Configuration
```env
JWT_SECRET=e4b3e3f4a1c5d9b8a3e7f6d2c1b4a9f8d5c3e2a1b4c9d8e7f6a2b1c4d9e8f7a6b5c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b
JWT_EXPIRE=30d
```

### Webhook Authentication
```env
WEBHOOK_USERNAME=Fourise
WEBHOOK_PASSWORD=6pMzMtzUQi3nfKB
```

## ⚙️ Server Configuration

### Backend Configuration
```env
NODE_ENV=production
PORT=5001
```

### CORS Configuration
```javascript
// Production CORS Origins
origin: ['https://pg.gradezy.in']
```

## 📁 Complete Production Environment Files

### Backend Production Config (`backend/config.env`)
```env
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
```

### Frontend Production Config (`frontend/.env.production`)
```env
# Production Environment Variables
VITE_API_URL=https://api.pg.gradezy.in/api
VITE_FRONTEND_URL=https://pg.gradezy.in
```

## 🚀 Production Deployment Commands

### Backend Production Start
```bash
cd backend
npm run prod
# or
npm run start:prod
```

### Frontend Production Build
```bash
cd frontend
npm run build
```

### Production Scripts
```bash
# Windows
frontend/build_production.bat

# Linux/Mac
frontend/build_production.sh
```

## 🔧 Production Configuration Updates

### 1. Backend CORS (Production)
```javascript
// In backend/index.js
app.use(cors({
  origin: ['https://pg.gradezy.in'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
```

### 2. Frontend API URLs (Production)
```javascript
// In all frontend components
const API_URL = import.meta.env.VITE_API_URL || 'https://api.pg.gradezy.in/api';
```

## 📊 Production Monitoring

### Health Check Endpoints
- **Backend Status**: https://api.pg.gradezy.in/api/test
- **PhonePe Config**: https://api.pg.gradezy.in/api/test-phonepe
- **Payment History**: https://api.pg.gradezy.in/api/pg-payment/history

### Key Metrics to Monitor
- **API Response Times**
- **Payment Success Rates**
- **Database Connection Status**
- **PhonePe Integration Status**

## 🔄 Quick Production Switch Commands

### Switch to Production (Backend)
```bash
cd backend
copy config.env config.env.backup
copy config.local.env config.env
npm run prod
```

### Switch to Production (Frontend)
```bash
cd frontend
copy .env.local .env.local.backup
copy env.production .env.production
npm run build
```

## 🛡️ Security Checklist

### Production Security
- ✅ **HTTPS**: All URLs use HTTPS
- ✅ **CORS**: Restricted to production domain only
- ✅ **JWT**: Strong secret key configured
- ✅ **PhonePe**: Production credentials active
- ✅ **Database**: Secure MongoDB Atlas connection
- ✅ **Environment**: NODE_ENV=production

### SSL Certificates
- **Frontend**: https://pg.gradezy.in (SSL enabled)
- **Backend**: https://api.pg.gradezy.in (SSL enabled)

## 📞 Support & Maintenance

### Contact Information
- **Domain**: gradezy.in
- **Frontend**: pg.gradezy.in
- **Backend**: api.pg.gradezy.in

### Backup Information
- **Database**: MongoDB Atlas (automated backups)
- **Code**: Git repository
- **Config**: Environment files backed up

## 🚨 Emergency Procedures

### If Production Goes Down
1. **Check Health**: https://api.pg.gradezy.in/api/test
2. **Check Logs**: Server logs and error messages
3. **Restart Services**: Backend and frontend servers
4. **Verify Database**: MongoDB Atlas connection
5. **Test Payment**: PhonePe integration status

### Rollback Procedure
1. **Backup Current**: Save current configuration
2. **Restore Previous**: Use backup configuration
3. **Restart Services**: Apply changes
4. **Test Functionality**: Verify all features work

---

## 📋 Quick Reference Card

| Component | URL | Credentials |
|-----------|-----|-------------|
| **Frontend** | https://pg.gradezy.in | - |
| **Backend** | https://api.pg.gradezy.in | - |
| **Database** | MongoDB Atlas | fouriseindia1 / 7UeakpxvP9ZdpIaN |
| **PhonePe** | Production API | SU2508251500285640112856 |
| **JWT Secret** | - | e4b3e3f4a1c5d9b8a3e7f6d2c1b4a9f8d5c3e2a1b4c9d8e7f6a2b1c4d9e8f7a6b5c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b |

**Last Updated**: $(date)
**Environment**: Production
**Status**: Active

