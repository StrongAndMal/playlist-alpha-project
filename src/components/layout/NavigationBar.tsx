import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { getGenreImage, getRandomImage, stockImages } from '../../utils/imageUtils';
import BrowseDropdownMenu from '../ui/BrowseDropdownMenu';

// Top genres organized by category for the dropdown with reliable images
const topGenres = [
  { name: 'Pop', image: getGenreImage('Pop') },
  { name: 'Hip-Hop', image: getGenreImage('Hip-Hop') },
  { name: 'Rock', image: getGenreImage('Rock') },
  { name: 'R&B', image: getGenreImage('R&B') || stockImages.genres.default },
  { name: 'Electronic', image: getGenreImage('Electronic') },
  { name: 'Country', image: getGenreImage('Country') || stockImages.genres.default },
  { name: 'K-Pop', image: getGenreImage('K-Pop') },
  { name: 'Latin', image: getGenreImage('Latin') || stockImages.genres.default },
  { name: 'Indie', image: getGenreImage('Indie') || stockImages.genres.default },
  { name: 'Jazz', image: getGenreImage('Jazz') },
  { name: 'Classical', image: getGenreImage('Classical') },
  { name: 'Metal', image: getGenreImage('Metal') || stockImages.genres.default },
];

// Other genres for the "View all" page
const allGenres = [
  'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'EDM', 'Dance', 'Electronic', 
  'Jazz', 'Blues', 'Soul', 'Classical', 'Folk', 'Reggae', 'Metal', 
  'Punk', 'Alternative', 'Indie', 'K-Pop', 'J-Pop', 'Latin', 'Trap', 
  'Disco', 'Funk', 'Gospel', 'House', 'Techno', 'Ambient', 'Lo-Fi', 
  'Dubstep', 'Drum & Bass', 'Trance', 'Synthwave', 'Grime', 'Drill', 
  'Opera', 'Bluegrass', 'Psychedelic', 'Ska', 'Grunge', 'New Wave', 
  'Rap', 'Emo', 'Post-rock', 'Progressive', 'Experimental', 'World Music',
  'Afrobeat', 'Salsa', 'Flamenco'
];

const NavigationBar: React.FC = () => {
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoAnimation, setLogoAnimation] = useState(false);
  const [defaultAvatar] = useState(getRandomImage(stockImages.userProfile));
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGenreDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Reset search when location changes
  useEffect(() => {
    setSearchQuery('');
    setIsSearchOpen(false);
  }, [location.pathname]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // Close mobile search after submission
      if (isSearchOpen) {
        setIsSearchOpen(false);
      }
    }
  };
  
  const handleLogoClick = () => {
    setLogoAnimation(true);
    // Reset animation after it completes to allow re-triggering
    setTimeout(() => setLogoAnimation(false), 2000);
  };

  // Handle image loading error in a genre card
  const handleGenreImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, genreName: string) => {
    e.currentTarget.src = stockImages.genres.default;
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close search if opening menu
    if (!isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    const newSearchState = !isSearchOpen;
    setIsSearchOpen(newSearchState);
    
    // Focus the input after search is opened
    if (newSearchState) {
      setTimeout(() => {
        if (mobileSearchInputRef.current) {
          mobileSearchInputRef.current.focus();
        }
      }, 100);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    } else if (mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
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
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="text-white hover:text-blue-400 group px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                  onMouseEnter={() => setIsGenreDropdownOpen(true)}
                >
                  <span>Browse</span>
                  <ChevronDownIcon 
                    className={`ml-1 h-4 w-4 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Browse Dropdown Menu */}
                <BrowseDropdownMenu 
                  isOpen={isGenreDropdownOpen} 
                  onClose={() => setIsGenreDropdownOpen(false)} 
                />
              </div>

              {isAuthenticated && (
                <Link to="/submit" className="text-white hover:text-blue-300 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">
                  Submit Playlist
                </Link>
              )}
            </div>
          </div>
          
          {/* Right side - Search and user menu */}
          <div className="flex items-center">
            {/* Desktop Search */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block mr-4">
              <div className="flex items-center border border-gray-700 rounded-full focus-within:ring-2 focus-within:ring-blue-500 bg-gray-800">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search tracks or users..."
                  className="bg-transparent text-white rounded-full py-1.5 pl-4 pr-10 focus:outline-none w-48 md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-white"
                  >
                    <XMarkIcon className="h-5 w-5 mr-1" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-2 py-1.5 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Mobile Search Toggle */}
            <div className="sm:hidden">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-md text-gray-400 hover:text-white"
                aria-label="Toggle search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Auth links - Conditional rendering */}
            <div className="hidden md:flex items-center space-x-3 ml-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center text-white hover:text-white transition-all duration-300 hover:shadow-md rounded-full"
                  >
                    <img
                      src={user?.avatar || defaultAvatar}
                      alt={user?.username || 'User'}
                      className="w-8 h-8 rounded-full mr-2 transition-transform duration-300 hover:scale-110"
                      onError={(e) => {e.currentTarget.src = defaultAvatar}}
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
                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      className="gradient-bg text-white px-4 py-2 rounded-full text-sm font-medium btn-hover-scale btn-hover-glow"
                    >
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
            
            {/* Mobile menu button - shown on small screens */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden ml-2 flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - shown on small screens */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 p-4 shadow-lg">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="text-white py-2 hover:text-blue-400">
              Home
            </Link>
            <Link to="/browse" className="text-white py-2 hover:text-blue-400">
              Browse
            </Link>
            {isAuthenticated && (
              <Link to="/submit" className="text-white py-2 hover:text-blue-400">
                Submit Playlist
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-white py-2 hover:text-blue-400">
                  Profile
                </Link>
                <button onClick={logout} className="text-white py-2 hover:text-blue-400 text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white py-2 hover:text-blue-400">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Search Panel */}
      {isSearchOpen && (
        <div className="sm:hidden fixed top-16 left-0 right-0 bg-gray-800 p-3 shadow-lg z-50 animate-slide-down">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center border border-gray-700 rounded-full focus-within:ring-2 focus-within:ring-blue-500 bg-gray-800">
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white rounded-full py-2 pl-4 pr-10 focus:outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-10 text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 h-full px-2 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar; 