import express from 'express';
import { getUserProfile, updateUserProfile, upload } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get user profile - public route
router.get('/profile/:username', getUserProfile);

// Get current user's profile - protected route
router.get('/profile', auth, (req, res) => {
  req.params.username = req.user.username;
  getUserProfile(req, res);
});

// Update user profile - protected route
router.put('/profile', auth, upload, updateUserProfile);

export default router; 