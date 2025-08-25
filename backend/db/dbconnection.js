// backend/db/dbconnection.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // If connection is successful, log a confirmation message
    console.log(`MongoDB Connected`);
  } catch (error) {
    // If there is an error during connection, log the error message
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    // Exit the process with a failure code (1)
    process.exit(1);
  }
};

module.exports = connectDB;