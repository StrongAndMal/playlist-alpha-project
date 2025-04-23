import express from 'express';
import * as authController from '../controllers/authController';
import * as spotifyAuthController from '../controllers/spotifyAuthController';
import { auth } from '../middleware/auth';

const router = express.Router();

// NOTE: V1 uses Spotify OAuth only, no local email/password routes.

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, authController.getCurrentUser);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, authController.updateProfile);

// Spotify OAuth routes
router.get('/spotify', spotifyAuthController.initiateSpotifyAuth);
router.get('/spotify/callback', spotifyAuthController.spotifyCallback);

export default router; 