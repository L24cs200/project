require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');

// --- 1. Import Routes ---
const authRoutes = require('./routes/auth');
const summarizeRoutes = require('./routes/summarizeRoutes');
const quizRoutes = require('./routes/quiz'); // ✅ CORRECT: Points to renamed quiz.js
const visualizerRoutes = require('./routes/visualizerRoutes'); 
const articleRoutes = require('./routes/articles'); 
const timerRoutes = require('./routes/timer'); 
const pdfToolRoutes = require('./routes/pdfToolRoutes');
const plannerRoutes = require('./routes/planner');
// --- 2. Connect to Database ---
connectDB();

const app = express();

// --- 3. Middleware ---
app.use(express.json({ extended: false }));

// --- 4. Enable CORS ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://project-frontend-kncn.onrender.com', 
  'http://192.168.255.147:3000', // Your Local IP
  'http://192.168.255.147:5000'  
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in the allowed list
    // OR if the origin starts with "http://192.168." (Allow all local network devices)
    if (allowedOrigins.includes(origin) || origin.startsWith('http://192.168.')) {
      return callback(null, true);
    }

    console.error(`❌ CORS Blocked: '${origin}' is NOT allowed`);
    return callback(new Error('CORS: Origin not allowed'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// --- 5. API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/summarize', summarizeRoutes);
app.use('/api/quiz', quizRoutes); // ✅ Route mounted at /api/quiz
app.use('/api/visualizer', visualizerRoutes);
app.use('/api/articles', articleRoutes); 
app.use('/api/timer', timerRoutes);
app.use('/api/pdf-tools', pdfToolRoutes);
app.use('/api/planner', plannerRoutes);
// --- 6. Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));