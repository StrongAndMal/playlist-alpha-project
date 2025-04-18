import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../services/dbService';
import { IUser } from '../models/User';
import ProfileItem, { ItemType, Rarity, ObtainMethod, IProfileItem } from '../models/ProfileItem';

// Define the IRequest interface here since the import is failing
interface IRequest extends Request {
  user?: IUser;
}

/**
 * @desc    Get all available profile items
 * @route   GET /api/items
 * @access  Public
 */
export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, rarity, obtainMethod } = req.query;
    
    // Build filter object based on query parameters
    const filter: any = { isActive: true };
    if (type) filter.type = type;
    if (rarity) filter.rarity = rarity;
    if (obtainMethod) filter.obtainMethod = obtainMethod;
    
    const items = await ProfileItem.find(filter).sort({ rarity: 1, name: 1 });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching profile items:', error);
    res.status(500).json({ error: 'Failed to fetch profile items' });
  }
};

/**
 * @desc    Get items available for a specific user
 * @route   GET /api/items/available
 * @access  Private
 */
export const getAvailableItems = async (req: IRequest, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    
    // Get all active items
    const allItems = await ProfileItem.find({ isActive: true });
    
    // Filter items based on user level and other criteria
    const availableItems = allItems.filter(item => {
      // If item requires a level, check user's level
      if (item.obtainMethod === 'purchase' && item.requiredLevel) {
        return user.level >= item.requiredLevel;
      }
      
      // If item is seasonal, it's available to everyone
      if (item.obtainMethod === 'seasonal') {
        return true;
      }
      
      // For other obtain methods, check if user already has the item
      if (item.type === 'avatar') {
        return user.avatarFrame?.toString() === item._id?.toString();
      }
      
      if (item.type === 'badge') {
        return user.badges?.some(badge => badge.toString() === item._id?.toString());
      }
      
      if (item.type === 'background') {
        return user.profileTheme?.toString() === item._id?.toString();
      }
      
      return false;
    });
    
    res.status(200).json({ items: availableItems });
  } catch (error) {
    console.error('Get available items error:', error);
    res.status(500).json({ message: 'Server error getting available items' });
  }
};

/**
 * @desc    Create a new profile item (admin only)
 * @route   POST /api/items
 * @access  Private (Admin)
 */
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      type,
      obtainMethod,
      rarity,
      imageUrl,
      price,
      requiredLevel,
      availableUntil,
      isActive
    } = req.body;
    
    // Validate required fields
    if (!name || !description || !type || !obtainMethod || !rarity || !imageUrl) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    // Validate obtainMethod is 'purchase' if price is provided
    if (obtainMethod === 'purchase' && !price) {
      res.status(400).json({ error: 'Price is required for purchasable items' });
      return;
    }
    
    const newItem = new ProfileItem({
      name,
      description,
      type,
      obtainMethod,
      rarity,
      imageUrl,
      price,
      requiredLevel,
      availableUntil,
      isActive: isActive !== undefined ? isActive : true
    });
    
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating profile item:', error);
    res.status(500).json({ error: 'Failed to create profile item' });
  }
};

/**
 * @desc    Update a profile item (admin only)
 * @route   PUT /api/items/:itemId
 * @access  Private (Admin)
 */
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid item ID format' });
      return;
    }
    
    const updatedItem = await ProfileItem.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      res.status(404).json({ error: 'Profile item not found' });
      return;
    }
    
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating profile item:', error);
    res.status(500).json({ error: 'Failed to update profile item' });
  }
};

/**
 * @desc    Delete a profile item (admin only)
 * @route   DELETE /api/items/:itemId
 * @access  Private (Admin)
 */
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid item ID format' });
      return;
    }
    
    const deletedItem = await ProfileItem.findByIdAndDelete(id);
    
    if (!deletedItem) {
      res.status(404).json({ error: 'Profile item not found' });
      return;
    }
    
    res.status(200).json({ message: 'Profile item deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile item:', error);
    res.status(500).json({ error: 'Failed to delete profile item' });
  }
};

// Get a profile item by ID
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid item ID format' });
      return;
    }
    
    const item = await ProfileItem.findById(id);
    
    if (!item) {
      res.status(404).json({ error: 'Profile item not found' });
      return;
    }
    
    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching profile item:', error);
    res.status(500).json({ error: 'Failed to fetch profile item' });
  }
};

// Get all profile items with optional filtering
export const getAllProfileItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, rarity } = req.query;
    
    // Build filter object based on query params
    const filter: any = {};
    if (type) filter.type = type;
    if (rarity) filter.rarity = rarity;
    
    const profileItems = await ProfileItem.find(filter);
    res.status(200).json(profileItems);
  } catch (error) {
    console.error('Error fetching profile items:', error);
    res.status(500).json({ message: 'Error fetching profile items' });
  }
};

// Get a profile item by ID
export const getProfileItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileItem = await ProfileItem.findById(req.params.id);
    
    if (!profileItem) {
      res.status(404).json({ message: 'Profile item not found' });
      return;
    }
    
    res.status(200).json(profileItem);
  } catch (error) {
    console.error('Error fetching profile item:', error);
    res.status(500).json({ message: 'Error fetching profile item' });
  }
};

// Create a new profile item (admin only)
export const createProfileItem = async (req: IRequest, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    
    const { name, description, type, imageUrl, rarity, price } = req.body;
    
    // Validate required fields
    if (!name || !type || !imageUrl) {
      res.status(400).json({ message: 'Name, type, and imageUrl are required' });
      return;
    }
    
    const newProfileItem = new ProfileItem({
      name,
      description,
      type,
      imageUrl,
      rarity: rarity || 'common',
      price: price || 0
    });
    
    const savedItem = await newProfileItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating profile item:', error);
    res.status(500).json({ message: 'Error creating profile item' });
  }
};

// Update an existing profile item (admin only)
export const updateProfileItem = async (req: IRequest, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    
    const { name, description, type, imageUrl, rarity, price } = req.body;
    
    const updatedItem = await ProfileItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        type,
        imageUrl,
        rarity,
        price
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      res.status(404).json({ message: 'Profile item not found' });
      return;
    }
    
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating profile item:', error);
    res.status(500).json({ message: 'Error updating profile item' });
  }
};

// Delete a profile item (admin only)
export const deleteProfileItem = async (req: IRequest, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    
    const deletedItem = await ProfileItem.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      res.status(404).json({ message: 'Profile item not found' });
      return;
    }
    
    res.status(200).json({ message: 'Profile item deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile item:', error);
    res.status(500).json({ message: 'Error deleting profile item' });
  }
}; 