// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure emails are unique
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set registration date
  },
});

// The third argument specifies the collection name ('users') in MongoDB
module.exports = mongoose.model('user', UserSchema, 'users');