// Inside: backend/routes/textRoutes.js

const express = require('express');
const router = express.Router();

// A test route to make sure it's working
router.get('/test', (req, res) => {
  res.json({ msg: 'Text routes are working!' });
});

// You will add your API logic for the speed reader here later

module.exports = router;