import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth';

const LoginPage: React.FC = () => {
  const { initiateLogin } = useSpotifyAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Debug info for the client ID
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const displayableClientId = clientId ? 
    `${clientId.substring(0, 4)}...${clientId.substring(clientId.length - 4)}` : 
    'not found';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold gradient-text">
            Welcome to My Playlist Finder
          </h2>
          <p className="mt-2 text-sm text-white">
            Sign in with your Spotify account to discover and share playlists
          </p>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              if (!isLoading) {
                setIsLoading(true);
                initiateLogin();
              }
            }}
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-4 px-6 border border-gray-700 rounded-md shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 btn-hover-scale transition-all duration-200 ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <svg
              className="w-6 h-6 mr-3"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            {isLoading ? 'Redirecting...' : 'Continue with Spotify'}
          </button>
          {/* Debug info - remove in production */}
          <div className="mt-4 text-xs text-gray-500">
            Client ID: {displayableClientId}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 