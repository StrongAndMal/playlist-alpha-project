import { Request, Response } from 'express';
import User from '../models/User';
import Playlist from '../models/Playlist';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
}).fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 }
]);

// Helper function to delete an existing file if it exists
const deleteFileIfExists = (filePath: string) => {
  if (!filePath) return;
  
  // Only delete files from the uploads directory (security measure)
  if (!filePath.startsWith('/uploads/')) return;
  
  // Convert from URL path to actual file path
  const actualPath = path.join(__dirname, '..', filePath);
  
  // Check if file exists before trying to delete
  if (fs.existsSync(actualPath)) {
    try {
      fs.unlinkSync(actualPath);
      console.log(`Deleted file: ${actualPath}`);
    } catch (err) {
      console.error(`Error deleting file ${actualPath}:`, err);
    }
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    
    // Find user by username
    const user = await User.findOne({ username }).select('-password -email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's playlists
    const playlists = await Playlist.find({ 'creator._id': user._id })
      .sort({ createdAt: -1 });
    
    // Get user's favorite playlists
    const favorites = await Playlist.find({ 
      _id: { $in: user.favorites || [] } 
    }).sort({ createdAt: -1 });
    
    // Calculate stats for response
    const playlistCount = playlists.length;
    const votesReceived = playlists.reduce((sum, playlist) => sum + (playlist.voteCount || 0), 0);
    
    res.json({
      user: {
        ...user.toObject(),
        playlistCount,
        votesReceived
      },
      playlists,
      favorites
    });
    
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error fetching user profile. Please try again.' });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // Ensure authenticated user is updating their own profile
    const userId = req.user.id;
    
    // Find the user to get current profile data
    const currentUser = await User.findById(userId).select('-password');
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get form data
    const {
      displayName,
      bio,
      profilePictureUrl,
      bannerImageUrl,
      spotifyUrl,
      twitterUrl,
      instagramUrl,
      removeProfilePicture,
      removeBannerImage
    } = req.body;
    
    // Validate input
    if (!displayName || displayName.trim() === '') {
      return res.status(400).json({ message: 'Display name is required' });
    }
    
    if (bio && bio.length > 160) {
      return res.status(400).json({ message: 'Bio must be 160 characters or less' });
    }
    
    // Validate URLs if provided
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    if (spotifyUrl && !urlRegex.test(spotifyUrl)) {
      return res.status(400).json({ message: 'Please enter a valid Spotify URL' });
    }
    
    if (twitterUrl && !urlRegex.test(twitterUrl)) {
      return res.status(400).json({ message: 'Please enter a valid Twitter URL' });
    }
    
    if (instagramUrl && !urlRegex.test(instagramUrl)) {
      return res.status(400).json({ message: 'Please enter a valid Instagram URL' });
    }
    
    // Start building update object
    const updateData: any = {
      displayName: displayName.trim(),
      bio: bio || '',
      spotifyUrl: spotifyUrl || '',
      twitterUrl: twitterUrl || '',
      instagramUrl: instagramUrl || ''
    };
    
    // Handle removal of profile picture if requested
    if (removeProfilePicture === 'true') {
      if (currentUser.profilePicture) {
        deleteFileIfExists(currentUser.profilePicture);
      }
      updateData.profilePicture = '';
    }
    
    // Handle removal of banner image if requested
    if (removeBannerImage === 'true') {
      if (currentUser.bannerImage) {
        deleteFileIfExists(currentUser.bannerImage);
      }
      updateData.bannerImage = '';
    }
    
    // Handle file uploads if present
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.profilePicture) {
        // Delete old profile picture if exists
        if (currentUser.profilePicture) {
          deleteFileIfExists(currentUser.profilePicture);
        }
        updateData.profilePicture = `/uploads/${files.profilePicture[0].filename}`;
      } else if (profilePictureUrl && !removeProfilePicture) {
        updateData.profilePicture = profilePictureUrl;
      }
      
      if (files.bannerImage) {
        // Delete old banner image if exists
        if (currentUser.bannerImage) {
          deleteFileIfExists(currentUser.bannerImage);
        }
        updateData.bannerImage = `/uploads/${files.bannerImage[0].filename}`;
      } else if (bannerImageUrl && !removeBannerImage) {
        updateData.bannerImage = bannerImageUrl;
      }
    }
    
    console.log('Updating user profile with data:', updateData);
    
    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password -email');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get playlists for stats
    const playlists = await Playlist.find({ 'creator._id': userId });
    const playlistCount = playlists.length;
    const votesReceived = playlists.reduce((sum, playlist) => sum + (playlist.voteCount || 0), 0);
    
    // Return updated user data
    res.json({
      user: {
        ...updatedUser.toObject(),
        playlistCount,
        votesReceived
      },
      message: 'Profile updated successfully'
    });
    
  } catch (err: any) {
    console.error('Error updating profile:', err);
    const errorMessage = err.message || 'Server error updating profile';
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    });
  }
}; 