const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Task = require('../models/Task');
const User = require('../models/User');

// ================= ROUTES =================

// 1. GET User Stats (Simplified / Placeholder)
router.get('/stats', auth, async (req, res) => {
  try {
    // Return empty stats so the frontend doesn't crash
    res.json({
      gamification: { xp: 0, streak: { current: 0 } },
      habits: [],
      activityLog: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 2. GET all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 3. CREATE a new task
router.post('/', auth, async (req, res) => {
  try {
    // ✅ Added 'time' to destructuring
    const { title, subject, dueDate, time, priority, notes } = req.body;
    
    const newTask = new Task({
      user: req.user.id,
      title,
      subject,
      dueDate,
      time: time || '', // ✅ Save time (or empty string if missing)
      priority: priority || 'do_first',
      notes: notes || '' 
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 4. UPDATE Task (Complete/Edit)
router.put('/:id', auth, async (req, res) => {
  try {
    // ✅ Added 'time' and 'dueDate' to destructuring
    const { priority, isCompleted, notes, time, dueDate } = req.body;
    let task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    // Update fields if present
    if (priority) task.priority = priority;
    if (notes !== undefined) task.notes = notes;
    if (time !== undefined) task.time = time;     // ✅ Update time
    if (dueDate) task.dueDate = dueDate;          // ✅ Allow updating date
    
    // Handle Completion
    if (isCompleted !== undefined) {
        task.isCompleted = isCompleted;
        if (isCompleted) {
            task.completedAt = new Date();
        } else {
            task.completedAt = null;
        }
    }

    await task.save();
    
    // Return just the task
    res.json(task);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 5. DELETE Task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 6. TOGGLE HABIT (Placeholder)
router.post('/habit/toggle', auth, (req, res) => {
    res.json({ message: "Habit tracking disabled" });
});

module.exports = router;