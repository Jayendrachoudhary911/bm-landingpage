import React from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useCustomTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import HeroSection from '../sections/Hero';
import FeaturesSection from '../sections/FeaturesSection';
import AboutSection from '../sections/AboutSection';
import AboutSectionTeam from '../sections/AboutTeam';
import FAQSection from '../sections/FAQSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  const { user } = useAuth();
  const { isDark } = useCustomTheme();

  return (
    <Box
      sx={{
        bgcolor: isDark ? '#000000' : '#f8fafc',
        color: isDark ? '#f8fafc' : '#0f172a',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <Navbar user={user} />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <AboutSectionTeam />
      <FAQSection />
      <ContactSection />
      <Footer />
    </Box>
  );
};

export default LandingPage;