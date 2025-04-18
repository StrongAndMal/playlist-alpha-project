import React, { useState } from 'react';
import { CalendarIcon, MusicalNoteIcon, UserGroupIcon, HeartIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';

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
    followersCount: number;
    followingCount: number;
    joinDate: string;
    spotifyUrl?: string;
    showCurrentlyListening?: boolean;
    currentlyPlaying?: {
      title: string;
      artist: string;
      albumArt: string;
    };
    socialLinks: {
      platform: string;
      url: string;
    }[];
  };
  playlists: Playlist[];
  onFollow?: () => void;
  onEditProfile?: () => void;
  onViewSettings?: () => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({
  profile,
  playlists,
  onFollow,
  onEditProfile,
  onViewSettings
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'playlists' | 'favorites' | 'activity'>('playlists');

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (onFollow) {
      onFollow();
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-gray-900 text-white">
      {/* Banner */}
      <div 
        className="h-48 w-full bg-cover bg-center relative" 
        style={{ 
          backgroundImage: profile.bannerUrl ? `url(${profile.bannerUrl})` : 'linear-gradient(to right, #1DB954, #191414)' 
        }}
      >
        {profile.isPrivate && !profile.isCurrentUser && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center p-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-bold">Private Profile</h3>
              <p className="text-gray-400">Follow this user to see their profile</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-4 sm:px-6 lg:px-8 -mt-16 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <div className="h-32 w-32 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800">
            <img 
              src={profile.avatarUrl || 'https://via.placeholder.com/128'} 
              alt={profile.displayName} 
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold truncate">{profile.displayName}</h1>
              {profile.isVerified && (
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-gray-400 mb-2">@{profile.username}</p>
            {profile.bio && <p className="text-sm text-gray-300 mt-1 mb-3 max-w-2xl">{profile.bio}</p>}
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                <span>{profile.followersCount} followers</span>
              </div>
              <div className="flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                <span>{profile.followingCount} following</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Joined {formatJoinDate(profile.joinDate)}</span>
              </div>
            </div>
          </div>

          <div className="sm:ml-auto flex flex-col sm:flex-row gap-2">
            {profile.isCurrentUser ? (
              <>
                <button 
                  onClick={onEditProfile}
                  className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={onViewSettings}
                  className="px-4 py-2 rounded-full bg-gray-800 text-white text-sm font-medium hover:bg-gray-700"
                >
                  Settings
                </button>
              </>
            ) : (
              <button 
                onClick={handleFollow}
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  isFollowing 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Currently Playing */}
      {profile.currentlyPlaying && profile.showCurrentlyListening && (
        <div className="max-w-5xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 flex items-center">
            <div className="flex-shrink-0 mr-4 relative">
              <img 
                src={profile.currentlyPlaying.albumArt} 
                alt={profile.currentlyPlaying.title} 
                className="h-16 w-16 object-cover rounded"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                <PlayIcon className="h-8 w-8 text-white opacity-80" />
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <MusicalNoteIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-green-500 font-medium">Currently listening to</span>
              </div>
              <h3 className="font-medium">{profile.currentlyPlaying.title}</h3>
              <p className="text-sm text-gray-400">{profile.currentlyPlaying.artist}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-800 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('playlists')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'playlists' 
                  ? 'border-green-500 text-green-500' 
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              Playlists
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'favorites' 
                  ? 'border-green-500 text-green-500' 
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'activity' 
                  ? 'border-green-500 text-green-500' 
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              Recent Activity
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'playlists' && (
          <>
            {playlists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {playlists.map(playlist => (
                  <div key={playlist.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
                    <div className="relative pb-[100%]">
                      <img 
                        src={playlist.imageUrl || 'https://via.placeholder.com/300?text=Playlist'} 
                        alt={playlist.name} 
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{playlist.name}</h3>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <MusicalNoteIcon className="h-4 w-4 mr-1" />
                        <span>{playlist.tracksCount} tracks</span>
                        <span className="mx-2">•</span>
                        <HeartIcon className="h-4 w-4 mr-1" />
                        <span>{playlist.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MusicalNoteIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No playlists yet</h3>
                <p className="text-gray-500">This user hasn't created any playlists yet.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'favorites' && (
          <div className="text-center py-12">
            <HeartIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">Favorite tracks coming soon</h3>
            <p className="text-gray-500">We're working on displaying favorite tracks here.</p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">Activity feed coming soon</h3>
            <p className="text-gray-500">We're working on showing recent activity here.</p>
          </div>
        )}
      </div>

      {/* Social Links */}
      {profile.socialLinks && profile.socialLinks.length > 0 && (
        <div className="border-t border-gray-800 py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg font-medium mb-4">Connect with {profile.displayName}</h3>
            <div className="flex flex-wrap gap-4">
              {profile.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition"
                >
                  {link.platform === 'spotify' && (
                    <svg className="h-5 w-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.54-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  )}
                  
                  {link.platform === 'instagram' && (
                    <svg className="h-5 w-5 text-[#E1306C]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  )}
                  
                  {link.platform === 'facebook' && (
                    <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.4 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  
                  {link.platform === 'twitter' && (
                    <svg className="h-5 w-5 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  )}
                  
                  {link.platform === 'tiktok' && (
                    <svg className="h-5 w-5 text-[#000000]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileView; 