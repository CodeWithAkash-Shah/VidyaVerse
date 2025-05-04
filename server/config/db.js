const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-educator";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

module.exports = connectDB;
