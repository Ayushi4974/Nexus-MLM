const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mlm_system';
  
  const options = {
    maxPoolSize: 50,              // Keep up to 50 active socket connections
    minPoolSize: 10,              // Maintain at least 10 active socket connections
    serverSelectionTimeoutMS: 5000, // Timeout selection after 5 seconds
    socketTimeoutMS: 45000,        // Close inactive sockets after 45 seconds
    family: 4                      // Use IPv4, skip trying IPv6
  };

  try {
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[Database] Lost MongoDB connection. Retrying...');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] Mongoose connection error: ${err}`);
});

module.exports = connectDB;
