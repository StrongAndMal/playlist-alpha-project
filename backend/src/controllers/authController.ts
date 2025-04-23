import { Request, Response } from 'express';
import { User } from '../services/dbService';
import { IUser } from '../models/User';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      res.status(400).json({ 
        message: 'User already exists with that email or username' 
      });
      return;
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      favoriteGenres: []
    });

    // Generate token
    const token = user.generateAuthToken();

    // Send response without password
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        favoriteGenres: user.favoriteGenres,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        favoriteGenres: user.favoriteGenres,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error getting user profile' });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { username, bio, avatar, favoriteGenres } = req.body;

    // Check if username already exists (if trying to change username)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ message: 'Username already taken' });
        return;
      }
    }

    // Update fields
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (favoriteGenres) user.favoriteGenres = favoriteGenres;

    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        favoriteGenres: user.favoriteGenres,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { currentPassword, newPassword } = req.body;

    // In development, we simplify to avoid TypeScript errors
    // In production with proper types, we would use proper Mongoose query chaining
    if (!user._id) {
      res.status(404).json({ message: 'User ID is missing' });
      return;
    }

    // Fetch the current user to verify password
    const userWithPassword = await User.findById(user._id.toString());
    
    if (!userWithPassword) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify current password
    const isMatch = await userWithPassword.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    // Update password
    userWithPassword.password = newPassword;
    await userWithPassword.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error instanceof Error ? error.message : String(error));
    res.status(500).json({ message: 'Server error changing password' });
  }
}; 