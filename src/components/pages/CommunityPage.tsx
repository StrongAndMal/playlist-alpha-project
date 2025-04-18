import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  FireIcon, 
  UserGroupIcon, 
  SparklesIcon,
  CalendarIcon,
  HashtagIcon,
  HeartIcon,
  PaperAirplaneIcon,
  PlusIcon,
  MicrophoneIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';
import Card from '../common/Card';
import Button from '../common/Button';
import Award from '../common/Award';

// Mock user data for the community page
const mockUsers = [
  { id: 'user1', name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', isOnline: true },
  { id: 'user2', name: 'Marcus Rivera', username: 'marcusbeats', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', isOnline: true },
  { id: 'user3', name: 'Alex Thompson', username: 'alexjams', avatar: 'https://randomuser.me/api/portraits/women/64.jpg', isOnline: false },
  { id: 'user4', name: 'Jamal Williams', username: 'jwilliams', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', isOnline: true },
  { id: 'user5', name: 'Zoe Chen', username: 'zoemusic', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', isOnline: false }
];

// Mock discussion posts
const mockPosts = [
  {
    id: 'post1',
    user: mockUsers[0],
    timestamp: '2 hours ago',
    content: 'Just discovered this amazing indie band! Anyone else a fan of "The Midnight Echoes"? Their latest album has been on repeat all week.',
    likes: 24,
    comments: 8,
    awards: [{ type: 'music' as const, count: 3 }]
  },
  {
    id: 'post2',
    user: mockUsers[3],
    timestamp: '5 hours ago',
    content: "What's everyone's top 3 albums of the year so far? Mine are:\n1. Black Pumas - Chronicles & Harmonies\n2. Japanese Breakfast - Divine Symmetry\n3. Tyler the Creator - Chromakopia",
    likes: 47,
    comments: 32,
    awards: [{ type: 'helpful' as const, count: 5 }, { type: 'original' as const, count: 1 }]
  },
  {
    id: 'post3',
    user: mockUsers[2],
    timestamp: 'Yesterday',
    content: 'Does anyone have recommendations for workout playlists that mix EDM and hip-hop? Need something to keep me going at the gym!',
    likes: 18,
    comments: 14,
    awards: []
  }
];

// Mock trending topics
const mockTrends = [
  { id: 'trend1', name: 'Summer Playlists', posts: 426 },
  { id: 'trend2', name: 'Music Festivals 2023', posts: 318 },
  { id: 'trend3', name: 'Lo-Fi Beats', posts: 245 },
  { id: 'trend4', name: 'Indie Discoveries', posts: 207 },
  { id: 'trend5', name: 'Vinyl Collectors', posts: 189 }
];

// Mock community events
const mockEvents = [
  { id: 'event1', title: 'Community Playlist Challenge', date: 'Ends in 3 days', participants: 147 },
  { id: 'event2', title: 'Virtual Listening Party', date: 'Tomorrow, 8PM EST', participants: 89 },
  { id: 'event3', title: 'Genre Spotlight: Jazz', date: 'Next Week', participants: 56 }
];

const CommunityPage: React.FC = () => {
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'discussions' | 'playlists'>('feed');

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, would submit this to backend
    console.log('Submitting post:', newPostContent);
    setNewPostContent('');
    alert('Post submitted! (This would save to the backend in the real app)');
  };

  return (
    <div className="bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Community Hub</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connect with fellow music enthusiasts, share your favorite playlists, and discover new music together.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar */}
          <div className="lg:w-1/4">
            <Card className="border border-gray-700 bg-gray-800 text-white mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
                  Trending Topics
                </h2>
                <Link to="#" className="text-sm text-blue-400 hover:text-blue-300">
                  See all
                </Link>
              </div>
              <ul className="space-y-3">
                {mockTrends.map(trend => (
                  <li key={trend.id} className="hover:bg-gray-700 rounded-md p-2 transition-colors">
                    <Link to="#" className="flex items-center justify-between">
                      <div className="flex items-center">
                        <HashtagIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-white font-medium">{trend.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{trend.posts} posts</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="border border-gray-700 bg-gray-800 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <CalendarIcon className="h-5 w-5 text-purple-500 mr-2" />
                  Community Events
                </h2>
                <Link to="#" className="text-sm text-blue-400 hover:text-blue-300">
                  See all
                </Link>
              </div>
              <ul className="space-y-4">
                {mockEvents.map(event => (
                  <li key={event.id} className="border border-gray-700 rounded-md p-3">
                    <h3 className="font-medium text-white">{event.title}</h3>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-gray-400">{event.date}</span>
                      <span className="text-blue-400">{event.participants} joining</span>
                    </div>
                    <Button size="sm" variant="outline" className="mt-2 w-full">
                      Join Event
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:w-2/4">
            <Card className="border border-gray-700 bg-gray-800 text-white mb-6">
              <form onSubmit={handleSubmitPost}>
                <textarea
                  placeholder="Share your music thoughts with the community..."
                  className="w-full bg-gray-700 rounded-md border border-gray-600 p-3 text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                ></textarea>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-2">
                    <button type="button" className="text-gray-400 hover:text-blue-400 p-1 rounded-full">
                      <MusicalNoteIcon className="h-5 w-5" />
                    </button>
                    <button type="button" className="text-gray-400 hover:text-blue-400 p-1 rounded-full">
                      <MicrophoneIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <Button type="submit" size="sm" disabled={!newPostContent.trim()}>
                    <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                    Post
                  </Button>
                </div>
              </form>
            </Card>

            <div className="bg-gray-800 border border-gray-700 rounded-md mb-6">
              <div className="flex">
                <button 
                  className={`flex-1 py-3 text-sm font-medium ${activeTab === 'feed' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('feed')}
                >
                  For You
                </button>
                <button 
                  className={`flex-1 py-3 text-sm font-medium ${activeTab === 'discussions' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('discussions')}
                >
                  Discussions
                </button>
                <button 
                  className={`flex-1 py-3 text-sm font-medium ${activeTab === 'playlists' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('playlists')}
                >
                  Playlists
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {mockPosts.map(post => (
                <Card key={post.id} className="border border-gray-700 bg-gray-800 text-white">
                  <div className="flex items-start space-x-3">
                    <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Link to="#" className="font-medium text-white hover:underline">
                          {post.user.name}
                        </Link>
                        <span className="text-gray-500 text-sm ml-2">@{post.user.username}</span>
                        <span className="text-gray-500 text-sm ml-auto">{post.timestamp}</span>
                      </div>
                      <div className="mt-2 text-white whitespace-pre-line">
                        {post.content}
                      </div>
                      <div className="mt-4 flex items-center space-x-4">
                        <button className="flex items-center text-gray-400 hover:text-red-500">
                          <HeartIcon className="h-5 w-5 mr-1" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center text-gray-400 hover:text-blue-400">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1" />
                          <span>{post.comments}</span>
                        </button>
                        <div className="ml-auto flex space-x-1">
                          {post.awards.map((award, idx) => (
                            <Award key={idx} type={award.type} count={award.count} showTooltip size="sm" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <div className="text-center pt-4">
                <Button variant="outline" className="border-gray-600 text-gray-400">
                  Load More
                </Button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:w-1/4">
            <Card className="border border-gray-700 bg-gray-800 text-white mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
                  Online Users
                </h2>
                <Link to="#" className="text-sm text-blue-400 hover:text-blue-300">
                  See all
                </Link>
              </div>
              <ul className="space-y-3">
                {mockUsers.map(user => (
                  <li key={user.id} className="flex items-center space-x-3 hover:bg-gray-700 rounded-md p-2 transition-colors">
                    <div className="relative">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      {user.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-800"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">@{user.username}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <Button variant="outline" className="w-full">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Find Friends
                </Button>
              </div>
            </Card>

            <Card className="border border-gray-700 bg-gray-800 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <SparklesIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  Weekly Challenges
                </h2>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg border border-blue-800/50 mb-4">
                <h3 className="font-medium text-blue-300">This Week's Challenge</h3>
                <p className="text-white font-bold mt-1">Create a playlist that tells a story</p>
                <p className="text-sm text-gray-300 mt-2">
                  Craft a playlist where the song titles read like a narrative when read in order.
                </p>
                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-gray-400">217 submissions</span>
                  <span className="text-yellow-400">500 points</span>
                </div>
                <Button variant="secondary" className="mt-3 w-full text-sm">
                  Submit Your Entry
                </Button>
              </div>
              <Link to="#" className="text-blue-400 text-sm hover:text-blue-300 flex justify-center">
                View past challenges
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage; 