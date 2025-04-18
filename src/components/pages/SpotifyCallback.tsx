import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth';
import { useAuth } from '../../context/AuthContext';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exchangeCodeForToken } = useSpotifyAuth();
  const { login } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Get the URL parameters
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const token = urlParams.get('token');
      const storedState = localStorage.getItem('spotify_auth_state');

      // Clean up the state from localStorage
      localStorage.removeItem('spotify_auth_state');

      // If we received a token directly (from backend redirect), store it and go to profile
      if (token) {
        localStorage.setItem('token', token);
        setStatus('success');
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
        return;
      }

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

      if (state && state !== storedState) {
        console.warn('State mismatch. Expected:', storedState, 'Received:', state);
        setStatus('error');
        setErrorMessage('State mismatch. Possible CSRF attack or session expired.');
        return;
      }

      try {
        // Exchange the code for an access token
        const result = await exchangeCodeForToken(code);
        
        if (result.success) {
          setStatus('success');
          
          // Try to auto-login with the token
          try {
            // For demo purposes, just logging in with placeholder credentials
            // In a real app, you'd verify the token with your backend
            await login('demo@example.com', 'password');
          } catch (loginErr) {
            console.error('Auto-login failed:', loginErr);
          }
          
          // Redirect back to the profile page after a brief delay
          setTimeout(() => {
            navigate('/profile');
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
  }, [exchangeCodeForToken, navigate, location.search, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-lg shadow-md text-white">
        <h1 className="text-2xl font-bold text-center">
          Spotify Authentication
        </h1>
        
        {status === 'processing' && (
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-300">Processing your authentication...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-900 bg-opacity-30 rounded-full">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-4 text-gray-300">
              Successfully authenticated with Spotify!
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Redirecting you to your profile...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-900 bg-opacity-30 rounded-full">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="mt-4 text-gray-300">
              {errorMessage || 'An error occurred during authentication.'}
            </p>
            <button
              className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700"
              onClick={() => navigate('/login')}
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyCallback; 