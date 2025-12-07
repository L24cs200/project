const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ FATAL: GEMINI_API_KEY is missing in .env");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Configure Multer (Temp storage for uploads)
const upload = multer({ dest: 'uploads/' });

// --- Helper: Robust Model Selector ---
// Tries different Gemini versions if one fails (404) or is busy
async function generateWithFallback(prompt) {
  const models = [
    "gemini-1.5-flash", 
    "gemini-1.5-flash-001", 
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
      console.warn(`⚠️ ${modelName} failed: ${error.message.split('[')[0]}`);
      // Continue to the next model in the list
    }
  }
  throw new Error("All AI models failed. Please check your API Key and Google Cloud Billing.");
}

// --- Helper: Clean JSON ---
// Extracts [ ... ] from the AI's response to ignore chatty intros like "Here is your JSON"
function cleanJsonOutput(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1) {
    throw new Error("AI did not return a valid JSON array.");
  }
  return text.substring(start, end + 1);
}

// --- ROUTE: POST /api/generate-quiz ---
router.post('/', upload.single('pdfFile'), async (req, res) => {
  try {
    // A. Validation
    if (!req.file) {
      return res.status(400).json({ error: "No PDF uploaded" });
    }

    // B. Extract Text
    let extractedText = "";
    try {
      const buffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
    } catch (err) {
      return res.status(500).json({ error: "Failed to read PDF file" });
    } finally {
      // Always delete the temp file to keep server clean
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ error: "PDF text is too short or empty." });
    }

    // C. Build Prompt
    const prompt = `
      You are a strict JSON generator. Create a quiz from the text below.
      
      RULES:
      1. Return ONLY a valid JSON Array.
      2. No Markdown blocks (\`\`\`json).
      3. No intro text (like "Here is the quiz").
      4. Generate exactly 5 multiple-choice questions.
      
      FORMAT:
      [
        {
          "question": "Question string?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A"
        }
      ]

      TEXT TO PROCESS:
      ${extractedText.substring(0, 15000).replace(/"/g, "'")} 
    `;

    // D. Generate & Parse
    const rawOutput = await generateWithFallback(prompt);
    
    // Clean potential markdown or intro text
    const cleanedJson = cleanJsonOutput(rawOutput);
    
    let quiz;
    try {
      quiz = JSON.parse(cleanedJson);
    } catch (e) {
      console.error("JSON Parse Error. Raw:", rawOutput);
      return res.status(500).json({ error: "AI generated invalid JSON. Please try again." });
    }

    res.json({ quiz });

  } catch (error) {
    console.error("🔥 Quiz Fatal Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to generate quiz." });
  }
});

module.exports = router;