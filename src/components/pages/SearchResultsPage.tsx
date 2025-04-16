import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PlaylistCard from '../ui/PlaylistCard';

// Dummy data for the prototype
const dummySearchResults = [
  {
    id: '1',
    title: 'Summer Vibes 2025',
    creator: 'DJ Cool',
    coverImage: 'https://picsum.photos/400/400',
    voteCount: 128,
    commentCount: 24,
  },
  {
    id: '2',
    title: 'Summer Hits',
    creator: 'Music Master',
    coverImage: 'https://picsum.photos/400/401',
    voteCount: 95,
    commentCount: 18,
  },
  {
    id: '3',
    title: 'Summer Party Mix',
    creator: 'Party DJ',
    coverImage: 'https://picsum.photos/400/402',
    voteCount: 256,
    commentCount: 42,
  },
];

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Search Results for "{query}"
        </h1>
        <p className="mt-2 text-gray-500">
          {dummySearchResults.length} playlists found
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dummySearchResults.map((playlist) => (
          <PlaylistCard key={playlist.id} {...playlist} />
        ))}
      </div>

      {dummySearchResults.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No playlists found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or browse our collection
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage; 