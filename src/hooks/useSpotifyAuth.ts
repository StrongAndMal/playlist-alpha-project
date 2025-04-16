import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface SpotifyAuthState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  error: string | null;
  accessToken: string | null;
  tokenExpiresAt: number | null;
}

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
const REDIRECT_URI = `${window.location.origin}/spotify-callback`;
const SCOPE = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
const TOKEN_STORAGE_KEY = 'spotify_token_data';

export const useSpotifyAuth = () => {
  const { user } = useAuth();
  const [authState, setAuthState] = useState<SpotifyAuthState>({
    isAuthenticated: false,
    isAuthenticating: false,
    error: null,
    accessToken: null,
    tokenExpiresAt: null,
  });

  // Load token from localStorage on mount
  useEffect(() => {
    const loadTokenFromStorage = () => {
      const storedTokenData = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedTokenData) {
        try {
          const parsedData = JSON.parse(storedTokenData);
          const now = Date.now();
          
          // Check if token is expired
          if (parsedData.expiresAt && parsedData.expiresAt > now) {
            setAuthState({
              isAuthenticated: true,
              isAuthenticating: false,
              error: null,
              accessToken: parsedData.accessToken,
              tokenExpiresAt: parsedData.expiresAt,
            });
          } else {
            // Token expired, remove from storage
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        } catch (error) {
          console.error('Error parsing stored token data:', error);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      }
    };

    loadTokenFromStorage();
  }, []);

  // Save token to localStorage when it changes
  useEffect(() => {
    if (authState.accessToken && authState.tokenExpiresAt) {
      localStorage.setItem(
        TOKEN_STORAGE_KEY,
        JSON.stringify({
          accessToken: authState.accessToken,
          expiresAt: authState.tokenExpiresAt,
        })
      );
    }
  }, [authState.accessToken, authState.tokenExpiresAt]);

  const initiateLogin = useCallback(() => {
    if (!SPOTIFY_CLIENT_ID) {
      setAuthState(prev => ({
        ...prev,
        error: 'Spotify client ID is not configured',
      }));
      return;
    }

    // Generate a random state value for security
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('spotify_auth_state', state);

    // Build the authorization URL
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const params = {
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      state,
      scope: SCOPE,
    };

    // Add parameters to the URL
    Object.entries(params).forEach(([key, value]) => {
      authUrl.searchParams.append(key, value);
    });

    // Redirect to Spotify authorization page
    window.location.href = authUrl.toString();
  }, []);

  const exchangeCodeForToken = useCallback(async (code: string) => {
    try {
      setAuthState(prev => ({ ...prev, isAuthenticating: true, error: null }));

      // Use the code parameter to log or for debugging purposes
      console.log('Exchanging authorization code for token:', code);

      // In a real app, this should be a server-side call to protect your client secret
      // Here we're simulating a successful response for demonstration purposes
      const fakeSuccessResponse = {
        access_token: 'mock_access_token_' + Math.random().toString(36).substring(2, 10),
        expires_in: 3600, // 1 hour in seconds
        token_type: 'Bearer',
      };

      // Calculate token expiration
      const expiresAt = Date.now() + fakeSuccessResponse.expires_in * 1000;

      setAuthState({
        isAuthenticated: true,
        isAuthenticating: false,
        error: null,
        accessToken: fakeSuccessResponse.access_token,
        tokenExpiresAt: expiresAt,
      });

      return {
        success: true,
        token: fakeSuccessResponse.access_token,
      };
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      setAuthState(prev => ({
        ...prev,
        isAuthenticating: false,
        error: 'Failed to authenticate with Spotify',
      }));
      return { success: false, error };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthState({
      isAuthenticated: false,
      isAuthenticating: false,
      error: null,
      accessToken: null,
      tokenExpiresAt: null,
    });
  }, []);

  return {
    ...authState,
    initiateLogin,
    exchangeCodeForToken,
    logout,
    isLoggedIn: Boolean(user) && authState.isAuthenticated,
  };
}; 