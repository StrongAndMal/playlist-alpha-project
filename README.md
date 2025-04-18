# My Playlist Finder

A web application for discovering and sharing music playlists built with React, TypeScript, and Vite.

## Features

- Browse and discover playlists
- Detailed playlist views
- Spotify integration
- User authentication
- Submit and share your own playlists
- Mobile-friendly responsive design

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Authentication**: Custom auth system
- **API Integration**: Spotify Web API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spotify Developer Account (for API access)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/StrongAndMal/playlist-alpha-project.git
cd playlist-alpha-project
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Spotify credentials:

```
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to see the app.

## Deployment

### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)

2. Connect your repository to Vercel:

   - Sign up or log in to [Vercel](https://vercel.com)
   - Click "New Project" and import your repository
   - Configure the project:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. Add environment variables:

   - Go to Settings > Environment Variables
   - Add `VITE_SPOTIFY_CLIENT_ID` with your Spotify client ID

4. Deploy the project

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── common/      # Reusable components
│   │   ├── pages/       # Page components
│   │   └── ui/          # UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom hooks
│   ├── services/        # API services
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore file
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## License

[MIT](LICENSE)

## Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
