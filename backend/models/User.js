// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // No unique constraint here, which is correct!
  },
  email: {
    type: String,
    required: true,
    unique: true, // Keep this! Emails must be unique.
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// ✅ FIX: Changed 'users' to 'users_new'
// This creates a brand new table in the database, ignoring the old broken rules.
module.exports = mongoose.model('user', UserSchema, 'users_new');