  // backend/summarizeRoutes.js
  const express = require('express');
  const router = express.Router();
  const multer = require('multer');
  const pdfParse = require('pdf-parse');
  // ✅ Fixed import
  const { CohereClient } = require('cohere-ai');
  require('dotenv').config();

  // --- Initialize Cohere Client ---
  const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
  });

  // --- Multer setup for PDF uploads ---
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') cb(null, true);
      else cb(new Error('Only PDF files are allowed!'), false);
    },
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  });

  // --- Summarization helper ---
  async function summarizeWithCohere(textToSummarize) {
    const MAX_CHARS = 120000;
    if (textToSummarize.length > MAX_CHARS) {
      console.warn('⚠️ Text too long. Truncating for summarization.');
      textToSummarize = textToSummarize.substring(0, MAX_CHARS);
    }

    try {
      const response = await cohere.chat({
        model: 'command-a-03-2025',
        message: `Summarize the following document clearly and concisely (use bullet points if helpful):\n\n${textToSummarize}`,
      });

      if (response && response.text) return response.text;
      throw new Error('Invalid or empty response from Cohere API.');
    } catch (err) {
      console.error('Error calling Cohere API:', err.message);
      throw new Error('Summary service (Cohere) failed to respond.');
    }
  }

  // --- Route handler ---
  router.post('/', upload.single('pdfFile'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ msg: 'No PDF file uploaded.' });

      // --- Extract text from PDF ---
      const data = await pdfParse(req.file.buffer);
      const pdfText = data.text;

      if (!pdfText || !pdfText.trim()) {
        return res.status(400).json({ msg: 'Could not extract text from PDF or PDF is empty.' });
      }

      // --- Summarize with Cohere ---
      const summary = await summarizeWithCohere(pdfText);
      res.status(200).json({ summary });
    } catch (err) {
      console.error('--- ERROR IN SUMMARIZE ROUTE ---:', err);

      if (err.message.includes('Only PDF files')) {
        return res.status(400).json({ msg: 'Upload Error: Only PDF files are allowed.' });
      }
      if (err.message.includes('Summary service (Cohere)')) {
        return res.status(503).json({ msg: 'Summary service is temporarily unavailable.' });
      }

      res.status(500).json({ msg: 'An unexpected server error occurred.' });
    }
  });

  module.exports = router;
