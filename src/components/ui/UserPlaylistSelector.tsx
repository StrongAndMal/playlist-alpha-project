import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';
import { getUserPlaylists } from '../../services/SpotifyService';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  owner: { display_name: string };
  tracks: { total: number };
}

interface UserPlaylistSelectorProps {
  onSelectPlaylist: (playlist: Playlist) => void;
}

const UserPlaylistSelector: React.FC<UserPlaylistSelectorProps> = ({ onSelectPlaylist }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getUserPlaylists();
        if (result && result.items) {
          setPlaylists(result.items);
          setFilteredPlaylists(result.items);
        } else {
          setError('Failed to load your playlists. Please try again.');
        }
      } catch (err) {
        setError('An error occurred. Please try again later.');
        console.error('Error fetching playlists:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlaylists(playlists);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = playlists.filter(
        playlist => playlist.name.toLowerCase().includes(term)
      );
      setFilteredPlaylists(filtered);
    }
  }, [searchTerm, playlists]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600 bg-opacity-10 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your playlists..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-700 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
      </div>

      {filteredPlaylists.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No playlists found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-2">
          {filteredPlaylists.map((playlist) => (
            <div 
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist)}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-colors duration-200 flex flex-col"
            >
              <div className="aspect-square w-full overflow-hidden">
                <img 
                  src={playlist.images[0]?.url || 'https://via.placeholder.com/300?text=Playlist'} 
                  alt={playlist.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Playlist';
                  }}
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
                <p className="text-sm text-gray-400 truncate">{playlist.tracks.total} tracks</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPlaylistSelector; 