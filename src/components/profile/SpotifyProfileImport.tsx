import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { importSpotifyProfile } from '../../services/SpotifyService';
import { SparklesIcon, ArrowPathIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface SpotifyProfileImportProps {
  onSuccess?: (profileData: any) => void;
  onError?: (error: string) => void;
}

const SpotifyProfileImport: React.FC<SpotifyProfileImportProps> = ({ onSuccess, onError }) => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState<any>(null);

  const handleImportProfile = async () => {
    setIsLoading(true);
    setStatus('loading');
    setMessage('');

    try {
      const response = await importSpotifyProfile();
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to import Spotify profile');
      }
      
      setProfileData(response.user);
      setStatus('success');
      setMessage('Spotify profile imported successfully!');
      
      // Update the user in context if needed
      if (updateProfile && response.user) {
        await updateProfile({
          username: response.user.username,
          avatar: response.user.avatar,
          spotifyId: response.user.spotifyId
        });
      }
      
      if (onSuccess) {
        onSuccess(response.user);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import Spotify profile';
      setStatus('error');
      setMessage(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <SparklesIcon className="h-8 w-8 text-green-500 mr-3" />
        <h2 className="text-xl font-bold text-white">Import Spotify Profile</h2>
      </div>
      
      <p className="text-gray-300 mb-6">
        Import your Spotify profile information to sync your account details, display name, and profile picture.
      </p>
      
      {status === 'success' && (
        <div className="mb-6 bg-green-900 bg-opacity-30 border border-green-500 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-green-400 font-medium">Profile Imported Successfully</h3>
              <p className="text-gray-300 text-sm mt-1">{message}</p>
              
              {profileData?.spotifyProfile && (
                <div className="mt-3 bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="text-sm text-gray-300">
                    <p><span className="text-gray-400">Display Name:</span> {profileData.spotifyProfile.displayName}</p>
                    {profileData.spotifyProfile.email && (
                      <p><span className="text-gray-400">Email:</span> {profileData.spotifyProfile.email}</p>
                    )}
                    {profileData.spotifyProfile.country && (
                      <p><span className="text-gray-400">Country:</span> {profileData.spotifyProfile.country}</p>
                    )}
                    {profileData.spotifyProfile.followers !== undefined && (
                      <p><span className="text-gray-400">Followers:</span> {profileData.spotifyProfile.followers}</p>
                    )}
                    <p>
                      <span className="text-gray-400">Account Type:</span> {profileData.spotifyProfile.product === 'premium' ? 'Premium' : 'Free'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="mb-6 bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-red-400 font-medium">Error Importing Profile</h3>
              <p className="text-gray-300 text-sm mt-1">{message}</p>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleImportProfile}
        disabled={isLoading}
        className={`w-full flex items-center justify-center py-3 px-4 rounded-md font-medium transition
          ${isLoading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
      >
        {isLoading ? (
          <>
            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <SparklesIcon className="h-5 w-5 mr-2" />
            {status === 'success' ? 'Reimport Profile' : 'Import My Spotify Profile'}
          </>
        )}
      </button>
      
      {!user?.spotifyId && (
        <p className="text-gray-400 text-sm mt-4">
          Note: You'll need to connect your Spotify account first if you haven't already.
        </p>
      )}
    </div>
  );
};

export default SpotifyProfileImport; 