import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

// User document interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  avatarFrame?: string;
  bio?: string;
  level: number;
  experience: number;
  joinDate: Date;
  spotifyId?: string;
  spotifyAccessToken?: string;
  spotifyRefreshToken?: string;
  favoriteGenres: string[];
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    dateAwarded: Date;
  }[];
  awards: {
    id: string;
    name: string;
    description: string;
    icon: string;
    awardedBy: mongoose.Types.ObjectId;
    dateAwarded: Date;
  }[];
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  profileTheme?: string;
  showcasePlaylists: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// User schema
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    avatar: {
      type: String,
      default: ''
    },
    avatarFrame: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    level: {
      type: Number,
      default: 1
    },
    experience: {
      type: Number,
      default: 0
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    spotifyId: {
      type: String
    },
    spotifyAccessToken: {
      type: String,
      select: false
    },
    spotifyRefreshToken: {
      type: String,
      select: false
    },
    favoriteGenres: [{
      type: String
    }],
    badges: [{
      id: String,
      name: String,
      description: String,
      icon: String,
      dateAwarded: {
        type: Date,
        default: Date.now
      }
    }],
    awards: [{
      id: String,
      name: String,
      description: String,
      icon: String,
      awardedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      dateAwarded: {
        type: Date,
        default: Date.now
      }
    }],
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    profileTheme: {
      type: String,
      default: 'default'
    },
    showcasePlaylists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Playlist'
    }]
  },
  {
    timestamps: true
  }
);

// Virtual for follower count
UserSchema.virtual('followerCount').get(function(this: IUser) {
  return this.followers.length;
});

// Virtual for following count
UserSchema.virtual('followingCount').get(function(this: IUser) {
  return this.following.length;
});

// Virtual for badge count
UserSchema.virtual('badgeCount').get(function(this: IUser) {
  return this.badges.length;
});

// Virtual for award count
UserSchema.virtual('awardCount').get(function(this: IUser) {
  return this.awards.length;
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function(): string {
  // Use any to bypass TypeScript errors with jwt.sign
  return jwt.sign(
    { id: this._id.toString(), username: this.username },
    config.jwtSecret as any,
    { expiresIn: config.jwtExpiresIn } as any
  );
};

// Set toJSON to include virtual properties
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

export default mongoose.model<IUser>('User', UserSchema); 