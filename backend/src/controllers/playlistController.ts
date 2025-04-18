import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Playlist } from '../services/dbService';
import { IPlaylist } from '../models/Playlist';
import { IUser } from '../models/User';
import { ICommentResponse, IVoteStatus, IComment } from '../types/Comment';
import { 
  IPlaylistResponse, 
  ISimilarPlaylistResponse, 
  IFeaturedPlaylistResponse 
} from '../types/Playlist';

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
    let userVote: 'up' | 'down' | 'none' = 'none';
    
    try {
      if (req.user) {
        userId = getUserId(req.user).toString();
        
        // Check user's vote status
        const hasUpvoted = playlist.upvotes.some((id: any) => id.toString() === userId);
        const hasDownvoted = playlist.downvotes.some((id: any) => id.toString() === userId);
        
        if (hasUpvoted) {
          userVote = 'up';
        } else if (hasDownvoted) {
          userVote = 'down';
        }
      }
    } catch (e) {
      // If getting user ID fails, treat as not authenticated
    }
    
    const creatorId = playlist.creator._id ? playlist.creator._id.toString() : '';
    
    if (!playlist.isPublic && (!userId || creatorId !== userId)) {
      res.status(403).json({ message: 'Access denied to private playlist' });
      return;
    }

    // Format the playlist for the frontend
    const formattedPlaylist: IPlaylistResponse = {
      id: playlist._id.toString(),
      title: playlist.title,
      description: playlist.description,
      creator: {
        id: playlist.creator._id.toString(),
        username: playlist.creator.username,
        avatar: playlist.creator.avatar
      },
      coverImage: playlist.coverImage,
      voteScore: playlist.upvotes.length - playlist.downvotes.length,
      userVote,
      spotifyId: playlist.spotifyPlaylistId,
      genres: playlist.genres,
      tracks: playlist.tracks,
      isPublic: playlist.isPublic,
      createdAt: playlist.createdAt,
      comments: playlist.comments.map((comment: IComment) => ({
        id: comment._id.toString(),
        user: {
          id: comment.user._id.toString(),
          username: comment.user.username,
          avatar: comment.user.avatar
        },
        text: comment.text,
        timestamp: comment.createdAt
      })),
      commentCount: playlist.comments.length,
      trackCount: playlist.tracks.length
    };

    res.status(200).json({ playlist: formattedPlaylist });
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
 * @desc    Vote on a playlist (upvote or downvote)
 * @route   POST /api/playlists/:id/vote
 * @access  Private
 */
export const votePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const playlist = await Playlist.findById(req.params.id).exec();
    const { voteType } = req.body; // 'up', 'down', or 'none'

    if (!playlist) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    if (!['up', 'down', 'none'].includes(voteType)) {
      res.status(400).json({ message: 'Invalid vote type. Must be "up", "down", or "none"' });
      return;
    }

    try {
      const userId = getUserId(user);
      const userIdStr = userId.toString();

      // Check current vote status
      const hasUpvoted = playlist.upvotes.some((id: any) => id.toString() === userIdStr);
      const hasDownvoted = playlist.downvotes.some((id: any) => id.toString() === userIdStr);

      // Remove any existing votes
      playlist.upvotes = playlist.upvotes.filter((id: any) => id.toString() !== userIdStr);
      playlist.downvotes = playlist.downvotes.filter((id: any) => id.toString() !== userIdStr);

      // Add new vote if not 'none'
      if (voteType === 'up') {
        playlist.upvotes.push(userId);
      } else if (voteType === 'down') {
        playlist.downvotes.push(userId);
      }

      await playlist.save();

      // Calculate new vote score
      const voteScore = playlist.upvotes.length - playlist.downvotes.length;

      const response: IVoteStatus = {
        voteType: voteType as 'up' | 'down' | 'none',
        voteScore,
        upvoteCount: playlist.upvotes.length,
        downvoteCount: playlist.downvotes.length
      };

      res.status(200).json(response);
    } catch (e) {
      res.status(400).json({ message: 'Invalid user ID' });
    }
  } catch (error) {
    console.error('Vote playlist error:', error);
    res.status(500).json({ message: 'Server error voting on playlist' });
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

/**
 * @desc    Get similar playlists based on genre
 * @route   GET /api/playlists/:id/similar
 * @access  Public
 */
export const getSimilarPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlist = await Playlist.findById(req.params.id).exec();

    if (!playlist) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    // Get playlists with matching genres, excluding the current playlist
    // Limit to 5 results for sidebar display
    const similarPlaylists = await Playlist.find({
      _id: { $ne: playlist._id },
      isPublic: true,
      genres: { $in: playlist.genres }
    })
      .populate('creator', 'username avatar')
      .limit(5)
      .exec();

    // Map to a simpler representation for the frontend
    const mappedPlaylists: ISimilarPlaylistResponse[] = similarPlaylists.map(p => ({
      id: p._id.toString(),
      title: p.title,
      coverImage: p.coverImage,
      creator: p.creator.username
    }));

    res.status(200).json({ similarPlaylists: mappedPlaylists });
  } catch (error) {
    console.error('Get similar playlists error:', error);
    res.status(500).json({ message: 'Server error getting similar playlists' });
  }
};

/**
 * @desc    Get featured/recommended playlists for homepage
 * @route   GET /api/playlists/featured
 * @access  Public
 */
export const getFeaturedPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 6 } = req.query;
    const limitNum = parseInt(limit as string, 10);

    // Get playlists sorted by vote score and limit to requested number
    const featuredPlaylists = await Playlist.find({ isPublic: true })
      .populate('creator', 'username avatar')
      .sort({ upvotes: -1 }) // Most upvoted first
      .limit(limitNum)
      .exec();

    // Format for frontend
    const mappedPlaylists: IFeaturedPlaylistResponse[] = featuredPlaylists.map(playlist => ({
      id: playlist._id.toString(),
      title: playlist.title,
      description: playlist.description.substring(0, 100) + (playlist.description.length > 100 ? '...' : ''),
      creator: {
        id: playlist.creator._id.toString(),
        username: playlist.creator.username,
        avatar: playlist.creator.avatar
      },
      coverImage: playlist.coverImage,
      voteScore: playlist.upvotes.length - playlist.downvotes.length,
      trackCount: playlist.tracks.length,
      commentCount: playlist.comments.length
    }));

    res.status(200).json({ 
      playlists: mappedPlaylists
    });
  } catch (error) {
    console.error('Get featured playlists error:', error);
    res.status(500).json({ message: 'Server error getting featured playlists' });
  }
}; 