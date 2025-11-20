// src/components/AboutSection.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import DownloadIcon from '@mui/icons-material/Download';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // adjust path to your firebase.js

const AboutSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // listen to landing_page/home doc in realtime
    const docRef = doc(db, 'landing_page', 'home');

    const unsub = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setAboutContent(null);
          setLoading(false);
          return;
        }
        const data = snapshot.data();
        // field in your screenshot is about_content
        setAboutContent(data?.about_content ?? null);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching about content:', err);
        setError('Failed to load content.');
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Optional fallback text if DB field is missing
  const fallback = `
    <p>BunkMate -------- a new way to plan, budget,
    chat, and create unforgettable journeys with your friends. Whether it’s
    a spontaneous road trip or a planned adventure, we help you keep it all
    together.</p>
    <p>Forget messy spreadsheets and scattered group chats. With BunkMate,
    your trip is beautifully organized and fun from start to finish.</p>
  `;

  // NOTE: aboutContent likely contains HTML (e.g. <br />). We use dangerouslySetInnerHTML to render it.
  // If the content can be edited by unknown users, consider sanitizing it (see notes below).
  return (
    <Box
      id="about"
      sx={{
        position: 'relative',
        py: { xs: 10, md: 16 },
        background: isMobile
          ? 'linear-gradient(320deg, #001fff, #000, #000'
          : '#000000ff',
        color: '#fff',
        overflow: 'hidden',
        height: '100vh',
        minHeight: '110vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background image: using uploaded file path you provided */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/mnt/data/941df691-89b7-425d-8a2a-0e581342dc1e.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          zIndex: 0,
          opacity: 0.15,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, px: 6 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={6}
          alignItems="center"
          justifyContent="space-between"
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ flex: 1 }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              mb={2}
              sx={{
                color: '#ffffff',
                textShadow: '0 0 20px rgba(255,255,255,0.1)',
              }}
            >
              About BunkMate
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <CircularProgress size={20} color="inherit" />
                <Typography variant="body2" sx={{ color: '#bbbbbb' }}>
                  Loading...
                </Typography>
              </Box>
            ) : error ? (
              <Typography variant="body1" sx={{ color: '#ff9b9b', mb: 4 }}>
                {error}
              </Typography>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  color: '#bbbbbb',
                  fontSize: '1.1rem',
                  lineHeight: 1.9,
                  mb: 4,
                  width: isMobile ? '300px' : '800px',
                }}
                // render HTML fetched from Firestore
                dangerouslySetInnerHTML={{ __html: aboutContent ?? fallback }}
              />
            )}

            <Button
              variant="contained"
              href="/bm-install"
              size="large"
              startIcon={<DownloadIcon />}
              sx={{
                borderRadius: '30px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                backgroundColor: '#ffffff',
                color: '#000',
                boxShadow: '0 0 20px rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#111',
                  color: '#fff',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 0 30px rgba(255,255,255,0.25)',
                },
              }}
            >
              Download Now
            </Button>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default AboutSection;
