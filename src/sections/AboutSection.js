import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useCustomTheme } from '../context/ThemeContext';

const AboutSection = () => {
  const { isDark } = useCustomTheme();
  const navigate = useNavigate();

  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  const fallback = `
    <p>BunkMate is an all-in-one ecosystem crafted to eliminate travel frictions. Plan itineraries, coordinate routes, automatically split costs, and keep your crew synced in real-time.</p>
    <p>Replace fragmented group chats and tangled spreadsheets with a cohesive, fluid space designed to let you focus entirely on the journey.</p>
  `;

  const comparison = {
    chaos: [
      'Scattered spreadsheets and buried chat notes',
      'Awkward bill splitting and forgotten dues',
      'Multiple disconnected apps for maps and planning',
      'Limited access when connectivity disappears',
    ],
    bunkmate: [
      'One shared space for your entire trip',
      'Simple and organized expense management',
      'Trips, chats, plans and updates together',
      'Stay prepared even when you are offline',
    ],
  };

  const colors = {
    background: isDark ? '#000000' : '#ffffff',
    surface: isDark ? '#0d0d0d' : '#f7f7f7',
    surfaceStrong: isDark ? '#141414' : '#ffffff',
    text: isDark ? '#ffffff' : '#111111',
    secondaryText: isDark ? '#a3a3a3' : '#737373',
    border: isDark
      ? 'rgba(255, 255, 255, 0.09)'
      : 'rgba(0, 0, 0, 0.08)',
    subtleBorder: isDark
      ? 'rgba(255, 255, 255, 0.06)'
      : 'rgba(0, 0, 0, 0.05)',
  };

  return (
    <Box
      id="about"
      sx={{
        position: 'relative',
        py: { xs: 10, sm: 12, md: 16 },
        px: 1.5,
        backgroundColor: colors.background,
        color: colors.text,
        overflow: 'hidden',
        transition: 'background-color 0.35s ease, color 0.35s ease',
      }}
    >
      {/* Subtle BM Background Decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 70, md: 100 },
          left: { xs: -100, md: -140 },
          width: { xs: 240, md: 420 },
          height: { xs: 240, md: 420 },
          borderRadius: '50%',
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.025)'
            : 'rgba(0, 0, 0, 0.025)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          right: { xs: -120, md: -100 },
          bottom: { xs: -120, md: -160 },
          width: { xs: 280, md: 500 },
          height: { xs: 280, md: 500 },
          borderRadius: '50%',
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.02)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 4, md: 5 },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'minmax(0, 1.05fr) minmax(420px, 0.95fr)',
            },
            gap: {
              xs: 6,
              md: 8,
              lg: 10,
            },
            alignItems: 'center',
          }}
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Box sx={{ maxWidth: 600 }}>

              {/* Heading */}
              <Typography
                variant="h2"
                sx={{
                  fontSize: {
                    xs: '2.2rem',
                    sm: '3.35rem',
                    md: '4rem',
                  },
                  lineHeight: {
                    xs: 1.08,
                    md: 1.02,
                  },
                  letterSpacing: {
                    xs: '-0.05em',
                    md: '-0.065em',
                  },
                  fontWeight: 800,
                  maxWidth: 680,
                  mb: 2.5,
                  color: '#ffeebd',
                }}
              >
                Less planning chaos.
                <br />
                <Box
                  component="span"
                  sx={{
                    color: '#706954',
                  }}
                >
                  More of the journey.
                </Box>
              </Typography>

              {/* Body */}
              {loading ? (
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{
                    minHeight: 100,
                    mb: 4,
                  }}
                >
                  <CircularProgress
                    size={20}
                    thickness={4}
                    sx={{
                      color: colors.text,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.secondaryText,
                    }}
                  >
                    Loading BunkMates...
                  </Typography>
                </Stack>
              ) : error ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#d32f2f',
                    mb: 4,
                  }}
                >
                  {error}
                </Typography>
              ) : (
                <Typography
                  component="div"
                  sx={{
                    maxWidth: 590,
                    color: colors.secondaryText,
                    fontSize: {
                      xs: '0.94rem',
                      md: '1.05rem',
                    },
                    lineHeight: 1.8,
                    mb: 4,

                    '& p': {
                      m: 0,
                      mb: 1.6,
                    },

                    '& p:last-of-type': {
                      mb: 0,
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: aboutContent ?? fallback,
                  }}
                />
              )}

              {/* Actions */}
              <Stack
                direction={{
                  xs: 'column',
                  sm: 'row',
                }}
                spacing={1.5}
                sx={{
                  alignItems: {
                    xs: 'stretch',
                    sm: 'center',
                  },
                }}
              >
                <Button
                  component={motion.button}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/bm-install')}
                  startIcon={
                    <DownloadRoundedIcon
                      sx={{
                        fontSize: '1.15rem !important',
                      }}
                    />
                  }
                  sx={{
                    minHeight: 48,
                    px: 3,
                    borderRadius: '16px',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    backgroundColor: '#fff5e4',
                    color: '#301e00',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: isDark
                        ? '#271900'
                        : '#242424',
                      color: '#fff5e4',
                    },
                  }}
                >
                  Get BunkMates
                </Button>

                <Button
                  component={motion.button}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/about')}
                  endIcon={
                    <ArrowForwardRoundedIcon
                      sx={{
                        fontSize: '1.1rem !important',
                      }}
                    />
                  }
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    borderRadius: '16px',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 650,
                    color: '#fff8eb',
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.11)'
                      : 'rgba(0, 0, 0, 0.035)',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.06)',
                    },
                  }}
                >
                  Explore BunkMates
                </Button>
              </Stack>
            </Box>
          </motion.div>

          {/* Right Comparison Panel */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Box
              sx={{
                position: 'relative',
                p: {
                  xs: 0,
                  sm: 2,
                },
                borderRadius: {
                  xs: '24px',
                  sm: '32px',
                },
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0)'
                  : '#f6f6f6',
              }}
            >
              {/* Panel Header */}
              <Box
                sx={{
                  px: {
                    xs: 1,
                    sm: 2,
                  },
                  pt: {
                    xs: 1,
                    sm: 2,
                  },
                  pb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontWeight: 800,
                    color: colors.secondaryText,
                    mb: 0.6,
                  }}
                >
                  One trip. One place.
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: '1.15rem',
                      sm: '1.55rem',
                    },
                    fontWeight: 750,
                    letterSpacing: '-0.035em',
                    color: colors.text,
                  }}
                >
                  From scattered tools to one shared space.
                </Typography>
              </Box>

              {/* Cards Container: Row layout on mobile, Column on desktop/tablet */}
              <Stack
                direction={{ xs: 'row', sm: 'column' }}
                spacing={{ xs: 1.2, sm: 1.5 }}
                sx={{
                  width: '100%',
                }}
              >
                {/* Fragmented Card */}
                <Box
                  component={motion.div}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    flex: { xs: '1 1 50%', sm: '1 1 auto' },
                    p: {
                      xs: 1.75,
                      sm: 2.75,
                    },
                    borderRadius: { xs: '18px', sm: '24px' },
                    backgroundColor: isDark
                      ? '#111111'
                      : 'rgba(255, 255, 255, 0.8)',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      mb: { xs: 1.5, sm: 2.2 },
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: '0.85rem', sm: '0.95rem' },
                          fontWeight: 750,
                          color: colors.text,
                          lineHeight: 1.2,
                        }}
                      >
                        The usual way
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: { xs: '0.68rem', sm: '0.78rem' },
                          color: colors.secondaryText,
                          mt: 0.2,
                          display: { xs: 'none', sm: 'block' },
                        }}
                      >
                        More apps. More confusion.
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={{ xs: 1, sm: 1.45 }}>
                    {comparison.chaos.map((item, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={{ xs: 0.8, sm: 1.25 }}
                        alignItems="flex-start"
                      >
                        <CloseRoundedIcon
                          sx={{
                            fontSize: { xs: 14, sm: 17 },
                            mt: '2px',
                            flexShrink: 0,
                            color: isDark ? '#777777' : '#9a9a9a',
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: {
                              xs: '0.75rem',
                              sm: '0.93rem',
                            },
                            lineHeight: 1.35,
                            color: colors.secondaryText,
                          }}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                {/* Divider visible only on sm+ screens */}
                <Divider
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    borderColor: colors.border,
                    mx: 1,
                  }}
                />

                {/* BunkMates Card */}
                <Box
                  component={motion.div}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    flex: { xs: '1 1 50%', sm: '1 1 auto' },
                    position: 'relative',
                    overflow: 'hidden',
                    p: {
                      xs: 1.75,
                      sm: 2.75,
                    },
                    borderRadius: { xs: '18px', sm: '24px' },
                    backgroundColor: isDark ? '#fff5e4' : '#111111',
                    color: isDark ? '#543705' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      mb: { xs: 1.5, sm: 2.2 },
                    }}
                  >

                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: '0.85rem', sm: '0.95rem' },
                          fontWeight: 800,
                          lineHeight: 1.2,
                        }}
                      >
                        The BunkMates way
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: { xs: '0.68rem', sm: '0.78rem' },
                          mt: 0.2,
                          opacity: 0.62,
                          display: { xs: 'none', sm: 'block' },
                        }}
                      >
                        Your trip, connected.
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={{ xs: 1, sm: 1.45 }}>
                    {comparison.bunkmate.map((item, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={{ xs: 0.8, sm: 1.25 }}
                        alignItems="flex-start"
                      >
                        <CheckRoundedIcon
                          sx={{
                            fontSize: { xs: 14, sm: 17 },
                            mt: '2px',
                            flexShrink: 0,
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: {
                              xs: '0.75rem',
                              sm: '0.93rem',
                            },
                            lineHeight: 1.35,
                            fontWeight: 550,
                            opacity: 0.82,
                          }}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {/* Decorative BM mark */}
                  <Typography
                    sx={{
                      position: 'absolute',
                      right: -8,
                      bottom: -28,
                      fontSize: { xs: '4.5rem', sm: '8rem' },
                      fontWeight: 900,
                      letterSpacing: '-0.12em',
                      opacity: 0.15,
                      color: '#dba21d',
                      pointerEvents: 'none',
                    }}
                  >
                    BM
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutSection;