import { FC, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import PlaylistDetailPage from './components/pages/PlaylistDetailPage';
import SubmitPlaylistPage from './components/pages/SubmitPlaylistPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import UserProfilePage from './components/pages/UserProfilePage';
import TermsAndConditions from './components/pages/TermsAndConditions';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import SpotifyCallback from './components/pages/SpotifyCallback';
import WelcomePopup from './components/ui/WelcomePopup';
import NavigationBar from './components/ui/NavigationBar';
import { AuthProvider } from './context/AuthContext';

const App: FC = () => {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  
  useEffect(() => {
    // Check if this is a first-time visitor
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setShowWelcomePopup(true);
    }
  }, []);
  
  const handleClosePopup = () => {
    setShowWelcomePopup(false);
    localStorage.setItem('hasVisitedBefore', 'true');
  };
  
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <NavigationBar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
              <Route path="/submit" element={<SubmitPlaylistPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/spotify-callback" element={<SpotifyCallback />} />
            </Routes>
          </main>
          <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center">
                <span className="gradient-text font-medium">My Playlist Finder</span>
                <span className="text-white"> © {new Date().getFullYear()}</span>
              </p>
              <div className="flex justify-center mt-2 space-x-4 text-sm">
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </footer>
          
          {showWelcomePopup && <WelcomePopup onClose={handleClosePopup} />}
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 