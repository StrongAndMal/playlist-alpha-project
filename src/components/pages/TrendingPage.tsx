import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FireIcon, 
  ArrowTrendingUpIcon,
  MusicalNoteIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  ArrowPathIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  PlayIcon,
  ClockIcon,
  NewspaperIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import Card from '../common/Card';
import Button from '../common/Button';

// Mock data for trending artists
const trendingArtists = [
  {
    id: 1,
    name: 'Olivia Rodrigo',
    image: 'https://images.unsplash.com/photo-1529354235303-cc42f23d767a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
    genre: 'Pop',
    monthlyListeners: '61.5M',
    growth: '+12%'
  },
  {
    id: 2,
    name: 'Central Cee',
    image: 'https://images.unsplash.com/photo-1568044852337-9bcc3378fc3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    genre: 'UK Hip-Hop',
    monthlyListeners: '24.8M',
    growth: '+18%'
  },
  {
    id: 3,
    name: 'Sabrina Carpenter',
    image: 'https://images.unsplash.com/photo-1558507652-2d9626c4e67a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    genre: 'Pop',
    monthlyListeners: '56.2M',
    growth: '+24%'
  },
  {
    id: 4,
    name: 'Zach Bryan',
    image: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    genre: 'Country',
    monthlyListeners: '21.3M',
    growth: '+8%'
  }
];

// Mock data for new releases
const newReleases = [
  {
    id: 1,
    title: 'Guts',
    artist: 'Olivia Rodrigo',
    image: 'https://images.unsplash.com/photo-1598387846148-47e82ee120cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
    date: 'Sep 8, 2023'
  },
  {
    id: 2,
    title: 'Short n Sweet',
    artist: 'Sabrina Carpenter',
    image: 'https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    date: 'Aug 11, 2023'
  },
  {
    id: 3,
    title: 'American Heartbreak',
    artist: 'Zach Bryan',
    image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    date: 'Oct 6, 2023'
  },
  {
    id: 4,
    title: 'Split Decision',
    artist: 'Central Cee',
    image: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80',
    date: 'Oct 12, 2023'
  }
];

// Mock data for trending genres
const trendingGenres = [
  { name: 'Afrobeats', growth: '+28%', color: 'bg-purple-600' },
  { name: 'UK Drill', growth: '+24%', color: 'bg-blue-600' },
  { name: 'Phonk', growth: '+21%', color: 'bg-green-600' },
  { name: 'Lo-Fi Hip Hop', growth: '+17%', color: 'bg-yellow-500' },
  { name: 'Jersey Club', growth: '+15%', color: 'bg-red-600' },
  { name: 'Brazilian Funk', growth: '+14%', color: 'bg-pink-600' }
];

// Mock data for music news
const musicNews = [
  {
    id: 1,
    title: 'Beyoncé announces world tour dates for 2024',
    excerpt: 'The iconic singer will be touring globally, including stops in Europe, Asia, and Australia.',
    date: 'Oct 15, 2023',
    image: 'https://images.unsplash.com/photo-1520155346-36773ab29479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 2,
    title: 'Drake and Kendrick Lamar feud intensifies with new diss tracks',
    excerpt: 'The rap rivalry continues as both artists release songs directed at each other.',
    date: 'Oct 12, 2023',
    image: 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
  },
  {
    id: 3,
    title: 'Billie Eilish reveals details about upcoming album',
    excerpt: 'The Grammy-winning artist shares insights about her new musical direction and collaborations.',
    date: 'Oct 10, 2023',
    image: 'https://images.unsplash.com/photo-1516900448138-898720b586d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80'
  }
];

// Mock data for top charts
const topCharts = [
  { position: 1, title: 'Paint The Town Red', artist: 'Doja Cat' },
  { position: 2, title: 'Cruel Summer', artist: 'Taylor Swift' },
  { position: 3, title: 'vampire', artist: 'Olivia Rodrigo' },
  { position: 4, title: 'Espresso', artist: 'Sabrina Carpenter' },
  { position: 5, title: 'Snooze', artist: 'SZA' }
];

const TrendingPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  
  useEffect(() => {
    console.log('TrendingPage mounted');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Trending Now</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover what's hot in the music scene right now. From emerging artists and rising genres to the latest releases and music news.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'today' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'week' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'month' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trending Artists Section */}
            <section className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <FireIcon className="h-6 w-6 text-red-500 mr-2" />
                <h2 className="text-2xl font-bold">Trending Artists</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingArtists.map(artist => (
                  <div key={artist.id} className="flex bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
                    <img src={artist.image} alt={artist.name} className="w-24 h-24 object-cover" />
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold text-lg">{artist.name}</h3>
                      <p className="text-gray-400 text-sm">{artist.genre}</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-300">{artist.monthlyListeners} listeners</span>
                        <span className="text-sm text-green-400 font-medium">{artist.growth}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* New Releases Section */}
            <section className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <SparklesIcon className="h-6 w-6 text-yellow-400 mr-2" />
                <h2 className="text-2xl font-bold">New Releases</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {newReleases.map(release => (
                  <div key={release.id} className="group">
                    <div className="relative rounded-lg overflow-hidden mb-2 shadow-md">
                      <img src={release.image} alt={release.title} className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-green-500 rounded-full p-3 transform hover:scale-110 transition-transform">
                          <MusicalNoteIcon className="h-6 w-6 text-white" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-medium line-clamp-1">{release.title}</h3>
                    <p className="text-sm text-gray-400">{release.artist}</p>
                    <p className="text-xs text-gray-500 mt-1">{release.date}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Trending Genres */}
            <section className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <ChartBarIcon className="h-6 w-6 text-purple-500 mr-2" />
                <h2 className="text-2xl font-bold">Trending Genres</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {trendingGenres.map((genre, index) => (
                  <div 
                    key={index} 
                    className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition shadow-md hover:shadow-lg"
                  >
                    <div className={`${genre.color} h-32 flex flex-col items-center justify-center p-4 text-center`}>
                      <h3 className="font-bold text-xl text-white">{genre.name}</h3>
                      <p className="mt-2 bg-black bg-opacity-30 px-3 py-1 rounded-full text-sm font-medium text-white">
                        {genre.growth}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Music News */}
            <section className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <NewspaperIcon className="h-6 w-6 text-blue-400 mr-2" />
                <h2 className="text-2xl font-bold">Music News</h2>
              </div>
              <div className="space-y-6">
                {musicNews.map(news => (
                  <div key={news.id} className="flex gap-4 hover:bg-gray-700 p-3 rounded-lg transition cursor-pointer border border-transparent hover:border-gray-600">
                    <img src={news.image} alt={news.title} className="w-24 h-24 rounded-lg object-cover shadow-md" />
                    <div>
                      <h3 className="font-semibold text-lg">{news.title}</h3>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{news.excerpt}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-gray-500">{news.date}</span>
                        <span className="ml-auto text-xs text-indigo-400 font-medium">Read more →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-8">
            {/* Weekly Top Charts */}
            <section className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <h2 className="text-xl font-bold">Top Charts</h2>
              </div>
              <div className="space-y-3">
                {topCharts.map(item => (
                  <div key={item.position} className="flex items-center hover:bg-gray-700 p-2 rounded-lg transition cursor-pointer">
                    <div className="w-8 text-center font-bold text-lg text-gray-400">{item.position}</div>
                    <div className="ml-4">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                  View complete chart
                </button>
              </div>
            </section>

            {/* For You Section */}
            <section className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <ClockIcon className="h-5 w-5 text-green-400 mr-2" />
                <h2 className="text-xl font-bold">Upcoming Events</h2>
              </div>
              <div className="space-y-4">
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">The Weeknd</h3>
                      <p className="text-sm text-gray-400">World Tour 2023</p>
                    </div>
                    <div className="bg-gray-900 px-2 py-1 rounded text-xs">Nov 12</div>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">Madison Square Garden, NY</p>
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Kendrick Lamar</h3>
                      <p className="text-sm text-gray-400">The Big Steppers Tour</p>
                    </div>
                    <div className="bg-gray-900 px-2 py-1 rounded text-xs">Nov 24</div>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">Staples Center, LA</p>
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Billie Eilish</h3>
                      <p className="text-sm text-gray-400">Happier Than Ever Tour</p>
                    </div>
                    <div className="bg-gray-900 px-2 py-1 rounded text-xs">Dec 8</div>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">O2 Arena, London</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                  View all events
                </button>
              </div>
            </section>
            
            {/* Follow Us */}
            <section className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Stay Updated</h2>
              <p className="text-gray-300 text-sm mb-4">
                Subscribe to our newsletter for weekly updates on the latest trending music.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 bg-gray-700 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 rounded-r-lg px-4 py-2 text-sm font-medium transition">
                  Subscribe
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage; 