# My Playlist Finder - Backend API

The backend API powering the My Playlist Finder application.

## Tech Stack

- **Express.js with TypeScript**: For building a type-safe API
- **MongoDB with Mongoose**: For data storage and management
- **JWT Authentication**: For secure user authentication
- **Spotify Web API Integration**: For fetching playlist data

## Project Structure

```
backend/
├── src/                 # Source code
│   ├── config/          # Configuration files for DB, env variables, etc.
│   ├── controllers/     # Request handlers for each route
│   ├── middleware/      # Express middleware (auth, validation, etc.)
│   ├── models/          # Mongoose models/schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic and external service integration
│   ├── types/           # TypeScript type definitions and interfaces
│   ├── utils/           # Helper functions and utilities
│   └── index.ts         # Application entry point
├── tests/               # Test files
├── .env.example         # Example environment variables
└── package.json         # Project dependencies
```

## Setup Instructions

1. Install dependencies:

   ```
   npm install
   ```

2. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Fill in the required values (database URI, JWT secret, etc.)

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user
- `GET /api/auth/me`: Get current user profile
- `PUT /api/auth/profile`: Update user profile
- `PUT /api/auth/password`: Change user password

### Playlists

- `POST /api/playlists`: Create a new playlist
- `GET /api/playlists`: Get all playlists (with filtering)
- `GET /api/playlists/:id`: Get a specific playlist
- `PUT /api/playlists/:id`: Update a playlist
- `DELETE /api/playlists/:id`: Delete a playlist
- `POST /api/playlists/:id/like`: Like/unlike a playlist
- `POST /api/playlists/:id/comments`: Add a comment to a playlist

### User Profiles

- `GET /api/profiles/:username`: Get user profile
- `PUT /api/profiles`: Update profile
- `POST /api/profiles/:username/follow`: Follow/unfollow a user
- `GET /api/profiles/:username/followers`: Get user's followers
- `GET /api/profiles/:username/following`: Get user's following
- `POST /api/profiles/:username/badges`: Award a badge to a user
- `POST /api/profiles/:username/awards`: Give an award to a user
- `PUT /api/profiles/showcase`: Update showcase playlists
- `PUT /api/profiles/frame`: Update avatar frame

### Spotify Integration

- `GET /api/spotify/auth`: Get Spotify authorization URL
- `POST /api/spotify/callback`: Handle Spotify callback
- `GET /api/spotify/playlists`: Get user's Spotify playlists
- `GET /api/spotify/search`: Search for tracks or playlists

## Recent Updates

The following updates have been made to align the backend with the frontend implementation:

### Playlist Features

1. **Voting System**: Updated from a simple like system to a full voting system with upvotes and downvotes
2. **Similar Playlists**: Added an endpoint to fetch similar playlists based on genre matching
3. **Featured Playlists**: Added an endpoint to fetch featured/recommended playlists sorted by popularity
4. **Enhanced Playlist Details**: Improved the response format to include all necessary information for the playlist detail page
5. **Type Definitions**: Added TypeScript interfaces for consistent API responses

### API Endpoints

| Method | Endpoint                    | Description                              | Access         |
| ------ | --------------------------- | ---------------------------------------- | -------------- |
| GET    | /api/playlists              | Get all playlists with filtering options | Public         |
| GET    | /api/playlists/featured     | Get featured/popular playlists           | Public         |
| GET    | /api/playlists/:id          | Get a single playlist by ID              | Public/Private |
| GET    | /api/playlists/:id/similar  | Get similar playlists                    | Public         |
| POST   | /api/playlists              | Create a new playlist                    | Private        |
| PUT    | /api/playlists/:id          | Update a playlist                        | Private        |
| DELETE | /api/playlists/:id          | Delete a playlist                        | Private        |
| POST   | /api/playlists/:id/vote     | Vote on a playlist (up/down/remove)      | Private        |
| POST   | /api/playlists/:id/comments | Add a comment to a playlist              | Private        |

## Development

### Running Tests

```
npm test
```

### Building for Production

```
npm run build
```

### Running in Production

```
npm start
```
