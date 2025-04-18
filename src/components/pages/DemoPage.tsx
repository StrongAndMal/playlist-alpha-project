import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Award, { AwardType } from '../common/Award';
import AwardModal from '../common/AwardModal';
import FollowButton from '../common/FollowButton';
import { ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';

const DemoPage: React.FC = () => {
  // Demo states
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(1000);
  const [receivedAwards, setReceivedAwards] = useState<Record<AwardType, number>>({
    gold: 1,
    silver: 3,
    bronze: 5,
    fire: 7,
    music: 2,
    genius: 0,
    original: 1,
    helpful: 4
  });

  // Top genres organized by category for the dropdown demo
  const topGenres = [
    { name: 'Pop', trending: true },
    { name: 'Hip-Hop', trending: true },
    { name: 'Rock', trending: true },
    { name: 'R&B', trending: true },
    { name: 'Electronic', trending: true },
    { name: 'Country', trending: false },
    { name: 'K-Pop', trending: true },
    { name: 'Latin', trending: true },
    { name: 'Indie', trending: true },
    { name: 'Jazz', trending: false },
    { name: 'Classical', trending: false },
    { name: 'Metal', trending: false },
  ];

  // Mock award function
  const handleGiveAward = async (awardType: AwardType) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update awards and points
    setReceivedAwards(prev => ({
      ...prev,
      [awardType]: prev[awardType] + 1
    }));
    
    // Deduct points
    const awardCosts: Record<AwardType, number> = {
      gold: 500,
      silver: 300,
      bronze: 200,
      fire: 150,
      music: 100,
      genius: 250,
      original: 200,
      helpful: 100
    };
    
    setUserPoints(prev => prev - awardCosts[awardType]);
  };

  // Mock follow function
  const handleFollowChange = async (isFollowing: boolean) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`User is now ${isFollowing ? 'following' : 'not following'}`);
    
    // In a real app, this would call your API
    return;
  };

  return (
    <div className="bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Feature Demo</h1>
        
        {/* Demo sections */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Genre dropdown demo */}
          <Card className="border border-gray-700 bg-gray-800 text-white">
            <h2 className="text-xl font-bold text-white mb-4">Genre Dropdown</h2>
            
            <div className="relative inline-block text-left mb-4" ref={null}>
              <button 
                className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
              >
                <span>Browse Genres</span>
                <ChevronDownIcon 
                  className={`ml-1 h-4 w-4 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {/* Dropdown panel */}
              {isGenreDropdownOpen && (
                <div className="absolute z-50 left-0 mt-2 w-72 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 text-white">
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-blue-400 mb-3">Popular Genres</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {topGenres.map((genre) => (
                        <div
                          key={genre.name}
                          className="flex items-center text-sm text-white hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {genre.trending && (
                            <span className="mr-1 text-yellow-400">
                              <SparklesIcon className="h-3 w-3 inline" />
                            </span>
                          )}
                          {genre.name}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-700 text-right">
                      <div className="inline-block text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
                        View all genres →
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-gray-400 text-sm">
              Click the button above to test the new genre dropdown with trending indicators.
            </p>
          </Card>
          
          {/* Premium model demo */}
          <Card className="border border-gray-700 bg-gray-800 text-white">
            <h2 className="text-xl font-bold text-white mb-4">Premium Model</h2>
            
            <div className="flex items-center justify-between mb-4 bg-gray-700 rounded-md p-3">
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-white font-medium">Premium Features</span>
              </div>
              <Link to="/premium" className="text-yellow-400 font-bold hover:text-yellow-300">
                View Plans
              </Link>
            </div>
            
            <ul className="space-y-2 text-gray-400 text-sm mb-4">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>BPM and key matching for perfect playlists</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Ad-free experience throughout the app</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Advanced genre-specific discoveries</span>
              </li>
            </ul>
            
            <Link to="/premium">
              <Button fullWidth>
                <SparklesIcon className="h-4 w-4 mr-2" />
                Explore Premium
              </Button>
            </Link>
          </Card>
          
          {/* Awards system demo */}
          <Card className="border border-gray-700 bg-gray-800 text-white">
            <h2 className="text-xl font-bold text-white mb-4">Award System</h2>
            
            <div className="flex items-center justify-between mb-6 bg-gray-700 rounded-md p-3">
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-white font-medium">Your Points</span>
              </div>
              <span className="text-yellow-400 font-bold">{userPoints}</span>
            </div>
            
            <div className="mb-4">
              <h3 className="text-white font-medium mb-2">Current Awards:</h3>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(receivedAwards) as AwardType[]).map(type => (
                  receivedAwards[type] > 0 && (
                    <Award 
                      key={type} 
                      type={type} 
                      count={receivedAwards[type]}
                      showTooltip
                    />
                  )
                ))}
              </div>
            </div>
            
            <Button onClick={() => setIsAwardModalOpen(true)}>
              Give an Award
            </Button>
            
            {/* Award Modal */}
            <AwardModal 
              isOpen={isAwardModalOpen}
              onClose={() => setIsAwardModalOpen(false)}
              onAward={handleGiveAward}
              userPoints={userPoints}
              targetName="Demo Playlist"
              targetType="playlist"
            />
          </Card>
          
          {/* Follow button demo */}
          <Card className="border border-gray-700 bg-gray-800 text-white">
            <h2 className="text-xl font-bold text-white mb-4">User Profile Actions</h2>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div>
                <h3 className="text-white font-medium">JohnDoe</h3>
                <p className="text-gray-400 text-sm">Playlist curator extraordinaire</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Default Button</h4>
                <FollowButton
                  userId="user-123"
                  username="JohnDoe"
                  isFollowing={false}
                  onFollowChange={handleFollowChange}
                />
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Outline Variant</h4>
                <FollowButton
                  userId="user-456"
                  username="JaneSmith"
                  isFollowing={true}
                  onFollowChange={handleFollowChange}
                  variant="outline"
                />
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Small Size</h4>
                <FollowButton
                  userId="user-789"
                  username="MikeBrown"
                  isFollowing={false}
                  onFollowChange={handleFollowChange}
                  size="sm"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemoPage; 