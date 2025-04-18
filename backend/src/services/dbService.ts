import mongoose from 'mongoose';
import config from '../config';
import * as mockDb from './mockDbService';

// Track whether we're using the mock database
let usingMockDb = false;
let dbConnected = false;

// Create a chainable interface to simulate Mongoose queries
interface ChainableQuery {
  select: (fields: string) => {
    exec: () => Promise<any>;
  };
}

/**
 * Uses the real User model or mock User service depending on database connection
 */
export const User = {
  findById: async (id: string) => {
    if (!dbConnected && config.env === 'development') {
      console.log('Using mock DB for User.findById');
      usingMockDb = true;
      return mockDb.userService.findById(id);
    }
    
    try {
      // Use the real mongoose model
      const UserModel = mongoose.model('User');
      return await UserModel.findById(id);
    } catch (error) {
      if (config.env === 'development') {
        console.warn('Falling back to mock DB for User.findById');
        usingMockDb = true;
        return mockDb.userService.findById(id);
      }
      throw error;
    }
  },
  
  findOne: async (query: any) => {
    if (!dbConnected && config.env === 'development') {
      console.log('Using mock DB for User.findOne');
      usingMockDb = true;
      return mockDb.userService.findOne(query);
    }
    
    try {
      // Use the real mongoose model
      const UserModel = mongoose.model('User');
      return await UserModel.findOne(query);
    } catch (error) {
      if (config.env === 'development') {
        console.warn('Falling back to mock DB for User.findOne');
        usingMockDb = true;
        return mockDb.userService.findOne(query);
      }
      throw error;
    }
  },
  
  // Modified to return a chainable object with exec method
  findOne_Chain: (query: any): ChainableQuery => {
    if (!dbConnected && config.env === 'development') {
      console.log('Using mock DB for User.findOne with chaining');
      usingMockDb = true;
      
      // Create a chainable object for mock
      return {
        select: (fields: string) => {
          // In our mock, we'll just return the whole user object and include password
          // regardless of fields for simplicity
          return {
            exec: async () => mockDb.userService.findOne(query)
          };
        }
      };
    }
    
    try {
      // Use the real mongoose model
      const UserModel = mongoose.model('User');
      return UserModel.findOne(query) as any;
    } catch (error) {
      if (config.env === 'development') {
        console.warn('Falling back to mock DB for User.findOne with chaining');
        usingMockDb = true;
        
        // Create a chainable object for mock
        return {
          select: (fields: string) => {
            return {
              exec: async () => mockDb.userService.findOne(query)
            };
          }
        };
      }
      throw error;
    }
  },
  
  // Modified to return a chainable object with exec method
  findById_Chain: (id: string): ChainableQuery => {
    if (!dbConnected && config.env === 'development') {
      console.log('Using mock DB for User.findById_Chain');
      usingMockDb = true;
      
      return {
        select: (fields: string) => {
          return {
            exec: async () => mockDb.userService.findById(id)
          };
        }
      };
    }
    
    try {
      // Use the real mongoose model
      const UserModel = mongoose.model('User');
      return UserModel.findById(id) as any;
    } catch (error) {
      if (config.env === 'development') {
        console.warn('Falling back to mock DB for User.findById_Chain');
        usingMockDb = true;
        
        return {
          select: (fields: string) => {
            return {
              exec: async () => mockDb.userService.findById(id)
            };
          }
        };
      }
      throw error;
    }
  },
  
  create: async (userData: any) => {
    if (!dbConnected && config.env === 'development') {
      console.log('Using mock DB for User.create');
      usingMockDb = true;
      return mockDb.userService.create(userData);
    }
    
    try {
      // Use the real mongoose model
      const UserModel = mongoose.model('User');
      return await UserModel.create(userData);
    } catch (error) {
      if (config.env === 'development') {
        console.warn('Falling back to mock DB for User.create');
        usingMockDb = true;
        return mockDb.userService.create(userData);
      }
      throw error;
    }
  }
};

