import express from 'express';
import * as profileItemController from '../controllers/profileItemController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', profileItemController.getAllProfileItems); // Get all profile items (filterable)
router.get('/:id', profileItemController.getProfileItemById); // Get a specific profile item

// Admin-only routes - requires authentication and admin privileges
router.post('/', auth, profileItemController.createProfileItem); // Create new item
router.put('/:id', auth, profileItemController.updateProfileItem); // Update item
router.delete('/:id', auth, profileItemController.deleteProfileItem); // Delete item

export default router; 