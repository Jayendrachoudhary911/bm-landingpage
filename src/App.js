import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import About from './pages/About';
import ProfilePage from './pages/ProfilePage';
import DownloadPage from './pages/download';
import FeaturesPage from './pages/FeaturesPage';
import ContactSupportPage from './pages/contactSupport';
import SafetyPrivacyPage from './pages/SafetyPrivacy';
import CommunityGuidelinesPage from './pages/CommunityGuidelines';
import { AnimatePresence } from 'framer-motion';
import ScrollToSection from './components/ScrollToSection';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import BackToTop from './components/BackToTop';

function ScrollToTopOnRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  // Define paths where Navbar and Footer should be hidden
  const hideNavAndFooter = ['/login', '/signup', '/profile'].includes(location.pathname);

  return (
    <>
      <ScrollToTopOnRoute />
      <ScrollToSection />
      
      {!hideNavAndFooter && <Navbar user={user} />}
      {!hideNavAndFooter && <BackToTop />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bm-install" element={<DownloadPage />} />
          <Route path="/contact" element={<ContactSupportPage />} />
          <Route path="/privacy" element={<SafetyPrivacyPage />} />
          <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
          <Route path="/features" element={<FeaturesPage />} />
        </Routes>
      </AnimatePresence>

      {!hideNavAndFooter && <Footer />}
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