import React, { useState } from 'react';
import { 
  CalendarIcon, 
  MusicalNoteIcon, 
  HeartIcon,
  PencilIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface Playlist {
  id: string;
  name: string;
  imageUrl: string;
  tracksCount: number;
  likes: number;
}

interface UserProfileViewProps {
  profile: {
    id: string;
    username: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    bannerUrl?: string;
    isPrivate: boolean;
    isCurrentUser: boolean;
    isVerified: boolean;
    isPremium?: boolean;
    followersCount: number;
    followingCount: number;
    joinDate: string;
    showCurrentlyListening?: boolean;
    socialLinks: {
      platform: string;
      url: string;
    }[];
  };
  playlists: Playlist[];
  onEditProfile?: () => void;
  onViewSettings?: () => void;
  onLogout?: () => void;
}

// Add CSS utility class for text shadow with improved contrast
const cssUtilities = `
  .text-shadow-sm {
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }
  .text-shadow-md {
    text-shadow: 0 2px 4px rgba(0,0,0,0.7);
  }
  .text-shadow-lg {
    text-shadow: 0 2px 8px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,1);
  }
`;

const UserProfileView: React.FC<UserProfileViewProps> = ({
  profile,
  playlists,
  onEditProfile,
  onViewSettings,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'playlists' | 'favorites'>('playlists');
  
  // Mock data for favorited playlists
  const favoritePlaylists: Playlist[] = [
    {
      id: 'fav1',
      name: 'Chill Hip-Hop Mix',
      imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      tracksCount: 18,
      likes: 345
    },
    {
      id: 'fav2',
      name: 'Morning Acoustic',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      tracksCount: 24,
      likes: 217
    },
    {
      id: 'fav3',
      name: 'Classic Rock Essentials',
      imageUrl: 'https://images.unsplash.com/photo-1471478331774-c5e74c24f747?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      tracksCount: 32,
      likes: 189
    }
  ];

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Simplified PlaylistCard component for this view
  const PlaylistCard = ({ playlist }: { playlist: Playlist }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img 
            src={playlist.imageUrl || 'https://via.placeholder.com/300?text=Playlist'} 
            alt={playlist.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Playlist';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white truncate">{playlist.name}</h3>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-300">
          <div className="flex items-center">
            <MusicalNoteIcon className="h-4 w-4 mr-1" />
            <span>{playlist.tracksCount} tracks</span>
          </div>
          <div className="flex items-center">
            <HeartIcon className="h-4 w-4 mr-1" />
            <span>{playlist.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white">
      {/* Add utility classes for text shadow */}
      <style>{cssUtilities}</style>
      
      {/* Banner */}
      <div 
        className="h-64 w-full bg-cover bg-center relative" 
        style={{ 
          backgroundImage: profile.bannerUrl ? `url(${profile.bannerUrl})` : 'linear-gradient(to right, #1DB954, #191414)' 
        }}
      >
        {/* Enhanced gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        
        {/* Profile info inside banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center">
            {/* Avatar - larger size and positioned partly over the banner edge */}
            <div className="h-36 w-36 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800 z-10 shadow-xl transform translate-y-6">
              <img 
                src={profile.avatarUrl || 'https://via.placeholder.com/128'} 
                alt={profile.displayName} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=User';
                }}
              />
            </div>
            
            {/* Basic info */}
            <div className="ml-6 flex-1">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-white text-shadow-lg">{profile.displayName}</h1>
                {profile.isVerified && (
                  <svg className="h-5 w-5 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-gray-200 text-shadow-md mb-2 opacity-90">@{profile.username}</p>
              
              <div className="flex items-center space-x-4 mt-2">
                <span className="flex items-center text-white">
                  <MusicalNoteIcon className="h-5 w-5 mr-1 text-green-400" />
                  <span className="font-medium">{playlists.length} Playlists</span>
                </span>
                <span className="flex items-center text-white">
                  <HeartIcon className="h-5 w-5 mr-1 text-pink-500" />
                  <span className="font-medium">
                    {playlists.reduce((sum, p) => sum + p.likes, 0)} Votes
                  </span>
                </span>
                <span className="flex items-center text-white">
                  <CalendarIcon className="h-5 w-5 mr-1 text-blue-400" />
                  <span className="font-medium">Joined {formatJoinDate(profile.joinDate)}</span>
                </span>
              </div>
            </div>
            
            {/* Action buttons - only for the profile owner */}
            {profile.isCurrentUser && (
              <div className="flex space-x-2">
                <button 
                  onClick={onEditProfile}
                  className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 shadow-md transition"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={onViewSettings}
                  className="p-2 rounded-full bg-gray-800 bg-opacity-90 text-white hover:bg-gray-700 shadow-md transition"
                >
                  <CogIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={onLogout}
                  className="p-2 rounded-full bg-gray-800 bg-opacity-90 text-white hover:bg-gray-700 shadow-md transition"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Content area with bio */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pb-16">
        {/* Bio card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-md">
          <h2 className="text-xl font-bold mb-3">Bio</h2>
          <p className="text-gray-300">{profile.bio || 'No bio yet.'}</p>
        </div>
        
        {/* Tabs navigation */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('playlists')}
              className={`pb-4 font-medium text-sm px-1 border-b-2 ${
                activeTab === 'playlists' 
                  ? 'border-blue-500 text-blue-500' 
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              Playlists
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-4 font-medium text-sm px-1 border-b-2 ${
                activeTab === 'favorites' 
                  ? 'border-pink-500 text-pink-500' 
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              Favorites
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="mt-6">
          {activeTab === 'playlists' && (
            <>
              {playlists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {playlists.map(playlist => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-800 rounded-lg">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No playlists yet</h3>
                  <p className="mt-1 text-gray-400">Get started by creating your first playlist</p>
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                      Create a Playlist
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'favorites' && (
            <>
              {favoritePlaylists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {favoritePlaylists.map(playlist => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-800 rounded-lg">
                  <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No favorites yet</h3>
                  <p className="mt-1 text-gray-400">Discover and save playlists you love</p>
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                      Explore Playlists
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileView; 