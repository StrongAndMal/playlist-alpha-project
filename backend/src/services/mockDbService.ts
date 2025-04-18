import { IUser } from '../models/User';
import { IPlaylist } from '../models/Playlist';
import mongoose from 'mongoose';

/**
 * Mock database service for development without a real database
 */

// Mock user data
const mockUsers = [
  {
    _id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
    password: '$2b$10$abcdefghijklmnopqrstuvwxyz', // Mocked hashed password
    avatar: 'https://via.placeholder.com/150',
    bio: 'Test user bio',
    favoriteGenres: ['rock', 'pop'],
    spotifyId: 'spotify123',
    spotifyAccessToken: 'mocktoken123',
    spotifyRefreshToken: 'mockrefreshtoken123',
    createdAt: new Date(),
    updatedAt: new Date(),
    // Methods
    comparePassword: async (password: string) => password === 'password',
    generateAuthToken: () => 'mockedJWTtoken123',
    save: async function() { return this; }
  }
];

// Mock user service
export const userService = {
  findById: async (id: string) => {
    const user = mockUsers.find(u => u._id === id);
    if (!user) return null;
    return { ...user };
  },
  
  findOne: async (query: any) => {
    // Basic query matching
    const user = mockUsers.find(u => {
      if (query.email && u.email === query.email) return true;
      if (query.username && u.username === query.username) return true;
      if (query.spotifyId && u.spotifyId === query.spotifyId) return true;
      if (query.$or) {
        return query.$or.some((condition: any) => {
          return Object.keys(condition).some(key => {
            return u[key as keyof typeof u] === condition[key];
          });
        });
      }
      return false;
    });
    
    if (!user) return null;
    return { ...user };
  },
  
  create: async (userData: any) => {
    const newUser = {
      _id: `user${mockUsers.length + 1}`,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      comparePassword: async (password: string) => password === userData.password,
      generateAuthToken: () => 'mockNewUserJWTtoken',
      save: async function() { return this; }
    };
    mockUsers.push(newUser);
    return newUser;
  }
};

// Mock playlist data
const mockPlaylists: any[] = [];

// Mock playlist service
export const playlistService = {
  findById: async (id: string) => {
    const playlist = mockPlaylists.find(p => p._id === id);
    if (!playlist) return null;
    return { ...playlist };
  },
  
  find: async (query: any) => {
    // Return all playlists for now, could implement filtering later
    return [...mockPlaylists];
  },
  
  countDocuments: async (query: any) => {
    return mockPlaylists.length;
  },
  
  create: async (playlistData: any) => {
    const newPlaylist = {
      _id: `playlist${mockPlaylists.length + 1}`,
      ...playlistData,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function() { return this; }
    };
    mockPlaylists.push(newPlaylist);
    return newPlaylist;
  }
};

// Flag to indicate if we're using mock data
export const isMockDbActive = true; 