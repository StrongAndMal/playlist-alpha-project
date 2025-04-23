import React from 'react';
import { Link } from 'react-router-dom';
import { Playlist } from '../../types/user';
import { MusicalNoteIcon, HeartIcon } from '@heroicons/react/24/outline';

interface PlaylistGridProps {
  playlists: Playlist[];
  emptyMessage: string;
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists, emptyMessage }) => {
  if (playlists.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 bg-opacity-50 rounded-xl">
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {playlists.map((playlist) => (
        <Link
          key={playlist._id}
          to={`/playlist/${playlist._id}`}
          className="bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-900/30 group"
        >
          <div className="relative aspect-square">
            <img
              src={playlist.coverImage || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80'}
              alt={playlist.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
            
            {playlist.isPinned && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 m-2 rounded-md shadow-lg">
                Pinned
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white truncate">{playlist.title}</h3>
            <p className="text-sm text-blue-400">By @{playlist.creator.username}</p>
            
            <div className="mt-3 flex justify-between items-center text-sm">
              <div className="flex items-center px-2 py-1 rounded-md bg-gray-700 bg-opacity-50">
                <MusicalNoteIcon className="h-4 w-4 mr-1 text-green-400" />
                <span className="text-gray-300">{playlist.trackCount}</span>
              </div>
              <div className="flex items-center px-2 py-1 rounded-md bg-gray-700 bg-opacity-50">
                <HeartIcon className="h-4 w-4 mr-1 text-pink-500" />
                <span className="text-gray-300">{playlist.voteCount}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PlaylistGrid; 