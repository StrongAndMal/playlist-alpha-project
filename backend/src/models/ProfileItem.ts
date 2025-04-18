import mongoose, { Schema, Document } from 'mongoose';

// Define types for profile items
export type ItemType = 'avatar' | 'frame' | 'badge' | 'background' | 'nameColor';
export type ObtainMethod = 'purchase' | 'reward' | 'achievement' | 'special' | 'seasonal';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

// Profile item interface
export interface IProfileItem extends Document {
  name: string;
  description: string;
  type: ItemType;
  obtainMethod: ObtainMethod;
  rarity: Rarity;
  imageUrl: string;
  price?: number; // Only for purchasable items
  requiredLevel?: number; // Level required to use/obtain
  availableUntil?: Date; // For limited time items
  isActive: boolean; // Whether the item is currently available
  createdAt: Date;
  updatedAt: Date;
}

// Profile item schema
const ProfileItemSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['avatar', 'frame', 'badge', 'background', 'nameColor'],
    },
    obtainMethod: {
      type: String,
      required: true,
      enum: ['purchase', 'reward', 'achievement', 'special', 'seasonal'],
    },
    rarity: {
      type: String,
      required: true,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: function(this: any) {
        return this.obtainMethod === 'purchase';
      },
    },
    requiredLevel: {
      type: Number,
      default: 0,
    },
    availableUntil: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProfileItem>('ProfileItem', ProfileItemSchema); 