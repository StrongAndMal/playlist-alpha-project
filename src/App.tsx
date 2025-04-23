import { FC, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import PlaylistDetailPage from './components/pages/PlaylistDetailPage';
import SubmitPlaylistPage from './components/pages/SubmitPlaylistPage';
import LoginPage from './components/pages/LoginPage';
import UserProfilePage from './components/pages/UserProfilePage';
import TermsOfServicePage from './components/pages/TermsOfServicePage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import SpotifyCallback from './components/pages/SpotifyCallback';
import SearchResultsPage from './components/pages/SearchResultsPage';
import GenreMoodPage from './components/pages/GenreMoodPage';
import GenresPage from './components/pages/GenresPage';
import MainLayout from './components/layout/MainLayout';
import { AuthProvider } from './context/AuthContext';

const App: FC = () => {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<Navigate to="/" replace />} />
            <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
            <Route path="/submit" element={<SubmitPlaylistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/user/:username" element={<UserProfilePage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/callback" element={<SpotifyCallback />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/genre/:genre" element={<GenreMoodPage />} />
            <Route path="/genres" element={<GenresPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
};

export default App; 