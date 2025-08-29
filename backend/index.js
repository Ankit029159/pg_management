
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/dbconnection'); 
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Add additional headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

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

// A simple test route
app.get('/', (req, res) => {
    res.send("Hello from backend. API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});