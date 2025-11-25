import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import config from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database.mongoUri);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;