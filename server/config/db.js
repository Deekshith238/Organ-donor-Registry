const mongoose = require('mongoose');
const seedData = require('./seed');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/organ_donor_registry';

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Seed only after successful MongoDB connection
    await seedData();

    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
