import express from 'express';
import * as profileController from '../controllers/profileController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/:username', profileController.getUserProfile);
router.get('/:username/followers', profileController.getFollowers);
router.get('/:username/following', profileController.getFollowing);

// Private routes (require authentication)
router.put('/', auth, profileController.updateProfile);
router.post('/:username/follow', auth, profileController.toggleFollow);
router.post('/:username/badges', auth, profileController.awardBadge);
router.post('/:username/awards', auth, profileController.giveAward);
router.put('/showcase', auth, profileController.updateShowcase);
router.put('/frame', auth, profileController.updateAvatarFrame);

export default router; 