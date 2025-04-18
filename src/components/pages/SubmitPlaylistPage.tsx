import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowSmallRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { 
  isValidSpotifyPlaylistUrl, 
  extractPlaylistId, 
  getPlaylistById,
  getAuthUrl,
  getUserProfile
} from '../../services/SpotifyService';

import TagInput from '../ui/TagInput';
import PlaylistPreviewCard from '../ui/PlaylistPreviewCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import FeedbackMessage from '../ui/FeedbackMessage';
import UserPlaylistSelector from '../ui/UserPlaylistSelector';

type SubmissionMethod = 'import' | 'manual' | null;
type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

interface PlaylistPreview {
  id: string;
  name: string;
  imageUrl: string;
  creator: string;
  trackCount: number;
}

const SubmitPlaylistPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [submissionMethod, setSubmissionMethod] = useState<SubmissionMethod>(null);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [playlistPreview, setPlaylistPreview] = useState<PlaylistPreview | null>(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  
  // Form submission state
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Check if user is authenticated with Spotify
  useEffect(() => {
    const checkAuth = async () => {
      const profile = await getUserProfile();
      setIsAuthenticated(!!profile);
    };
    
    checkAuth();
  }, []);

  // Validate URL and fetch playlist preview for manual method
  useEffect(() => {
    const fetchPlaylistPreview = async () => {
      if (!playlistUrl.trim() || !isValidSpotifyPlaylistUrl(playlistUrl)) {
        setPlaylistPreview(null);
        return;
      }

      setPreviewLoading(true);
      
      try {
        const playlistId = extractPlaylistId(playlistUrl);
        if (!playlistId) {
          throw new Error('Invalid playlist URL');
        }
        
        const playlistData = await getPlaylistById(playlistId);
        
        if (!playlistData) {
          throw new Error('Could not fetch playlist data');
        }
        
        setPlaylistPreview({
          id: playlistData.id,
          name: playlistData.name,
          imageUrl: playlistData.images[0]?.url || '',
          creator: playlistData.owner.display_name,
          trackCount: playlistData.tracks.total
        });
        
        setFeedback(null);
      } catch (error) {
        console.error('Error fetching playlist:', error);
        setPlaylistPreview(null);
        setFeedback({
          type: 'error',
          message: 'Failed to load playlist. Please check the URL and try again.'
        });
      } finally {
        setPreviewLoading(false);
      }
    };

    // Use a small delay before fetch to avoid spam during typing
    const debounce = setTimeout(() => {
      if (submissionMethod === 'manual' && playlistUrl) {
        fetchPlaylistPreview();
      }
    }, 800);

    return () => clearTimeout(debounce);
  }, [playlistUrl, submissionMethod]);

  const handleSelectPlaylist = (playlist: any) => {
    setPlaylistPreview({
      id: playlist.id,
      name: playlist.name,
      imageUrl: playlist.images[0]?.url || '',
      creator: playlist.owner.display_name,
      trackCount: playlist.tracks.total
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistUrl(e.target.value);
    if (!isValidSpotifyPlaylistUrl(e.target.value)) {
      setPlaylistPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playlistPreview) {
      setFeedback({
        type: 'error',
        message: 'Please select a valid playlist first.'
      });
      return;
    }
    
    setSubmissionStatus('loading');
    
    // In a real implementation, you would send this data to your backend
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Submitting playlist:', {
        playlistId: playlistPreview.id,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        submissionMethod
      });
      
      setSubmissionStatus('success');
      setFeedback({
        type: 'success',
        message: 'Playlist submitted successfully!'
      });
      
      // Reset form
      setTimeout(() => {
        setPlaylistUrl('');
        setTags('');
        setPlaylistPreview(null);
        setSubmissionMethod(null);
        setSubmissionStatus('idle');
        // In a real app, you might redirect to the playlist detail page here
        // navigate(`/playlist/${playlistId}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting playlist:', error);
      setSubmissionStatus('error');
      setFeedback({
        type: 'error',
        message: 'Failed to submit playlist. Please try again.'
      });
    }
  };

  const handleConnectSpotify = () => {
    window.location.href = getAuthUrl();
  };

  const renderMethodSelector = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Share Your Playlist</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Share playlists you've created or discovered. Choose an option below to get started.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => isAuthenticated ? setSubmissionMethod('import') : handleConnectSpotify()}
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg cursor-pointer transition-colors duration-200 border border-gray-700 hover:border-blue-500"
        >
          <div className="flex items-center justify-center h-16 w-16 bg-blue-600 bg-opacity-20 rounded-full text-blue-500 mb-4 mx-auto">
            <SparklesIcon className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-white text-center mb-2">Import from Spotify</h3>
          <p className="text-gray-400 text-center">
            Connect to your Spotify account and select from your personal playlists.
          </p>
        </div>
        
        <div
          onClick={() => setSubmissionMethod('manual')}
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg cursor-pointer transition-colors duration-200 border border-gray-700 hover:border-blue-500"
        >
          <div className="flex items-center justify-center h-16 w-16 bg-green-600 bg-opacity-20 rounded-full text-green-500 mb-4 mx-auto">
            <ArrowSmallRightIcon className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-white text-center mb-2">Submit URL Manually</h3>
          <p className="text-gray-400 text-center">
            Paste a Spotify playlist URL directly to submit.
          </p>
        </div>
      </div>
    </div>
  );

  const renderImportFlow = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Select a Playlist</h2>
        <button
          type="button"
          onClick={() => setSubmissionMethod(null)}
          className="text-sm text-gray-400 hover:text-white"
        >
          Back to Options
        </button>
      </div>
      
      {playlistPreview ? (
        <div className="space-y-6">
          <h3 className="text-lg text-white">Selected Playlist:</h3>
          <div className="max-w-sm">
            <PlaylistPreviewCard
              imageUrl={playlistPreview.imageUrl}
              title={playlistPreview.name}
              creator={playlistPreview.creator}
              trackCount={playlistPreview.trackCount}
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-white mb-2">
              Genre/Mood Tags
            </label>
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="pop, summer, workout, etc."
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setPlaylistPreview(null)}
              className="mr-4 px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700"
            >
              Change Playlist
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submissionStatus === 'loading'}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submissionStatus === 'loading' ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Submitting...</span>
                </>
              ) : 'Submit Playlist'}
            </button>
          </div>
        </div>
      ) : (
        <UserPlaylistSelector onSelectPlaylist={handleSelectPlaylist} />
      )}
    </div>
  );

  const renderManualLinkFlow = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Submit Playlist URL</h2>
        <button
          type="button"
          onClick={() => setSubmissionMethod(null)}
          className="text-sm text-gray-400 hover:text-white"
        >
          Back to Options
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="playlist-url" className="block text-sm font-medium text-white mb-1">
            Spotify Playlist URL
          </label>
          <input
            type="url"
            id="playlist-url"
            value={playlistUrl}
            onChange={handleUrlChange}
            placeholder="https://open.spotify.com/playlist/..."
            className="block w-full px-3 py-2 border border-gray-700 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Must be a public Spotify playlist URL
          </p>
        </div>
        
        {previewLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        )}
        
        {playlistPreview && !previewLoading && (
          <>
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Playlist Preview:</h3>
              <PlaylistPreviewCard
                imageUrl={playlistPreview.imageUrl}
                title={playlistPreview.name}
                creator={playlistPreview.creator}
                trackCount={playlistPreview.trackCount}
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-white mb-2">
                Genre/Mood Tags
              </label>
              <TagInput
                value={tags}
                onChange={setTags}
                placeholder="pop, summer, workout, etc."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submissionStatus === 'loading'}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submissionStatus === 'loading' ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : 'Submit Playlist'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8">
        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}
        
        {submissionMethod === null && renderMethodSelector()}
        {submissionMethod === 'import' && renderImportFlow()}
        {submissionMethod === 'manual' && renderManualLinkFlow()}
      </div>
    </div>
  );
};

export default SubmitPlaylistPage; 