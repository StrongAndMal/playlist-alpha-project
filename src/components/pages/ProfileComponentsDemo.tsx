import React, { useState } from 'react';
import { 
  CogIcon, 
  PencilIcon, 
  XMarkIcon, 
  ArrowRightOnRectangleIcon, 
  SparklesIcon,
  PhotoIcon,
  LinkIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import { 
  MusicalNoteIcon, 
  HeartIcon, 
  UserCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';
import UserProfileView from '../profile/UserProfileView';
import ProfileSettings from '../profile/ProfileSettings';
import ProfileEdit from '../profile/ProfileEdit';
import RecentActivity from '../profile/RecentActivity';
import WelcomeTutorial from '../profile/WelcomeTutorial';

// Custom banner component inspired by Twitter/SoundCloud
const CustomProfileBanner: React.FC<{
  profile: any; 
  playlists: any[];
  onEditProfile: () => void;
  onViewSettings: () => void;
}> = ({ profile, playlists, onEditProfile, onViewSettings }) => {
  return (
    <div className="relative">
      <div 
        className="h-64 w-full bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${profile.bannerUrl})` 
        }}
      >
        {/* Enhanced gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        
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
            
            {/* Action buttons - on the right side like Twitter with improved contrast */}
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
                </>
              ) : (
                <button className="px-6 py-2 rounded-full bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 shadow-md transition">
                  Follow
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
          {profile.isVerified && (
            <span className="flex items-center mr-3 text-blue-400">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Artist
            </span>
          )}
          <span>Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};

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

const ProfileComponentsDemo: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [activeTab, setActiveTab] = useState<'playlists' | 'favorites' | 'social'>('playlists');
  const [postText, setPostText] = useState('');

  // Mock data for the profile
  const mockProfile = {
    id: '123456',
    username: 'musiclover42',
    displayName: 'Alex Johnson',
    bio: 'Music enthusiast and playlist curator. I love discovering new artists and sharing great music with others!',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bannerOverlayColor: 'rgba(0, 0, 0, 0.5)',
    textColor: '#ffffff',
    isPrivate: false,
    isCurrentUser: true,
    isVerified: true,
    isPremium: true,
    followersCount: 256,
    followingCount: 184,
    joinDate: '2022-05-15',
    spotifyUrl: 'https://open.spotify.com/user/example',
    showCurrentlyListening: true,
    currentlyPlaying: {
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      albumArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80'
    },
    socialLinks: [
      { platform: 'spotify', url: 'https://open.spotify.com/user/example' },
      { platform: 'instagram', url: 'https://instagram.com/musiclover42' },
      { platform: 'twitter', url: 'https://twitter.com/musiclover42' }
    ]
  };

  // Mock data for playlists
  const mockPlaylists = [
    {
      id: 'p1',
      name: 'Summer Vibes 2023',
      imageUrl: 'https://images.unsplash.com/photo-1534196511436-921a4e99f297?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      tracksCount: 24,
      likes: 108
    },
    {
      id: 'p2',
      name: 'Chill Lo-Fi Beats',
      imageUrl: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      tracksCount: 42,
      likes: 325
    },
    {
      id: 'p3',
      name: 'Rock Classics',
      imageUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      tracksCount: 56,
      likes: 198
    },
    {
      id: 'p4',
      name: 'Workout Mix',
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      tracksCount: 18,
      likes: 76
    }
  ];

  // Mock data for recent activity
  const mockTracks = [
    {
      id: 't1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      albumArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      sourceType: 'spotify' as const
    },
    {
      id: 't2',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      sourceType: 'spotify' as const
    },
    {
      id: 't3',
      title: 'Beat It',
      artist: 'Michael Jackson',
      albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      sourceType: 'apple' as const
    }
  ];

  // Settings
  const mockSettings = {
    isPrivate: false,
    showCurrentlyListening: true,
    publicPlaylists: true,
    theme: {
      primaryColor: '#1DB954',
      secondaryColor: '#191414',
      fontColor: '#ffffff'
    },
    socialLinks: [
      { platform: 'spotify' as const, url: 'https://open.spotify.com/user/example' },
      { platform: 'instagram' as const, url: 'https://instagram.com/musiclover42' }
    ]
  };

  // Mock data for social posts
  const mockPosts = [
    {
      id: 'post1',
      content: "Just created a new summer playlist that I'm really excited about! Check it out and let me know what you think 🎵☀️",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      likes: 24,
      comments: 5,
      attachedPlaylist: {
        id: 'p1',
        name: 'Summer Vibes 2023',
        imageUrl: 'https://images.unsplash.com/photo-1534196511436-921a4e99f297?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
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

  const handleEditProfile = () => {
    setShowProfileEdit(true);
  };

  const handleViewSettings = () => {
    setShowSettings(true);
  };

  const handleSaveSettings = async () => {
    console.log('Settings saved');
    setShowSettings(false);
    return Promise.resolve();
  };

  const handleSaveProfile = async () => {
    console.log('Profile saved');
    setShowProfileEdit(false);
    return Promise.resolve();
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Implement logout functionality here
  };

  const handlePost = () => {
    if (postText.trim()) {
      console.log('Posting:', postText);
      // Implement post creation here
      setPostText('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      {/* Add utility classes for text shadow */}
      <style>{cssUtilities}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Playlist Finder</h1>
          
          <div className="flex space-x-3">
            <button
              onClick={handleShowTutorial}
              className="px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700"
            >
              Show Tutorial
            </button>
            
            <button
              onClick={handleViewSettings}
              className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <CogIcon className="h-5 w-5" />
            </button>
            
            {/* Logout button with icon only */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Main content grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main profile section - takes up 2/3 of the space on desktop */}
          <div className="lg:col-span-2 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            {/* Replace UserProfileView with custom banner and just the tabs/content */}
            <CustomProfileBanner 
              profile={mockProfile}
              playlists={mockPlaylists}
              onEditProfile={handleEditProfile}
              onViewSettings={handleViewSettings}
            />
            
            {/* Tabs - keeping just this part from UserProfileView */}
            <div className="border-b border-gray-800">
              <div className="px-4 sm:px-6 lg:px-8">
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
            
            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'playlists' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {mockPlaylists.map(playlist => (
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
                        <h3 className="font-medium truncate text-white">{playlist.name}</h3>
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
                  {/* Post creation area */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex space-x-3">
                      <img 
                        src={mockProfile.avatarUrl} 
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

                  {/* Posts feed */}
                  <div className="space-y-4">
                    {mockPosts.map(post => (
                      <div key={post.id} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <img 
                            src={mockProfile.avatarUrl} 
                            alt={mockProfile.displayName} 
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-semibold text-white">{mockProfile.displayName}</span>
                              {mockProfile.isPremium && (
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
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar section - takes up 1/3 of the space on desktop */}
          <div className="space-y-6">
            {/* Recent activity widget */}
            <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              <RecentActivity 
                tracks={mockTracks} 
                showTitle={true}
              />
            </div>
            
            {/* Social updates widget */}
            <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-blue-400">Social Updates</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-start">
                      <img 
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&q=80" 
                        alt="User avatar" 
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="text-sm text-white">
                          <span className="font-semibold">Jamie Smith</span> liked your playlist <span className="text-blue-400">Summer Vibes 2023</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-start">
                      <img 
                        src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&q=80" 
                        alt="User avatar" 
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="text-sm text-white">
                          <span className="font-semibold">Michael Wong</span> started following you
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-start">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&q=80" 
                        alt="User avatar" 
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="text-sm text-white">
                          <span className="font-semibold">Sofia Chen</span> commented on your playlist <span className="text-blue-400">Chill Lo-Fi Beats</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">This playlist is perfect for work! Thanks for sharing 🙌</p>
                        <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 text-center py-2 text-sm text-blue-400 hover:text-blue-300">
                  View all updates
                </button>
              </div>
            </div>
            
            {/* Suggested connections widget */}
            <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-green-400">Suggested Connections</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&q=80" 
                        alt="User avatar" 
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">David Miller</p>
                        <p className="text-xs text-gray-400">Similar music taste</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-gray-800 text-white rounded-full hover:bg-gray-700">
                      Follow
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&q=80" 
                        alt="User avatar" 
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">Robert Johnson</p>
                        <p className="text-xs text-gray-400">Popular playlist creator</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-gray-800 text-white rounded-full hover:bg-gray-700">
                      Follow
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&q=80" 
                        alt="User avatar" 
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">Emma Wilson</p>
                        <p className="text-xs text-gray-400">Followed by Jamie Smith</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-gray-800 text-white rounded-full hover:bg-gray-700">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="max-w-xl w-full">
            <ProfileEdit
              userProfile={{
                displayName: mockProfile.displayName,
                username: mockProfile.username,
                bio: mockProfile.bio,
                avatarUrl: mockProfile.avatarUrl,
                bannerUrl: mockProfile.bannerUrl
              }}
              onSave={handleSaveProfile}
              onCancel={() => setShowProfileEdit(false)}
            />
          </div>
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="max-w-2xl w-full relative">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <ProfileSettings
              userId={mockProfile.id}
              initialSettings={mockSettings}
              onSave={handleSaveSettings}
            />
          </div>
        </div>
      )}
      
      {/* Welcome Tutorial Overlay */}
      {showTutorial && (
        <WelcomeTutorial
          username={mockProfile.username}
          onComplete={() => setShowTutorial(false)}
          onSkip={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
};

export default ProfileComponentsDemo; 