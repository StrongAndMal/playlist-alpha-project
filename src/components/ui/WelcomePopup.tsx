import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface WelcomePopupProps {
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Animation states
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setFadeIn(false);
    // Wait for fade out animation before closing
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`w-full max-w-lg mx-4 transform transition-all duration-300 ${fadeIn ? 'translate-y-0' : 'translate-y-4'}`}>
        <div className="relative rounded-lg shadow-xl overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 gradient-bg opacity-70"></div>
          
          {/* Content with dark background */}
          <div className="relative m-[2px] bg-gray-900 rounded-lg p-6 sm:p-8">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-3xl leading-6 font-bold gradient-text mb-6">
                  Welcome to My Playlist Finder
                </h3>
                <div className="mt-4">
                  <p className="text-gray-300 text-lg mb-6">
                    Discover and share your favorite music playlists with our community.
                    Join thousands of music lovers in exploring new sounds and genres.
                  </p>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 btn-hover-scale"
                  >
                    Explore Now
                  </button>
                  <Link
                    to="/signup"
                    onClick={handleClose}
                    className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 btn-hover-glow btn-hover-slide"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-200"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup; 