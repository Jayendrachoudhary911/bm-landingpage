import React from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../context/ThemeContext';

const AboutSectionTeam = () => {
  const { isDark } = useCustomTheme();

  return (
    <Box
      id="about"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? '#000000' : '#ffffff',
        color: isDark ? '#fff' : '#0f172a',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            fontWeight={800}
            align="center"
            sx={{
              mb: 3,
              color: isDark ? '#ffffff' : '#0f172a',
              letterSpacing: '-0.5px',
            }}
          >
            About Us
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              maxWidth: 720,
              mx: 'auto',
              fontSize: '1.1rem',
              color: isDark ? '#94a3b8' : '#64748b',
              lineHeight: 1.8,
            }}
          >
            We are a passionate team of developers and travelers, building BunkMate to make
            group trips fun, collaborative, and stress-free. Our mission is to bring people
            together and simplify planning so that all you need to focus on is enjoying the journey.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutSectionTeam;
