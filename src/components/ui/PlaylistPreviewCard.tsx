import React from 'react';
import { MusicalNoteIcon, UserIcon } from '@heroicons/react/24/outline';

interface PlaylistPreviewCardProps {
  imageUrl: string;
  title: string;
  creator: string;
  trackCount: number;
  isLoading?: boolean;
}

const PlaylistPreviewCard: React.FC<PlaylistPreviewCardProps> = ({
  imageUrl,
  title,
  creator,
  trackCount,
  isLoading = false
}) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="bg-gray-700 h-48 w-full"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="aspect-square w-full overflow-hidden">
            <img 
              src={imageUrl || 'https://via.placeholder.com/300?text=Playlist'} 
              alt={title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Playlist';
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-white text-lg mb-1 truncate">{title}</h3>
            <div className="flex items-center text-gray-400 text-sm mb-2">
              <UserIcon className="h-4 w-4 mr-1" />
              <span className="truncate">{creator}</span>
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <MusicalNoteIcon className="h-4 w-4 mr-1" />
              <span>{trackCount} tracks</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlaylistPreviewCard; 