import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PlaylistCard from '../ui/PlaylistCard';
import { useAuth } from '../../context/AuthContext';
import { PencilIcon, LinkIcon, PlusIcon } from '@heroicons/react/24/outline';
import UserProfileView from '../profile/UserProfileView';

// Define playlist type
interface Playlist {
  id: string;
  title: string;
  creator: string;
  coverImage: string;
  voteCount: number;
  commentCount: number;
  genre?: string;
}

// Define theme colors
const themeColors = [
  { name: 'Blue Gradient', value: 'bg-gradient-to-r from-blue-600 to-indigo-600' },
  { name: 'Purple Gradient', value: 'bg-gradient-to-r from-purple-600 to-pink-600' },
  { name: 'Green Gradient', value: 'bg-gradient-to-r from-green-500 to-teal-500' },
  { name: 'Orange Gradient', value: 'bg-gradient-to-r from-orange-500 to-red-500' },
  { name: 'Pink Gradient', value: 'bg-gradient-to-r from-pink-500 to-rose-500' },
];

const UserProfilePage: React.FC = () => {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState('New York, USA');
  const [coverImage] = useState('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&h=300&q=80');
  const [selectedTheme, setSelectedTheme] = useState(themeColors[0].value);
  const [socialLinks, setSocialLinks] = useState({
    spotify: '',
    instagram: '',
    twitter: '',
    website: '',
  });
  const [favoriteGenres, setFavoriteGenres] = useState(['Electronic', 'Hip-Hop', 'Indie']);
  const [updateError, setUpdateError] = useState('');

  // Dummy data for the prototype with genres added
  const dummyPlaylists: Playlist[] = [
    {
      id: '1',
      title: 'Summer Vibes 2025',
      creator: user?.username || 'User',
      coverImage: 'https://picsum.photos/400/400',
      voteCount: 128,
      commentCount: 24,
      genre: 'Pop'
    },
    {
      id: '2',
      title: 'Workout Mix',
      creator: user?.username || 'User',
      coverImage: 'https://picsum.photos/400/401',
      voteCount: 95,
      commentCount: 18,
      genre: 'Hip-Hop'
    },
    {
      id: '3',
      title: 'Chill Lofi Beats',
      creator: user?.username || 'User',
      coverImage: 'https://picsum.photos/400/402',
      voteCount: 256,
      commentCount: 42,
      genre: 'Lo-Fi'
    },
  ];

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError('');

    try {
      // In a real implementation, we would update all these fields
      await updateProfile({ username, bio });
      setIsEditing(false);
    } catch (error) {
      setUpdateError('Failed to update profile. Please try again.');
    }
  };

  // Function to simulate file upload
  const handleImageUpload = (type: 'avatar' | 'cover') => {
    // In a real implementation, this would open a file dialog
    alert(`This would open a file dialog to upload a new ${type} image`);
  };

  // Function to add a new favorite genre
  const handleAddGenre = () => {
    const genre = prompt('Enter a genre to add to your favorites:');
    if (genre && !favoriteGenres.includes(genre)) {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  // Function to update social links
  const handleSocialLinkChange = (platform: keyof typeof socialLinks, value: string) => {
    setSocialLinks({
      ...socialLinks,
      [platform]: value,
    });
  };

  // For the newer profile view integration with the updated UserProfileView component
  // This is a simplified example - add this where you want to use the updated profile view
  // instead of the older implementation
  const userProfileViewData = {
    id: user.id,
    username: user.username || username,
    displayName: username, // Use username as displayName since it's available
    bio: user.bio || bio,
    avatarUrl: user.avatar || 'https://picsum.photos/200/200',
    bannerUrl: coverImage,
    isPrivate: false,
    isCurrentUser: true,
    isVerified: true,
    isPremium: true, // Set this based on your user state or subscription status
    followersCount: 256,
    followingCount: 184,
    joinDate: new Date().toISOString(), // Use current date for now
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

  // This is just to show where you'd use the newer profile view component
  // You can replace your current profile UI with this
  const renderNewProfileView = () => {
    // Convert the dummy playlists to the format expected by UserProfileView
    const convertedPlaylists = dummyPlaylists.map(playlist => ({
      id: playlist.id,
      name: playlist.title,
      imageUrl: playlist.coverImage,
      tracksCount: Math.floor(Math.random() * 20) + 5, // Random number of tracks
      likes: playlist.voteCount
    }));
    
    return (
      <UserProfileView
        profile={userProfileViewData}
        playlists={convertedPlaylists}
        onEditProfile={() => setIsEditing(true)}
        onViewSettings={() => console.log('Settings view')}
        onLogout={handleLogout}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Use this to render the new profile view */}
      {renderNewProfileView()}
      
      {/* Or you can keep your existing UI with the code below */}
      {/* Comment out or remove the existing UI if you're fully switching to the new profile view */}
      {/* Cover Image */}
      <div 
        className="relative h-60 bg-gray-800 rounded-b-lg overflow-hidden"
        style={{ 
          backgroundImage: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className={`absolute inset-0 ${selectedTheme} opacity-50`}></div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition-all"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        ) : (
          <button 
            onClick={() => handleImageUpload('cover')}
            className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition-all"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-gray-900 shadow rounded-lg mb-8 border border-gray-800">
          <div className="px-6 py-8">
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold gradient-text mb-4">Edit Profile</h3>
                  
                  {updateError && (
                    <div className="bg-red-900 bg-opacity-30 border-l-4 border-red-500 p-4 mb-4">
                      <p className="text-sm text-red-400">{updateError}</p>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div className="flex items-center">
                      <img
                        src={user.avatar || 'https://picsum.photos/200/200'}
                        alt={user.username}
                        className="w-24 h-24 rounded-full border-2 border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageUpload('avatar')}
                        className="ml-4 px-3 py-1.5 border border-gray-700 rounded-md text-sm text-white bg-gray-800 hover:bg-gray-700"
                      >
                        Change Avatar
                      </button>
                    </div>
                    
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-white">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-white">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-white">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                        placeholder="Tell us about yourself, your music taste, and what kind of playlists you create..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Profile Theme
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {themeColors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setSelectedTheme(color.value)}
                            className={`h-10 rounded-md ${color.value} ${
                              selectedTheme === color.value ? 'ring-2 ring-white' : ''
                            }`}
                            aria-label={`Select ${color.name} theme`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Favorite Genres
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {favoriteGenres.map((genre) => (
                          <span key={genre} className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                            {genre}
                          </span>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddGenre}
                          className="bg-gray-800 text-white px-2 py-1 rounded-full text-sm flex items-center hover:bg-gray-700"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Social Links
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="text-sm text-white w-24">Spotify:</span>
                          <input
                            type="url"
                            value={socialLinks.spotify}
                            onChange={(e) => handleSocialLinkChange('spotify', e.target.value)}
                            placeholder="https://open.spotify.com/user/..."
                            className="flex-1 rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-white w-24">Instagram:</span>
                          <input
                            type="url"
                            value={socialLinks.instagram}
                            onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                            placeholder="https://instagram.com/..."
                            className="flex-1 rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-white w-24">Twitter:</span>
                          <input
                            type="url"
                            value={socialLinks.twitter}
                            onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                            placeholder="https://twitter.com/..."
                            className="flex-1 rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-white w-24">Website:</span>
                          <input
                            type="url"
                            value={socialLinks.website}
                            onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                            placeholder="https://..."
                            className="flex-1 rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white gradient-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 btn-hover-scale btn-hover-glow"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setUsername(user.username);
                      setBio(user.bio || '');
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 btn-hover-scale"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 flex flex-col items-center">
                  <img
                    src={user.avatar || 'https://picsum.photos/200/200'}
                    alt={user.username}
                    className="w-32 h-32 rounded-full border-2 border-blue-500"
                  />
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 btn-hover-scale"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 btn-hover-scale"
                    >
                      Logout
                    </button>
                  </div>
                  
                  {/* Social Links */}
                  {(socialLinks.spotify || socialLinks.instagram || socialLinks.twitter || socialLinks.website) && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-white mb-2">Connect</h3>
                      <div className="flex space-x-2">
                        {socialLinks.spotify && (
                          <a href={socialLinks.spotify} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                          </a>
                        )}
                        {socialLinks.instagram && (
                          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                          </a>
                        )}
                        {socialLinks.twitter && (
                          <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                          </a>
                        )}
                        {socialLinks.website && (
                          <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
                            <LinkIcon className="h-6 w-6" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Favorite Genres */}
                  {favoriteGenres.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-white mb-2">Favorite Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {favoriteGenres.map((genre) => (
                          <Link 
                            key={genre} 
                            to={`/genre/${genre.toLowerCase()}`} 
                            className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs hover:bg-gray-700"
                          >
                            {genre}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="md:w-2/3 mt-6 md:mt-0 md:ml-6">
                  <h1 className="text-3xl font-bold gradient-text">{user.username}</h1>
                  <p className="text-white text-sm mt-1">{location}</p>
                  <p className="mt-4 text-white whitespace-pre-line">{user.bio || 'No bio yet.'}</p>
                  
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <span className="block text-2xl font-bold gradient-text">{dummyPlaylists.length}</span>
                      <span className="block text-sm text-white">Playlists</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <span className="block text-2xl font-bold gradient-text">142</span>
                      <span className="block text-sm text-white">Followers</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <span className="block text-2xl font-bold gradient-text">98</span>
                      <span className="block text-sm text-white">Following</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* My Playlists Section */}
        <div className="bg-gray-900 shadow rounded-lg border border-gray-800">
          <div className="px-6 py-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold gradient-text">My Playlists</h2>
            <Link 
              to="/submit"
              className="inline-flex items-center px-3 py-1.5 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none btn-hover-scale"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Playlist
            </Link>
          </div>
          
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} {...playlist} />
              ))}
            </div>

            {dummyPlaylists.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-white">No playlists yet</h3>
                <p className="mt-2 text-white">
                  You haven't created any playlists yet
                </p>
                <div className="mt-6">
                  <Link 
                    to="/submit" 
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 btn-hover-scale btn-hover-glow"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Create your first playlist
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 