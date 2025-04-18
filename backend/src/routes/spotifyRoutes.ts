import express from 'express';
import { importSpotifyProfile } from '../controllers/spotifyProfileController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Protected routes (require authentication)
router.get('/profile/import', auth, importSpotifyProfile);

export default router; 