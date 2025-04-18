import express from 'express';
import * as playlistController from '../controllers/playlistController';
import { auth, optionalAuth } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/playlists
// @desc    Create a new playlist
// @access  Private
router.post('/', auth, playlistController.createPlaylist);

// @route   GET /api/playlists
// @desc    Get all playlists with optional filtering
// @access  Public (with optional auth for personalization)
router.get('/', optionalAuth, playlistController.getPlaylists);

// @route   GET /api/playlists/:id
// @desc    Get a single playlist by ID
// @access  Public (with optional auth to check if user owns private playlist)
router.get('/:id', optionalAuth, playlistController.getPlaylistById);

// @route   PUT /api/playlists/:id
// @desc    Update a playlist
// @access  Private (owner only)
router.put('/:id', auth, playlistController.updatePlaylist);

// @route   DELETE /api/playlists/:id
// @desc    Delete a playlist
// @access  Private (owner only)
router.delete('/:id', auth, playlistController.deletePlaylist);

// @route   POST /api/playlists/:id/like
// @desc    Like or unlike a playlist
// @access  Private
router.post('/:id/like', auth, playlistController.toggleLikePlaylist);

// @route   POST /api/playlists/:id/comments
// @desc    Add a comment to a playlist
// @access  Private
router.post('/:id/comments', auth, playlistController.addComment);

export default router; 