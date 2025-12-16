const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');
const os = require('os'); // <--- Import OS to find the system temp folder

// ✅ FIX 1: Use os.tmpdir() to prevent "Missing uploads folder" crash on Render
const upload = multer({ dest: os.tmpdir() });

// --- HELPER: Clean JSON Output ---
function cleanJsonOutput(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1) {
    const startObj = text.indexOf('{');
    const endObj = text.lastIndexOf('}');
    if (startObj !== -1 && endObj !== -1) {
        return `[${text.substring(startObj, endObj + 1)}]`; 
    }
    throw new Error("AI did not return a valid JSON array.");
  }
  return text.substring(start, end + 1);
}

// ✅ FIX 2: Path is '/generate' to match Frontend POST request
router.post('/generate', upload.single('pdfFile'), async (req, res) => {
  try {
    // 1. Validate File Upload
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    let extractedText = "";

    // 2. Extract Text from PDF
    try {
      const buffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
    } catch (err) {
      console.error("PDF Read Error:", err);
      return res.status(500).json({ error: "Failed to read PDF file" });
    } finally {
      // Clean up uploaded file
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    // 3. Validate Text Length
    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ error: "PDF text is too short or empty." });
    }

    // 4. Construct Prompt
    const truncatedText = extractedText.substring(0, 3000).replace(/\n/g, " ");
    
    const prompt = `[INST] You are an expert educational AI. Generate a quiz based on the text below.
    
    STRICT REQUIREMENTS:
    1. Return ONLY a raw JSON Array. Do not use Markdown.
    2. Create exactly 5 questions.
    3. Follow this specific JSON structure:
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Option A"
      }
    ]

    TEXT TO ANALYZE:
    "${truncatedText}"
    [/INST]`;

    // 5. Call Hugging Face API
    // Check API Key
    if (!process.env.HUGGINGFACE_API_KEY) {
        throw new Error("Missing HUGGINGFACE_API_KEY in environment variables");
    }

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        inputs: prompt,
        parameters: { 
            max_new_tokens: 1500, 
            return_full_text: false,
            temperature: 0.1 
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 6. Parse Response
    let generatedText = response.data[0].generated_text;
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

    const cleanedJson = cleanJsonOutput(generatedText);
    const quiz = JSON.parse(cleanedJson);

    // 7. Send Response
    res.json({ quiz });

  } catch (error) {
    console.error("🔥 Quiz Generation Error:", error.response?.data || error.message);
    
    if (error.message.includes("JSON")) {
        return res.status(500).json({ error: "AI failed to format the quiz correctly. Please try again." });
    }
    if (error.message.includes("API_KEY")) {
        return res.status(500).json({ error: "Server configuration error: Missing API Key." });
    }
    
    res.status(500).json({ error: "Failed to generate quiz. Check backend logs." });
  }
});

module.exports = router;