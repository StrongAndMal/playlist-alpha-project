# Routes

This directory contains Express router definitions that map HTTP endpoints to controller functions.

## Overview

- Routes define the API endpoints available to clients
- Each route file groups related endpoints for a specific resource
- Routes specify HTTP methods (GET, POST, PUT, DELETE) and URL paths
- They connect incoming requests to the appropriate controller functions
- Routes handle middleware application (authentication, validation, etc.)

## Files

- `authRoutes.ts`: Authentication endpoints (register, login, profile)
- `playlistRoutes.ts`: Playlist management endpoints
- `spotifyRoutes.ts`: Spotify integration endpoints
- `userRoutes.ts`: User management endpoints
- `profileItemRoutes.ts`: Profile customization item endpoints

## Route Structure

Each route file typically follows this pattern:

1. Import Express and create a router instance
2. Import required controller functions
3. Import middleware (authentication, validation)
4. Define routes with HTTP methods, paths, middleware, and controller functions
5. Export the router

## Usage Example

```typescript
import { Router } from "express";
import {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  likePlaylist,
  addComment,
} from "../controllers/playlistController";
import { auth } from "../middleware/auth";
import { optionalAuth } from "../middleware/auth";

const router = Router();

// Public routes (or optional auth)
router.get("/", optionalAuth, getAllPlaylists);
router.get("/:id", optionalAuth, getPlaylistById);

// Protected routes
router.post("/", auth, createPlaylist);
router.put("/:id", auth, updatePlaylist);
router.delete("/:id", auth, deletePlaylist);
router.post("/:id/like", auth, likePlaylist);
router.post("/:id/comments", auth, addComment);

export default router;
```

## Best Practices

1. Group related endpoints in a single route file
2. Use descriptive route paths that follow REST conventions
3. Apply appropriate middleware for security and validation
4. Keep route definitions clean and simple
5. Use route parameters for dynamic values
6. Consider versioning for API stability
7. Document routes with comments or use Swagger/OpenAPI
