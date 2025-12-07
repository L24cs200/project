require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testConnection() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY is missing in .env");
    return;
  }

  console.log("🔑 Testing API Key:", apiKey.substring(0, 10) + "...");
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // 1. List available models
    console.log("📡 Connecting to Google AI...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // 2. Try a simple generation
    console.log("🤖 Attempting to generate text...");
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    const text = response.text();
    
    console.log("\n✅ SUCCESS! The API is working.");
    console.log("📝 Response:", text);

  } catch (error) {
    console.error("\n❌ API CONNECTION FAILED");
    console.error("Error Message:", error.message);
    
    if (error.message.includes("404")) {
      console.log("\n💡 DIAGNOSIS: The API Key is valid, but the 'Generative Language API' is DISABLED for this project.");
      console.log("👉 FIX: Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com and click ENABLE.");
    }
  }
}

testConnection();