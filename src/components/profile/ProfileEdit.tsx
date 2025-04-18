import React, { useState, useEffect } from 'react';
import { UserCircleIcon, XMarkIcon, PencilIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface ProfileEditProps {
  userProfile: {
    displayName: string;
    username: string;
    bio: string;
    avatarUrl: string;
    bannerUrl?: string;
  };
  onSave: (profile: any) => Promise<void>;
  onCancel: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ userProfile, onSave, onCancel }) => {
  const [profile, setProfile] = useState({
    displayName: '',
    username: '',
    bio: '',
    avatarUrl: '',
    bannerUrl: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (userProfile) {
      setProfile({
        displayName: userProfile.displayName || '',
        username: userProfile.username || '',
        bio: userProfile.bio || '',
        avatarUrl: userProfile.avatarUrl || '',
        bannerUrl: userProfile.bannerUrl || ''
      });
      setAvatarPreview(userProfile.avatarUrl || '');
      setBannerPreview(userProfile.bannerUrl || '');
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    setProfile({ ...profile, avatarUrl: '' });
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview('');
    setProfile({ ...profile, bannerUrl: '' });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!profile.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    if (!profile.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(profile.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (profile.bio && profile.bio.length > 160) {
      newErrors.bio = 'Bio must be 160 characters or less';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real application, you would upload the files to a server
    // For this example, we'll just simulate an API call with the file data
    try {
      // Simulating file uploads and getting back URLs
      // In a real app, you would upload the files to your server/cloud storage
      const updatedProfile = { ...profile };
      
      if (avatarFile) {
        // updatedProfile.avatarUrl would be set to the URL returned from your server
        // This is a placeholder for demonstration
        updatedProfile.avatarUrl = avatarPreview;
      }
      
      if (bannerFile) {
        // updatedProfile.bannerUrl would be set to the URL returned from your server
        // This is a placeholder for demonstration
        updatedProfile.bannerUrl = bannerPreview;
      }
      
      await onSave(updatedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Edit Profile</h2>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Banner Upload */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">Banner Image</label>
          <div 
            className="h-32 bg-gray-800 rounded-lg overflow-hidden relative"
            style={{ 
              backgroundImage: bannerPreview ? `url(${bannerPreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!bannerPreview && (
              <div className="absolute inset-0 flex items-center justify-center">
                <PhotoIcon className="h-12 w-12 text-gray-600" />
              </div>
            )}
            
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <label className="bg-gray-700 text-white p-2 rounded-full cursor-pointer hover:bg-gray-600">
                <PencilIcon className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </label>
              
              {bannerPreview && (
                <button
                  type="button"
                  onClick={removeBanner}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-1">Recommended size: 1200 x 300px</p>
        </div>
        
        {/* Avatar Upload */}
        <div className="mb-6 flex items-start">
          <div className="relative mr-4">
            <div 
              className="h-24 w-24 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center"
            >
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile avatar preview" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-16 w-16 text-gray-600" />
              )}
            </div>
            
            <div className="absolute bottom-0 right-0 flex space-x-1">
              <label className="bg-gray-700 text-white p-1.5 rounded-full cursor-pointer hover:bg-gray-600">
                <PencilIcon className="h-3.5 w-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
              
              {avatarPreview && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-white font-medium mb-1">Profile Picture</p>
            <p className="text-gray-400 text-sm">
              Upload a profile picture to make your profile more personal.
              Square images work best.
            </p>
          </div>
        </div>
        
        {/* Display Name */}
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-white font-medium mb-2">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={profile.displayName}
            onChange={handleChange}
            className={`bg-gray-800 text-white rounded-md w-full px-3 py-2 border ${errors.displayName ? 'border-red-500' : 'border-gray-700'}`}
          />
          {errors.displayName && (
            <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>
          )}
        </div>
        
        {/* Username */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-white font-medium mb-2">
            Username
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">@</span>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className={`bg-gray-800 text-white rounded-md w-full pl-8 pr-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-700'}`}
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            This will be your unique identifier used in URLs and mentions.
          </p>
        </div>
        
        {/* Bio */}
        <div className="mb-6">
          <label htmlFor="bio" className="block text-white font-medium mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows={3}
            className={`bg-gray-800 text-white rounded-md w-full px-3 py-2 border ${errors.bio ? 'border-red-500' : 'border-gray-700'}`}
            placeholder="Tell others a bit about yourself..."
          ></textarea>
          <div className="flex justify-between mt-1">
            {errors.bio ? (
              <p className="text-red-500 text-sm">{errors.bio}</p>
            ) : (
              <p className="text-gray-500 text-xs">
                Brief description for your profile. Max 160 characters.
              </p>
            )}
            <p className={`text-xs ${profile.bio.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
              {profile.bio.length}/160
            </p>
          </div>
        </div>
        
        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
            <p className="text-red-400 text-sm">{errors.submit}</p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit; 