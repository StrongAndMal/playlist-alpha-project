import React, { useState } from 'react';

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
}

const FlippableCard: React.FC<FlippableCardProps> = ({ 
  frontContent, 
  backContent, 
  className = '' 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`relative ${className} cursor-pointer perspective-1000 w-full h-full`}
      onClick={handleFlip}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        <div 
          className={`absolute w-full h-full backface-hidden ${
            isFlipped ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          {frontContent}
        </div>
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 ${
            isFlipped ? '' : 'opacity-0 pointer-events-none'
          }`}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlippableCard; 