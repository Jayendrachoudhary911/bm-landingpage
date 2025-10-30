import React from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import DownloadIcon from '@mui/icons-material/Download';

const AboutSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      id="about"
      sx={{
        position: 'relative',
        py: { xs: 10, md: 16 },
        background: isMobile ? 'linear-gradient(320deg, #001fff, #000, #000' : '#000000ff',
        color: '#fff',
        overflow: 'hidden',
        height: '100vh',
        minHeight: '110vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Half Gradiented Background Image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/assets/bm_about.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          zIndex: 0,
        }}
      />


      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, px: 6 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={6}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Text Section */}
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

            <Typography
              variant="body1"
              sx={{
                color: '#bbbbbb',
                fontSize: '1.1rem',
                lineHeight: 1.9,
                mb: 4,
                width: isMobile ? '300px' : '800px',
              }}
            >
              BunkMate is your social travel partner — a new way to plan, budget,
              chat, and create unforgettable journeys with your friends. Whether it’s
              a spontaneous road trip or a planned adventure, we help you keep it all
              together.
              <br />
              <br />
              Forget messy spreadsheets and scattered group chats. With BunkMate,
              your trip is beautifully organized and fun from start to finish.
            </Typography>

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
