const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route: POST /api/generate-quiz/generate
router.post('/generate', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Please provide text to generate a quiz.' });
  }

  try {
    // 1. Check for API Key
    if (!process.env.OPENAI_API_KEY) {
      console.warn("Warning: OPENAI_API_KEY is missing. Returning mock quiz.");
      return res.json(getMockQuiz());
    }

    // 2. Construct Prompt
    const prompt = `
      Generate a quiz with 3 multiple-choice questions based on the text below.

      IMPORTANT: Return ONLY raw JSON. Do not include markdown formatting (like \`\`\`json).
      
      JSON structure:
      {
        "quiz": [
          {
            "question": "",
            "options": ["A", "B", "C", "D"],
            "answer": ""
          }
        ]
      }

      Text to quiz: "${text.substring(0, 2000)}"
    `;

    // 3. Call OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",  
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 4. Extract Output
    let generatedText = response.data.choices[0].message.content;

    // Remove accidental markdown
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

    const quizData = JSON.parse(generatedText);

    // 5. Send Real Quiz
    res.json(quizData);

  } catch (error) {
    console.error("OpenAI API Error (Quiz):", error.response?.data || error.message);
    console.log("Falling back to Mock Quiz.");

    // 6. Fallback
    res.json(getMockQuiz());
  }
});

// --- Helper: Mock Data ---
function getMockQuiz() {
  return {
    quiz: [
      {
        question: "(Mock) What allows this app to generate quizzes?",
        options: ["Magic", "OpenAI", "Random Chance", "Hard-coded Data"],
        answer: "OpenAI"
      },
      {
        question: "(Mock) Which file handles the quiz logic?",
        options: ["server.js", "quizRoutes.js", "Dashboard.js", "App.js"],
        answer: "quizRoutes.js"
      },
      {
        question: "(Mock) If the API fails, what happens?",
        options: ["App Crashes", "Nothing", "Shows Mock Quiz", "Computer Explodes"],
        answer: "Shows Mock Quiz"
      }
    ]
  };
}

module.exports = router;
