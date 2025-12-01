// backend/utils/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Ensure dotenv is configured to read MONGO_URI

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ options are generally handled automatically
      // useNewUrlParser: true, // No longer needed
      // useUnifiedTopology: true, // No longer needed
      // useCreateIndex: true, // No longer needed
      // useFindAndModify: false // No longer needed
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;