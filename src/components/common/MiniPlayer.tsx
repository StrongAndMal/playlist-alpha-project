import React, { useEffect, useRef, useState } from 'react';

interface MiniPlayerProps {
  previewUrl: string | null;
  visible: boolean;
  position: { x: number; y: number };
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ previewUrl, visible, position }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle visibility changes
  useEffect(() => {
    if (visible && previewUrl && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      setIsPlaying(true);
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [visible, previewUrl]);
  
  // Reset audio when preview URL changes
  useEffect(() => {
    setIsLoading(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [previewUrl]);

  if (!visible || !previewUrl) {
    return null;
  }

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      className="absolute z-50 bg-white shadow-lg rounded-md p-2 w-64"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, 10px)'
      }}
    >
      <audio 
        ref={audioRef} 
        src={previewUrl} 
        onCanPlay={handleCanPlay}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={togglePlayPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white mr-3 hover:bg-green-600 transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <div>
            <p className="text-sm font-medium">Preview</p>
            <p className="text-xs text-gray-500">Spotify preview</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer; 