import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileHeader from '../profile/ProfileHeader';
import ProfileBio from '../profile/ProfileBio';
import ProfileTabs from '../profile/ProfileTabs';
import PlaylistGrid from '../ui/PlaylistGrid';
import EditProfileModal from '../profile/EditProfileModal';
import axios from 'axios';
import { User, Playlist } from '../../types/user';

const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('playlists');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Determine if viewing own profile
  const isOwnProfile = currentUser && 
    (!username || username === currentUser.username);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const targetUsername = username || currentUser?.username;
        
        if (!targetUsername) {
          setError('User not found');
          setIsLoading(false);
          return;
        }
        
        console.log(`Fetching profile for user: ${targetUsername}`);
        
        // Use a mock/dummy data approach for development if the API is not ready
        // Comment this out when the API is working
        const mockUser: User = {
          _id: '1',
          username: targetUsername,
          displayName: targetUsername.charAt(0).toUpperCase() + targetUsername.slice(1),
          bio: 'This is a sample bio for the user profile demo. I love discovering new music and sharing my favorite playlists with friends. Check out my summer collection!',
          profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
          bannerImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&h=400&q=80',
          joinedDate: new Date(),
          playlistCount: 5,
          votesReceived: 42
        };
        
        const mockPlaylists: Playlist[] = [
          {
            _id: '1',
            title: 'Summer Vibes 2023',
            creator: {
              _id: '1',
              username: targetUsername,
              displayName: targetUsername.charAt(0).toUpperCase() + targetUsername.slice(1)
            },
            coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
            trackCount: 12,
            voteCount: 24,
            isPinned: true,
            createdAt: new Date()
          },
          {
            _id: '2',
            title: 'Workout Mix',
            creator: {
              _id: '1',
              username: targetUsername,
              displayName: targetUsername.charAt(0).toUpperCase() + targetUsername.slice(1)
            },
            coverImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
            trackCount: 15,
            voteCount: 18,
            createdAt: new Date(Date.now() - 86400000) // 1 day ago
          },
          {
            _id: '3',
            title: 'Chill Evening',
            creator: {
              _id: '1',
              username: targetUsername,
              displayName: targetUsername.charAt(0).toUpperCase() + targetUsername.slice(1)
            },
            coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
            trackCount: 8,
            voteCount: 15,
            createdAt: new Date(Date.now() - 172800000) // 2 days ago
          }
        ];
        
        // Use the mock data instead of API call
        setProfileUser(mockUser);
        setPlaylists(mockPlaylists);
        setFavorites([
          {...mockPlaylists[0], _id: '4', title: 'Jazz Collection'},
          {...mockPlaylists[1], _id: '5', title: 'Indie Discoveries'},
        ]);
        setError(null);
        
        /* 
        // Uncomment this when the backend API is ready
        const { data } = await axios.get(`/api/users/profile/${targetUsername}`);
        setProfileUser(data.user);
        
        // Sort playlists to show pinned playlist first
        const sortedPlaylists = data.playlists.map((playlist: Playlist) => ({
          ...playlist,
          isPinned: playlist._id === data.user.pinnedPlaylist
        })).sort((a: Playlist, b: Playlist) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setPlaylists(sortedPlaylists);
        setFavorites(data.favorites || []);
        setError(null);
        */
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [username, currentUser]);
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Open/close edit modal
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  
  // Update profile after edit
  const handleProfileUpdate = (updatedUser: User) => {
    setProfileUser(updatedUser);
    setIsEditModalOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="max-w-md bg-gray-800 bg-opacity-90 rounded-xl shadow-xl p-8 text-center">
          <p className="text-red-400 text-lg">{error || 'User not found'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gray-800 bg-opacity-80 rounded-xl shadow-xl overflow-hidden">
          {/* Profile Header with banner, avatar, name, and stats */}
          <ProfileHeader 
            user={profileUser} 
            isOwnProfile={isOwnProfile} 
            onEditProfile={handleOpenEditModal} 
          />
          
          {/* Bio Section */}
          <div className="px-4 sm:px-6 lg:px-8">
            <ProfileBio bio={profileUser.bio} />
          
            {/* Content Tabs and Grid */}
            <div className="mt-8 pb-8">
              <ProfileTabs 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
              />
              
              <div className="mt-6">
                {activeTab === 'playlists' && (
                  <PlaylistGrid 
                    playlists={playlists}
                    emptyMessage="No playlists submitted yet"
                  />
                )}
                
                {activeTab === 'favorites' && (
                  <PlaylistGrid 
                    playlists={favorites}
                    emptyMessage="No favorite playlists yet"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          user={profileUser}
          onClose={handleCloseEditModal}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default UserProfilePage; 