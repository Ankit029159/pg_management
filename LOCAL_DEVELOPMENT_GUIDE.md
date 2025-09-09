# 🏠 Local Development Guide

This guide will help you run the PG Management System locally for development and testing.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Windows
start_local_development.bat

# Linux/Mac
./start_local_development.sh
```

### Option 2: Manual Setup
```bash
# Terminal 1 - Backend
start_backend_local.bat

# Terminal 2 - Frontend  
start_frontend_local.bat
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (cloud connection already configured)

## 🔧 Local Configuration

### Frontend Configuration
- **File**: `frontend/env.local`
- **API URL**: `http://localhost:5001/api`
- **Frontend URL**: `http://localhost:5173`

### Backend Configuration
- **File**: `backend/config.local.env`
- **Port**: `5001`
- **PhonePe Test Mode**: `true` (bypasses real payments)
- **CORS**: Configured for localhost

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main application |
| **Backend API** | http://localhost:5001/api | API endpoints |
| **Health Check** | http://localhost:5001/api/test | Backend status |
| **PhonePe Config** | http://localhost:5001/api/test-phonepe | Payment config test |

## 🛠 Development Features

### PhonePe Integration (Test Mode)
- **Test Mode**: Enabled by default
- **Real Payments**: Disabled (safe for development)
- **Mock Responses**: Simulated payment flows
- **Callback URLs**: Point to localhost

### CORS Configuration
- **Production**: Only `https://pg.gradezy.in`
- **Development**: Includes `localhost:3000` and `localhost:5173`

### Environment Detection
- **Automatic**: Detects development vs production
- **CORS**: Adjusts based on environment
- **Logging**: Enhanced for development

## 📁 File Structure

```
pg/
├── frontend/
│   ├── env.local              # Local environment variables
│   ├── .env.local             # Auto-generated from env.local
│   └── src/                   # React application
├── backend/
│   ├── config.local.env       # Local environment variables
│   ├── config.env             # Auto-generated from config.local.env
│   ├── index.local.js         # Local development server
│   └── controllers/           # API controllers
├── start_local_development.bat    # Windows startup script
├── start_local_development.sh     # Linux/Mac startup script
├── start_backend_local.bat        # Backend only
└── start_frontend_local.bat       # Frontend only
```

## 🔄 Development Workflow

### 1. Start Development Environment
```bash
# Run the automated script
start_local_development.bat
```

### 2. Make Changes
- **Frontend**: Edit files in `frontend/src/`
- **Backend**: Edit files in `backend/`
- **Hot Reload**: Both servers auto-restart on changes

### 3. Test Changes
- **Frontend**: http://localhost:5173
- **API**: http://localhost:5001/api/test
- **Payment Flow**: Test with mock PhonePe integration

### 4. Stop Servers
- **Windows**: Close command windows or Ctrl+C
- **Linux/Mac**: Ctrl+C in terminal

## 🧪 Testing Features

### Payment Testing
- **Test Mode**: All payments are simulated
- **No Real Money**: Safe for development
- **Mock Responses**: Realistic payment flows
- **Status Updates**: Full payment lifecycle

### API Testing
```bash
# Health check
curl http://localhost:5001/api/test

# PhonePe config
curl http://localhost:5001/api/test-phonepe

# Payment history
curl http://localhost:5001/api/pg-payment/history
```

### Frontend Testing
- **Booking Flow**: Complete booking process
- **Payment Integration**: Test payment initiation
- **Admin Panel**: Test admin functions
- **Responsive Design**: Test on different screen sizes

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check if port 5001 is in use
netstat -ano | findstr :5001

# Kill process if needed
taskkill /PID <PID_NUMBER> /F
```

#### Frontend Won't Start
```bash
# Check if port 5173 is in use
netstat -ano | findstr :5173

# Clear npm cache
npm cache clean --force
```

#### CORS Errors
- Ensure backend is running on port 5001
- Check that `config.local.env` is copied to `config.env`
- Verify CORS origins include localhost

#### Database Connection Issues
- Check MongoDB connection string in `config.local.env`
- Verify internet connection
- Check MongoDB Atlas whitelist settings

### Debug Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check if ports are available
netstat -ano | findstr :5001
netstat -ano | findstr :5173

# Test API connectivity
curl http://localhost:5001/api/test
```

## 🔄 Switching Between Local and Production

### To Production
1. Update `backend/config.env` with production settings
2. Update `frontend/.env.production` with production API URL
3. Run production build scripts

### To Local Development
1. Run `start_local_development.bat`
2. Environment files are automatically configured
3. Test mode is enabled by default

## 📝 Development Notes

### Environment Variables
- **Local**: Uses `.local` files for development
- **Production**: Uses production configuration
- **Auto-copy**: Scripts automatically copy local configs

### PhonePe Integration
- **Test Mode**: `PHONEPE_TEST_MODE=true`
- **Mock Payments**: Simulated responses
- **Real Integration**: Set `PHONEPE_TEST_MODE=false` for testing

### File Watching
- **Backend**: Nodemon watches for changes
- **Frontend**: Vite hot reload enabled
- **Auto-restart**: Servers restart on file changes

## 🚀 Next Steps

1. **Start Development**: Run `start_local_development.bat`
2. **Make Changes**: Edit your code
3. **Test Locally**: Verify changes work
4. **Deploy**: Use production scripts when ready

---

**Happy Coding! 🎉**

For issues or questions, check the troubleshooting section or review the console logs for error messages.

