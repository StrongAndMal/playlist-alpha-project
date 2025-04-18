# Controllers

This directory contains the controller functions that handle HTTP requests and responses.

## Overview

- Controllers implement the business logic for API endpoints
- Each controller file groups related functionality for a specific domain
- Controllers receive requests, process data, interact with models, and return responses
- They abstract the complexity of operations from route definitions

## Files

- `authController.ts`: Authentication operations (register, login, profile management)
- `playlistController.ts`: Playlist CRUD operations and related actions
- `profileItemController.ts`: Management of profile customization items
- `userController.ts`: User account management beyond authentication
- `spotifyController.ts`: Integration with Spotify API

## Controller Structure

Each controller file typically contains:

1. Import statements for required models, services, and utilities
2. Exported functions that handle specific routes
3. Request validation and error handling
4. Business logic implementation
5. Response formatting

## Usage Example

```typescript
// Example of a controller function
import { Request, Response } from "express";
import { Playlist } from "../models/Playlist";

export const getPlaylistById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id)
      .populate("creator", "username profilePicture")
      .populate("tracks");

    if (!playlist) {
      res.status(404).json({ message: "Playlist not found" });
      return;
    }

    // Check if private playlist is accessible to this user
    if (
      !playlist.isPublic &&
      (!req.user || playlist.creator._id.toString() !== req.user.id)
    ) {
      res.status(403).json({ message: "Access denied to private playlist" });
      return;
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

## Best Practices

1. Keep controller functions focused on a single responsibility
2. Move complex business logic to service classes
3. Use try-catch blocks for error handling
4. Return appropriate HTTP status codes
5. Validate input data before processing
6. Use TypeScript interfaces for request and response types
7. Document each controller function with JSDoc comments
