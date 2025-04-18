import React, { useState } from 'react';
import { XMarkIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ProfileBuilderProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
}

export interface UserProfile {
  username: string;
  displayName?: string;
  bio: string;
  location: string;
  avatar: string;
  customAvatar?: string; // For customizable avatar
  coverImage: string;
  themeColor: string;
  socialLinks: {
    spotify: string;
    instagram: string;
    twitter: string;
    facebook: string;
    website: string;
  };
  privacySettings: {
    isPrivate: boolean;
    showPlaylists: boolean;
    showActivity: boolean;
  };
  favoriteGenres: string[];
}

// Theme color options
const themeColors = [
  { name: 'Blue Gradient', value: 'bg-gradient-to-r from-blue-600 to-indigo-600' },
  { name: 'Purple Gradient', value: 'bg-gradient-to-r from-purple-600 to-pink-600' },
  { name: 'Green Gradient', value: 'bg-gradient-to-r from-green-500 to-teal-500' },
  { name: 'Orange Gradient', value: 'bg-gradient-to-r from-orange-500 to-red-500' },
  { name: 'Pink Gradient', value: 'bg-gradient-to-r from-pink-500 to-rose-500' },
  { name: 'Spotify Green', value: 'bg-gradient-to-r from-green-500 to-green-600' },
  { name: 'Dark Mode', value: 'bg-gradient-to-r from-gray-800 to-gray-900' },
  { name: 'Neon Night', value: 'bg-gradient-to-r from-purple-800 to-blue-900' },
];

