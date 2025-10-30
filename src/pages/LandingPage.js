import React from 'react';
import { Box, Button, Typography, Avatar, Container, Grid, Card, CardContent, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../sections/Hero';
import FeaturesSection from '../sections/FeaturesSection';
import AboutSection from '../sections/AboutSection';
import FAQSection from '../sections/FAQSection';
import AboutSectionTeam from '../sections/AboutTeam';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ bgcolor: '#000000ff', minHeight: '100vh' }}>
          <Navbar user={user} />
          <HeroSection />
          <AboutSection />
          <FeaturesSection />
          <FAQSection />
          <ContactSection />
          <Footer />
    </Box>
  );
};

export default LandingPage;