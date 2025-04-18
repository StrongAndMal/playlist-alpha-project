import { FC, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import PlaylistDetailPage from './components/pages/PlaylistDetailPage';
import SubmitPlaylistPage from './components/pages/SubmitPlaylistPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import UserProfilePage from './components/pages/UserProfilePage';
import TermsOfServicePage from './components/pages/TermsOfServicePage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import SpotifyCallback from './components/pages/SpotifyCallback';
import PremiumPage from './components/pages/PremiumPage';
import CommunityPage from './components/pages/CommunityPage';
import TrendingPage from './components/pages/TrendingPage';
import DemoPage from './components/pages/DemoPage';
import ProfileComponentsDemo from './components/pages/ProfileComponentsDemo';
import FeaturePopup from './components/common/FeaturePopup';
import MainLayout from './components/layout/MainLayout';
import { AuthProvider } from './context/AuthContext';
import SearchResultsPage from './components/pages/SearchResultsPage';
import GenreMoodPage from './components/pages/GenreMoodPage';
import { markPopupAsShown } from './services/PopupService';

const App: FC = () => {
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);
  
  useEffect(() => {
    // Show feature popup for all users, including returning visitors
    setShowFeaturePopup(true);
  }, []);
  
  const handleClosePopup = () => {
    setShowFeaturePopup(false);
    markPopupAsShown();
  };
  
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
            <Route path="/submit" element={<SubmitPlaylistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/spotify-callback" element={<SpotifyCallback />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/genre/:genre" element={<GenreMoodPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/profile-demo" element={<ProfileComponentsDemo />} />
          </Routes>
        </MainLayout>
        
        {showFeaturePopup && <FeaturePopup onClose={handleClosePopup} />}
      </Router>
    </AuthProvider>
  );
};

export default App; 