import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Playlist } from '../services/dbService';
import { IPlaylist } from '../models/Playlist';
import { IUser } from '../models/User';

// Helper function to safely get user ID
const getUserId = (user: any): mongoose.Types.ObjectId => {
  if (user && user._id) {
    // If it's already an ObjectId, return it
    if (user._id instanceof mongoose.Types.ObjectId) {
      return user._id;
    }
    // If it's a string, convert it to an ObjectId
    if (typeof user._id === 'string') {
      return new mongoose.Types.ObjectId(user._id);
    }
    // If it has a toString method, convert to string then to ObjectId
    if (user._id.toString) {
      return new mongoose.Types.ObjectId(user._id.toString());
    }
  }
  // Fallback for error cases
  throw new Error('Invalid user ID');
};

/**
 * @desc    Create a new playlist
 * @route   POST /api/playlists
 * @access  Private
 */
export const createPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { 
      title, 
      description, 
      genres, 
      tracks, 
      coverImage, 
      isPublic = true,
      spotifyPlaylistId
    } = req.body;

    // Validate required fields
    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
      res.status(400).json({ message: 'At least one track is required' });
      return;
    }

    // Create the playlist
    const playlist = await Playlist.create({
      title,
      description: description || '',
      creator: getUserId(user),
      genres: genres || [],
      tracks,
      coverImage: coverImage || '',
      isPublic,
      spotifyPlaylistId,
      likes: [],
      comments: []
    });

    res.status(201).json({ playlist });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ message: 'Server error creating playlist' });
  }
};

/**
 * @desc    Get all playlists (with filtering options)
 * @route   GET /api/playlists
 * @access  Public
 */
export const getPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      limit = 10, 
      page = 1, 
      genre, 
      creator,
      q: searchQuery 
    } = req.query;

    // Build filter
    const filter: any = { isPublic: true };
    
    if (genre) {
      filter.genres = genre;
    }

    if (creator) {
      filter.creator = creator;
    }

    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get playlists
    const playlists = await Playlist.find(filter)
      .populate('creator', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Playlist.countDocuments(filter);

    res.status(200).json({
      playlists,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ message: 'Server error getting playlists' });
  }
};

/**
 * @desc    Get a single playlist by ID
 * @route   GET /api/playlists/:id
 * @access  Public (for public playlists) / Private (for private playlists)
 */
export const getPlaylistById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Use .exec() to ensure we get a proper Promise
    const playlist = await Playlist.findById(req.params.id)
      .populate('creator', 'username avatar')
      .populate('comments.user', 'username avatar')
      .exec();

    if (!playlist) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    // Check if playlist is private and not the creator
    let userId = '';
    try {
      if (req.user) {
        userId = getUserId(req.user).toString();
      }
    } catch (e) {
      // If getting user ID fails, treat as not authenticated
    }
    
    const creatorId = playlist.creator._id ? playlist.creator._id.toString() : '';
    
    if (!playlist.isPublic && (!userId || creatorId !== userId)) {
      res.status(403).json({ message: 'Access denied to private playlist' });
      return;
    }

    res.status(200).json({ playlist });
  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({ message: 'Server error getting playlist' });
  }
};

/**
 * @desc    Update a playlist
 * @route   PUT /api/playlists/:id
 * @access  Private (creator only)
 */
export const updatePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const playlist = await Playlist.findById(req.params.id).exec();

    if (!playlist) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    // Check if user is the creator
    try {
      const userId = getUserId(user).toString();
      const creatorId = playlist.creator.toString();
      
      if (creatorId !== userId) {
        res.status(403).json({ message: 'Not authorized to update this playlist' });
        return;
      }
    } catch (e) {
      res.status(403).json({ message: 'Not authorized to update this playlist' });
      return;
    }

    const { title, description, genres, tracks, coverImage, isPublic } = req.body;

    // Update fields if provided
    if (title) playlist.title = title;
    if (description !== undefined) playlist.description = description;
    if (genres) playlist.genres = genres;
    if (tracks) playlist.tracks = tracks;
    if (coverImage) playlist.coverImage = coverImage;
    if (isPublic !== undefined) playlist.isPublic = isPublic;

    await playlist.save();

    res.status(200).json({ playlist });
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ message: 'Server error updating playlist' });
  }
};

/**
 * @desc    Delete a playlist
 * @route   DELETE /api/playlists/:id
 * @access  Private (creator only)
 */
export const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const playlist = await Playlist.findById(req.params.id).exec();

    if (!playlist) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    // Check if user is the creator
    try {
      const userId = getUserId(user).toString();
      const creatorId = playlist.creator.toString();
      
      if (creatorId !== userId) {
        res.status(403).json({ message: 'Not authorized to delete this playlist' });
        return;
      }
    } catch (e) {
      res.status(403).json({ message: 'Not authorized to delete this playlist' });
      return;
    }

    await playlist.deleteOne();

    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ message: 'Server error deleting playlist' });
  }
};

/**
 * @desc    Like or unlike a playlist
 * @route   POST /api/playlists/:id/like
 * @access  Private
 */
export const toggleLikePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const playlist = await Playlist.findById(req.params.id).exec();

    if (!playlist) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    try {
      const userId = getUserId(user).toString();

      // Check if playlist is already liked
      const isLiked = playlist.likes.some((like: any) => like.toString() === userId);

      if (isLiked) {
        // Unlike
        playlist.likes = playlist.likes.filter((like: any) => like.toString() !== userId);
      } else {
        // Like
        playlist.likes.push(new mongoose.Types.ObjectId(userId));
      }

      await playlist.save();

      res.status(200).json({ 
        liked: !isLiked,
        likeCount: playlist.likes.length
      });
    } catch (e) {
      res.status(400).json({ message: 'Invalid user ID' });
    }
  } catch (error) {
    console.error('Like playlist error:', error);
    res.status(500).json({ message: 'Server error liking playlist' });
  }
};

/**
 * @desc    Add a comment to a playlist
 * @route   POST /api/playlists/:id/comments
 * @access  Private
 */
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const playlist = await Playlist.findById(req.params.id).exec();

    if (!playlist) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    const { text } = req.body;

    if (!text) {
      res.status(400).json({ message: 'Comment text is required' });
      return;
    }

    try {
      const userId = getUserId(user);
      
      playlist.comments.push({
        user: userId,
        text,
        createdAt: new Date()
      });

      await playlist.save();

      // Return the newly added comment
      const newComment = playlist.comments[playlist.comments.length - 1];

      res.status(201).json({ comment: newComment });
    } catch (e) {
      res.status(400).json({ message: 'Invalid user ID' });
    }
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
}; 