import { FC } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ChatBubbleLeftIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

interface PlaylistCardProps {
  id: string;
  title: string;
  creator: string;
  coverImage: string;
  voteCount: number;
  commentCount: number;
  genre?: string;
}

const PlaylistCard: FC<PlaylistCardProps> = ({
  id,
  title,
  creator,
  coverImage,
  voteCount,
  commentCount,
  genre = 'Mixed',
}) => {
  return (
    <Link to={`/playlist/${id}`} className="card group">
      <div className="aspect-square relative overflow-hidden rounded-lg">
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-blue-500 bg-opacity-80 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <MusicalNoteIcon className="h-3 w-3 mr-1" />
            {genre}
          </span>
        </div>
        
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 group-hover:opacity-70 transition-opacity"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-lg font-bold text-white truncate group-hover:underline">{title}</h3>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex items-center">
          <span className="text-sm font-medium text-blue-400">by </span>
          <span className="text-sm font-medium text-white ml-1 hover:text-blue-400 transition-colors">{creator}</span>
        </div>
        <div className="mt-2 flex items-center space-x-4">
          <div className="flex items-center text-gray-400 hover:text-blue-400 transition-colors">
            <HeartIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">{voteCount}</span>
          </div>
          <div className="flex items-center text-gray-400 hover:text-blue-400 transition-colors">
            <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">{commentCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard; 