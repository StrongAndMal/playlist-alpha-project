import mongoose, { Schema, Document } from 'mongoose';

// Playlist document interface
export interface IPlaylist extends Document {
  title: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  coverImage: string;
  genres: string[];
  tracks: {
    spotifyId: string;
    title: string;
    artist: string;
    album: string;
    albumCover: string;
    duration: number;
    previewUrl?: string;
  }[];
  spotifyPlaylistId?: string;
  isPublic: boolean;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  comments: {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  voteScore: number;
  commentCount: number;
  trackCount: number;
}

// Playlist schema
const PlaylistSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Playlist title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    coverImage: {
      type: String,
      default: ''
    },
    genres: [{
      type: String
    }],
    tracks: [
      {
        spotifyId: {
          type: String,
          required: true
        },
        title: {
          type: String,
          required: true
        },
        artist: {
          type: String,
          required: true
        },
        album: {
          type: String
        },
        albumCover: {
          type: String
        },
        duration: {
          type: Number
        },
        previewUrl: {
          type: String
        }
      }
    ],
    spotifyPlaylistId: {
      type: String
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        text: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Virtual for vote score (upvotes - downvotes)
PlaylistSchema.virtual('voteScore').get(function(this: IPlaylist) {
  return this.upvotes.length - this.downvotes.length;
});

// Virtual for comment count
PlaylistSchema.virtual('commentCount').get(function(this: IPlaylist) {
  return this.comments.length;
});

// Virtual for track count
PlaylistSchema.virtual('trackCount').get(function(this: IPlaylist) {
  return this.tracks.length;
});

// Set toJSON to include virtual properties
PlaylistSchema.set('toJSON', { virtuals: true });
PlaylistSchema.set('toObject', { virtuals: true });

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema); 