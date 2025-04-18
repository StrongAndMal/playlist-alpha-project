import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { User } from '../services/dbService';
import config from '../config';

// Load environment variables
dotenv.config();

// Define TypeScript interfaces for API responses
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

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
}

/**
 * @desc    Initiate Spotify OAuth flow
 * @route   GET /api/auth/spotify
 * @access  Public
 */
export const initiateSpotifyAuth = (req: Request, res: Response): void => {
  try {
    // Generate a random state value for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    
    // In a production app, store this state in a session or cookie
    // req.session.spotifyAuthState = state;
    
    // Define the scopes needed for your application
    const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
    
    // Build the authorization URL
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', process.env.SPOTIFY_CLIENT_ID as string);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI as string);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', scope);
    
    // Redirect the user to Spotify's authorization page
    res.redirect(authUrl.toString());
  } catch (error) {
    console.error('Error initiating Spotify auth:', error);
    res.status(500).redirect('/login?error=auth_initialization_failed');
  }
};

/**
 * @desc    Handle Spotify OAuth callback
 * @route   GET /api/auth/spotify/callback
 * @access  Public
 */
export const spotifyCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract code and state from query parameters
    const { code, state } = req.query;
    
    // Verify state parameter (anti-CSRF)
    // In a production app, you would compare this with a state stored in session/cookie
    if (!state) {
      res.status(400).redirect(`${config.frontendUrl}/login?error=invalid_state`);
      return;
    }
    
    // If no code was received, redirect with error
    if (!code) {
      res.status(400).redirect(`${config.frontendUrl}/login?error=no_code`);
      return;
    }

    // Exchange authorization code for access and refresh tokens
    const tokenResponse = await exchangeCodeForTokens(code as string);
    
    if (!tokenResponse) {
      res.status(500).redirect(`${config.frontendUrl}/login?error=token_exchange_failed`);
      return;
    }
    
    // Fetch user profile from Spotify API
    const spotifyProfile = await fetchSpotifyUserProfile(tokenResponse.access_token);
    
    if (!spotifyProfile) {
      res.status(500).redirect(`${config.frontendUrl}/login?error=profile_fetch_failed`);
      return;
    }

    // Find or create user in database
    const user = await findOrCreateUser(spotifyProfile, tokenResponse);

    // Generate JWT token
    const token = user.generateAuthToken();

    // Redirect to frontend with token
    // This implementation uses URL parameters - in production, consider using secure HTTP-only cookies
    res.redirect(`${config.frontendUrl}/spotify-auth-success?token=${token}`);
    
  } catch (error) {
    console.error('Spotify callback error:', error);
    res.status(500).redirect(`${config.frontendUrl}/login?error=server_error`);
  }
};

/**
 * Exchange authorization code for access and refresh tokens
 */
async function exchangeCodeForTokens(code: string): Promise<SpotifyTokenResponse | null> {
  try {
    // Create authorization header using client ID and secret
    const authHeader = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    // Create request body
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI as string
    });

    // Make request to Spotify API
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      params.toString(), 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Token exchange error:', error instanceof Error ? error.message : String(error));
    if (axios.isAxiosError(error) && error.response) {
      console.error('Spotify API response:', error.response.data);
    }
    return null;
  }
}

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

/**
 * Find or create user in database
 */
async function findOrCreateUser(
  spotifyProfile: SpotifyUserProfile, 
  tokenData: SpotifyTokenResponse
): Promise<any> {
  try {
    // Calculate token expiry date
    const tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    
    // Try to find user by Spotify ID
    let user = await User.findOne({ spotifyId: spotifyProfile.id });
    
    if (user) {
      // Update existing user
      user.spotifyAccessToken = tokenData.access_token;
      user.spotifyRefreshToken = tokenData.refresh_token;
      
      // Only update profile info if available
      if (spotifyProfile.display_name) {
        // Only update username if it doesn't exist or is a generated one
        if (!user.username || user.username.startsWith('spotify_user_')) {
          // Check if username is taken
          const existingUser = await User.findOne({ username: spotifyProfile.display_name });
          if (!existingUser) {
            user.username = spotifyProfile.display_name;
          }
        }
      }
      
      // Update avatar if none exists
      if (!user.avatar && spotifyProfile.images && spotifyProfile.images.length > 0) {
        user.avatar = spotifyProfile.images[0].url;
      }
      
      // Update email if provided and not already set
      if (spotifyProfile.email && !user.email) {
        user.email = spotifyProfile.email;
      }
      
      await user.save();
    } else {
      // Create new user
      // Generate a unique username if display_name is not available
      const username = spotifyProfile.display_name || `spotify_user_${spotifyProfile.id.substring(0, 8)}`;
      
      // Check if username exists
      const usernameExists = await User.findOne({ username });
      const finalUsername = usernameExists ? `${username}_${Date.now().toString().substring(8, 13)}` : username;
      
      // Create a random password for Spotify users (they'll login via OAuth)
      const randomPassword = Math.random().toString(36).slice(-10);
      
      user = await User.create({
        username: finalUsername,
        email: spotifyProfile.email || `spotify_${spotifyProfile.id}@placeholder.com`,
        password: randomPassword, // This will be hashed by the pre-save hook
        avatar: spotifyProfile.images && spotifyProfile.images.length > 0 ? spotifyProfile.images[0].url : '',
        spotifyId: spotifyProfile.id,
        spotifyAccessToken: tokenData.access_token,
        spotifyRefreshToken: tokenData.refresh_token,
        favoriteGenres: []
      });
    }
    
    return user;
  } catch (error) {
    console.error('Database error:', error instanceof Error ? error.message : String(error));
    throw error;
  }
} 