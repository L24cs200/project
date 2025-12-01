require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors'); // Import cors
const connectDB = require('./utils/db');

// --- 1. Import Routes ---
const authRoutes = require('./routes/auth');
const summarizeRoutes = require('./routes/summarizeRoutes');
const quizRoutes = require('./routes/quizRoutes');
const textRoutes = require('./routes/textRoutes');

// --- 2. Connect to Database ---
connectDB();

const app = express();

// --- 3. Middleware ---
app.use(express.json({ extended: false }));

// --- 4. Enable CORS ---
// This list now allows your frontend AND your API tools
const allowedOrigins = [
  'http://localhost:3000',    // For your React frontend
  'http://localhost:3000/',   // For your React frontend (with slash)
  'http://localhost:5000',    // FIX for API tools (Thunder Client)
  'http://localhost:5000/',   // FIX for API tools (with slash)
  'https://project-frontend-2dgh.onrender.com' // For deployment
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.error(`CORS Error: The origin '${origin}' was not found in the allowedOrigins list.`);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


// --- 5. Define API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/summarize', summarizeRoutes);
app.use('/api/generate-quiz', quizRoutes);
app.use('/api/text', textRoutes);

// --- 6. Serve Frontend in Production ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// --- 7. Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));