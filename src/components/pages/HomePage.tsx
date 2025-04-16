import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import PlaylistCard from '../ui/PlaylistCard';
import SpotlightCarousel from '../ui/SpotlightCarousel';
import { FireIcon } from '@heroicons/react/24/solid';

// Dummy data for community playlists
const communityPlaylists = [
  {
    id: '1',
    title: 'Summer Vibes 2025',
    creator: 'DJ Cool',
    coverImage: 'https://picsum.photos/400/400',
    voteCount: 128,
    commentCount: 24,
    genre: 'Pop'
  },
  {
    id: '2',
    title: 'Workout Mix',
    creator: 'Fitness Guru',
    coverImage: 'https://picsum.photos/400/401',
    voteCount: 95,
    commentCount: 18,
    genre: 'Hip-Hop'
  },
  {
    id: '3',
    title: 'Chill Lofi Beats',
    creator: 'Study Buddy',
    coverImage: 'https://picsum.photos/400/402',
    voteCount: 256,
    commentCount: 42,
    genre: 'Lo-Fi'
  },
  {
    id: '4',
    title: '80s Throwbacks',
    creator: 'Retro Fan',
    coverImage: 'https://picsum.photos/400/403',
    voteCount: 189,
    commentCount: 31,
    genre: 'Rock'
  },
  {
    id: '5',
    title: 'Indie Discoveries',
    creator: 'Indie Explorer',
    coverImage: 'https://picsum.photos/400/404',
    voteCount: 76,
    commentCount: 14,
    genre: 'Indie'
  },
  {
    id: '6',
    title: 'Jazz Collection',
    creator: 'Jazz Cat',
    coverImage: 'https://picsum.photos/400/405',
    voteCount: 112,
    commentCount: 27,
    genre: 'Jazz'
  },
  {
    id: '7',
    title: 'Hip Hop Essentials',
    creator: 'Urban Beats',
    coverImage: 'https://picsum.photos/400/406',
    voteCount: 223,
    commentCount: 48,
    genre: 'Hip-Hop'
  },
  {
    id: '8',
    title: 'Electronic Dreams',
    creator: 'Techno DJ',
    coverImage: 'https://picsum.photos/400/407',
    voteCount: 164,
    commentCount: 32,
    genre: 'Electronic'
  },
];

// Sorting options
const sortOptions = [
  { label: 'Most Voted', value: 'votes' },
  { label: 'Most Recent', value: 'recent' },
  { label: 'Most Comments', value: 'comments' },
  { label: 'Trending', value: 'trending' },
];

const HomePage: FC = () => {
  const [sortBy, setSortBy] = useState('votes');
  
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Spotlight Section */}
        <div className="mb-12">
          <SpotlightCarousel />
        </div>
        
        {/* Community Voted Playlists */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <FireIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-white">Community Favorites</h2>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-white">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {communityPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} {...playlist} />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              to="/community"
              className="inline-block text-blue-400 border border-blue-400 rounded-full px-6 py-2 hover:bg-blue-400 hover:text-gray-900 transition-colors btn-hover-scale"
            >
              View All Community Playlists
            </Link>
          </div>
        </div>
        
        {/* Genre Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Explore Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Hip-Hop', 'Rock', 'Electronic', 'Jazz', 'Classical', 'K-Pop', 'Alternative', 'Blues'].map(genre => (
              <Link 
                key={genre}
                to={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`}
                className="relative overflow-hidden rounded-lg group"
              >
                <img 
                  src={`https://picsum.photos/400/225?random=${genre}`} 
                  alt={genre} 
                  className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white font-bold">{genre}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 