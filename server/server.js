const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check whether MongoDB URI exists
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is missing');
      process.exit(1);
    }

    // Connect to MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB connected successfully`);
    console.log(`📡 Host: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;