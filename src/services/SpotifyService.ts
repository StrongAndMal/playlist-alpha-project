// Spotify API endpoints
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_BASE_URL = 'https://api.spotify.com/v1';

// Get client ID from environment variable
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
console.log('SpotifyService - Client ID:', CLIENT_ID);
console.log('SpotifyService - All env vars:', import.meta.env);

// Always use the configured redirect URI from environment
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
if (!REDIRECT_URI) {
  console.error('VITE_REDIRECT_URI is not configured in environment variables');
}
console.log('SpotifyService - Redirect URI:', REDIRECT_URI);

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-private',
  'playlist-read-collaborative',
  'streaming'
].join(' ');

// Local storage keys
const TOKEN_KEY = 'spotify_access_token';
const REFRESH_TOKEN_KEY = 'spotify_refresh_token';
const TOKEN_EXPIRY_KEY = 'spotify_token_expiry';

/**
 * Generate the Spotify authorization URL
 */
export const getAuthUrl = (): string => {
  const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&response_type=code&show_dialog=true`;
  console.log('SpotifyService - Full auth URL:', authUrl);
  return authUrl;
};

/**
 * Exchange authorization code for access token
 */
export const exchangeCodeForToken = async (code: string): Promise<boolean> => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('client_id', CLIENT_ID);
    // Note: In a production environment, client_secret should be kept secure and not exposed in client-side code
    // This would normally be handled by your backend

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    saveTokenData(data);
    return true;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return false;
  }
};

/**
 * Save token data to local storage
 */
const saveTokenData = (data: any): void => {
  const expiresIn = data.expires_in * 1000; // Convert to milliseconds
  const expiryTime = new Date().getTime() + expiresIn;

  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

  if (data.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  }
};

/**
 * Get the current access token, refreshing if necessary
 */
export const getAccessToken = async (): Promise<string | null> => {
  const accessToken = localStorage.getItem(TOKEN_KEY);
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!accessToken || !expiryTime) {
    return null;
  }

  // Check if token is expired
  const isExpired = new Date().getTime() > parseInt(expiryTime);

  // If token is expired and we have a refresh token, try to refresh
  if (isExpired && refreshToken) {
    const success = await refreshAccessToken(refreshToken);
    if (success) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  return accessToken;
};

/**
 * Refresh the access token using the refresh token
 */
const refreshAccessToken = async (refreshToken: string): Promise<boolean> => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    params.append('client_id', CLIENT_ID);

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    saveTokenData(data);
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearTokenData();
    return false;
  }
};

/**
 * Clear all token data from local storage
 */
export const clearTokenData = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Get a user's profile information
 */
export const getUserProfile = async (): Promise<any | null> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Get a track preview URL
 */
export const getTrackPreview = async (trackId: string): Promise<string | null> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch track');
    }

    const data = await response.json();
    return data.preview_url;
  } catch (error) {
    console.error('Error fetching track preview:', error);
    return null;
  }
};

/**
 * Get a user's playlists
 */
export const getUserPlaylists = async (limit = 50, offset = 0): Promise<any | null> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/me/playlists?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user playlists');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    return null;
  }
};

/**
 * Get a specific playlist by ID
 */
export const getPlaylistById = async (playlistId: string): Promise<any | null> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return null;
  }
};

/**
 * Extract playlist ID from Spotify URL
 */
export const extractPlaylistId = (url: string): string | null => {
  // Standard format: https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd?si=...
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};

/**
 * Check if a string is a valid Spotify playlist URL
 */
export const isValidSpotifyPlaylistUrl = (url: string): boolean => {
  const regex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+(\?.*)?$/;
  return regex.test(url);
};

/**
 * Import user's Spotify profile data to the application
 */
export const importSpotifyProfile = async (): Promise<any | null> => {
  const API_URL = import.meta.env.VITE_API_URL || '';
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/api/spotify/profile/import`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to import Spotify profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error importing Spotify profile:', error);
    return null;
  }
}; 