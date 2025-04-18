import mongoose from 'mongoose';
import config from './index';
import { setDbConnectionStatus } from '../services/dbService';

const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      throw new Error('MongoDB URI is not defined');
    }

    // Check if we're in development mode
    if (config.env === 'development') {
      try {
        const conn = await mongoose.connect(config.mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        setDbConnectionStatus(true);
        return conn;
      } catch (error) {
        console.warn(`⚠️ Warning: Couldn't connect to MongoDB.`);
        console.warn(`⚠️ Running in development without database.`);
        console.warn(`⚠️ API functionality will be limited.`);
        
        // In development, we'll continue without database for UI development
        if (error instanceof Error) {
          console.warn(`⚠️ MongoDB Error: ${error.message}`);
        }
        
        // Don't exit in development mode
        setDbConnectionStatus(false);
        return null;
      }
    } else {
      // In production, we require a working database
      const conn = await mongoose.connect(config.mongoUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      setDbConnectionStatus(true);
      return conn;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Unknown error occurred while connecting to MongoDB');
    }
    
    // Only exit in production mode
    if (config.env !== 'development') {
      process.exit(1);
    }
    setDbConnectionStatus(false);
    return null;
  }
};

export default connectDB; 