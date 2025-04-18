import express from 'express';
import * as authController from '../controllers/authController';
import * as spotifyAuthController from '../controllers/spotifyAuthController';
import { auth } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, authController.getCurrentUser);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, authController.updateProfile);

// @route   PUT /api/auth/password
// @desc    Change user password
// @access  Private
router.put('/password', auth, authController.changePassword);

// @route   GET /api/auth/spotify
// @desc    Initialize Spotify OAuth flow
// @access  Public
router.get('/spotify', spotifyAuthController.initiateSpotifyAuth);

// @route   GET /api/auth/spotify/callback
// @desc    Handle Spotify OAuth callback
// @access  Public
router.get('/spotify/callback', spotifyAuthController.spotifyCallback);

export default router; 