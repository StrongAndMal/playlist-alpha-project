import { Request, Response } from 'express';
import axios from 'axios';
import { User } from '../services/dbService';
import { IUser } from '../models/User';

interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  images?: Array<{ url: string }>;
  country?: string;
  product?: string;
  external_urls: {
    spotify: string;
  };
  followers?: {
    total: number;
  };
}

/**
 * @desc    Import user's Spotify profile data
 * @route   GET /api/spotify/profile/import
 * @access  Private
 */
export const importSpotifyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    
    // Check if user has Spotify tokens
    if (!user.spotifyAccessToken) {
      res.status(400).json({ message: 'No Spotify account connected' });
      return;
    }
    
    // Fetch profile from Spotify API
    const spotifyProfile = await fetchSpotifyUserProfile(user.spotifyAccessToken);
    
    if (!spotifyProfile) {
      res.status(500).json({ message: 'Failed to fetch Spotify profile' });
      return;
    }
    
    // Update user with Spotify profile data
    user.spotifyId = spotifyProfile.id;
    
    // Only update username if it's a generic one
    if (user.username.startsWith('user_') || user.username.includes('spotify_user_')) {
      const displayName = spotifyProfile.display_name;
      if (displayName) {
        // Check if username exists
        const usernameExists = await User.findOne({ username: displayName });
        if (!usernameExists) {
          user.username = displayName;
        }
      }
    }
    
    // Update avatar if available and user doesn't have one
    if ((!user.avatar || user.avatar === '') && spotifyProfile.images && spotifyProfile.images.length > 0) {
      user.avatar = spotifyProfile.images[0].url;
    }
    
    // Save updated user
    await user.save();
    
    // Send back success response with user profile data
    res.status(200).json({
      success: true,
      message: 'Spotify profile imported successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        spotifyId: user.spotifyId,
        spotifyProfile: {
          displayName: spotifyProfile.display_name,
          email: spotifyProfile.email,
          country: spotifyProfile.country,
          product: spotifyProfile.product,
          spotifyUrl: spotifyProfile.external_urls.spotify,
          followers: spotifyProfile.followers?.total || 0
        }
      }
    });
  } catch (error) {
    console.error('Import Spotify profile error:', error);
    res.status(500).json({ message: 'Server error importing Spotify profile' });
  }
};

/**
 * Fetch user profile from Spotify API
 */
async function fetchSpotifyUserProfile(accessToken: string): Promise<SpotifyUserProfile | null> {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Profile fetch error:', error instanceof Error ? error.message : String(error));
    if (axios.isAxiosError(error) && error.response) {
      console.error('Spotify API response:', error.response.data);
    }
    return null;
  }
} 