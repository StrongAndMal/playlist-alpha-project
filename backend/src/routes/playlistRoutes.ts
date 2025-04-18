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

// @route   GET /api/playlists/featured
// @desc    Get featured playlists for homepage
// @access  Public
router.get('/featured', playlistController.getFeaturedPlaylists);

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

// @route   POST /api/playlists/:id/vote
// @desc    Vote on a playlist (upvote, downvote, or remove vote)
// @access  Private
router.post('/:id/vote', auth, playlistController.votePlaylist);

// @route   POST /api/playlists/:id/comments
// @desc    Add a comment to a playlist
// @access  Private
router.post('/:id/comments', auth, playlistController.addComment);

// @route   GET /api/playlists/:id/similar
// @desc    Get similar playlists based on genre
// @access  Public
router.get('/:id/similar', playlistController.getSimilarPlaylists);

export default router; 