import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PlaylistCard from '../ui/PlaylistCard';
import { useAuth } from '../../context/AuthContext';
import { PencilIcon, LinkIcon, PlusIcon } from '@heroicons/react/24/outline';
import UserProfileView from '../profile/UserProfileView';
import SpotifyProfileImport from '../profile/SpotifyProfileImport';

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
  const { username: usernameParam } = useParams<{ username?: string }>();
  
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
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isLoading2, setIsLoading2] = useState(usernameParam ? true : false);
  const [activeTab, setActiveTab] = useState('playlists');

  // Dummy data for the prototype with genres added
  const dummyPlaylists: Playlist[] = [
    {
      id: '1',
      title: 'Summer Vibes 2025',
      creator: profileUser?.username || user?.username || 'User',
      coverImage: 'https://picsum.photos/400/400',
      voteCount: 128,
      commentCount: 24,
      genre: 'Pop'
    },
    {
      id: '2',
      title: 'Workout Mix',
      creator: profileUser?.username || user?.username || 'User',
      coverImage: 'https://picsum.photos/400/401',
      voteCount: 95,
      commentCount: 18,
      genre: 'Hip-Hop'
    },
    {
      id: '3',
      title: 'Chill Lofi Beats',
      creator: profileUser?.username || user?.username || 'User',
      coverImage: 'https://picsum.photos/400/402',
      voteCount: 256,
      commentCount: 42,
      genre: 'Lo-Fi'
    },
  ];

  // Load profile data if username is provided in URL
  useEffect(() => {
    if (usernameParam) {
      setIsLoading2(true);
      // This would be an API call to fetch the user profile
      // For now, we'll mock it with a timeout
      setTimeout(() => {
        if (user && usernameParam === user.username) {
          // If viewing own profile via username URL, use current user data
          setProfileUser(user);
        } else {
          // Mock data for another user's profile
          setProfileUser({
            id: 'user-' + usernameParam,
            username: usernameParam,
            displayName: usernameParam.charAt(0).toUpperCase() + usernameParam.slice(1),
            bio: `Music enthusiast and playlist creator. This is ${usernameParam}'s profile.`,
            avatar: `https://picsum.photos/seed/${usernameParam}/200/200`,
            isCurrentUser: false
          });
        }
        setIsLoading2(false);
      }, 500);
    } else {
      // If no username in URL, it's the current user's profile
      setProfileUser(null);
    }
  }, [usernameParam, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || (!user && !usernameParam) || (usernameParam && isLoading2)) {
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

  // Determine whether we're viewing the current user's profile or another user's profile
  const isCurrentUserProfile = Boolean(!usernameParam || (user && usernameParam === user.username));
  const displayUser = isCurrentUserProfile ? (user || {}) : (profileUser || {});

  // Add a function to handle successful Spotify profile import
  const handleSpotifyProfileImport = (profileData: any) => {
    console.log('Spotify profile imported:', profileData);
    // You could update the profile data here if needed
  };

  // Create profile data for the UserProfileView component
  const userProfileViewData = {
    id: displayUser.id || '',
    username: displayUser.username || username,
    displayName: isCurrentUserProfile ? username : (displayUser.displayName || ''),
    bio: displayUser.bio || bio,
    avatarUrl: displayUser.avatar || 'https://picsum.photos/200/200',
    bannerUrl: coverImage,
    isPrivate: false,
    isCurrentUser: isCurrentUserProfile,
    isVerified: true,
    isPremium: false, // Set based on user state or subscription status
    followersCount: 0, // For V1, we're removing followers
    followingCount: 0, // For V1, we're removing following
    joinDate: new Date().toISOString(),
    showCurrentlyListening: false, // Removed for V1
    socialLinks: [] // Empty for V1 simplicity
  };

  // Convert the dummy playlists to the format expected by UserProfileView
  const convertedPlaylists = dummyPlaylists.map(playlist => ({
    id: playlist.id,
    name: playlist.title,
    imageUrl: playlist.coverImage,
    tracksCount: Math.floor(Math.random() * 20) + 5, // Random number of tracks
    likes: playlist.voteCount
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto pb-12">
        <UserProfileView
          profile={userProfileViewData}
          playlists={convertedPlaylists}
          onEditProfile={() => isCurrentUserProfile && setIsEditing(true)}
          onViewSettings={() => isCurrentUserProfile && console.log('Settings view')}
          onLogout={isCurrentUserProfile ? handleLogout : undefined}
        />
        
        {/* Add a new section for Spotify integration */}
        {isCurrentUserProfile && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Spotify Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SpotifyProfileImport onSuccess={handleSpotifyProfileImport} />
              
              {/* Additional Spotify-related components could go here */}
            </div>
          </div>
        )}
      </div>
      
      {/* Edit profile modal - only shown for current user */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold">Edit Profile</h2>
            </div>
            <form onSubmit={handleProfileUpdate} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="username">
                  Username
                </label>
                <input
                  type="text" 
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
              
              {updateError && (
                <div className="mb-4 p-2 bg-red-900 bg-opacity-25 border border-red-800 rounded text-sm">
                  {updateError}
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage; 