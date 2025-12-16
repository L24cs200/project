const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Task = require('../models/Task');
const axios = require('axios'); 

// --- 1. AI Feature: Break down a task ---
router.post('/ai-breakdown', auth, async (req, res) => {
  try {
    const { taskTitle, subject } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "No AI Key found" });
    }

    const prompt = `I am a student. Break down this task: "${taskTitle}" for the subject "${subject}" into 3-4 small, actionable sub-steps (max 5 words each). 
    Return ONLY a raw JSON array of strings. Example: ["Read Chapter 1", "Solve 5 problems", "Review notes"].`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const candidate = response.data.candidates[0].content.parts[0].text;
    let cleanJson = candidate.replace(/```json/g, '').replace(/```/g, '').trim();
    const steps = JSON.parse(cleanJson);

    res.json({ steps });

  } catch (error) {
    console.error("AI Breakdown Error:", error.message);
    res.status(500).json({ error: "AI failed to generate steps" });
  }
});

// --- 2. GET all tasks ---
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- 3. ADD a new task ---
router.post('/', auth, async (req, res) => {
  try {
    // We now accept 'priority' from the frontend (do_first, schedule, etc.)
    const { title, type, subject, dueDate, priority } = req.body;
    
    const newTask = new Task({
      user: req.user.id,
      title,
      type,
      subject,
      dueDate,
      priority: priority || 'do_first' // Default to Urgent if missing
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --- 4. UPDATE Task (Drag-and-Drop & Completion) ---
// ✅ UPDATED for Matrix Support
router.put('/:id', auth, async (req, res) => {
  try {
    const { priority, isCompleted } = req.body;
    let task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Check user ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update Priority (if dragged to new column)
    if (priority) {
        task.priority = priority;
    }

    // Update Completion (if marked done)
    if (isCompleted !== undefined) {
        task.isCompleted = isCompleted;
    } else if (!req.body.priority && Object.keys(req.body).length === 0) {
        // Fallback: If nothing sent, toggle completion (old behavior)
        task.isCompleted = !task.isCompleted;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --- 5. DELETE Task ---
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

module.exports = router;