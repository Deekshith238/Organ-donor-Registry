const mongoose = require('mongoose');
const seedData = require('./seed');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/organ_donor_registry', {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedData();
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn(`💡 Backend operating with Mongoose fallback mode.`);
    return false;
  }
};

module.exports = connectDB;
