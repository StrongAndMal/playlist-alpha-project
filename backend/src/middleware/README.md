# Middleware

This directory contains Express middleware functions that process requests before they reach route handlers.

## Overview

- Middleware functions have access to the request, response, and next function
- They can execute code, modify request/response objects, end the request-response cycle, or call the next middleware
- Middleware helps separate cross-cutting concerns from route handlers

## Files

- `auth.ts`: Authentication middleware to verify JWT tokens and attach user data to requests
- `error.ts`: Global error handling middleware
- `validation.ts`: Request validation middleware using express-validator
- `rateLimiter.ts`: Rate limiting to protect against abuse

## Usage Example

```typescript
// Example of using middleware in routes
import express from "express";
import { auth } from "../middleware/auth";
import { validatePlaylist } from "../middleware/validation";
import * as playlistController from "../controllers/playlistController";

const router = express.Router();

// Public route - no auth middleware
router.get("/", playlistController.getAllPlaylists);

// Protected route - with auth middleware
router.post("/", auth, validatePlaylist, playlistController.createPlaylist);

export default router;
```

## Creating Custom Middleware

```typescript
// Example of creating custom middleware
import { Request, Response, NextFunction } from "express";

export const logRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
```

## Best Practices

1. Keep middleware functions focused on a single responsibility
2. Use the `next()` function to pass control to the next middleware
3. Handle errors by passing them to the `next(error)` function
4. Chain middleware in a logical order
5. Consider performance implications for middleware that runs on every request
