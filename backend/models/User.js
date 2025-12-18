const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  
  // --- 1. GAMIFICATION (Scores & Streak) ---
  gamification: {
    xp: { type: Number, default: 0 },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
      freezes: { type: Number, default: 1 }
    }
  },

  // --- 2. HABITS (Daily Rituals) ---
  habits: {
    type: [{
      id: String,
      name: String,
      icon: String, 
      completed: { type: Boolean, default: false }
    }],
    // This default ensures NEW users get habits immediately
    default: [
      { id: 'read', name: 'Read 15m', icon: 'BookOpen', completed: false },
      { id: 'code', name: 'Code 1h', icon: 'Code', completed: false },
      { id: 'social', name: 'No Socials', icon: 'Coffee', completed: false }
    ]
  },

  // --- 3. ACTIVITY CHART ---
  activityLog: { type: Map, of: Number, default: {} } 
});

module.exports = mongoose.model('user', UserSchema);