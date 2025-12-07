const express = require('express');
const router = express.Router();
const { saveSession } = require('../controllers/timerController');
// const auth = require('../middleware/auth'); // Uncomment if you have auth

// POST api/timer/save
router.post('/save', saveSession); // Add 'auth' middleware here later

module.exports = router;