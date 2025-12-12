const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Init GEMINI
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ FATAL: GEMINI_API_KEY is missing in .env");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const upload = multer({ dest: 'uploads/' });

// --- ROBUST MODEL SELECTOR ---
async function generateWithFallback(prompt) {
  const models = [
    "gemini-1.5-flash", 
    "gemini-1.5-flash-latest",
    "gemini-pro",
    "gemini-1.0-pro"
  ];
  
  for (const modelName of models) {
    try {
      console.log(`🤖 Requesting quiz from model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text(); 
    } catch (error) {
      console.warn(`⚠️ ${modelName} Failed.`);
      console.warn(`📝 Error Details: ${error.message}`); 
    }
  }
  throw new Error("All AI models failed. Please check your API Key and Google Cloud Billing.");
}

function cleanJsonOutput(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1) {
    throw new Error("AI did not return a valid JSON array.");
  }
  return text.substring(start, end + 1);
}

// --- ROUTE ---
router.post('/', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    let extractedText = "";
    try {
      const buffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
    } catch (err) {
      return res.status(500).json({ error: "Failed to read PDF file" });
    } finally {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ error: "PDF text is too short." });
    }

    const prompt = `
      You are a strict JSON generator. Create a quiz from the text below.
      RULES:
      1. Return ONLY a valid JSON Array.
      2. No Markdown blocks.
      3. Generate exactly 5 questions.
      
      FORMAT:
      [
        {
          "question": "Question string?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A",
          "type": "MCQ"
        }
      ]

      TEXT:
      ${extractedText.substring(0, 15000).replace(/"/g, "'")} 
    `;

    const rawOutput = await generateWithFallback(prompt);
    const cleanedJson = cleanJsonOutput(rawOutput);
    const quiz = JSON.parse(cleanedJson);

    res.json({ quiz });

  } catch (error) {
    console.error("🔥 Quiz Fatal Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to generate quiz." });
  }
});

module.exports = router;