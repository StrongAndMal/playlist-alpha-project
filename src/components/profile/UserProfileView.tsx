import React, { useState } from 'react';
import { 
  CalendarIcon, 
  MusicalNoteIcon, 
  UserGroupIcon, 
  HeartIcon,
  PencilIcon, 
  CogIcon,
  XMarkIcon,
  SparklesIcon,
  PhotoIcon,
  LinkIcon,
  PaperClipIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { PlayIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

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

interface Post {
  id: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  image?: string;
  attachedPlaylist?: {
    id: string;
    name: string;
    imageUrl: string;
  };
  attachedTrack?: {
    title: string;
    artist: string;
    albumArt: string;
  };
}

const UserProfileView: React.FC<UserProfileViewProps> = ({
  profile,
  playlists,
  onFollow,
  onEditProfile,
  onViewSettings,
  onLogout
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'playlists' | 'favorites' | 'social'>('playlists');
  const [postText, setPostText] = useState('');

  // Mock data for social posts
  const mockPosts: Post[] = [
    {
      id: 'post1',
      content: "Just created a new summer playlist that I'm really excited about! Check it out and let me know what you think 🎵☀️",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      likes: 24,
      comments: 5,
      attachedPlaylist: {
        id: playlists[0]?.id || 'p1',
        name: playlists[0]?.name || 'Summer Vibes 2023',
        imageUrl: playlists[0]?.imageUrl || 'https://via.placeholder.com/300?text=Playlist',
      }
    },
    {
      id: 'post2',
      content: "Discovered this amazing new artist today. Their sound is like a mix between Radiohead and Tame Impala. Highly recommend!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      likes: 42,
      comments: 8,
      attachedTrack: {
        title: "Eclipse",
        artist: "Lunar Waves",
        albumArt: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      }
    },
    {
      id: 'post3',
      content: "Just got back from an amazing concert! The energy was incredible and they played all my favorite songs.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
      likes: 78,
      comments: 12,
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    }
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (onFollow) {
      onFollow();
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handlePost = () => {
    if (postText.trim()) {
      console.log('Posting:', postText);
      // Implement post creation here
      setPostText('');
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

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
        
        {/* Profile info inside banner (Twitter-inspired layout) */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center">
            {/* Avatar - larger size and positioned partly over the banner edge like Twitter */}
            <div className="h-36 w-36 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800 z-10 shadow-xl transform translate-y-6">
              <img 
                src={profile.avatarUrl || 'https://via.placeholder.com/128'} 
                alt={profile.displayName} 
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Stats - similar to Twitter's arrangement with better visibility */}
            <div className="ml-6 flex-1">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-white text-shadow-lg">{profile.displayName}</h1>
                {profile.isVerified && (
                  <svg className="h-5 w-5 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {/* Premium badge */}
                {profile.isPremium && (
                  <div className="ml-2 flex items-center px-2 py-1 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full">
                    <SparklesIcon className="h-4 w-4 text-gray-900 mr-1" />
                    <span className="text-xs font-bold text-gray-900">PREMIUM</span>
                  </div>
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
                  <span className="font-medium">152 Likes</span>
                </span>
                <span className="text-white font-medium">{profile.followersCount} Followers</span>
                <span className="text-white font-medium">{profile.followingCount} Following</span>
              </div>
            </div>
            
            {/* Action buttons - on the right side */}
            <div className="flex space-x-2">
              {profile.isCurrentUser ? (
                <>
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
                  {/* Logout button with icon only */}
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-full bg-gray-800 bg-opacity-90 text-white hover:bg-gray-700 shadow-md transition"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full ${
                    isFollowing 
                      ? 'bg-gray-800 text-white hover:bg-gray-700' 
                      : 'bg-blue-500 text-white text-sm font-bold hover:bg-blue-600'
                  } shadow-md transition`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio section under banner - SoundCloud style with improved spacing */}
      <div className="bg-gray-900 px-6 pt-10 pb-4 border-b border-gray-800">
        {profile.bio && <p className="text-gray-300 max-w-3xl">{profile.bio}</p>}
        
        {/* Verified badge and join date */}
        <div className="flex items-center mt-2 text-sm text-gray-400">
          <span className="flex items-center mr-3">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Joined {formatJoinDate(profile.joinDate)}</span>
          </span>
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
              onClick={() => setActiveTab('social')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'social' 
                  ? 'border-green-500 text-green-500' 
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              Social
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
                  <div key={playlist.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition group">
                    <div className="relative pb-[100%]">
                      <img 
                        src={playlist.imageUrl || 'https://via.placeholder.com/300?text=Playlist'} 
                        alt={playlist.name} 
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <div className="bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100">
                          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
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
                <MusicalNoteIcon className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                <h3 className="text-lg font-medium text-white mb-2">No playlists yet</h3>
                <p className="text-gray-400 mb-4">You haven't created any playlists yet</p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition">
                  Create Your First Playlist
                </button>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'favorites' && (
          <div className="text-gray-400 text-center py-10">
            <HeartIcon className="h-16 w-16 mx-auto text-gray-700 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Your Favorites</h3>
            <p>Tracks and playlists you've liked will appear here</p>
          </div>
        )}
        
        {activeTab === 'social' && (
          <div className="space-y-6">
            {/* Post creation area - only for the profile owner */}
            {profile.isCurrentUser && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex space-x-3">
                  <img 
                    src={profile.avatarUrl} 
                    alt="Your profile" 
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      placeholder="Share what's on your mind..."
                      className="w-full bg-gray-700 text-white rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <div className="flex justify-between mt-2">
                      <div className="flex space-x-2">
                        <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700">
                          <PhotoIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700">
                          <MusicalNoteIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700">
                          <LinkIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <button 
                        onClick={handlePost}
                        disabled={!postText.trim()}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          postText.trim() 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts feed */}
            <div className="space-y-4">
              {mockPosts.map(post => (
                <div key={post.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.displayName} 
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-semibold text-white">{profile.displayName}</span>
                        {profile.isVerified && (
                          <svg className="h-4 w-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {profile.isPremium && (
                          <span className="ml-2">
                            <SparklesIcon className="h-4 w-4 text-yellow-400" />
                          </span>
                        )}
                        <span className="mx-2 text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.timestamp).toLocaleDateString('en-US', { 
                            hour: 'numeric', 
                            minute: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-1 mb-3">{post.content}</p>
                      
                      {/* Attached media */}
                      {post.image && (
                        <div className="mt-2 mb-3 rounded-lg overflow-hidden">
                          <img src={post.image} alt="Post image" className="w-full" />
                        </div>
                      )}
                      
                      {post.attachedPlaylist && (
                        <div className="mt-2 mb-3 bg-gray-700 rounded-lg p-3 flex items-center">
                          <img 
                            src={post.attachedPlaylist.imageUrl} 
                            alt={post.attachedPlaylist.name} 
                            className="h-14 w-14 rounded object-cover mr-3"
                          />
                          <div>
                            <p className="text-sm text-gray-400">Playlist</p>
                            <p className="text-white font-medium">{post.attachedPlaylist.name}</p>
                          </div>
                        </div>
                      )}
                      
                      {post.attachedTrack && (
                        <div className="mt-2 mb-3 bg-gray-700 rounded-lg p-3 flex items-center">
                          <img 
                            src={post.attachedTrack.albumArt} 
                            alt={post.attachedTrack.title} 
                            className="h-14 w-14 rounded object-cover mr-3"
                          />
                          <div>
                            <p className="text-sm text-gray-400">Track</p>
                            <p className="text-white font-medium">{post.attachedTrack.title}</p>
                            <p className="text-sm text-gray-400">{post.attachedTrack.artist}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Post actions */}
                      <div className="flex space-x-4 mt-2">
                        <button className="flex items-center text-gray-400 hover:text-pink-500">
                          <HeartIcon className="h-5 w-5 mr-1" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center text-gray-400 hover:text-blue-500">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="flex items-center text-gray-400 hover:text-green-500">
                          <PaperClipIcon className="h-5 w-5 mr-1" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {mockPosts.length === 0 && (
                <div className="text-center py-12">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                  <h3 className="text-lg font-medium text-white mb-2">No posts yet</h3>
                  <p className="text-gray-400 mb-4">Start sharing your thoughts and music with your followers</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileView; 