const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');
const os = require('os'); 

const upload = multer({ dest: os.tmpdir() });

// --- FALLBACK QUIZ ---
const FALLBACK_QUIZ = [
    {
        question: "The AI is currently warming up. This is a demo question.",
        options: ["Ok", "Retry", "Wait", "Ignore"],
        answer: "Retry"
    },
    {
        question: "Why do I see this?",
        options: ["PDF was empty", "AI timed out", "Invalid API Key", "All of the above"],
        answer: "AI timed out"
    }
];

// --- HELPER: Clean JSON ---
function cleanJsonOutput(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start !== -1 && end !== -1) return text.substring(start, end + 1);
  return text; 
}

// --- HELPER: Smart Retry Function ---
async function generateWithRetry(prompt, apiKey, retries = 3) {
    const url = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
    
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`🤖 Attempt ${i + 1} to call AI...`);
            const response = await axios.post(
                url,
                {
                    inputs: prompt,
                    parameters: { max_new_tokens: 1500, return_full_text: false, temperature: 0.1 }
                },
                {
                    headers: { 
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json' 
                    },
                    timeout: 60000 // 60 Second Timeout (Free tier is slow)
                }
            );
            return response.data[0].generated_text;

        } catch (error) {
            // Check if model is loading (Status 503)
            if (error.response && error.response.status === 503) {
                const waitTime = error.response.data.estimated_time || 20;
                console.log(`⏳ Model is loading. Waiting ${waitTime} seconds...`);
                // Wait for the model to load
                await new Promise(resolve => setTimeout(resolve, (waitTime * 1000) + 2000));
            } else {
                // If it's another error (401, 400), throw it immediately
                throw error;
            }
        }
    }
    throw new Error("AI failed after multiple retries");
}

// Route: POST /api/quiz/generate
router.post('/generate', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    // 1. Extract Text
    let extractedText = "";
    try {
      const buffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error("PDF Error:", err);
      return res.json({ quiz: FALLBACK_QUIZ, error: "Failed to read PDF" });
    }

    if (extractedText.length < 50) return res.json({ quiz: FALLBACK_QUIZ, error: "PDF text too short" });

    // 2. Prepare Prompt
    const truncatedText = extractedText.substring(0, 2500).replace(/\n/g, " ");
    const prompt = `[INST] Generate 5 multiple-choice questions based ONLY on the text below.
    Return a RAW JSON ARRAY. No Markdown.
    Format: [{"question": "...", "options": ["A","B","C","D"], "answer": "A"}]
    
    Text: "${truncatedText}" [/INST]`;

    // 3. Call AI with Retry Logic
    if (!process.env.HUGGINGFACE_API_KEY) {
        return res.json({ quiz: FALLBACK_QUIZ, error: "Missing API Key" });
    }

    try {
        const rawText = await generateWithRetry(prompt, process.env.HUGGINGFACE_API_KEY);
        
        const cleanedJson = cleanJsonOutput(rawText);
        const quiz = JSON.parse(cleanedJson);

        if (!Array.isArray(quiz)) throw new Error("Invalid JSON structure");

        res.json({ quiz });

    } catch (aiError) {
        console.error("⚠️ AI Failed:", aiError.message);
        res.json({ quiz: FALLBACK_QUIZ, error: "AI Busy/Timeout" });
    }

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server crashed" });
  }
});

module.exports = router;