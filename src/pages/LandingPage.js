import React from 'react';
import { Box, Button, Typography, Avatar, Container, Grid, Card, CardContent, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../sections/Hero';
import FeaturesSection from '../sections/FeaturesSection';
import Footer from '../sections/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh' }}>
          <Navbar user={user} />
          <HeroSection />
          <FeaturesSection />
      <Container>



        <Box py={8}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            💬 Testimonials
          </Typography>
          <Typography textAlign="center" color="text.secondary">
            Hear what our users say about BunkMates!
          </Typography>
          {/* Map and render testimonial cards here */}
        </Box>

        <Box py={8}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            💰 Pricing
          </Typography>
          <Typography textAlign="center" color="text.secondary">
            Simple and affordable plans for everyone.
          </Typography>
          {/* Map and render pricing cards here */}
        </Box>

        <Box py={8}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            📚 Blog & Resources
          </Typography>
          <Typography textAlign="center" color="text.secondary">
            Tips, travel hacks and stories from our community.
          </Typography>
          {/* Blog cards here */}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default LandingPage;