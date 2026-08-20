import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import About from './pages/About';
import ProfilePage from './pages/ProfilePage';
import DownloadPage from './pages/download';
import DummyReview from './pages/dummy_reviews';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';

function ScrollToTopOnRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <ScrollToTopOnRoute />
      <BackToTop />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bm-install" element={<DownloadPage />} />
          <Route path="/dummy-review" element={<DummyReview />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;