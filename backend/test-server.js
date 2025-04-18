const express = require("express");
const cors = require("cors");
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// Mock data
const dummyPlaylists = [
  {
    id: "1",
    title: "Summer Vibes 2025",
    description: "Perfect for your summer adventures",
    creator: {
      id: "user1",
      username: "DJ Cool",
      avatar: "https://picsum.photos/100/100?random=1",
    },
    coverImage: "https://picsum.photos/800/800?random=1",
    voteScore: 128,
    trackCount: 12,
    commentCount: 8,
  },
  {
    id: "2",
    title: "Chill Beats for Studying",
    description: "Concentrate with these relaxing beats",
    creator: {
      id: "user2",
      username: "ChillMaster",
      avatar: "https://picsum.photos/100/100?random=2",
    },
    coverImage: "https://picsum.photos/800/800?random=2",
    voteScore: 89,
    trackCount: 15,
    commentCount: 4,
  },
  {
    id: "3",
    title: "Workout Motivation",
    description: "Get pumped with this high-energy mix",
    creator: {
      id: "user3",
      username: "FitnessFanatic",
      avatar: "https://picsum.photos/100/100?random=3",
    },
    coverImage: "https://picsum.photos/800/800?random=3",
    voteScore: 75,
    trackCount: 10,
    commentCount: 6,
  },
];

const dummyPlaylist = {
  id: "1",
  title: "Summer Vibes 2025",
  description:
    "The perfect playlist for your summer adventures. A mix of upbeat tracks to keep you energized all season long.",
  creator: {
    id: "user1",
    username: "DJ Cool",
    avatar: "https://picsum.photos/100/100?random=1",
  },
  coverImage: "https://picsum.photos/800/800?random=1",
  voteScore: 128,
  userVote: "none",
  spotifyId: "37i9dQZF1DXdPec7aLTmlC",
  genres: ["pop", "dance", "summer"],
  tracks: [
    {
      spotifyId: "track1",
      title: "Summer Fun",
      artist: "Beach Boys",
      album: "Beach Time",
      albumCover: "https://picsum.photos/100/100?random=4",
      duration: 180000,
    },
  ],
  isPublic: true,
  createdAt: new Date().toISOString(),
  comments: [
    {
      id: "1",
      user: {
        id: "user2",
        username: "MusicLover123",
        avatar: "https://picsum.photos/50/50?random=5",
      },
      text: "This playlist is amazing! Perfect for my beach trips.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      user: {
        id: "user3",
        username: "BeachBum99",
        avatar: "https://picsum.photos/50/50?random=6",
      },
      text: "Great selection of tracks! I especially love the third one.",
      timestamp: new Date().toISOString(),
    },
  ],
  commentCount: 2,
  trackCount: 1,
};

const similarPlaylists = [
  {
    id: "2",
    title: "Beach Party Mix",
    coverImage: "https://picsum.photos/200/200?random=7",
    creator: "SurfDude",
  },
  {
    id: "3",
    title: "Poolside Chill",
    coverImage: "https://picsum.photos/200/200?random=8",
    creator: "ChillVibes",
  },
  {
    id: "4",
    title: "Summer Sunset",
    coverImage: "https://picsum.photos/200/200?random=9",
    creator: "EveningGrooves",
  },
];

// Routes

// Health check route
app.get("/api/health", (req, res) => {
  console.log("Health check endpoint called");
  res.status(200).json({ status: "ok", message: "Test server is running" });
});

// Get featured playlists
app.get("/api/playlists/featured", (req, res) => {
  console.log("Featured playlists endpoint called");
  res.status(200).json({ playlists: dummyPlaylists });
});

// Get playlist by ID
app.get("/api/playlists/:id", (req, res) => {
  res.status(200).json({ playlist: dummyPlaylist });
});

// Get similar playlists
app.get("/api/playlists/:id/similar", (req, res) => {
  res.status(200).json({ similarPlaylists });
});

// Vote on a playlist
app.post("/api/playlists/:id/vote", (req, res) => {
  const { voteType } = req.body;

  // Simulate response based on vote type
  const response = {
    voteType,
    voteScore: voteType === "up" ? 129 : voteType === "down" ? 127 : 128,
    upvoteCount: voteType === "up" ? 150 : 149,
    downvoteCount: voteType === "down" ? 23 : 21,
  };

  res.status(200).json(response);
});

// Add a comment
app.post("/api/playlists/:id/comments", (req, res) => {
  const { text } = req.body;

  // Create a new comment
  const newComment = {
    id: Math.random().toString(36).substring(7),
    user: {
      id: "current-user",
      username: "CurrentUser",
      avatar: "https://picsum.photos/50/50?random=10",
    },
    text,
    timestamp: new Date().toISOString(),
  };

  res.status(201).json({ comment: newComment });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
  console.log("Press Ctrl+C to stop");
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down test server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Keep the process running
process.stdin.resume();
