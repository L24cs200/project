const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  
  // --- UPDATED PRIORITY ENUM ---
  priority: { 
    type: String, 
    enum: ['do_first', 'schedule', 'delegate', 'delete'], 
    default: 'do_first' 
  },
  
  // We keep this for the "Delegate" or "Delete" section
  isCompleted: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);