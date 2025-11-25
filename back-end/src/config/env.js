// filepath: back-end/config/env.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  
  database: {
    mongoUri: process.env.MONGO_URI,
  },
  
  cache: {
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  
  queue: {
    rabbitmqUri: process.env.RABBITMQ_URI,
  },
  
  security: {
    jwtSecret: process.env.JWT_SECRET,
  },
};

export default config;