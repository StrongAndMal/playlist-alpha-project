import React from 'react';
import { Link } from 'react-router-dom';
import { getGenreImage } from '../../utils/imageUtils';

const GenresPage: React.FC = () => {
  // List of all genres to display in the grid
  const allGenres = [
    'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'EDM', 'Dance', 'Electronic', 
    'Jazz', 'Blues', 'Soul', 'Classical', 'Folk', 'Reggae', 'Metal', 
    'Punk', 'Alternative', 'Indie', 'K-Pop', 'J-Pop', 'Latin', 'Trap', 
    'Disco', 'Funk', 'Gospel', 'House', 'Techno', 'Ambient', 'Lo-Fi', 
    'Dubstep', 'Drum & Bass', 'Trance', 'Synthwave', 'Grime', 'Drill'
  ];

  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=225&q=80';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Browse All Genres</h1>
        <p className="mt-2 text-gray-400">
          Discover playlists across {allGenres.length} different music genres
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allGenres.map((genre) => (
          <Link
            key={genre}
            to={`/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`}
            className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <div className="relative h-40 w-full">
              <div className="absolute inset-0 bg-gray-900 opacity-40 group-hover:opacity-20 transition-opacity"></div>
              <img 
                src={getGenreImage(genre)} 
                alt={genre} 
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" 
                onError={handleImageError}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h4 className="text-white text-xl font-medium group-hover:scale-110 transition-transform duration-300">
                    {genre}
                  </h4>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenresPage; 