import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { User } from '../services/dbService';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret as any) as { id: string };
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ message: 'User not found, authorization denied' });
      return;
    }
    
    // Set user and token on request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Optional auth middleware that continues if no token is present
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token, continue without setting user
      next();
      return;
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret as any) as { id: string };
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (user) {
      // Set user and token on request
      req.user = user;
      req.token = token;
    }
    
    next();
  } catch (error) {
    // Token invalid, continue without setting user
    next();
  }
}; 