require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

// --- 4. Enable CORS (Updated with your new frontend URL) ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3000/',
  'http://localhost:5000',
  'http://localhost:5000/',
  'https://project-frontend-2dgh.onrender.com',   // old frontend
  'https://projectedu-frontend.onrender.com'      // NEW frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);   // allow mobile, Postman, curl

    if (!allowedOrigins.includes(origin)) {
      console.error(`❌ CORS Blocked: '${origin}' is NOT allowed`);
      return callback(new Error('CORS: Origin not allowed'), false);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// --- 5. API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/summarize', summarizeRoutes);
app.use('/api/generate-quiz', quizRoutes);
app.use('/api/text', textRoutes);

// --- 6. REMOVED frontend serving block (because repo has no frontend) ---
// This avoids ENOENT error on Render.

// --- 7. Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
