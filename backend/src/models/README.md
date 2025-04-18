# Models

This directory contains Mongoose schema definitions and TypeScript interfaces for database models.

## Overview

- Models define the structure of documents stored in MongoDB collections
- Each model includes both TypeScript interfaces (for type safety) and Mongoose schemas
- Models encapsulate data validation, middleware, and business logic related to the data

## Files

- `User.ts`: User model with authentication fields and profile information
- `Playlist.ts`: Playlist model for storing music playlists and related metadata
- `ProfileItem.ts`: Profile customization items that users can collect and display
- `Comment.ts`: Comments that users can add to playlists

## Model Structure

Each model file typically includes:

1. TypeScript interfaces defining the document structure
2. Mongoose schema definition with validation
3. Pre/post hooks for tasks like password hashing
4. Static methods that operate on the collection
5. Instance methods that operate on individual documents

## Usage Example

```typescript
// Example of using a model in a controller
import { Request, Response } from "express";
import { Playlist } from "../models/Playlist";
import { User } from "../models/User";

export const createPlaylist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { name, description, isPublic } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newPlaylist = new Playlist({
      name,
      description,
      isPublic,
      creator: userId,
      tracks: [],
    });

    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating playlist", error: error.message });
  }
};
```

## Best Practices

1. Keep models focused on a single entity
2. Use Mongoose middleware for common operations like data transformation
3. Implement proper validation at the schema level
4. Use TypeScript interfaces for type safety
5. Include appropriate indexes for frequently queried fields
