const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');
const os = require('os'); 

// Use system temp folder to prevent Render crashes
const upload = multer({ dest: os.tmpdir() });

// --- FALLBACK QUIZ (Safety Net) ---
// If AI fails, we show this so the app doesn't crash during presentation
const FALLBACK_QUIZ = [
    {
        question: "What is the primary function of the CPU in a computer?",
        options: ["Store data permanently", "Process instructions", "Display images", "Connect to the internet"],
        answer: "Process instructions"
    },
    {
        question: "Which of the following is NOT a programming language?",
        options: ["Python", "Java", "HTML", "JPEG"],
        answer: "JPEG"
    },
    {
        question: "What does 'RAM' stand for?",
        options: ["Read Access Memory", "Random Access Memory", "Run All Memory", "Read All Memory"],
        answer: "Random Access Memory"
    },
    {
        question: "Which data structure uses LIFO (Last In, First Out)?",
        options: ["Queue", "Stack", "Array", "Tree"],
        answer: "Stack"
    },
    {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(n^2)", "O(log n)", "O(1)"],
        answer: "O(log n)"
    }
];

// --- HELPER: Clean JSON Output ---
function cleanJsonOutput(text) {
  // Try to find JSON array brackets
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  
  if (start !== -1 && end !== -1) {
      return text.substring(start, end + 1);
  }
  // If no brackets, maybe it's a raw object?
  return text; 
}

// Route: POST /api/quiz/generate
router.post('/generate', upload.single('pdfFile'), async (req, res) => {
  let extractedText = "";

  try {
    // 1. Validate File
    if (!req.file) {
        console.error("❌ No file uploaded.");
        return res.status(400).json({ error: "No PDF uploaded" });
    }

    // 2. Extract Text
    try {
      const buffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
      // Clean up file immediately
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error("❌ PDF Parsing Error:", err);
      // Even if PDF fails, return fallback so app works
      return res.json({ quiz: FALLBACK_QUIZ, note: "PDF Error - Showing Demo Quiz" });
    }

    // 3. Prepare AI Request
    const truncatedText = extractedText.substring(0, 2000).replace(/\n/g, " ");
    
    // Check API Key
    if (!process.env.HUGGINGFACE_API_KEY) {
        console.error("❌ Missing API Key");
        return res.json({ quiz: FALLBACK_QUIZ, note: "Missing Key - Showing Demo Quiz" });
    }

    console.log("🤖 Sending to Hugging Face...");

    // 4. Call AI (With Error Handling)
    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
            {
                inputs: `[INST] Generate 5 multiple-choice questions from this text. Return ONLY a JSON array.
                Format: [{"question": "...", "options": ["A","B","C","D"], "answer": "A"}]
                
                Text: "${truncatedText}" [/INST]`,
                parameters: { max_new_tokens: 1500, return_full_text: false, temperature: 0.1 }
            },
            {
                headers: { 
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json' 
                },
                timeout: 20000 // 20 second timeout
            }
        );

        // 5. Parse AI Response
        let generatedText = response.data[0].generated_text;
        console.log("✅ AI Responded. Cleaning JSON...");

        const cleanedJson = cleanJsonOutput(generatedText);
        const quiz = JSON.parse(cleanedJson);

        // Validate structure (must be array)
        if (!Array.isArray(quiz)) throw new Error("AI returned object, not array");

        res.json({ quiz });

    } catch (aiError) {
        // --- THIS IS THE SAFETY NET ---
        console.error("⚠️ AI Generation Failed:", aiError.message);
        if (aiError.response) console.error("AI Status:", aiError.response.status, aiError.response.data);

        // Return Mock Data instead of 500 Error
        console.log("🔄 Switching to Fallback Quiz.");
        res.json({ 
            quiz: FALLBACK_QUIZ, 
            note: "AI Busy - Showing Demo Quiz" 
        });
    }

  } catch (error) {
    console.error("🔥 Critical Server Error:", error);
    res.status(500).json({ error: "Server crashed." });
  }
});

module.exports = router;