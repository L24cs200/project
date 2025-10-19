// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./authRoutes');
const summarizeRoutes = require('./summarizeRoutes'); // <-- ADD THIS

// Initialize express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
connectDB();

// --- API Routes ---
app.use('/api/auth', authRoutes); // Use the auth routes for any /api/auth path
app.use('/api/summarize', summarizeRoutes); // <-- ADD THIS

// Define a simple route for the root
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Server Listening ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
