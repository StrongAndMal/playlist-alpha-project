import { IUser } from '../models/User';
import { IPlaylist } from '../models/Playlist';
import mongoose from 'mongoose';

// Mock database storage
const mockDb = {
  users: new Map<string, any>(),
  playlists: new Map<string, any>(),
  counters: {
    userId: 1,
    playlistId: 1
  }
};

// Populate some initial data
const initMockData = () => {
  // Sample users
  const user1Id = new mongoose.Types.ObjectId();
  const user2Id = new mongoose.Types.ObjectId();
  
  mockDb.users.set(user1Id.toString(), {
    _id: user1Id,
    username: 'testuser',
    email: 'test@example.com',
    password: '$2b$10$X7o5/C76WxST9mLV5mP1Z.LI9i8GVjxc0FQIi0j6Eq2y7FQ.K1AQC', // hashed 'password123'
    avatar: '',
    bio: 'Test user for development',
    favoriteGenres: ['pop', 'rock'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  });
  
  mockDb.users.set(user2Id.toString(), {
    _id: user2Id,
    username: 'musiclover',
    email: 'music@example.com',
    password: '$2b$10$X7o5/C76WxST9mLV5mP1Z.LI9i8GVjxc0FQIi0j6Eq2y7FQ.K1AQC', // hashed 'password123'
    avatar: '',
    bio: 'Just someone who loves music!',
    favoriteGenres: ['indie', 'electronic'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  });
  
  // Sample playlists
  const playlist1Id = new mongoose.Types.ObjectId();
  const playlist2Id = new mongoose.Types.ObjectId();
  
  mockDb.playlists.set(playlist1Id.toString(), {
    _id: playlist1Id,
    title: 'Awesome Rock Mix',
    description: 'Best rock songs of all time',
    creator: user1Id,
    coverImage: 'https://example.com/covers/rock.jpg',
    genres: ['rock', 'classic rock'],
    tracks: [
      {
        spotifyId: '4cOdK2wGLETKBW3PvgPWqT',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night At The Opera',
        albumCover: 'https://example.com/albums/queen.jpg',
        duration: 354,
        previewUrl: 'https://example.com/preview/bohemian.mp3'
      },
      {
        spotifyId: '5oD2Z1OOx1Tmcu2mc9sLY2',
        title: 'Sweet Child O\' Mine',
        artist: 'Guns N\' Roses',
        album: 'Appetite for Destruction',
        albumCover: 'https://example.com/albums/gnr.jpg',
        duration: 356,
        previewUrl: 'https://example.com/preview/sweet-child.mp3'
      }
    ],
    isPublic: true,
    likes: [user2Id],
    comments: [
      {
        user: user2Id,
        text: 'Great playlist! Love the song choices.',
        createdAt: new Date('2023-02-01')
      }
    ],
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-02-01')
  });
  
  mockDb.playlists.set(playlist2Id.toString(), {
    _id: playlist2Id,
    title: 'Chill Electronic Vibes',
    description: 'Perfect for coding or studying',
    creator: user2Id,
    coverImage: 'https://example.com/covers/electronic.jpg',
    genres: ['electronic', 'ambient'],
    tracks: [
      {
        spotifyId: '2wC2LJIws5WxIZANWGH5Mf',
        title: 'Strobe',
        artist: 'deadmau5',
        album: 'For Lack of a Better Name',
        albumCover: 'https://example.com/albums/deadmau5.jpg',
        duration: 598,
        previewUrl: 'https://example.com/preview/strobe.mp3'
      },
      {
        spotifyId: '1Oz6R6rFlvI57ceuzuKc7A',
        title: 'Flim',
        artist: 'Aphex Twin',
        album: 'Come to Daddy',
        albumCover: 'https://example.com/albums/aphex.jpg',
        duration: 179,
        previewUrl: 'https://example.com/preview/flim.mp3'
      }
    ],
    isPublic: true,
    likes: [user1Id],
    comments: [],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-10')
  });
};

// Initialize the mock data
initMockData();

// Mock User service
export const userService = {
  findById: (id: string) => {
    return Promise.resolve(mockDb.users.get(id) || null);
  },
  
  findOne: (query: any) => {
    if (query.email) {
      const email = query.email;
      for (const user of mockDb.users.values()) {
        if (user.email === email) {
          return Promise.resolve(user);
        }
      }
    } else if (query.username) {
      const username = query.username;
      for (const user of mockDb.users.values()) {
        if (user.username === username) {
          return Promise.resolve(user);
        }
      }
    } else if (query.$or) {
      const orQueries = query.$or;
      for (const user of mockDb.users.values()) {
        for (const orQuery of orQueries) {
          if ((orQuery.email && user.email === orQuery.email) || 
              (orQuery.username && user.username === orQuery.username)) {
            return Promise.resolve(user);
          }
        }
      }
    }
    return Promise.resolve(null);
  },
  
  create: (userData: any) => {
    const id = new mongoose.Types.ObjectId();
    const now = new Date();
    const newUser = {
      _id: id,
      ...userData,
      createdAt: now,
      updatedAt: now
    };
    mockDb.users.set(id.toString(), newUser);
    
    // Add generateAuthToken method to mock
    newUser.generateAuthToken = function() {
      return `mock_token_for_${this._id}`;
    };
    
    // Add comparePassword method to mock
    newUser.comparePassword = function(password: string) {
      return Promise.resolve(password === 'password123'); // Always match with this password in dev
    };
    
    return Promise.resolve(newUser);
  }
};

// Mock Playlist service
export const playlistService = {
  findById: (id: string) => {
    const playlist = mockDb.playlists.get(id);
    if (!playlist) return Promise.resolve(null);
    
    // Add populated fields for creator and comments
    const populated = {
      ...playlist,
      creator: mockDb.users.get(playlist.creator.toString()) || playlist.creator,
      comments: playlist.comments.map((comment: any) => ({
        ...comment,
        user: mockDb.users.get(comment.user.toString()) || comment.user
      }))
    };
    
    return Promise.resolve(populated);
  },
  
  find: (query: any) => {
    let results = Array.from(mockDb.playlists.values());
    
    // Handle isPublic filter
    if (query.isPublic !== undefined) {
      results = results.filter(playlist => playlist.isPublic === query.isPublic);
    }
    
    // Handle genre filter
    if (query.genres) {
      results = results.filter(playlist => playlist.genres.includes(query.genres));
    }
    
    // Handle creator filter
    if (query.creator) {
      results = results.filter(playlist => playlist.creator.toString() === query.creator.toString());
    }
    
    // Handle text search
    if (query.$or) {
      const filtered = [];
      for (const playlist of results) {
        for (const orQuery of query.$or) {
          if (orQuery.title && orQuery.title.$regex) {
            const regex = new RegExp(orQuery.title.$regex, orQuery.title.$options);
            if (regex.test(playlist.title)) {
              filtered.push(playlist);
              break;
            }
          }
          if (orQuery.description && orQuery.description.$regex) {
            const regex = new RegExp(orQuery.description.$regex, orQuery.description.$options);
            if (regex.test(playlist.description)) {
              filtered.push(playlist);
              break;
            }
          }
        }
      }
      results = filtered;
    }
    
    // Mock object for chaining
    const chainObj = {
      populate: function() { return this; },
      sort: function() { return this; },
      skip: function() { return this; },
      limit: function(limit: number) {
        results = results.slice(0, limit);
        return Promise.resolve(results);
      }
    };
    
    return chainObj;
  },
  
  countDocuments: (query: any) => {
    // Reuse the find logic but just return the count
    let results = Array.from(mockDb.playlists.values());
    
    if (query.isPublic !== undefined) {
      results = results.filter(playlist => playlist.isPublic === query.isPublic);
    }
    
    if (query.genres) {
      results = results.filter(playlist => playlist.genres.includes(query.genres));
    }
    
    if (query.creator) {
      results = results.filter(playlist => playlist.creator.toString() === query.creator.toString());
    }
    
    return Promise.resolve(results.length);
  },
  
  create: (playlistData: any) => {
    const id = new mongoose.Types.ObjectId();
    const now = new Date();
    const newPlaylist = {
      _id: id,
      ...playlistData,
      createdAt: now,
      updatedAt: now
    };
    mockDb.playlists.set(id.toString(), newPlaylist);
    return Promise.resolve(newPlaylist);
  }
};

// Flag to indicate if we're using mock data
export const isMockDbActive = true; 