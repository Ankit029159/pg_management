const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Configure CORS based on environment
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://pg.gradezy.in'] 
  : ['https://pg.gradezy.in', 'http://localhost:3000', 'http://localhost:5173'];

console.log('🌐 CORS Origins:', corsOrigins);
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Increase payload size limit for file uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Import routes
const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/servicesRoutes');
const footerRoutes = require('./routes/footerRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const heroRoutes = require('./routes/heroRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const floorRoutes = require('./routes/floorRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bedRoutes = require('./routes/bedRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const simplePaymentRoutes = require('./routes/simplePaymentRoutes');
const pgPaymentRoutes = require('./routes/pgPaymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Use the PORT from environment variables, with a fallback to 5001
const PORT = process.env.PORT || 5001;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/simple-payment', simplePaymentRoutes);
app.use('/api/pg-payment', pgPaymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contact', contactRoutes);

// A simple test route
app.get('/', (req, res) => {
    res.send("Hello from backend. API is running...");
});

// Test payment endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Backend is working properly',
        timestamp: new Date().toISOString(),
        environment: {
            nodeEnv: process.env.NODE_ENV || 'development',
            port: process.env.PORT || 5001,
            corsOrigins: corsOrigins
        }
    });
});

// Test PhonePe configuration endpoint
app.get('/api/test-phonepe', (req, res) => {
    res.json({
        success: true,
        message: 'PhonePe Configuration Test',
        timestamp: new Date().toISOString(),
        phonepeConfig: {
            merchantId: process.env.PHONEPE_MERCHANT_ID,
            saltKey: process.env.PHONEPE_SALT_KEY ? '***' + process.env.PHONEPE_SALT_KEY.slice(-4) : 'NOT_SET',
            saltIndex: process.env.PHONEPE_SALT_INDEX,
            baseUrl: process.env.PHONEPE_BASE_URL,
            callbackUrl: process.env.PHONEPE_CALLBACK_URL,
            redirectUrl: process.env.PHONEPE_REDIRECT_URL,
            testMode: process.env.PHONEPE_TEST_MODE
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle specific error types
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large. Please upload a smaller image (max 10MB).'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Local URL: http://localhost:${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/api/test`);
      console.log(`💳 Payment API: http://localhost:${PORT}/api/payment`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🧪 PhonePe Test Mode: ${process.env.PHONEPE_TEST_MODE || 'false'}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

