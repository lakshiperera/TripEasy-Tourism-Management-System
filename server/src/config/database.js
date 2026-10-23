const mongoose = require('mongoose');
const { initStore } = require('../utils/embeddedStore');

let dbMode = 'uninitialized';

/**
 * Connect to MongoDB or seamlessly fall back to Embedded Engine
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tripeasy';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    dbMode = 'mongodb';
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(`ℹ️  MongoDB server not active locally (${error.message}).`);
    console.log('🌲 Activating TripEasy Embedded JSON Storage Engine...');
    await initStore();
    dbMode = 'embedded';
    console.log('✅ TripEasy Embedded Store initialized with 10 Attractions & 6 Categories.');
    return null;
  }
};

const getDBMode = () => dbMode;

module.exports = connectDB;
module.exports.getDBMode = getDBMode;
