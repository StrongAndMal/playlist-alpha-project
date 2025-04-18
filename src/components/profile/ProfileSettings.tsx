import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, UserIcon, PhotoIcon, PaintBrushIcon, LinkIcon } from '@heroicons/react/24/outline';
import AccountReset from './AccountReset';

interface ProfileTheme {
  primaryColor: string;
  secondaryColor: string;
  fontColor: string;
}

interface SocialLink {
  platform: 'spotify' | 'instagram' | 'facebook' | 'twitter' | 'tiktok';
  url: string;
}

interface ProfileSettingsProps {
  userId: string;
  initialSettings?: {
    isPrivate: boolean;
    showCurrentlyListening: boolean;
    publicPlaylists: boolean;
    theme: ProfileTheme;
    socialLinks: SocialLink[];
  };
  onSave: (settings: any) => Promise<void>;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userId, initialSettings, onSave }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'appearance' | 'social' | 'reset'>('privacy');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    isPrivate: false,
    showCurrentlyListening: true,
    publicPlaylists: true,
    theme: {
      primaryColor: '#1DB954',
      secondaryColor: '#191414',
      fontColor: '#ffffff'
    },
    socialLinks: [] as SocialLink[]
  });

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      await onSave(settings);
      setIsSaving(false);
    } catch (error) {
      setSaveError('Failed to save settings. Please try again.');
      setIsSaving(false);
    }
  };

  const handleReset = async (): Promise<void> => {
    // This would be implemented to call the backend API to reset the account
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  };

  const handleSocialLinkChange = (platform: SocialLink['platform'], url: string) => {
    const updatedLinks = [...settings.socialLinks];
    const existingIndex = updatedLinks.findIndex(link => link.platform === platform);
    
    if (existingIndex >= 0) {
      if (url) {
        updatedLinks[existingIndex].url = url;
      } else {
        updatedLinks.splice(existingIndex, 1);
      }
    } else if (url) {
      updatedLinks.push({ platform, url });
    }
    
    setSettings({
      ...settings,
      socialLinks: updatedLinks
    });
  };

  const getSocialLinkValue = (platform: SocialLink['platform']) => {
    const link = settings.socialLinks.find(l => l.platform === platform);
    return link ? link.url : '';
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {showResetConfirm ? (
        <AccountReset 
          onReset={handleReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      ) : (
        <>
          <div className="flex border-b border-gray-800">
            <button
              className={`px-4 py-3 flex items-center space-x-2 ${activeTab === 'privacy' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
              onClick={() => setActiveTab('privacy')}
            >
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Privacy</span>
            </button>
            <button
              className={`px-4 py-3 flex items-center space-x-2 ${activeTab === 'appearance' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
              onClick={() => setActiveTab('appearance')}
            >
              <PaintBrushIcon className="h-5 w-5" />
              <span>Appearance</span>
            </button>
            <button
              className={`px-4 py-3 flex items-center space-x-2 ${activeTab === 'social' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
              onClick={() => setActiveTab('social')}
            >
              <LinkIcon className="h-5 w-5" />
              <span>Social Links</span>
            </button>
            <button
              className={`px-4 py-3 flex items-center space-x-2 ${activeTab === 'reset' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
              onClick={() => setActiveTab('reset')}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Privacy Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Private Account</h4>
                      <p className="text-gray-400 text-sm">Only approved followers can see your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.isPrivate}
                        onChange={() => setSettings({...settings, isPrivate: !settings.isPrivate})}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Public Playlists</h4>
                      <p className="text-gray-400 text-sm">Allow your playlists to be visible even if your account is private</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.publicPlaylists}
                        onChange={() => setSettings({...settings, publicPlaylists: !settings.publicPlaylists})}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Currently Listening</h4>
                      <p className="text-gray-400 text-sm">Show what you're currently listening to on your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.showCurrentlyListening}
                        onChange={() => setSettings({...settings, showCurrentlyListening: !settings.showCurrentlyListening})}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Profile Appearance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Primary Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.theme.primaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          theme: { ...settings.theme, primaryColor: e.target.value }
                        })}
                        className="h-10 w-10 rounded border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.theme.primaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          theme: { ...settings.theme, primaryColor: e.target.value }
                        })}
                        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Secondary Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.theme.secondaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          theme: { ...settings.theme, secondaryColor: e.target.value }
                        })}
                        className="h-10 w-10 rounded border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.theme.secondaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          theme: { ...settings.theme, secondaryColor: e.target.value }
                        })}
                        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">Profile Banner</label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-800/50">
                      <PhotoIcon className="h-12 w-12 text-gray-500 mb-3" />
                      <p className="text-gray-300 mb-2">Drag and drop your banner image here</p>
                      <p className="text-gray-500 text-sm mb-4">PNG, JPG up to 2MB (1200 x 300px recommended)</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Upload Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Social Media Links</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <span className="flex items-center">
                        <svg className="h-5 w-5 mr-2 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.54-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        Spotify URL
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://open.spotify.com/user/yourusername"
                      value={getSocialLinkValue('spotify')}
                      onChange={(e) => handleSocialLinkChange('spotify', e.target.value)}
                      className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <span className="flex items-center">
                        <svg className="h-5 w-5 mr-2 text-[#E1306C]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                        Instagram
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/yourusername"
                      value={getSocialLinkValue('instagram')}
                      onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                      className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <span className="flex items-center">
                        <svg className="h-5 w-5 mr-2 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/yourusername"
                      value={getSocialLinkValue('facebook')}
                      onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                      className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <span className="flex items-center">
                        <svg className="h-5 w-5 mr-2 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://twitter.com/yourusername"
                      value={getSocialLinkValue('twitter')}
                      onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                      className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <span className="flex items-center">
                        <svg className="h-5 w-5 mr-2 text-[#000000]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                        TikTok
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://tiktok.com/@yourusername"
                      value={getSocialLinkValue('tiktok')}
                      onChange={(e) => handleSocialLinkChange('tiktok', e.target.value)}
                      className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reset' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Reset Account</h3>
                <p className="text-gray-300 mb-6">
                  Resetting your account will clear all profile customizations, followers, and activity history. 
                  This is useful for testing or starting fresh. Your playlists and login details will be preserved.
                </p>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reset Account
                </button>
              </div>
            )}
          </div>

          {(activeTab === 'privacy' || activeTab === 'appearance' || activeTab === 'social') && (
            <div className="px-6 py-4 border-t border-gray-800 flex justify-between items-center">
              {saveError && (
                <p className="text-red-400 text-sm">{saveError}</p>
              )}
              <div className="ml-auto">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileSettings; 