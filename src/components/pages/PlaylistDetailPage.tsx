import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import VoteButtons from '../ui/VoteButtons';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';

// Interface for Playlist
interface Playlist {
  id: string;
  title: string;
  description: string;
  creator: {
    id: string;
    username: string;
    avatar?: string;
  };
  coverImage: string;
  voteScore: number;
  spotifyId: string;
  comments: {
    id: string;
    user: {
      id: string;
      username: string;
      avatar?: string;
    };
    text: string;
    timestamp: string;
  }[];
}

// Interface for Similar Playlist
interface SimilarPlaylist {
  id: string;
  title: string;
  coverImage: string;
  creator: string;
}

const PlaylistDetailPage: React.FC = () => {
  const { id: playlistId } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [similarPlaylists, setSimilarPlaylists] = useState<SimilarPlaylist[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Fetch the playlist data based on the ID
  useEffect(() => {
    setLoading(true);
    setErrorMessage(null);
    
    // Fetch playlist
    fetch(`http://localhost:5001/api/playlists/${playlistId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch playlist data');
        }
        return response.json();
      })
      .then(data => {
        setPlaylist(data.playlist);
        
        // Fetch similar playlists after getting playlist data
        return fetch(`http://localhost:5001/api/playlists/${playlistId}/similar`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch similar playlists');
        }
        return response.json();
      })
      .then(data => {
        setSimilarPlaylists(data.similarPlaylists);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setErrorMessage(error.message);
        setLoading(false);
      });
  }, [playlistId]);

  // Handle upvote/downvote
  const handleVote = async (newScore: number, voteType: 'up' | 'down' | 'none') => {
    try {
      const response = await fetch(`http://localhost:5001/api/playlists/${playlistId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to vote on playlist');
      }
      
      const data = await response.json();
      
      // Update the local state with the new vote score
      if (playlist) {
        setPlaylist({
          ...playlist,
          voteScore: data.voteScore
        });
      }
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  // Comment handler function
  const handleCommentSubmit = async (text: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:5001/api/playlists/${playlistId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      
      const data = await response.json();
      
      // Add the new comment to the playlist comments
      if (playlist) {
        setPlaylist({
          ...playlist,
          comments: [...playlist.comments, data.comment],
        });
      }
    } catch (error) {
      console.error('Comment error:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Loading skeleton */}
          <div className="h-64 bg-gray-800 rounded-lg mb-8"></div>
          <div className="h-96 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-900/50 p-6 rounded-lg border border-red-800">
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-red-200">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-2">Playlist Not Found</h2>
          <p className="text-gray-400">The requested playlist could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Playlist Header */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <img
                  src={playlist.coverImage}
                  alt={playlist.title}
                  className="w-48 h-48 rounded-lg object-cover shadow-lg border border-gray-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Playlist';
                  }}
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold gradient-text">{playlist.title}</h1>
                <p className="mt-2 text-white">
                  by <a href={`/user/${playlist.creator.id}`} className="hover:text-blue-400 transition-colors duration-200">{playlist.creator.username}</a>
                </p>
                <p className="mt-4 text-white">{playlist.description}</p>
                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <a 
                    href={`https://open.spotify.com/playlist/${playlist.spotifyId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gradient-bg text-white px-4 py-2 rounded-md hover:opacity-90 btn-hover-scale btn-hover-glow flex items-center"
                  >
                    Open on Spotify
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
                  </a>
                  <VoteButtons 
                    initialScore={playlist.voteScore} 
                    onVote={handleVote}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Spotify Embed */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold gradient-text mb-4">Tracks</h2>
            <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800 p-1">
              <div className="relative pb-[56.25%] h-0 sm:pb-0 sm:h-[380px]">
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${playlist.spotifyId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg absolute top-0 left-0 w-full h-full sm:relative"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold gradient-text mb-4">Comments</h2>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
              <CommentList comments={playlist.comments} />
              <CommentForm 
                onSubmit={handleCommentSubmit} 
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800 sticky top-8">
            <h3 className="text-xl font-bold gradient-text mb-4">Similar Playlists</h3>
            <div className="space-y-4">
              {similarPlaylists.map((playlist) => (
                <a 
                  key={playlist.id} 
                  href={`/playlist/${playlist.id}`}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg transition-colors duration-200 group"
                >
                  <img 
                    src={playlist.coverImage} 
                    alt={playlist.title} 
                    className="w-12 h-12 rounded object-cover group-hover:shadow-glow-sm transition-all duration-300" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Playlist';
                    }}
                  />
                  <div>
                    <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors duration-200">{playlist.title}</h4>
                    <p className="text-gray-400 text-sm">by {playlist.creator}</p>
                  </div>
                </a>
              ))}
              {similarPlaylists.length === 0 && (
                <p className="text-gray-400 text-center py-4">No similar playlists found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetailPage; 