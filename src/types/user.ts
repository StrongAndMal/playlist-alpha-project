export interface User {
  _id: string;
  username: string;
  displayName: string;
  bio: string;
  profilePicture: string;
  bannerImage: string;
  joinedDate: Date;
  playlistCount: number;
  votesReceived: number;
  pinnedPlaylist?: string; // Optional ID of pinned playlist
  spotifyUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
}

export interface Playlist {
  _id: string;
  title: string;
  description?: string;
  creator: {
    _id: string;
    username: string;
    displayName: string;
  };
  coverImage: string;
  trackCount: number;
  voteCount: number;
  isPinned?: boolean;
  createdAt: Date;
} 