import React from 'react';
import { Link } from 'react-router-dom';

interface BrowseDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// List of top genres to display in the dropdown
const topGenres = ['Pop', 'Hip-Hop', 'Rock', 'Electronic', 'R&B', 'Country'];

const BrowseDropdownMenu: React.FC<BrowseDropdownMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute z-50 left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 text-white py-1">
      {/* Main browse options */}
      <Link
        to="/browse"
        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-blue-400"
        onClick={onClose}
      >
        All Playlists
      </Link>
      <Link
        to="/browse?sort=popular"
        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-blue-400"
        onClick={onClose}
      >
        Most Popular
      </Link>
      <Link
        to="/browse?sort=newest"
        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-blue-400"
        onClick={onClose}
      >
        Newest
      </Link>

      {/* Separator */}
      <div className="border-t border-gray-700 my-1"></div>

      {/* Top Genres subheader - Non-Clickable */}
      <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Top Genres
      </div>

      {/* Top genre links */}
      {topGenres.map((genre) => (
        <Link
          key={genre}
          to={`/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`}
          className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-blue-400"
          onClick={onClose}
        >
          {genre}
        </Link>
      ))}

      {/* View all genres link */}
      <div className="border-t border-gray-700 my-1"></div>
      <Link
        to="/genres"
        className="block px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 hover:text-blue-300"
        onClick={onClose}
      >
        All Genres
      </Link>
    </div>
  );
};

export default BrowseDropdownMenu; 