import { Types } from 'mongoose';
import { ICommentResponse } from './Comment';

export interface ITrack {
  spotifyId: string;
  title: string;
  artist: string;
  album?: string;
  albumCover?: string;
  duration?: number;
  previewUrl?: string;
}

export interface IPlaylistCreator {
  id: string;
  username: string;
  avatar?: string;
}

export interface IPlaylistResponse {
  id: string;
  title: string;
  description: string;
  creator: IPlaylistCreator;
  coverImage: string;
  voteScore: number;
  userVote?: 'up' | 'down' | 'none';
  spotifyId?: string;
  genres: string[];
  tracks: ITrack[];
  isPublic: boolean;
  createdAt: Date;
  comments: ICommentResponse[];
  commentCount: number;
  trackCount: number;
}

export interface ISimilarPlaylistResponse {
  id: string;
  title: string;
  coverImage: string;
  creator: string;
}

export interface IFeaturedPlaylistResponse {
  id: string;
  title: string;
  description: string;
  creator: IPlaylistCreator;
  coverImage: string;
  voteScore: number;
  trackCount: number;
  commentCount: number;
} 