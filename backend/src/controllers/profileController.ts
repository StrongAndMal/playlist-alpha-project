import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../services/dbService';
import { Playlist } from '../services/dbService';
import { IUser } from '../models/User';
import { IPlaylist } from '../models/Playlist';

/**
 * @desc    Get user profile by username
 * @route   GET /api/profiles/:username
 * @access  Public
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const userObj = user.toJSON ? user.toJSON() : { ...user };
    delete userObj.password;
    delete userObj.spotifyAccessToken;
    delete userObj.spotifyRefreshToken;
    res.status(200).json({ user: userObj });
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
    if (currentUser.username === usernameToFollow) {
      res.status(400).json({ message: 'You cannot follow yourself' });
      return;
    }
    const userToFollow = await User.findOne({ username: usernameToFollow });
    if (!userToFollow) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const currentUserId = currentUser._id?.toString() || '';
    const userToFollowId = userToFollow._id?.toString() || '';
    if (!currentUserId || !userToFollowId) {
      console.error('Could not get valid user IDs for follow action');
      res.status(500).json({ message: 'Server error processing follow request' });
      return;
    }
    const isFollowing = currentUser.following.some((id: mongoose.Types.ObjectId | string) => 
      id.toString() === userToFollowId
    );
    if (isFollowing) {
      currentUser.following = currentUser.following.filter((id: mongoose.Types.ObjectId | string) => 
        id.toString() !== userToFollowId
      );
      userToFollow.followers = userToFollow.followers.filter((id: mongoose.Types.ObjectId | string) => 
        id.toString() !== currentUserId
      );
    } else {
      currentUser.following.push(new mongoose.Types.ObjectId(userToFollowId));
      userToFollow.followers.push(new mongoose.Types.ObjectId(currentUserId));
      currentUser.experience = (currentUser.experience || 0) + 5;
      if (currentUser.experience >= (currentUser.level || 1) * 100) {
        currentUser.level = (currentUser.level || 1) + 1;
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
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const followers = await Promise.all(
      (user.followers || []).map(async (followerId: mongoose.Types.ObjectId | string) => {
        const follower = await User.findById(followerId.toString());
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
    const validFollowers = followers.filter((follower): follower is Exclude<typeof follower, null> => follower !== null);
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
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const following = await Promise.all(
      (user.following || []).map(async (followingId: mongoose.Types.ObjectId | string) => {
        const followedUser = await User.findById(followingId.toString());
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
    const validFollowing = following.filter((followedUser): followedUser is Exclude<typeof followedUser, null> => followedUser !== null);
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
    if (!currentUser || (currentUser.level || 1) < 10) {
      res.status(403).json({ message: 'Not authorized to award badges' });
      return;
    }
    const userToAward = await User.findOne({ username });
    
    if (!userToAward) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Check if badge already awarded
    const badgeExists = (userToAward.badges || []).some((badge: any) => badge.id === badgeId);
    
    if (badgeExists) {
      res.status(400).json({ message: 'Badge already awarded to this user' });
      return;
    }
    
    // Add badge
    if (!userToAward.badges) {
      userToAward.badges = [];
    }
    userToAward.badges.push({
      id: badgeId,
      name: badgeName,
      description: badgeDescription,
      icon: badgeIcon,
      dateAwarded: new Date()
    });
    
    // Give experience points
    userToAward.experience = (userToAward.experience || 0) + 25;
    
    // Level up if enough experience
    if (userToAward.experience >= (userToAward.level || 1) * 100) {
      userToAward.level = (userToAward.level || 1) + 1;
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
    const userToAward = await User.findOne({ username });
    
    if (!userToAward) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    const currentUserId = currentUser._id?.toString();
    if (!currentUserId) {
      res.status(400).json({ message: 'Invalid current user ID' });
      return;
    }
    
    // Add award
    if (!userToAward.awards) {
      userToAward.awards = [];
    }
    userToAward.awards.push({
      id: awardId,
      name: awardName,
      description: awardDescription,
      icon: awardIcon,
      awardedBy: new mongoose.Types.ObjectId(currentUserId),
      dateAwarded: new Date()
    });
    
    // Give experience points
    userToAward.experience = (userToAward.experience || 0) + 10;
    currentUser.experience = (currentUser.experience || 0) + 5; // Giver also gets some XP
    
    // Level up if enough experience
    if (userToAward.experience >= (userToAward.level || 1) * 100) {
      userToAward.level = (userToAward.level || 1) + 1;
    }
    
    if (currentUser.experience >= (currentUser.level || 1) * 100) {
      currentUser.level = (currentUser.level || 1) + 1;
    }
    
    // Check if user gets a badge for receiving awards
    if (!userToAward.badges) {
      userToAward.badges = [];
    }
    if (userToAward.awards.length === 5) {
      if (!userToAward.badges.some((b:any) => b.id === 'awards-5')) {
        userToAward.badges.push({
          id: 'awards-5',
          name: 'Rising Star',
          description: 'Received 5 community awards',
          icon: 'rising-star',
          dateAwarded: new Date()
        });
      }
    } else if (userToAward.awards.length === 25) {
       if (!userToAward.badges.some((b:any) => b.id === 'awards-25')) {
          userToAward.badges.push({
            id: 'awards-25',
            name: 'Community Favorite',
            description: 'Received 25 community awards',
            icon: 'trophy',
            dateAwarded: new Date()
          });
        }
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
    
    const currentUserId = user._id?.toString();
    if (!currentUserId) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }
    
    // Verify playlists exist and belong to user
    const playlists = await Promise.all(
      playlistIds.map(async (id: string) => {
        try {
          const playlist = await Playlist.findById(id);
          if (!playlist) return null;
          
          // Check if user owns playlist or if playlist is public
          if (playlist.creator?.toString() !== currentUserId && !playlist.isPublic) {
            return null;
          }
          
          return playlist._id;
        } catch (err) {
          console.warn(`Error fetching playlist ${id} for showcase:`, err);
          return null;
        }
      })
    );
    
    // Filter out null values (non-existent or unauthorized playlists)
    const validPlaylistIds = playlists.filter((playlistId): playlistId is mongoose.Types.ObjectId => 
      playlistId instanceof mongoose.Types.ObjectId
    );
    
    // Update user showcase
    user.showcasePlaylists = validPlaylistIds;
    
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
    if ((user.level || 1) < 3 && frameId !== 'default') {
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