import mongoose from 'mongoose';
import config from '../config';
import * as mockDb from './mockDbService';

// Track whether we're using the mock database
let usingMockDb = false;
let dbConnected = false;

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
  
  findOne_Chain: (query: any) => {
    if (!dbConnected && config.env === 'development') {
      console.log('Using mock DB for User.findOne with chaining');
      usingMockDb = true;
      
      // Create a chainable object for mock
      return {
        select: (fields: string) => {
          // In our mock, we'll just return the whole user object and include password
          // regardless of fields for simplicity
          return mockDb.userService.findOne(query);
        }
      };
    }
    
    try {
      // Use the real mongoose model
      const UserModel = mongoose.model('User');
      return UserModel.findOne(query);
    } catch (error) {
      if (config.env === 'development') {
        console.warn('Falling back to mock DB for User.findOne with chaining');
        usingMockDb = true;
        
        // Create a chainable object for mock
        return {
          select: (fields: string) => {
            return mockDb.userService.findOne(query);
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
      const results = mockDb.playlistService.find(query);
      if (results && typeof results === 'object') {
        return {
          ...results,
          exec: function() {
            // If the mock already has a limit method that returns a promise,
            // we'll just call that with a large number as a fallback
            if (typeof this.limit === 'function') {
              return this.limit(100);
            }
            // Otherwise, create a resolved promise with an empty array
            return Promise.resolve([]);
          }
        };
      }
      return results;
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
        const results = mockDb.playlistService.find(query);
        if (results && typeof results === 'object') {
          return {
            ...results,
            exec: function() {
              // If the mock already has a limit method that returns a promise,
              // we'll just call that with a large number as a fallback
              if (typeof this.limit === 'function') {
                return this.limit(100);
              }
              // Otherwise, create a resolved promise with an empty array
              return Promise.resolve([]);
            }
          };
        }
        return results;
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
 * Set the database connection status
 */
export const setDbConnectionStatus = (status: boolean) => {
  dbConnected = status;
};

/**
 * Check if we're using the mock database
 */
export const isUsingMockDb = () => {
  return usingMockDb;
}; 