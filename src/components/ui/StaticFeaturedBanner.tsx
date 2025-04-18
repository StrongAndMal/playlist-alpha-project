import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getRandomImage, handleImageError, stockImages } from '../../utils/imageUtils';

// Featured playlist data
const featuredPlaylist = {
  id: '1',
  title: 'Summer Beats 2025',
  description: 'The hottest tracks to fuel your summer vibes',
  creator: 'DJ Sunshine',
  genre: 'Pop/Dance',
  coverImage: getRandomImage(stockImages.featuredBanner),
  voteCount: 875,
  commentCount: 113
};

const StaticFeaturedBanner: React.FC = () => {
  const [imageSrc, setImageSrc] = useState(featuredPlaylist.coverImage);
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If the current image fails, get a different one from our collection
    const newImage = getRandomImage(stockImages.featuredBanner);
    setImageSrc(newImage);
    handleImageError(e, newImage);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-xl shadow-xl">
      {/* Background image with gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Hidden img element to handle error checking */}
        <img 
          src={imageSrc} 
          alt="" 
          className="hidden"
          onError={handleError} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent opacity-80"></div>
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <div>
              <div className="text-sm font-medium text-blue-400 mb-2">
                FEATURED PLAYLIST • {featuredPlaylist.genre}
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-3">{featuredPlaylist.title}</h2>
              <p className="text-gray-200 mb-4">{featuredPlaylist.description}</p>
              <div className="flex items-center text-white mb-6">
                <span>Created by </span>
                <Link 
                  to="/creator-profile" 
                  className="ml-1 font-bold text-blue-400 hover:underline"
                >
                  {featuredPlaylist.creator}
                </Link>
                <div className="mx-3 h-1 w-1 rounded-full bg-gray-400"></div>
                <span>{featuredPlaylist.voteCount} votes</span>
              </div>
              <div className="flex">
                <Link 
                  to={`/playlist/${featuredPlaylist.id}`}
                  className="gradient-bg text-white px-6 py-3 rounded-md hover:opacity-90 btn-hover-scale btn-hover-glow"
                >
                  View Playlist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticFeaturedBanner; 