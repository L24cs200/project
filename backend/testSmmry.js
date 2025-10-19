// test-cohere.js
require('dotenv').config();
const { CohereClient } = require('cohere-ai');

const myKey = process.env.COHERE_API_KEY;

if (!myKey) {
  console.error("❌ ERROR: COHERE_API_KEY is not defined.");
  process.exit(1);
}

const cohere = new CohereClient({ token: myKey });

async function testCohereConnection() {
  console.log("Attempting to connect to Cohere API...");

  try {
    // Use a currently supported model, e.g., 'xlarge' for chat or 'summarize-xlarge' for summarization
    const response = await cohere.chat({
      model: 'command-a-03-2025',  // UPDATED model
      message: 'Hello, this is a connection test.',
    });

    console.log("\n✅ API Connected Successfully!");
    console.log("Response Text:", response.text);

  } catch (err) {
    console.error("\n❌ API Connection Failed!");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    if (err.statusCode) {
      console.error("Status Code:", err.statusCode);
      console.error("Body:", err.body);
    }
  }
}

testCohereConnection();
