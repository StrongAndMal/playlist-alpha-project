# My Playlist Finder - Frontend

This is the frontend application for My Playlist Finder, a platform to discover and share music playlists.

## Project Structure

```
src/
├── components/           # React components
│   ├── common/           # Common components used across multiple pages
│   ├── layout/           # Layout components (MainLayout, NavigationBar, Footer)
│   ├── pages/            # Page components (route destinations)
│   │   └── __tests__/    # Page component tests
│   └── ui/               # Reusable UI components (buttons, cards, etc.)
├── context/              # React Context API providers
├── hooks/                # Custom React hooks
├── services/             # Service modules for API interactions
├── App.tsx               # Main App component with routing
└── main.tsx              # Entry point
```

## Key Components

### Layout

- **MainLayout**: The main application layout wrapper with header and footer
- **NavigationBar**: Top navigation bar with links and user menu
- **Footer**: Site footer with links and copyright

### Pages

- **HomePage**: The landing page
- **PlaylistDetailPage**: Displays details for a specific playlist
- **SubmitPlaylistPage**: Form to submit a new playlist
- **LoginPage** & **SignupPage**: Authentication pages
- **UserProfilePage**: User profile display and management
- **TermsAndConditions** & **PrivacyPolicy**: Legal pages
- **SpotifyCallback**: Handles Spotify OAuth callback
- **SearchResultsPage**: Displays search results
- **GenreMoodPage**: Shows playlists by genre or mood

### UI Components

- **PlaylistCard**: Card component for displaying playlists
- **SpotlightCarousel**: Featured content carousel
- **WelcomePopup**: First-time visitor welcome message

## Authentication

Authentication is managed through the AuthContext provider, which includes:

- User registration and login
- Profile management
- Token-based authentication

## Spotify Integration

Spotify integration is managed through:

- **SpotifyService**: API calls to Spotify
- **useSpotifyAuth**: Custom hook for Spotify authentication
- **SpotifyCallback**: Component for handling OAuth flow

## Development

To start the development server:

```
npm run dev
```

To build for production:

```
npm run build
```
