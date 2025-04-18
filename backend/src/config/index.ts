import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: isProduction ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: isProduction 
      ? process.env.SPOTIFY_REDIRECT_URI_PROD 
      : process.env.SPOTIFY_REDIRECT_URI
  },
  frontendUrl: isProduction
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL,
  logLevel: process.env.LOG_LEVEL || 'info'
};

export default config; 