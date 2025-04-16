import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const { exchangeCodeForToken } = useSpotifyAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Get the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const storedState = localStorage.getItem('spotify_auth_state');

      // Clean up the state from localStorage
      localStorage.removeItem('spotify_auth_state');

      // Handle errors or state mismatch
      if (error) {
        setStatus('error');
        setErrorMessage(`Spotify authentication error: ${error}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMessage('No authorization code found in the URL');
        return;
      }

      if (state !== storedState) {
        setStatus('error');
        setErrorMessage('State mismatch. Possible CSRF attack.');
        return;
      }

      try {
        // Exchange the code for an access token
        const result = await exchangeCodeForToken(code);
        
        if (result.success) {
          setStatus('success');
          // Redirect back to the home page after a brief delay
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setStatus('error');
          setErrorMessage('Failed to authenticate with Spotify');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage('An unexpected error occurred during authentication');
        console.error('Authentication error:', err);
      }
    };

    handleCallback();
  }, [exchangeCodeForToken, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Spotify Authentication
        </h1>
        
        {status === 'processing' && (
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Processing your authentication...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-4 text-gray-600">
              Successfully authenticated with Spotify!
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Redirecting you back to the app...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="mt-4 text-gray-600">
              {errorMessage || 'An error occurred during authentication.'}
            </p>
            <button
              className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
              onClick={() => navigate('/')}
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyCallback; 