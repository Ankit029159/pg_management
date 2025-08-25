
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/dbconnection'); 
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Use the PORT from environment variables, with a fallback to 5001
const PORT = process.env.PORT || 5001;

// A simple test route
app.get('/', (req, res) => {
    res.send("Hello from backend. API is running...");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});