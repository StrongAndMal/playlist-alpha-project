// Spotify API endpoints
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_BASE_URL = 'https://api.spotify.com/v1';

// You'll need to replace these with your actual Spotify Developer credentials
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
const REDIRECT_URI = `${window.location.origin}/spotify-callback`; // This should match what you set in your Spotify Developer Dashboard
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'streaming'
].join('%20');

// Local storage keys
const TOKEN_KEY = 'spotify_access_token';
const REFRESH_TOKEN_KEY = 'spotify_refresh_token';
const TOKEN_EXPIRY_KEY = 'spotify_token_expiry';

/**
 * Generate the Spotify authorization URL
 */
export const getAuthUrl = (): string => {
  return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=code&show_dialog=true`;
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