import React from 'react';
import { useParams } from 'react-router-dom';
import PlaylistCard from '../ui/PlaylistCard';

// Dummy data for the prototype
const dummyPlaylists = [
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
    title: 'Workout Mix',
    creator: 'Fitness Guru',
    coverImage: 'https://picsum.photos/400/401',
    voteCount: 95,
    commentCount: 18,
  },
  {
    id: '3',
    title: 'Chill Lofi Beats',
    creator: 'Study Buddy',
    coverImage: 'https://picsum.photos/400/402',
    voteCount: 256,
    commentCount: 42,
  },
];

const GenreMoodPage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Playlists tagged "{tag}"
        </h1>
        <p className="mt-2 text-gray-500">
          {dummyPlaylists.length} playlists found
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dummyPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} {...playlist} />
        ))}
      </div>

      {dummyPlaylists.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No playlists found</h3>
          <p className="mt-2 text-gray-500">
            Try browsing other tags or submit a playlist
          </p>
        </div>
      )}
    </div>
  );
};

export default GenreMoodPage; 