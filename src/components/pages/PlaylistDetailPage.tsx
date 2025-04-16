import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { HeartIcon, ChatBubbleLeftIcon, PlayIcon } from '@heroicons/react/24/outline';

// Dummy data for the prototype
const dummyPlaylist = {
  id: '1',
  title: 'Summer Vibes 2025',
  description: 'The perfect playlist for your summer adventures. A mix of upbeat tracks to keep you energized all season long.',
  creator: 'DJ Cool',
  coverImage: 'https://picsum.photos/800/800',
  voteCount: 128,
  commentCount: 24,
  tracks: [
    {
      id: '1',
      title: 'Summer Nights',
      artist: 'Beach Boys',
      album: 'Summer Collection',
      duration: '3:45',
    },
    {
      id: '2',
      title: 'Sunshine',
      artist: 'Pool Party',
      album: 'Beach Vibes',
      duration: '4:12',
    },
    // Add more dummy tracks as needed
  ],
  comments: [
    {
      id: '1',
      user: 'MusicLover123',
      avatar: 'https://picsum.photos/50/50',
      text: 'This playlist is amazing! Perfect for my beach trips.',
      timestamp: '2 hours ago',
    },
    // Add more dummy comments as needed
  ],
};

const PlaylistDetailPage: FC = () => {
  const { id: _id } = useParams<{ id: string }>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <img
                  src={dummyPlaylist.coverImage}
                  alt={dummyPlaylist.title}
                  className="w-48 h-48 rounded-lg object-cover shadow-lg border border-gray-700"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">{dummyPlaylist.title}</h1>
                <p className="mt-2 text-white">by {dummyPlaylist.creator}</p>
                <p className="mt-4 text-white">{dummyPlaylist.description}</p>
                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <button className="gradient-bg text-white px-4 py-2 rounded-md hover:opacity-90 btn-hover-scale btn-hover-glow flex items-center">
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Open on Spotify
                  </button>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-white hover:text-blue-400 transition-colors duration-200">
                      <HeartIcon className="h-5 w-5 mr-1" />
                      <span>{dummyPlaylist.voteCount}</span>
                    </button>
                    <button className="flex items-center text-white hover:text-blue-400 transition-colors duration-200">
                      <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                      <span>{dummyPlaylist.commentCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold gradient-text mb-4">Tracks</h2>
            <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Artist</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Album</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {dummyPlaylist.tracks.map((track, index) => (
                    <tr key={track.id} className="hover:bg-gray-800 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{track.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{track.artist}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{track.album}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{track.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold gradient-text mb-4">Comments</h2>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
              <div className="space-y-6">
                {dummyPlaylist.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <img
                      src={comment.avatar}
                      alt={comment.user}
                      className="h-10 w-10 rounded-full border border-gray-700"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{comment.user}</span>
                        <span className="text-sm text-gray-400">{comment.timestamp}</span>
                      </div>
                      <p className="mt-1 text-white">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <textarea
                  className="w-full rounded-lg p-4 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a comment..."
                  rows={3}
                />
                <button className="mt-4 gradient-bg text-white px-4 py-2 rounded-md hover:opacity-90 btn-hover-scale btn-hover-glow">Post Comment</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800 sticky top-8">
            <h3 className="text-xl font-bold gradient-text mb-4">Similar Playlists</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg transition-colors duration-200">
                  <img 
                    src={`https://picsum.photos/800/800?random=${item}`} 
                    alt="Playlist cover" 
                    className="w-12 h-12 rounded object-cover" 
                  />
                  <div>
                    <h4 className="text-white font-medium">Playlist Title {item}</h4>
                    <p className="text-white text-sm">by Creator {item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetailPage; 