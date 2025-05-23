import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import BrowseDropdownMenu from './BrowseDropdownMenu';

const NavigationBar: React.FC = () => {
  const [isBrowseDropdownOpen, setIsBrowseDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoAnimation, setLogoAnimation] = useState(false);
  const browseDropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (browseDropdownRef.current && !browseDropdownRef.current.contains(event.target as Node)) {
        setIsBrowseDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here (will be implemented in future)
    console.log('Searching for:', searchQuery);
    // For prototype, we would redirect to search results
    // history.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  
  const handleLogoClick = () => {
    setLogoAnimation(true);
    // Reset animation after it completes to allow re-triggering
    setTimeout(() => setLogoAnimation(false), 2000);
  };
  
  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className={`text-blue-500 font-bold text-xl btn-hover-scale ${logoAnimation ? 'animate-logo-color' : ''}`}
                onClick={handleLogoClick}
              >
                My Playlist Finder
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <Link to="/" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              
              {/* Browse dropdown */}
              <div className="relative" ref={browseDropdownRef}>
                <button 
                  className="text-white hover:text-blue-400 group px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                  onClick={() => setIsBrowseDropdownOpen(!isBrowseDropdownOpen)}
                  onMouseEnter={() => setIsBrowseDropdownOpen(true)}
                >
                  <span>Browse</span>
                  <ChevronDownIcon 
                    className={`ml-1 h-4 w-4 transition-transform ${isBrowseDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Browse Dropdown Menu */}
                <BrowseDropdownMenu 
                  isOpen={isBrowseDropdownOpen} 
                  onClose={() => setIsBrowseDropdownOpen(false)} 
                />
              </div>
              
              <Link to="/community" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                Community
              </Link>
              <Link to="/playlists/trending" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                Trending
              </Link>
              {isAuthenticated && (
                <Link to="/submit" className="text-white hover:text-blue-300 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">
                  Submit Playlist
                </Link>
              )}
            </div>
          </div>
          
          {/* Right side - Search and user menu */}
          <div className="flex items-center">
            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="relative mr-4">
              <div className="flex items-center border border-gray-700 rounded-full focus-within:ring-2 focus-within:ring-blue-500 bg-gray-800">
                <input
                  type="text"
                  placeholder="Search tracks or users..."
                  className="bg-transparent text-white rounded-full py-1.5 pl-4 pr-10 focus:outline-none w-48 md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-2 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
            
            {/* Auth links - Conditional rendering */}
            <div className="hidden md:flex items-center space-x-3 ml-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center text-white hover:text-white transition-all duration-300 hover:shadow-md rounded-full"
                  >
                    <img
                      src={user?.avatar || 'https://picsum.photos/200/200'}
                      alt={user?.username || 'User'}
                      className="w-8 h-8 rounded-full mr-2 transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=User';
                      }}
                    />
                    <span>{user?.username}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-blue-400 px-3 py-2 text-sm font-medium">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="gradient-bg text-white px-4 py-2 rounded-full text-sm font-medium btn-hover-scale btn-hover-glow"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile menu button - shown on small screens */}
            <button className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - shown on small screens */}
      {/* Mobile menu implementation would go here */}
    </nav>
  );
};

export default NavigationBar; 