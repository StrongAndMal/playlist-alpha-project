import React, { useState } from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import Award, { AwardType } from './Award';

interface AwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAward: (awardType: AwardType) => Promise<void>;
  userPoints: number;
  targetName: string;
  targetType: 'playlist' | 'comment' | 'user';
}

const awardTypes: AwardType[] = [
  'gold', 
  'silver', 
  'bronze', 
  'fire', 
  'music', 
  'genius', 
  'original', 
  'helpful'
];

// Award info with icons, costs, and descriptions
const awardInfo = {
  gold: {
    icon: '🏆',
    label: 'Gold Award',
    description: 'The highest honor for exceptional playlists',
    cost: 500
  },
  silver: {
    icon: '🥈',
    label: 'Silver Award',
    description: 'Recognition for great playlists',
    cost: 300
  },
  bronze: {
    icon: '🥉',
    label: 'Bronze Award',
    description: 'A solid playlist worth recognizing',
    cost: 200
  },
  fire: {
    icon: '🔥',
    label: 'Fire',
    description: 'This playlist is straight fire!',
    cost: 150
  },
  music: {
    icon: '🎵',
    label: 'Melodic',
    description: 'A perfectly balanced, harmonious playlist',
    cost: 100
  },
  genius: {
    icon: '🧠',
    label: 'Genius',
    description: 'Smartly crafted playlist with perfect flow',
    cost: 250
  },
  original: {
    icon: '💎',
    label: 'Original',
    description: 'Uniquely composed with rare tracks',
    cost: 200
  },
  helpful: {
    icon: '👍',
    label: 'Helpful',
    description: 'A playlist that helped many listeners',
    cost: 100
  }
};

const AwardModal: React.FC<AwardModalProps> = ({
  isOpen,
  onClose,
  onAward,
  userPoints,
  targetName,
  targetType
}) => {
  const [selectedAward, setSelectedAward] = useState<AwardType | null>(null);
  const [isAwarding, setIsAwarding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAward = (award: AwardType) => {
    setSelectedAward(award);
    setError(null);
  };

  const handleGiveAward = async () => {
    if (!selectedAward) {
      setError('Please select an award first');
      return;
    }

    const cost = awardInfo[selectedAward].cost;
    if (userPoints < cost) {
      setError(`Not enough points. You need ${cost} points for this award.`);
      return;
    }

    setIsAwarding(true);
    setError(null);

    try {
      await onAward(selectedAward);
      setSuccess(`Award successfully given to this ${targetType}!`);
      setTimeout(() => {
        onClose();
        setSuccess(null);
        setSelectedAward(null);
      }, 1500);
    } catch (err) {
      setError('Error giving award. Please try again.');
    } finally {
      setIsAwarding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">Give an Award</h2>
          <p className="text-gray-400 mt-1">
            Choose an award to give to this {targetType}
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-6 bg-gray-700 rounded-md p-3">
          <div className="flex items-center">
            <SparklesIcon className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-white font-medium">Your Points</span>
          </div>
          <span className="text-yellow-400 font-bold">{userPoints}</span>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-900/40 border border-red-500 text-red-200 rounded text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-2 bg-green-900/40 border border-green-500 text-green-200 rounded text-sm">
            {success}
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-white font-medium mb-2">Available Awards:</h3>
          <div className="grid grid-cols-4 gap-4">
            {awardTypes.map((awardType) => {
              const award = awardInfo[awardType];
              const canAfford = userPoints >= award.cost;
              
              return (
                <div 
                  key={awardType} 
                  className={`
                    flex flex-col items-center p-2 rounded-lg 
                    ${selectedAward === awardType ? 'bg-blue-900/50 border border-blue-500' : 'bg-gray-700'} 
                    ${canAfford ? 'cursor-pointer hover:bg-gray-600' : 'opacity-50 cursor-not-allowed'}
                    transition-colors
                  `}
                  onClick={() => canAfford && handleSelectAward(awardType)}
                >
                  <Award type={awardType} size="md" />
                  <div className="text-white text-xs mt-2">{award.label}</div>
                  <div className="text-yellow-400 text-xs mt-1">{award.cost}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {selectedAward && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-start">
              <Award type={selectedAward} size="lg" className="mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">{awardInfo[selectedAward].label}</h4>
                <p className="text-gray-400 text-sm mt-1">{awardInfo[selectedAward].description}</p>
                <div className="text-yellow-400 text-sm mt-2">
                  Cost: {awardInfo[selectedAward].cost} points
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="text-gray-400 border-gray-600"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleGiveAward}
            isLoading={isAwarding}
            disabled={!selectedAward || isAwarding || userPoints < (selectedAward ? awardInfo[selectedAward].cost : 0)}
          >
            {isAwarding ? 'Giving Award...' : 'Give Award'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AwardModal; 