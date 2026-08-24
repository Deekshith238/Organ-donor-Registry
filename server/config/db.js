const mongoose = require('mongoose');
const seedData = require('./seed');

const connectDB = async () => {
  try {
    // Check both MONGODB_URI and MONGO_URI (or fallback to local MongoDB for development)
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/organ_donor_registry';

    if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
      console.warn('⚠️ Neither MONGODB_URI nor MONGO_URI environment variable was provided.');
      console.warn('💡 Connecting to local fallback MongoDB...');
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('✅ MongoDB connected successfully');
    console.log(`📡 Host: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);

    // Seed initial data once connected
    try {
      await seedData();
    } catch (seedErr) {
      console.warn('⚠️ Database seeding notice:', seedErr.message);
    }

    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('💡 Tip for Render & MongoDB Atlas: Ensure Network Access in MongoDB Atlas allows 0.0.0.0/0 (Allow access from anywhere).');
    return false;
  }
};

module.exports = connectDB;