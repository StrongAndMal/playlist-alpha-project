import axios from 'axios';
import querystring from 'querystring';
import config from '../config';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  preview_url: string | null;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  tracks: {
    items: Array<{ track: SpotifyTrack }>;
    total: number;
  };
}

class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = config.spotify.clientId as string;
    this.clientSecret = config.spotify.clientSecret as string;
    this.redirectUri = config.spotify.redirectUri as string;
  }

  /**
   * Generate authorization URL for OAuth flow
   */
  getAuthorizationUrl(state: string): string {
    const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
    
    return 'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: this.clientId,
        scope,
        redirect_uri: this.redirectUri,
        state
      });
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code: string): Promise<SpotifyTokenResponse> {
    const authString = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        querystring.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUri
        }),
        {
          headers: {
            Authorization: `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw new Error('Failed to get Spotify access token');
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<Omit<SpotifyTokenResponse, 'refresh_token'>> {
    const authString = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        querystring.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }),
        {
          headers: {
            Authorization: `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error refreshing Spotify access token:', error);
      throw new Error('Failed to refresh Spotify access token');
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting Spotify user profile:', error);
      throw new Error('Failed to get Spotify user profile');
    }
  }

  /**
   * Get user's playlists
   */
  async getUserPlaylists(accessToken: string, limit = 20, offset = 0): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting Spotify playlists:', error);
      throw new Error('Failed to get Spotify playlists');
    }
  }

  /**
   * Get a specific playlist with tracks
   */
  async getPlaylist(accessToken: string, playlistId: string): Promise<SpotifyPlaylist> {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      return response.data;
    } catch (error) {
      console.error(`Error getting Spotify playlist ${playlistId}:`, error);
      throw new Error('Failed to get Spotify playlist');
    }
  }

  /**
   * Search Spotify
   */
  async search(accessToken: string, query: string, type = 'track,playlist', limit = 20): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      return response.data;
    } catch (error) {
      console.error('Error searching Spotify:', error);
      throw new Error('Failed to search Spotify');
    }
  }
}

export default new SpotifyService(); 