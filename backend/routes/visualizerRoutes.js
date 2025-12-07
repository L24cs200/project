const express = require('express');
const router = express.Router();

/**
 * Visualizer Route
 * Endpoint: POST /api/visualizer/chunks
 * Accepts: { text: "...", chunkSize: 1 }
 * Returns: { chunks: ["word1", "word2", ...] }
 */
router.post('/chunks', (req, res) => {
  try {
    const { text, chunkSize = 1 } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing text.' });
    }

    // Split text by spaces (and newlines) to get words
    const words = text.trim().split(/\s+/);
    const chunks = [];

    // Group words according to the chunk size
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }

    res.json({ chunks });
  } catch (error) {
    console.error('Error in visualizer route:', error.message);
    res.status(500).json({ message: 'Server error while processing text.' });
  }
});

module.exports = router;