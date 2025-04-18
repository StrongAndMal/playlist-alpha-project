import { Types } from 'mongoose';

export interface ICommentUser {
  _id: Types.ObjectId;
  username: string;
  avatar?: string;
}

export interface IComment {
  _id: Types.ObjectId;
  user: ICommentUser;
  text: string;
  createdAt: Date;
}

export interface ICommentResponse {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  text: string;
  timestamp: Date;
}

export interface IVoteStatus {
  voteType: 'up' | 'down' | 'none';
  voteScore: number;
  upvoteCount: number;
  downvoteCount: number;
} 