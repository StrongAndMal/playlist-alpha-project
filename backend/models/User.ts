import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio: string;
  profilePicture: string;
  bannerImage: string;
  joinedDate: Date;
  pinnedPlaylist?: mongoose.Types.ObjectId;
  spotifyUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  favorites?: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 160 },
  profilePicture: { type: String, default: '' },
  bannerImage: { type: String, default: '' },
  joinedDate: { type: Date, default: Date.now },
  pinnedPlaylist: { type: Schema.Types.ObjectId, ref: 'Playlist' },
  spotifyUrl: { type: String },
  twitterUrl: { type: String },
  instagramUrl: { type: String },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }]
});

export default mongoose.model<IUser>('User', UserSchema); 