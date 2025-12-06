import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import config from './env.js';

const connectDB = async () => {
  try {
    if (!config.database.mongoUri) {
      logger.warn('MongoDB URI not provided, running in memory mode');
      return;
    }

    const conn = await mongoose.connect(config.database.mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    logger.warn('Server will continue without database connection');
    // Don't exit process, allow server to run for API testing
  }
};

export default connectDB;