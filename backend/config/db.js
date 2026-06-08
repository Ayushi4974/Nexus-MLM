const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  try {
    // Set low timeout (3 seconds) to check local/env MongoDB availability quickly
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mlm_system', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.log('--------------------------------------------------');
    console.log(`MongoDB connection failed: ${error.message}`);
    console.log('Falling back to local in-memory/JSON mock database (mockDb.json).');
    console.log('The MLM system is fully operational for preview!');
    console.log('--------------------------------------------------');
    global.useMockDb = true;
  }
};

module.exports = connectDB;
