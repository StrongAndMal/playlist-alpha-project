import React, { useState, useEffect } from 'react';
import { XMarkIcon, TrashIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { User } from '../../types/user';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    username: user.username || '',
    bio: user.bio || '',
    profilePicture: user.profilePicture || '',
    bannerImage: user.bannerImage || '',
    spotifyUrl: user.spotifyUrl || '',
    twitterUrl: user.twitterUrl || '',
    instagramUrl: user.instagramUrl || ''
  });
  
  // Files for upload
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  
  // Preview URLs for images
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>(user.profilePicture || '');
  const [bannerImagePreview, setBannerImagePreview] = useState<string>(user.bannerImage || '');
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear individual field error when user edits
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = {...prev};
        delete updated[name];
        return updated;
      });
    }
  };
  
  // Handle file changes
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          profilePicture: 'Image too large. Please select an image under 5MB.'
        }));
        return;
      }
      
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
      
      // Clear error if exists
      if (formErrors.profilePicture) {
        setFormErrors(prev => {
          const updated = {...prev};
          delete updated.profilePicture;
          return updated;
        });
      }
    }
  };
  
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          bannerImage: 'Image too large. Please select an image under 5MB.'
        }));
        return;
      }
      
      setBannerImageFile(file);
      setBannerImagePreview(URL.createObjectURL(file));
      
      // Clear error if exists
      if (formErrors.bannerImage) {
        setFormErrors(prev => {
          const updated = {...prev};
          delete updated.bannerImage;
          return updated;
        });
      }
    }
  };
  
  // Handle remove image buttons
  const handleRemoveBannerImage = () => {
    setBannerImageFile(null);
    setBannerImagePreview('');
    setFormData(prev => ({ ...prev, bannerImage: '' }));
  };
  
  const handleRemoveProfilePicture = () => {
    setProfilePictureFile(null);
    setProfilePicturePreview('');
    setFormData(prev => ({ ...prev, profilePicture: '' }));
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Display name validation
    if (!formData.displayName.trim()) {
      errors.displayName = 'Display name is required';
    }
    
    // Bio validation
    if (formData.bio.length > 160) {
      errors.bio = 'Bio must be 160 characters or less';
    }
    
    // URL validations
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    if (formData.spotifyUrl && !urlRegex.test(formData.spotifyUrl)) {
      errors.spotifyUrl = 'Please enter a valid URL';
    }
    
    if (formData.twitterUrl && !urlRegex.test(formData.twitterUrl)) {
      errors.twitterUrl = 'Please enter a valid URL';
    }
    
    if (formData.instagramUrl && !urlRegex.test(formData.instagramUrl)) {
      errors.instagramUrl = 'Please enter a valid URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('displayName', formData.displayName);
      // We'll assume username is read-only post-registration
      formDataToSend.append('bio', formData.bio);
      
      // Optional social links
      if (formData.spotifyUrl) formDataToSend.append('spotifyUrl', formData.spotifyUrl);
      if (formData.twitterUrl) formDataToSend.append('twitterUrl', formData.twitterUrl);
      if (formData.instagramUrl) formDataToSend.append('instagramUrl', formData.instagramUrl);
      
      // Add files if selected
      if (profilePictureFile) {
        formDataToSend.append('profilePicture', profilePictureFile);
      } else if (formData.profilePicture) {
        formDataToSend.append('profilePictureUrl', formData.profilePicture);
      }
      
      if (bannerImageFile) {
        formDataToSend.append('bannerImage', bannerImageFile);
      } else if (formData.bannerImage) {
        formDataToSend.append('bannerImageUrl', formData.bannerImage);
      }
      
      // Send update request
      const { data } = await axios.put('/api/users/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Show success message briefly
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        // Call onSave with updated user data
        onSave(data.user);
      }, 1000);
      
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (profilePictureFile) URL.revokeObjectURL(profilePicturePreview);
      if (bannerImageFile) URL.revokeObjectURL(bannerImagePreview);
    };
  }, [profilePictureFile, bannerImageFile, profilePicturePreview, bannerImagePreview]);
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-80 backdrop-blur-sm transition-opacity">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Modal dialog */}
        <div className="inline-block align-bottom bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-700">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white bg-gray-800 rounded-full p-1 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-xl font-medium text-white mb-4 flex items-center">
              <span>Edit Profile</span>
              <div className="h-px bg-gradient-to-r from-blue-500 to-purple-500 flex-grow ml-3 opacity-50"></div>
            </h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900 bg-opacity-40 text-red-200 rounded-md border border-red-800">
                <p className="font-medium">{error}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 p-3 bg-green-900 bg-opacity-40 text-green-200 rounded-md border border-green-800">
                <p className="font-medium">{successMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Banner Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Banner Image
                </label>
                <div className="relative h-36 w-full overflow-hidden rounded-lg bg-gray-700 mb-2 border border-gray-600">
                  {bannerImagePreview ? (
                    <img
                      src={bannerImagePreview}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400 text-sm">No banner image selected</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      id="bannerImage"
                      accept="image/*"
                      onChange={handleBannerImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <label 
                      htmlFor="bannerImage"
                      className="flex items-center justify-center px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm cursor-pointer transition-colors w-full"
                    >
                      <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                      Choose File
                    </label>
                  </div>
                  
                  {bannerImagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveBannerImage}
                      className="px-3 py-2 rounded-md bg-red-700 hover:bg-red-600 text-white text-sm transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {formErrors.bannerImage && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.bannerImage}</p>
                )}
                
                <p className="mt-1 text-xs text-gray-500">Recommended size: 1200 x 300 pixels</p>
              </div>
              
              {/* Profile Picture */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-700 border border-gray-600 flex-shrink-0">
                    {profilePicturePreview ? (
                      <img
                        src={profilePicturePreview}
                        alt="Profile picture preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 text-xs">No image</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="relative">
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <label 
                        htmlFor="profilePicture"
                        className="flex items-center justify-center px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm cursor-pointer transition-colors w-full"
                      >
                        <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                        Choose File
                      </label>
                    </div>
                    
                    {profilePicturePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveProfilePicture}
                        className="px-3 py-2 rounded-md bg-red-700 hover:bg-red-600 text-white text-sm transition-colors w-full"
                      >
                        <TrashIcon className="h-4 w-4 mr-2 inline-block" />
                        Remove
                      </button>
                    )}
                    
                    {formErrors.profilePicture && (
                      <p className="text-xs text-red-400">{formErrors.profilePicture}</p>
                    )}
                    
                    <p className="text-xs text-gray-500">Recommended: Square image</p>
                  </div>
                </div>
              </div>
              
              {/* Display Name */}
              <div className="mb-4">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-md bg-gray-700 text-white border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.displayName ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {formErrors.displayName && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.displayName}</p>
                )}
              </div>
              
              {/* Username (Read-only) */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  readOnly
                  className="w-full px-3 py-2 rounded-md bg-gray-600 text-gray-300 border border-gray-600 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Used in profile URL and mentions. Cannot be changed.</p>
              </div>
              
              {/* Bio */}
              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={160}
                  className={`w-full px-3 py-2 rounded-md bg-gray-700 text-white border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.bio ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                <div className="mt-1 flex justify-between">
                  <p className={`text-xs ${formData.bio.length >= 140 ? 'text-yellow-500' : 'text-gray-500'}`}>
                    {formData.bio.length}/160 characters
                  </p>
                  {formErrors.bio && (
                    <p className="text-xs text-red-400">{formErrors.bio}</p>
                  )}
                </div>
              </div>
              
              {/* Social Links (Optional) */}
              <div className="mt-6 mb-4">
                <h4 className="text-md font-medium text-white mb-3 flex items-center">
                  <span>Social Links</span>
                  <span className="text-xs text-gray-400 ml-2">(Optional)</span>
                  <div className="h-px bg-gradient-to-r from-blue-500 to-purple-500 flex-grow ml-3 opacity-30"></div>
                </h4>
              </div>
              
              {/* Spotify URL */}
              <div className="mb-4">
                <label htmlFor="spotifyUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  Spotify Profile URL
                </label>
                <input
                  type="url"
                  id="spotifyUrl"
                  name="spotifyUrl"
                  value={formData.spotifyUrl}
                  onChange={handleInputChange}
                  placeholder="https://open.spotify.com/user/yourusername"
                  className={`w-full px-3 py-2 rounded-md bg-gray-700 text-white border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.spotifyUrl ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {formErrors.spotifyUrl && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.spotifyUrl}</p>
                )}
              </div>
              
              {/* Twitter URL */}
              <div className="mb-4">
                <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  Twitter URL
                </label>
                <input
                  type="url"
                  id="twitterUrl"
                  name="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/yourusername"
                  className={`w-full px-3 py-2 rounded-md bg-gray-700 text-white border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.twitterUrl ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {formErrors.twitterUrl && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.twitterUrl}</p>
                )}
              </div>
              
              {/* Instagram URL */}
              <div className="mb-6">
                <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  id="instagramUrl"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourusername"
                  className={`w-full px-3 py-2 rounded-md bg-gray-700 text-white border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.instagramUrl ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {formErrors.instagramUrl && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.instagramUrl}</p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal; 