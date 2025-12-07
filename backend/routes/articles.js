const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// @route   GET /api/articles
// @desc    Get all articles (sorted by newest first)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/articles
// @desc    Create a new article
// @access  Public (for now)
router.post('/', async (req, res) => {
  const { title, content, author } = req.body;

  try {
    const newArticle = new Article({
      title,
      content,
      author
    });

    const article = await newArticle.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;