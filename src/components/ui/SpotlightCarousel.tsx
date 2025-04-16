import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Featured playlists dummy data
const featuredPlaylists = [
  {
    id: '1',
    title: 'Summer Beats 2025',
    description: 'The hottest tracks to fuel your summer vibes',
    creator: 'DJ Sunshine',
    genre: 'Pop/Dance',
    coverImage: 'https://images.unsplash.com/photo-1525183290645-06e4c0354fd2?auto=format&fit=crop&w=1200&h=400&q=80',
    voteCount: 875,
    commentCount: 113
  },
  {
    id: '2',
    title: 'Chill Lo-Fi Study Mix',
    description: 'Perfect background music for productive study sessions',
    creator: 'Study Guru',
    genre: 'Lo-Fi/Ambient',
    coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&h=400&q=80',
    voteCount: 1243,
    commentCount: 86
  },
  {
    id: '3',
    title: 'Workout Power Hour',
    description: 'High energy tracks to push your workout to the next level',
    creator: 'Fitness King',
    genre: 'EDM/Hip-Hop',
    coverImage: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1200&h=400&q=80',
    voteCount: 967,
    commentCount: 72
  },
  {
    id: '4',
    title: 'Indie Discoveries',
    description: 'Fresh indie tracks you haven\'t heard yet but will love',
    creator: 'Indie Explorer',
    genre: 'Indie/Alternative',
    coverImage: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=1200&h=400&q=80',
    voteCount: 642,
    commentCount: 58
  },
  {
    id: '5',
    title: 'Retro Wave Classics',
    description: 'Take a nostalgic journey with these synthwave hits',
    creator: 'Retrowave Master',
    genre: 'Synthwave/Electronic',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=400&q=80',
    voteCount: 789,
    commentCount: 94
  },
  {
    id: '6',
    title: 'Jazz for Late Nights',
    description: 'Smooth jazz to unwind after a long day',
    creator: 'Jazz Cat',
    genre: 'Jazz/Soul',
    coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&h=400&q=80',
    voteCount: 524,
    commentCount: 43
  },
  {
    id: '7',
    title: 'Morning Coffee',
    description: 'Gentle tunes to start your day right',
    creator: 'Morning Person',
    genre: 'Acoustic/Folk',
    coverImage: 'https://images.unsplash.com/photo-1524218786725-9e51dbcf6dc4?auto=format&fit=crop&w=1200&h=400&q=80',
    voteCount: 687,
    commentCount: 61
  },
  {
    id: '8',
    title: 'Electric Dreams',
    description: 'Cutting edge electronic music for the forward thinker',
    creator: 'Future Sound',
    genre: 'Electronic/Experimental',
    coverImage: 'https://images.unsplash.com/photo-1614149162883-81628d7c9a62?auto=format&fit=crop&w=1200&h=400&q=80',
    voteCount: 932,
    commentCount: 87
  }
];

const SpotlightCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Auto-rotate through playlists every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);
  
  const nextSlide = () => {
    if (isAnimating) return; // Prevent clicking during animation
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredPlaylists.length);
    
    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const prevSlide = () => {
    if (isAnimating) return; // Prevent clicking during animation
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredPlaylists.length - 1 : prevIndex - 1
    );
    
    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Skip to a specific slide
  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const currentPlaylist = featuredPlaylists[currentIndex];
  
  return (
    <div className="relative w-full h-96 overflow-hidden rounded-xl shadow-xl">
      {/* Slide background image with gradient overlay */}
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-in-out"
        style={{
          backgroundImage: `url(${currentPlaylist.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent opacity-80"></div>
      </div>
      
      {/* Spotlight content */}
      <div className="relative h-full flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <div className="animate-fade-in">
              <div className="text-sm font-medium text-blue-400 mb-2">
                PLAYLIST SPOTLIGHT • {currentPlaylist.genre}
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-3">{currentPlaylist.title}</h2>
              <p className="text-gray-200 mb-4">{currentPlaylist.description}</p>
              <div className="flex items-center text-white mb-6">
                <span>Created by </span>
                <Link 
                  to="/creator-profile" 
                  className="ml-1 font-bold text-blue-400 hover:underline"
                >
                  {currentPlaylist.creator}
                </Link>
                <div className="mx-3 h-1 w-1 rounded-full bg-gray-400"></div>
                <span>{currentPlaylist.voteCount} votes</span>
                <div className="mx-3 h-1 w-1 rounded-full bg-gray-400"></div>
                <span>{currentPlaylist.commentCount} comments</span>
              </div>
              <div className="flex space-x-4">
                <Link 
                  to={`/playlist/${currentPlaylist.id}`}
                  className="gradient-bg text-white px-6 py-3 rounded-md hover:opacity-90 btn-hover-scale btn-hover-glow"
                >
                  View Playlist
                </Link>
                <button className="bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors btn-hover-scale">
                  Save for Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons - Improved for better clickability */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 text-white transition-all z-20 focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 text-white transition-all z-20 focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {featuredPlaylists.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 transition-all focus:outline-none ${
              index === currentIndex 
                ? 'w-6 bg-blue-500' 
                : 'w-2 bg-white bg-opacity-50 hover:bg-opacity-75'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SpotlightCarousel; 