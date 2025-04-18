import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../services/dbService';
import { Playlist } from '../services/dbService';
import { IUser } from '../models/User';

/**
 * @desc    Get user profile by username
 * @route   GET /api/profiles/:username
 * @access  Public
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.params.username;
    
    // Find user by username and populate followers, following, and showcase playlists
    const user = await User.findOne_Chain({ username })
      .select('-password -spotifyAccessToken -spotifyRefreshToken');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error getting user profile' });
  }
};

/**
 * @desc    Update user's profile
 * @route   PUT /api/profiles
 * @access  Private
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { 
      bio, 
      avatar, 
      favoriteGenres, 
      profileTheme 
    } = req.body;
    
    // Update fields if provided
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (favoriteGenres) user.favoriteGenres = favoriteGenres;
    if (profileTheme) user.profileTheme = profileTheme;
    
    await user.save();
    
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        avatarFrame: user.avatarFrame,
        bio: user.bio,
        level: user.level,
        experience: user.experience,
        favoriteGenres: user.favoriteGenres,
        badges: user.badges,
        awards: user.awards,
        followers: user.followers,
        following: user.following,
        profileTheme: user.profileTheme,
        showcasePlaylists: user.showcasePlaylists,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

/**
 * @desc    Follow/Unfollow a user
 * @route   POST /api/profiles/:username/follow
 * @access  Private
 */
export const toggleFollow = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const usernameToFollow = req.params.username;
    
    // Can't follow yourself
    if (currentUser.username === usernameToFollow) {
      res.status(400).json({ message: 'You cannot follow yourself' });
      return;
    }
    
    // Find the user to follow
    const userToFollow = await User.findOne({ username: usernameToFollow });
    
    if (!userToFollow) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    const currentUserId = currentUser._id.toString();
    const userToFollowId = userToFollow._id.toString();
    
    // Check if already following
    const isFollowing = currentUser.following.some(id => 
      id.toString() === userToFollowId
    );
    
    if (isFollowing) {
      // Unfollow: Remove from following list
      currentUser.following = currentUser.following.filter(id => 
        id.toString() !== userToFollowId
      );
      
      // Remove from followers list of the target user
      userToFollow.followers = userToFollow.followers.filter(id => 
        id.toString() !== currentUserId
      );
    } else {
      // Follow: Add to following list
      currentUser.following.push(new mongoose.Types.ObjectId(userToFollowId));
      
      // Add to followers list of the target user
      userToFollow.followers.push(new mongoose.Types.ObjectId(currentUserId));
      
      // Give experience points for social interaction
      currentUser.experience += 5;
      
      // Level up if enough experience (100 per level)
      if (currentUser.experience >= currentUser.level * 100) {
        currentUser.level += 1;
        
        // Add a badge for reaching level milestones
        if (currentUser.level === 5) {
          currentUser.badges.push({
            id: 'level-5',
            name: 'Social Butterfly',
            description: 'Reached level 5 by being active in the community',
            icon: 'butterfly',
            dateAwarded: new Date()
          });
        } else if (currentUser.level === 10) {
          currentUser.badges.push({
            id: 'level-10',
            name: 'Music Enthusiast',
            description: 'Reached level 10 by being very active in the community',
            icon: 'music-note',
            dateAwarded: new Date()
          });
        }
      }
    }
    
    // Save both users
    await Promise.all([currentUser.save(), userToFollow.save()]);
    
    res.status(200).json({ 
      following: !isFollowing, 
      user: {
        username: userToFollow.username,
        avatar: userToFollow.avatar,
        followerCount: userToFollow.followers.length
      }
    });
  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({ message: 'Server error toggling follow status' });
  }
};

/**
 * @desc    Get user's followers
 * @route   GET /api/profiles/:username/followers
 * @access  Public
 */
export const getFollowers = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.params.username;
    
    // Find user and populate followers
    const user = await User.findOne({ username }).exec();
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Get followers with minimal info
    const followers = await Promise.all(
      user.followers.map(async (followerId) => {
        const follower = await User.findById(followerId.toString()).exec();
        if (!follower) return null;
        
        return {
          id: follower._id,
          username: follower.username,
          avatar: follower.avatar,
          avatarFrame: follower.avatarFrame,
          level: follower.level
        };
      })
    );
    
    // Filter out null values (deleted users)
    const validFollowers = followers.filter(follower => follower !== null);
    
    res.status(200).json({ 
      followers: validFollowers,
      count: validFollowers.length 
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Server error getting followers' });
  }
};

/**
 * @desc    Get user's following
 * @route   GET /api/profiles/:username/following
 * @access  Public
 */
export const getFollowing = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.params.username;
    
    // Find user and populate following
    const user = await User.findOne({ username }).exec();
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Get following with minimal info
    const following = await Promise.all(
      user.following.map(async (followingId) => {
        const followedUser = await User.findById(followingId.toString()).exec();
        if (!followedUser) return null;
        
        return {
          id: followedUser._id,
          username: followedUser.username,
          avatar: followedUser.avatar,
          avatarFrame: followedUser.avatarFrame,
          level: followedUser.level
        };
      })
    );
    
    // Filter out null values (deleted users)
    const validFollowing = following.filter(followedUser => followedUser !== null);
    
    res.status(200).json({ 
      following: validFollowing,
      count: validFollowing.length 
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error getting following' });
  }
};

/**
 * @desc    Award a badge to a user (admin only)
 * @route   POST /api/profiles/:username/badges
 * @access  Private (Admin)
 */
