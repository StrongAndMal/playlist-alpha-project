import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CursorArrowRippleIcon, MagnifyingGlassIcon, FingerPrintIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

interface FeaturePopupProps {
  onClose: () => void;
}

const FeaturePopup: React.FC<FeaturePopupProps> = ({ onClose }) => {
  const features = [
    {
      name: 'Enhanced Hover Preview',
      description: 'Hover over songs to instantly see detailed audio features and metrics',
      icon: CursorArrowRippleIcon,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      name: 'Spotify One-Click',
      description: 'Export discoveries directly to your Spotify account with a single click',
      icon: MusicalNoteIcon,
      color: 'from-red-500 to-pink-600'
    },
    {
      name: 'Collections',
      description: 'Save unlimited playlists and access them across all your devices',
      icon: FingerPrintIcon,
      color: 'from-amber-500 to-yellow-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-2xl leading-6 font-bold text-white" id="modal-title">
                  Discover Music in New Ways
                </h3>
                <div className="mt-4">
                  <p className="text-gray-300">
                    Welcome to My Playlist Finder! Here's how we help you discover music:
                  </p>
                  
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {features.map((feature) => (
                      <div 
                        key={feature.name} 
                        className={`flex flex-col items-center bg-gradient-to-r ${feature.color} rounded-lg p-4 shadow-lg hover:scale-105 transition-transform duration-300`}
                      >
                        <feature.icon className="h-8 w-8 text-white mb-2" aria-hidden="true" />
                        <h4 className="text-lg font-semibold text-white">{feature.name}</h4>
                        <p className="text-sm text-white opacity-90 text-center">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-base font-medium text-white hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Explore Now
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-gray-200 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Remind me later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturePopup; 