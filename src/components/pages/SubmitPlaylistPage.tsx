import React, { useState } from 'react';

const SubmitPlaylistPage: React.FC = () => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (to be implemented)
    console.log({ playlistUrl, tags });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Share Your Playlist</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="playlist-url" className="block text-sm font-medium text-gray-700">
            Spotify Playlist URL
          </label>
          <div className="mt-1">
            <input
              type="url"
              id="playlist-url"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="https://open.spotify.com/playlist/..."
              className="shadow-sm focus:ring-spotify-green focus:border-spotify-green block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Genre/Mood Tags
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="pop, summer, workout, etc."
              className="shadow-sm focus:ring-spotify-green focus:border-spotify-green block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Separate tags with commas
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
          >
            Submit Playlist
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitPlaylistPage; 