// Banner options
const bannerOptions = [
  { name: 'Abstract Music', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&h=300&q=80' },
  { name: 'Concert', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&h=300&q=80' },
  { name: 'Studio', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&h=300&q=80' },
  { name: 'Vinyl Records', url: 'https://images.unsplash.com/photo-1535992165812-68d1861aa71e?auto=format&fit=crop&w=1200&h=300&q=80' },
  { name: 'DJ Mixer', url: 'https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=1200&h=300&q=80' },
  { name: 'Neon Lights', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&h=300&q=80' },
];

// Avatar options
const avatarOptions = [
  { name: 'Default 1', url: 'https://picsum.photos/200/200?random=1' },
  { name: 'Default 2', url: 'https://picsum.photos/200/200?random=2' },
  { name: 'Default 3', url: 'https://picsum.photos/200/200?random=3' },
  { name: 'Default 4', url: 'https://picsum.photos/200/200?random=4' },
  { name: 'Default 5', url: 'https://picsum.photos/200/200?random=5' },
];

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ initialProfile, onSave, onCancel }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState<'basic' | 'appearance' | 'social' | 'privacy'>('basic');
  const [isUploading, setIsUploading] = useState(false);
  const [genreInput, setGenreInput] = useState('');
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle social links changes
  const handleSocialChange = (platform: keyof UserProfile['socialLinks'], value: string) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };
  
  // Handle privacy settings changes
  const handlePrivacyChange = (setting: keyof UserProfile['privacySettings'], value: boolean) => {
    setProfile(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [setting]: value
      }
    }));
  };
  
  // Handle avatar selection
  const handleAvatarSelect = (url: string) => {
    setProfile(prev => ({
      ...prev,
      avatar: url
    }));
  };
  
  // Handle banner selection
  const handleBannerSelect = (url: string) => {
    setProfile(prev => ({
      ...prev,
      coverImage: url
    }));
  };
  
  // Handle theme color selection
  const handleThemeSelect = (value: string) => {
    setProfile(prev => ({
      ...prev,
      themeColor: value
    }));
  };
  
  // Simulate file upload (in a real implementation, this would upload to a server)
  const handleFileUpload = (type: 'avatar' | 'cover' | 'customAvatar') => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // In a real implementation, this would be the URL returned from the server
      const mockUrl = type === 'cover' 
        ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&h=300&q=80' 
        : 'https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 100);
      
      if (type === 'avatar') {
        setProfile(prev => ({ ...prev, avatar: mockUrl }));
      } else if (type === 'cover') {
        setProfile(prev => ({ ...prev, coverImage: mockUrl }));
      } else if (type === 'customAvatar') {
        setProfile(prev => ({ ...prev, customAvatar: mockUrl }));
      }
      
      setIsUploading(false);
    }, 1500);
  };
  
  // Handle adding a genre
  const handleAddGenre = () => {
    if (genreInput && !profile.favoriteGenres.includes(genreInput)) {
      setProfile(prev => ({
        ...prev,
        favoriteGenres: [...prev.favoriteGenres, genreInput]
      }));
      setGenreInput('');
    }
  };
  
  // Handle removing a genre
  const handleRemoveGenre = (genre: string) => {
    setProfile(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.filter(g => g !== genre)
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };
  
  return (
    <div className="bg-gray-900 shadow rounded-lg border border-gray-800 max-w-4xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold gradient-text">Customize Your Profile</h2>
        <p className="text-gray-400 text-sm mt-1">Build your perfect music profile experience</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="flex overflow-x-auto">
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'basic' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'appearance' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'social' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('social')}
          >
            Social & Music
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'privacy' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
        </div>
      </div>
      
      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-white">
                  Display Name (optional)
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={profile.displayName || ''}
                  onChange={handleChange}
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
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-white">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                  placeholder="Tell us about yourself, your music taste, and what kind of playlists you create..."
                />
              </div>
            </div>
          )}
          
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Profile Pictures */}
              <div>
                <h3 className="text-white font-medium mb-3">Profile Pictures</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Main Avatar */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-white mb-2">
                        Profile Photo
                      </label>
                      <div className="flex items-center">
                        <img 
                          src={profile.avatar} 
                          alt="Profile Avatar" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                        />
                        <div className="ml-4 flex flex-col space-y-2">
                          <button
                            type="button"
                            onClick={() => handleFileUpload('avatar')}
                            className={`px-3 py-1.5 border border-gray-700 rounded-md text-sm text-white bg-gray-800 hover:bg-gray-700 flex items-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              'Upload Photo'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {avatarOptions.map((avatar, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAvatarSelect(avatar.url)}
                          className={`relative rounded-full overflow-hidden h-12 w-12 ${profile.avatar === avatar.url ? 'ring-2 ring-blue-500' : ''}`}
                        >
                          <img 
                            src={avatar.url} 
                            alt={avatar.name} 
                            className="h-full w-full object-cover"
                          />
                          {profile.avatar === avatar.url && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                              <CheckIcon className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Avatar */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-white mb-2">
                        Custom Avatar (Optional)
                      </label>
                      <div className="flex items-center">
                        <div className="w-20 h-20 rounded-full border-2 border-blue-500 flex items-center justify-center bg-gray-700 overflow-hidden">
                          {profile.customAvatar ? (
                            <img 
                              src={profile.customAvatar} 
                              alt="Custom Avatar" 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500 text-xs text-center px-1">No custom avatar</span>
                          )}
                        </div>
                        <div className="ml-4 flex flex-col space-y-2">
                          <button
                            type="button"
                            onClick={() => handleFileUpload('customAvatar')}
                            className={`px-3 py-1.5 border border-gray-700 rounded-md text-sm text-white bg-gray-800 hover:bg-gray-700 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isUploading}
                          >
                            {isUploading ? 'Uploading...' : 'Upload Avatar'}
                          </button>
                          {profile.customAvatar && (
                            <button
                              type="button"
                              onClick={() => setProfile(prev => ({ ...prev, customAvatar: undefined }))}
                              className="px-3 py-1.5 border border-gray-700 rounded-md text-sm text-red-400 bg-gray-800 hover:bg-gray-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Show your personality with a custom avatar image
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Banner Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Profile Banner
                </label>
                <div className="relative h-40 bg-gray-800 rounded-lg overflow-hidden mb-3">
                  <img 
                    src={profile.coverImage} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${profile.themeColor} opacity-40`}></div>
                  <button
                    type="button"
                    onClick={() => handleFileUpload('cover')}
                    className="absolute bottom-3 right-3 px-3 py-1.5 border border-gray-700 rounded-md text-sm text-white bg-gray-900 bg-opacity-70 hover:bg-opacity-90"
                  >
                    Upload Custom
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {bannerOptions.map((banner, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleBannerSelect(banner.url)}
                      className={`relative rounded-lg overflow-hidden h-20 ${profile.coverImage === banner.url ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <img 
                        src={banner.url} 
                        alt={banner.name} 
                        className="h-full w-full object-cover"
                      />
                      {profile.coverImage === banner.url && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                          <CheckIcon className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Color Theme */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Profile Theme
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {themeColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleThemeSelect(color.value)}
                      className={`h-10 rounded-md ${color.value} ${
                        profile.themeColor === color.value ? 'ring-2 ring-white' : ''
                      }`}
                      aria-label={`Select ${color.name} theme`}
                    >
                      {profile.themeColor === color.value && (
                        <CheckIcon className="h-6 w-6 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              {/* Favorite Genres */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Favorite Genres
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.favoriteGenres.map((genre) => (
                    <span key={genre} className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm flex items-center">
                      {genre}
                      <button
                        type="button"
                        onClick={() => handleRemoveGenre(genre)}
                        className="ml-1 text-gray-400 hover:text-gray-300"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    placeholder="Add a genre..."
                    className="flex-grow rounded-l-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGenre}
                    className="px-4 py-2 rounded-r-md bg-blue-600 text-white font-medium hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Social Links
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-sm text-white w-24">Spotify:</span>
                    <input
                      type="url"
                      value={profile.socialLinks.spotify}
                      onChange={(e) => handleSocialChange('spotify', e.target.value)}
                      placeholder="https://open.spotify.com/user/..."
                      className="flex-1 rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-white w-24">Instagram:</span>
                    <input
                      type="url"
                      value={profile.socialLinks.instagram}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="flex-1 rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-white w-24">Twitter:</span>
                    <input
                      type="url"
                      value={profile.socialLinks.twitter}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                      placeholder="https://twitter.com/..."
                      className="flex-1 rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-white w-24">Facebook:</span>
                    <input
                      type="url"
                      value={profile.socialLinks.facebook}
                      onChange={(e) => handleSocialChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="flex-1 rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-white w-24">Website:</span>
                    <input
                      type="url"
                      value={profile.socialLinks.website}
                      onChange={(e) => handleSocialChange('website', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-medium mb-4">Privacy Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">Private Account</h4>
                      <p className="text-xs text-gray-400">Only followers can see your profile content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={profile.privacySettings.isPrivate}
                        onChange={(e) => handlePrivacyChange('isPrivate', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">Public Playlists</h4>
                      <p className="text-xs text-gray-400">Allow everyone to discover your playlists</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={profile.privacySettings.showPlaylists}
                        onChange={(e) => handlePrivacyChange('showPlaylists', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">Show Listening Activity</h4>
                      <p className="text-xs text-gray-400">Display your recently played tracks on your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={profile.privacySettings.showActivity}
                        onChange={(e) => handlePrivacyChange('showActivity', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <strong>Note:</strong> Even with a private account, your playlists can still be discovered if the "Public Playlists" option is enabled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-800 flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700"
          >
            Cancel
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setProfile(initialProfile)}
              className="px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Save Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileBuilder; 