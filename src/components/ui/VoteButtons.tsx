import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ChevronUpIcon as ChevronUpSolidIcon, ChevronDownIcon as ChevronDownSolidIcon } from '@heroicons/react/24/solid';

interface VoteButtonsProps {
  initialScore: number;
  onVote?: (newScore: number, voteType: 'up' | 'down' | 'none') => void;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ initialScore, onVote }) => {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<'up' | 'down' | 'none'>('none');

  const handleVote = (voteType: 'up' | 'down') => {
    let newScore = score;
    let newUserVote: 'up' | 'down' | 'none' = userVote;

    if (userVote === voteType) {
      // Undo the vote if clicking the same button
      newScore = voteType === 'up' ? score - 1 : score + 1;
      newUserVote = 'none';
    } else if (userVote === 'none') {
      // New vote
      newScore = voteType === 'up' ? score + 1 : score - 1;
      newUserVote = voteType;
    } else {
      // Changing vote (from down to up or vice versa)
      newScore = voteType === 'up' ? score + 2 : score - 2;
      newUserVote = voteType;
    }

    setScore(newScore);
    setUserVote(newUserVote);
    
    if (onVote) {
      onVote(newScore, newUserVote);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => handleVote('up')}
        className={`p-1 rounded-full focus:outline-none transition-colors ${
          userVote === 'up' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'
        }`}
        aria-label="Upvote"
      >
        {userVote === 'up' ? (
          <ChevronUpSolidIcon className="h-6 w-6" />
        ) : (
          <ChevronUpIcon className="h-6 w-6" />
        )}
      </button>
      
      <span className={`font-medium text-sm ${
        userVote === 'up' 
          ? 'text-blue-500' 
          : userVote === 'down' 
            ? 'text-red-500' 
            : 'text-white'
      }`}>
        {score}
      </span>
      
      <button
        onClick={() => handleVote('down')}
        className={`p-1 rounded-full focus:outline-none transition-colors ${
          userVote === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
        }`}
        aria-label="Downvote"
      >
        {userVote === 'down' ? (
          <ChevronDownSolidIcon className="h-6 w-6" />
        ) : (
          <ChevronDownIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default VoteButtons; 