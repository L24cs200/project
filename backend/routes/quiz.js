const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');
const os = require('os'); 

const upload = multer({ dest: os.tmpdir() });

// --- ✅ UPDATED FALLBACK QUIZ (Eat That Frog) ---
// This quiz appears if the AI fails, timeouts, or the PDF is unreadable.
const FALLBACK_QUIZ = [
  {
    question: "What does the phrase 'Eat That Frog' mean in the book?",
    options: [
      "Do the hardest and most important task first",
      "Complete easy tasks before difficult ones",
      "Avoid unpleasant work",
      "Take frequent breaks"
    ],
    answer: "Do the hardest and most important task first"
  },
  {
    question: "According to Brian Tracy, what is the main cause of procrastination?",
    options: [
      "Lack of intelligence",
      "Fear of failure and lack of clarity",
      "Too much free time",
      "Poor physical health"
    ],
    answer: "Fear of failure and lack of clarity"
  },
  {
    question: "What is the 80/20 Rule mentioned in Eat That Frog?",
    options: [
      "80% of tasks are easy",
      "20% of tasks produce 80% of results",
      "80% effort gives 20% results",
      "Work 80 minutes, rest 20 minutes"
    ],
    answer: "20% of tasks produce 80% of results"
  },
  {
    question: "Which technique helps break large tasks into manageable pieces?",
    options: [
      "Time blocking",
      "Salami Slice method",
      "Pomodoro technique",
      "Delegation"
    ],
    answer: "Salami Slice method"
  },
  {
    question: "What is one key habit of highly productive people according to the book?",
    options: [
      "They multitask continuously",
      "They plan every day in advance",
      "They avoid deadlines",
      "They work only when motivated"
    ],
    answer: "They plan every day in advance"
  }
];

// --- HELPER: Clean JSON ---
// Removes extra text like "Here is the JSON:" that AI sometimes adds
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
                // If it's another error (401, 400), throw it immediately to hit the catch block below
                throw error;
            }
        }
    }
    throw new Error("AI failed after multiple retries");
}

// Route: POST /api/quiz/generate
router.post('/generate', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
        return res.json({ quiz: FALLBACK_QUIZ, error: "No PDF uploaded. Using default quiz." });
    }

    // 1. Extract Text
    let extractedText = "";
    try {
      const buffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
      fs.unlinkSync(req.file.path); // Clean up temp file
    } catch (err) {
      console.error("PDF Read Error:", err.message);
      return res.json({ quiz: FALLBACK_QUIZ, error: "Failed to read PDF. Using default quiz." });
    }

    // Check if text is too short (e.g., scanned image PDF)
    if (extractedText.length < 50) {
        return res.json({ quiz: FALLBACK_QUIZ, error: "PDF text too short/unreadable. Using default quiz." });
    }

    // 2. Prepare Prompt
    const truncatedText = extractedText.substring(0, 2500).replace(/\n/g, " ");
    const prompt = `[INST] Generate 5 multiple-choice questions based ONLY on the text below.
    Return a RAW JSON ARRAY. No Markdown.
    Format: [{"question": "...", "options": ["A","B","C","D"], "answer": "A"}]
    
    Text: "${truncatedText}" [/INST]`;

    // 3. Call AI with Retry Logic
    if (!process.env.HUGGINGFACE_API_KEY) {
        console.warn("⚠️ Missing API Key. Using fallback.");
        return res.json({ quiz: FALLBACK_QUIZ, error: "Missing API Key. Using default quiz." });
    }

    try {
        const rawText = await generateWithRetry(prompt, process.env.HUGGINGFACE_API_KEY);
        
        const cleanedJson = cleanJsonOutput(rawText);
        const quiz = JSON.parse(cleanedJson);

        if (!Array.isArray(quiz)) throw new Error("Invalid JSON structure");

        // Success! Return the AI generated quiz
        res.json({ quiz });

    } catch (aiError) {
        console.error("⚠️ AI Failed or Timed Out:", aiError.message);
        // ✅ HERE IS THE FALLBACK TRIGGER
        res.json({ quiz: FALLBACK_QUIZ, error: "AI Busy/Timeout. Using default quiz." });
    }

  } catch (error) {
    console.error("Server Crash Error:", error);
    // Even if the server crashes, try to send the fallback quiz if possible
    res.status(500).json({ quiz: FALLBACK_QUIZ, error: "Server error. Using default quiz." });
  }
});

module.exports = router;