import React from 'react';
import { MusicalNoteIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  timestamp: string;
  sourceType: 'spotify' | 'apple' | 'local';
}

interface RecentActivityProps {
  tracks: Track[];
  isLoading?: boolean;
  showTitle?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  tracks, 
  isLoading = false,
  showTitle = true
}) => {
  if (isLoading) {
    return (
      <div className="bg-gray-900 shadow rounded-lg border border-gray-800 overflow-hidden">
        {showTitle && (
          <div className="px-4 py-3 border-b border-gray-800">
            <h3 className="text-lg font-semibold gradient-text">Recent Activity</h3>
          </div>
        )}
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="bg-gray-700 h-12 w-12 rounded-md"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="bg-gray-900 shadow rounded-lg border border-gray-800 overflow-hidden">
        {showTitle && (
          <div className="px-4 py-3 border-b border-gray-800">
            <h3 className="text-lg font-semibold gradient-text">Recent Activity</h3>
          </div>
        )}
        <div className="p-6 text-center">
          <MusicalNoteIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No recent activity to show</p>
          <p className="text-sm text-gray-500 mt-1">Start listening to see your activity</p>
        </div>
      </div>
    );
  }

  // Helper function to format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `${mins}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  // Source icon component
  const SourceIcon = ({ sourceType }: { sourceType: Track['sourceType'] }) => {
    switch(sourceType) {
      case 'spotify':
        return (
          <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        );
      case 'apple':
        return (
          <svg className="h-4 w-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15C17.59.01 17.5 0 17.13 0H6.997c-.423 0-.54.01-.975.018-.505.016-1.012.055-1.51.143-.675.121-1.304.353-1.88.727-1.11.73-1.87 1.734-2.183 3.05C.244 4.625.18 5.35.18 6.075c0 .482.006.96.018 1.424v9c-.01.465-.018.936-.018 1.413 0 .72.066 1.45.24 2.164.316 1.317 1.076 2.32 2.182 3.052.575.37 1.205.6 1.88.72.506.092 1.012.126 1.52.143.44.01.56.016.976.016h10.13c.42 0 .541-.01.975-.016.518-.02 1.03-.057 1.536-.144.68-.12 1.31-.35 1.876-.715 1.124-.736 1.87-1.74 2.188-3.05.174-.722.236-1.45.236-2.166 0-.477-.006-.95-.018-1.415v-9c.012-.45.018-.934.018-1.42 0-.018-.006-.036-.006-.055H24v.06h-.003zm-6.35 10.126c-.102 2.433-1.058 3.35-3.383 3.405-1.114.027-1.497-.63-2.253-1.268-.79-.678-1.148-.994-2.014-.994-.913 0-1.31.334-2.11.995-.85.686-1.317 1.304-2.413 1.26-2.23-.074-3.252-1.288-3.374-3.402-.075-1.27.074-2.557.606-3.788.469-1.083 1.115-1.972 1.992-2.743.903-.772 1.888-1.361 3.047-1.72.193-.06.403-.114.614-.168-.257 1.077.138 2.368.923 3.225.748.817 1.956 1.357 3.132 1.257 1.178-.094 2.334-.758 3.047-1.7.746-.992 1.116-2.325.902-3.444 1.034.288 1.943.708 2.778 1.266.97.656 1.756 1.496 2.346 2.55.703 1.25 1.072 2.59 1.072 4.02.005.044.005.088.005.13z" />
          </svg>
        );
      default:
        return <MusicalNoteIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-900 shadow rounded-lg border border-gray-800 overflow-hidden">
      {showTitle && (
        <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold gradient-text">Recent Activity</h3>
          <span className="text-xs text-gray-400">Past 7 days</span>
        </div>
      )}
      <div className="divide-y divide-gray-800">
        {tracks.map((track) => (
          <div key={track.id} className="p-3 hover:bg-gray-800 transition-colors">
            <div className="flex items-center space-x-3">
              <img 
                src={track.albumArt} 
                alt={`${track.title} album art`} 
                className="h-12 w-12 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{track.title}</p>
                <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                <div className="flex items-center mt-1">
                  <SourceIcon sourceType={track.sourceType} />
                  <span className="text-gray-500 text-xs ml-1">
                    {formatRelativeTime(track.timestamp)}
                  </span>
                </div>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-pink-500 rounded-full hover:bg-gray-700">
                <HeartIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-gray-800 text-center">
        <Link to="/history" className="text-sm text-blue-400 hover:text-blue-300">
          View full history
        </Link>
      </div>
    </div>
  );
};

export default RecentActivity; 