import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database';
import config from './config';

// Import routes
import authRoutes from './routes/authRoutes';
import playlistRoutes from './routes/playlistRoutes';
import profileRoutes from './routes/profileRoutes';

// Load environment variables
dotenv.config();

// Initialize Express
const app: Express = express();

// Connect to MongoDB
const dbConnection = connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logger
app.use(morgan('dev'));

// Development mode without database
let isDbConnected = true;

dbConnection.then(conn => {
  isDbConnected = !!conn;
  
  if (!isDbConnected && config.env === 'development') {
    console.warn('⚠️ Running with limited functionality due to missing database connection');
  }
}).catch(() => {
  isDbConnected = false;
  if (config.env === 'development') {
    console.warn('⚠️ Running with limited functionality due to missing database connection');
  }
});

// Development-only middleware to check database status
if (config.env === 'development') {
  app.use((req: Request, res: Response, next: NextFunction): void => {
    // Skip the health check endpoint
    if (req.path === '/api/health') {
      next();
      return;
    }
    
    if (!isDbConnected && req.method !== 'GET') {
      res.status(503).json({
        message: 'Database connection is not available',
        details: 'In development mode, only GET requests are simulated without database'
      });
      return;
    }
    next();
  });
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/profiles', profileRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Server is running',
    version: '1.0.0',
    environment: config.env,
    database: isDbConnected ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
}); 