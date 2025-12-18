const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  // Link task to a specific user
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },

  // Basic Task Details
  title: { type: String, required: true },
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  
  // ✅ NEW: Time Field (e.g., "10:00" or "2:30 PM")
  time: { type: String, default: '' }, 

  // Eisenhower Matrix Priority
  priority: { 
    type: String, 
    enum: ['do_first', 'schedule', 'delegate', 'delete'], 
    default: 'do_first' 
  },
  
  // Notes Field
  notes: { type: String, default: '' }, 

  // Completion Status
  isCompleted: { type: Boolean, default: false },
  
  // Timestamps
  completedAt: { type: Date }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);