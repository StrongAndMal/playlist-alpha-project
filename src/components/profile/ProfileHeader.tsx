import React from 'react';
import { CalendarIcon, MusicalNoteIcon, HeartIcon } from '@heroicons/react/24/outline';
import { User } from '../../types/user';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onEditProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwnProfile, onEditProfile }) => {
  // Format join date to Month Year format
  const formatJoinDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="h-56 md:h-72 w-full overflow-hidden">
        <img 
          src={user.bannerImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&h=400&q=80'}
          alt="Profile banner" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&h=400&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
      </div>
      
      {/* Profile Info Overlay */}
      <div className="relative px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Profile Picture + Name/Username/Stats Block */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Profile Picture */}
            <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-full ring-4 ring-blue-600 overflow-hidden bg-gray-800 shadow-xl -mt-20 sm:-mt-16 mx-auto sm:mx-0">
              <img 
                src={user.profilePicture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80'}
                alt={user.displayName} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80';
                }}
              />
            </div>
            
            {/* Name, Username, Stats */}
            <div className="text-center sm:text-left mt-4 sm:mt-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.displayName}</h1>
              <p className="text-blue-400 text-sm sm:text-base mb-4">@{user.username}</p>
              
              {/* User Stats */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-300">
                <div className="flex items-center bg-gray-900 bg-opacity-60 px-3 py-2 rounded-lg">
                  <MusicalNoteIcon className="h-5 w-5 mr-2 text-blue-400" />
                  <span>{user.playlistCount} Playlists</span>
                </div>
                <div className="flex items-center bg-gray-900 bg-opacity-60 px-3 py-2 rounded-lg">
                  <HeartIcon className="h-5 w-5 mr-2 text-pink-500" />
                  <span>{user.votesReceived} Votes</span>
                </div>
                <div className="flex items-center bg-gray-900 bg-opacity-60 px-3 py-2 rounded-lg">
                  <CalendarIcon className="h-5 w-5 mr-2 text-green-400" />
                  <span>Joined {formatJoinDate(user.joinedDate)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Edit Profile Button */}
          {isOwnProfile && (
            <button 
              onClick={onEditProfile}
              className="mt-6 sm:mt-0 px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 