/**
 * Uses the real Playlist model or mock Playlist service depending on database connection
 */
export const Playlist = {
  findById: (id: string) => {
    if (!dbConnected && config.env === 'development') {
      console.log('Using mock DB for Playlist.findById');
      usingMockDb = true;
      
      // Return a chainable object that matches Mongoose's interface
      return {
        populate: function(path: string, select?: string) {
          return this; // Just return self for chaining
        },
        then: function(callback: any) {
          // Simulate promise behavior by forwarding to the actual mock service
          return mockDb.playlistService.findById(id).then(callback);
        },
        exec: function() {
          return mockDb.playlistService.findById(id);
        }
      };
    }
    
    try {
      // Use the real mongoose model
      const PlaylistModel = mongoose.model('Playlist');
      return PlaylistModel.findById(id);
    } catch (error) {
      if (config.env === 'development') {
        console.warn('Falling back to mock DB for Playlist.findById');
        usingMockDb = true;
        
        // Return a chainable object
        return {
          populate: function(path: string, select?: string) {
            return this; // Just return self for chaining
          },
          then: function(callback: any) {
            return mockDb.playlistService.findById(id).then(callback);
          },
          exec: function() {
            return mockDb.playlistService.findById(id);
          }
        };
      }
      throw error;
    }
  },
  
  find: (query: any) => {
    if (!dbConnected && config.env === 'development') {
      console.log('Using mock DB for Playlist.find');
      usingMockDb = true;
      
      // Create a more complete chainable object for mock
      const chainableObject = {
        populate: function() { return this; },
        sort: function() { return this; },
        skip: function() { return this; },
        limit: function() { return this; },
        exec: function() {
          return Promise.resolve(mockDb.playlistService.find(query));
        }
      };
      
      return chainableObject;
    }
    
    try {
      // Use the real mongoose model
      const PlaylistModel = mongoose.model('Playlist');
      return PlaylistModel.find(query);
    } catch (error) {
      if (config.env === 'development') {
        console.warn('Falling back to mock DB for Playlist.find');
        usingMockDb = true;
        
        // Create a more complete chainable object for mock
        const chainableObject = {
          populate: function() { return this; },
          sort: function() { return this; },
          skip: function() { return this; },
          limit: function() { return this; },
          exec: function() {
            return Promise.resolve(mockDb.playlistService.find(query));
          }
        };
        
        return chainableObject;
      }
      throw error;
    }
  },
  
  countDocuments: async (query: any) => {
    if (!dbConnected && config.env === 'development') {
      console.log('Using mock DB for Playlist.countDocuments');
      usingMockDb = true;
      return mockDb.playlistService.countDocuments(query);
    }
    
    try {
      // Use the real mongoose model
      const PlaylistModel = mongoose.model('Playlist');
      return await PlaylistModel.countDocuments(query);
    } catch (error) {
      if (config.env === 'development') {
        console.warn('Falling back to mock DB for Playlist.countDocuments');
        usingMockDb = true;
        return mockDb.playlistService.countDocuments(query);
      }
      throw error;
    }
  },
  
  create: async (playlistData: any) => {
    if (!dbConnected && config.env === 'development') {
      console.log('Using mock DB for Playlist.create');
      usingMockDb = true;
      return mockDb.playlistService.create(playlistData);
    }
    
    try {
      // Use the real mongoose model
      const PlaylistModel = mongoose.model('Playlist');
      return await PlaylistModel.create(playlistData);
    } catch (error) {
      if (config.env === 'development') {
        console.warn('Falling back to mock DB for Playlist.create');
        usingMockDb = true;
        return mockDb.playlistService.create(playlistData);
      }
      throw error;
    }
  }
};

/**
 * Update the database connection status
 */
export const setDbConnectionStatus = (status: boolean) => {
  dbConnected = status;
};

/**
 * Check if using mock database
 */
export const isUsingMockDb = () => {
  return usingMockDb;
}; 