export const awardBadge = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const username = req.params.username;
    const { badgeId, badgeName, badgeDescription, badgeIcon } = req.body;
    
    // Check if current user is admin (in a real app, you'd have proper admin checks)
    if (!currentUser || currentUser.level < 10) {
      res.status(403).json({ message: 'Not authorized to award badges' });
      return;
    }
    
    // Find user to award
    const userToAward = await User.findOne({ username }).exec();
    
    if (!userToAward) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Check if badge already awarded
    const badgeExists = userToAward.badges.some(badge => badge.id === badgeId);
    
    if (badgeExists) {
      res.status(400).json({ message: 'Badge already awarded to this user' });
      return;
    }
    
    // Add badge
    userToAward.badges.push({
      id: badgeId,
      name: badgeName,
      description: badgeDescription,
      icon: badgeIcon,
      dateAwarded: new Date()
    });
    
    // Give experience points
    userToAward.experience += 25;
    
    // Level up if enough experience
    if (userToAward.experience >= userToAward.level * 100) {
      userToAward.level += 1;
    }
    
    await userToAward.save();
    
    res.status(200).json({ 
      message: 'Badge awarded successfully',
      badge: {
        id: badgeId,
        name: badgeName,
        description: badgeDescription,
        icon: badgeIcon
      } 
    });
  } catch (error) {
    console.error('Award badge error:', error);
    res.status(500).json({ message: 'Server error awarding badge' });
  }
};

/**
 * @desc    Give an award to a user
 * @route   POST /api/profiles/:username/awards
 * @access  Private
 */
export const giveAward = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const username = req.params.username;
    const { awardId, awardName, awardDescription, awardIcon } = req.body;
    
    // Can't award yourself
    if (currentUser.username === username) {
      res.status(400).json({ message: 'You cannot give an award to yourself' });
      return;
    }
    
    // Find user to award
    const userToAward = await User.findOne({ username }).exec();
    
    if (!userToAward) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Add award
    userToAward.awards.push({
      id: awardId,
      name: awardName,
      description: awardDescription,
      icon: awardIcon,
      awardedBy: new mongoose.Types.ObjectId(currentUser._id.toString()),
      dateAwarded: new Date()
    });
    
    // Give experience points
    userToAward.experience += 10;
    currentUser.experience += 5; // Giver also gets some XP
    
    // Level up if enough experience
    if (userToAward.experience >= userToAward.level * 100) {
      userToAward.level += 1;
    }
    
    if (currentUser.experience >= currentUser.level * 100) {
      currentUser.level += 1;
    }
    
    // Check if user gets a badge for receiving awards
    if (userToAward.awards.length === 5) {
      userToAward.badges.push({
        id: 'awards-5',
        name: 'Rising Star',
        description: 'Received 5 community awards',
        icon: 'rising-star',
        dateAwarded: new Date()
      });
    } else if (userToAward.awards.length === 25) {
      userToAward.badges.push({
        id: 'awards-25',
        name: 'Community Favorite',
        description: 'Received 25 community awards',
        icon: 'trophy',
        dateAwarded: new Date()
      });
    }
    
    // Save both users
    await Promise.all([userToAward.save(), currentUser.save()]);
    
    res.status(200).json({ 
      message: 'Award given successfully',
      award: {
        id: awardId,
        name: awardName,
        description: awardDescription,
        icon: awardIcon
      } 
    });
  } catch (error) {
    console.error('Give award error:', error);
    res.status(500).json({ message: 'Server error giving award' });
  }
};

/**
 * @desc    Update showcase playlists
 * @route   PUT /api/profiles/showcase
 * @access  Private
 */
export const updateShowcase = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { playlistIds } = req.body;
    
    // Validate playlist IDs
    if (!Array.isArray(playlistIds)) {
      res.status(400).json({ message: 'Playlist IDs must be an array' });
      return;
    }
    
    // Limit to 3 showcase playlists
    if (playlistIds.length > 3) {
      res.status(400).json({ message: 'Maximum 3 showcase playlists allowed' });
      return;
    }
    
    // Verify playlists exist and belong to user
    const playlists = await Promise.all(
      playlistIds.map(async (id) => {
        const playlist = await Playlist.findById(id).exec();
        if (!playlist) return null;
        
        // Check if user owns playlist or if playlist is public
        if (playlist.creator.toString() !== user._id.toString() && !playlist.isPublic) {
          return null;
        }
        
        return playlist._id;
      })
    );
    
    // Filter out null values (non-existent or unauthorized playlists)
    const validPlaylistIds = playlists.filter(playlist => playlist !== null);
    
    // Update user showcase
    user.showcasePlaylists = validPlaylistIds as mongoose.Types.ObjectId[];
    
    await user.save();
    
    res.status(200).json({ 
      message: 'Showcase updated successfully',
      showcasePlaylists: user.showcasePlaylists
    });
  } catch (error) {
    console.error('Update showcase error:', error);
    res.status(500).json({ message: 'Server error updating showcase' });
  }
};

/**
 * @desc    Update avatar frame
 * @route   PUT /api/profiles/frame
 * @access  Private
 */
export const updateAvatarFrame = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { frameId } = req.body;
    
    // Check if user has earned this frame
    // In a real app, you would check against a list of available frames
    // and verify that the user has met the requirements
    
    // For demo purposes, we'll just allow it if the user is at least level 3
    if (user.level < 3 && frameId !== 'default') {
      res.status(403).json({ 
        message: 'You need to be at least level 3 to use custom frames'
      });
      return;
    }
    
    // Update avatar frame
    user.avatarFrame = frameId;
    
    await user.save();
    
    res.status(200).json({ 
      message: 'Avatar frame updated successfully',
      avatarFrame: user.avatarFrame
    });
  } catch (error) {
    console.error('Update avatar frame error:', error);
    res.status(500).json({ message: 'Server error updating avatar frame' });
  }
}; 