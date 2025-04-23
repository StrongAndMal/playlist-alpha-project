import React from 'react';
import { Link } from 'react-router-dom';

interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  text: string;
  timestamp: string;
}

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="flex space-x-4 p-4 border-b border-gray-800 hover:bg-gray-800/30 transition-colors duration-150 rounded-lg">
      <Link to={`/user/${comment.user.id}`} className="flex-shrink-0">
        <img
          src={comment.user.avatar || 'https://via.placeholder.com/40?text=User'}
          alt={comment.user.username}
          className="h-10 w-10 rounded-full object-cover border border-gray-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=User';
          }}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <Link 
            to={`/user/${comment.user.id}`} 
            className="font-medium text-white hover:text-blue-400 transition-colors duration-200"
          >
            {comment.user.username}
          </Link>
          <span className="text-sm text-gray-400">{comment.timestamp}</span>
        </div>
        <p className="mt-1 text-white break-words">{comment.text}</p>
      </div>
    </div>
  );
};

interface CommentListProps {
  comments: Comment[];
  isLoading?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ comments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex space-x-4 p-4">
            <div className="h-10 w-10 rounded-full bg-gray-700"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Be the first to comment on this playlist!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList; 