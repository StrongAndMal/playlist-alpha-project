import React from 'react';

export type AwardType = 
  | 'gold' 
  | 'silver' 
  | 'bronze' 
  | 'fire' 
  | 'music' 
  | 'genius' 
  | 'original' 
  | 'helpful';

interface AwardProps {
  type: AwardType;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  onClick?: () => void;
  className?: string;
}

// Award info with icons, colors, and descriptions
const awardInfo = {
  gold: {
    icon: '🏆',
    label: 'Gold Award',
    description: 'The highest honor for exceptional playlists',
    cost: 500,
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-800'
  },
  silver: {
    icon: '🥈',
    label: 'Silver Award',
    description: 'Recognition for great playlists',
    cost: 300,
    bgColor: 'bg-gray-300',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-800'
  },
  bronze: {
    icon: '🥉',
    label: 'Bronze Award',
    description: 'A solid playlist worth recognizing',
    cost: 200,
    bgColor: 'bg-amber-600',
    borderColor: 'border-amber-700',
    textColor: 'text-amber-900'
  },
  fire: {
    icon: '🔥',
    label: 'Fire',
    description: 'This playlist is straight fire!',
    cost: 150,
    bgColor: 'bg-red-500',
    borderColor: 'border-red-600',
    textColor: 'text-red-900'
  },
  music: {
    icon: '🎵',
    label: 'Melodic',
    description: 'A perfectly balanced, harmonious playlist',
    cost: 100,
    bgColor: 'bg-blue-400',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800'
  },
  genius: {
    icon: '🧠',
    label: 'Genius',
    description: 'Smartly crafted playlist with perfect flow',
    cost: 250,
    bgColor: 'bg-purple-400',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-900'
  },
  original: {
    icon: '💎',
    label: 'Original',
    description: 'Uniquely composed with rare tracks',
    cost: 200,
    bgColor: 'bg-cyan-400',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-900'
  },
  helpful: {
    icon: '👍',
    label: 'Helpful',
    description: 'A playlist that helped many listeners',
    cost: 100,
    bgColor: 'bg-green-400',
    borderColor: 'border-green-500',
    textColor: 'text-green-900'
  }
};

const Award: React.FC<AwardProps> = ({
  type,
  count = 0,
  size = 'md',
  showTooltip = false,
  onClick,
  className = ''
}) => {
  const award = awardInfo[type];
  
  // Size-based styles
  const sizeStyles = {
    sm: 'text-lg p-1',
    md: 'text-xl p-1.5',
    lg: 'text-2xl p-2'
  };

  return (
    <div className="relative inline-block group">
      <div 
        className={`
          inline-flex items-center justify-center rounded-full 
          ${award.bgColor} ${award.borderColor} border-2
          ${sizeStyles[size]} 
          ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
          ${className}
        `}
        onClick={onClick}
      >
        <span>{award.icon}</span>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-5 min-w-[1.25rem] flex items-center justify-center px-1">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="bg-gray-900 text-white rounded-lg shadow-lg p-2 text-xs whitespace-nowrap">
            <div className="font-semibold">{award.label}</div>
            <div className="text-gray-300 text-xs max-w-[200px]">{award.description}</div>
            <div className="text-yellow-400 mt-1">{award.cost} points</div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[1px] border-t-4 border-l-4 border-r-4 border-gray-900 border-b-0 border-solid w-0 h-0"></div>
        </div>
      )}
    </div>
  );
};

export default Award; 