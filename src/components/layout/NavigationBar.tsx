import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

// Top genres organized by category for the dropdown
const topGenres = [
  { name: 'Pop', trending: true, image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'Hip-Hop', trending: true, image: 'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'Rock', trending: true, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'R&B', trending: true, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'Electronic', trending: true, image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'Country', trending: false, image: 'https://images.unsplash.com/photo-1543862475-eb136770ae9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'K-Pop', trending: true, image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'Latin', trending: true, image: 'https://images.unsplash.com/photo-1504609813442-a9924e2973ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'Indie', trending: true, image: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'Jazz', trending: false, image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'Classical', trending: false, image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'Metal', trending: false, image: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  
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
              
              {/* Genre dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="text-white hover:text-blue-400 group px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                >
                  <span>Genres</span>
                  <ChevronDownIcon 
                    className={`ml-1 h-4 w-4 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* New styled dropdown panel */}
                {isGenreDropdownOpen && (
                  <div className="absolute z-50 left-0 mt-2 w-96 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 text-white">
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-blue-400 mb-3">Explore Genres</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {topGenres.map((genre) => (
                          <Link
                            key={genre.name}
                            to={`/genre/${genre.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="group relative overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg"
                            onClick={() => setIsGenreDropdownOpen(false)}
                          >
                            <div className="relative h-24 w-full">
                              <div className="absolute inset-0 bg-gray-900 opacity-40 group-hover:opacity-20 transition-opacity"></div>
                              <img 
                                src={genre.image} 
                                alt={genre.name} 
                                className="h-full w-full object-cover" 
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <h4 className="text-white font-medium group-hover:scale-110 transition-transform duration-300">
                                    {genre.name}
                                  </h4>
                                  {genre.trending && (
                                    <span className="inline-flex items-center mt-1 text-yellow-300 text-xs">
                                      <SparklesIcon className="h-3 w-3 mr-1" />
                                      Trending
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-700 text-right">
                        <Link
                          to="/genres"
                          className="inline-block text-sm text-blue-400 hover:text-blue-300"
                          onClick={() => setIsGenreDropdownOpen(false)}
                        >
                          View all genres →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/community" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                Community
              </Link>
              <Link to="/trending" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
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
            
            {/* Premium button */}
            <Link
              to="/premium"
              className="hidden md:flex items-center ml-4 text-yellow-400 hover:text-yellow-300 px-3 py-2 text-sm font-medium"
            >
              <span className="mr-1">
                <SparklesIcon className="h-4 w-4 inline" />
              </span>
              Premium
            </Link>
            
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