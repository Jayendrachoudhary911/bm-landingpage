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
        backgroundColor: colors.background,
        color: colors.text,
        overflow: 'hidden',
        transition:
          'background-color 0.35s ease, color 0.35s ease',
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
          px: { xs: 2.5, sm: 4, md: 5 },
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
              xs: 7,
              md: 9,
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
            <Box
              sx={{
                maxWidth: 600,
              }}
            >
              {/* Eyebrow */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.8,
                  px: 1.4,
                  py: 0.75,
                  mb: 3,
                  borderRadius: '999px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.035)'
                    : 'rgba(0, 0, 0, 0.025)',
                }}
              >
                <AutoAwesomeRoundedIcon
                  sx={{
                    fontSize: 15,
                    color: colors.text,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.01em',
                    color: colors.secondaryText,
                  }}
                >
                  Everything your trip needs
                </Typography>
              </Box>

              {/* Heading */}
              <Typography
                variant="h2"
                sx={{
                  fontSize: {
                    xs: '2.6rem',
                    sm: '3.35rem',
                    md: '4rem',
                  },
                  lineHeight: {
                    xs: 1.05,
                    md: 1.02,
                  },
                  letterSpacing: {
                    xs: '-0.055em',
                    md: '-0.065em',
                  },
                  fontWeight: 800,
                  maxWidth: 680,
                  mb: 3,
                }}
              >
                Less planning chaos.
                <br />
                <Box
                  component="span"
                  sx={{
                    color: colors.secondaryText,
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
                      xs: '1rem',
                      md: '1.05rem',
                    },
                    lineHeight: 1.8,
                    mb: 4.5,

                    '& p': {
                      m: 0,
                      mb: 1.8,
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
                    backgroundColor: colors.text,
                    color: colors.background,
                    boxShadow: isDark
                      ? '0 12px 30px rgba(0, 0, 0, 0.35)'
                      : '0 10px 25px rgba(0, 0, 0, 0.12)',
                    '&:hover': {
                      backgroundColor: isDark
                        ? '#e8e8e8'
                        : '#242424',
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
                    color: colors.text,
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.045)'
                      : 'rgba(0, 0, 0, 0.035)',
                    border: `1px solid ${colors.border}`,
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
                  xs: 1.5,
                  sm: 2,
                },
                borderRadius: {
                  xs: '28px',
                  sm: '32px',
                },
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.035)'
                  : '#f6f6f6',
                border: `1px solid ${colors.subtleBorder}`,
                boxShadow: isDark
                  ? '0 30px 80px rgba(0, 0, 0, 0.28)'
                  : '0 25px 70px rgba(0, 0, 0, 0.06)',
              }}
            >
              {/* Panel Header */}
              <Box
                sx={{
                  px: {
                    xs: 1.5,
                    sm: 2,
                  },
                  pt: {
                    xs: 1.5,
                    sm: 2,
                  },
                  pb: 2.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontWeight: 800,
                    color: colors.secondaryText,
                    mb: 0.8,
                  }}
                >
                  One trip. One place.
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: '1.35rem',
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

              <Stack spacing={1.5}>
                {/* Fragmented Card */}
                <Box
                  component={motion.div}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    p: {
                      xs: 2.25,
                      sm: 2.75,
                    },
                    borderRadius: '24px',
                    backgroundColor: isDark
                      ? '#111111'
                      : 'rgba(255, 255, 255, 0.8)',
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.25}
                    alignItems="center"
                    sx={{
                      mb: 2.2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.06)'
                          : '#f1f1f1',
                        color: colors.secondaryText,
                      }}
                    >
                      <CloseRoundedIcon
                        sx={{
                          fontSize: 19,
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 750,
                          color: colors.text,
                        }}
                      >
                        The usual way
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: '0.78rem',
                          color: colors.secondaryText,
                          mt: 0.2,
                        }}
                      >
                        More apps. More confusion.
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={1.45}>
                    {comparison.chaos.map((item, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={1.25}
                        alignItems="flex-start"
                      >
                        <CloseRoundedIcon
                          sx={{
                            fontSize: 17,
                            mt: '2px',
                            flexShrink: 0,
                            color: isDark ? '#777777' : '#9a9a9a',
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: {
                              xs: '0.88rem',
                              sm: '0.93rem',
                            },
                            lineHeight: 1.5,
                            color: colors.secondaryText,
                          }}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                <Divider
                  sx={{
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
                    position: 'relative',
                    overflow: 'hidden',
                    p: {
                      xs: 2.25,
                      sm: 2.75,
                    },
                    borderRadius: '24px',
                    backgroundColor: isDark ? '#ffffff' : '#111111',
                    color: isDark ? '#000000' : '#ffffff',
                    boxShadow: isDark
                      ? '0 15px 35px rgba(0, 0, 0, 0.3)'
                      : '0 15px 35px rgba(0, 0, 0, 0.14)',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.25}
                    alignItems="center"
                    sx={{
                      mb: 2.2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isDark
                          ? '#eeeeee'
                          : 'rgba(255, 255, 255, 0.12)',
                      }}
                    >
                      <CheckRoundedIcon
                        sx={{
                          fontSize: 19,
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 800,
                        }}
                      >
                        The BunkMates way
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: '0.78rem',
                          mt: 0.2,
                          opacity: 0.62,
                        }}
                      >
                        Your trip, connected.
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={1.45}>
                    {comparison.bunkmate.map((item, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={1.25}
                        alignItems="flex-start"
                      >
                        <CheckRoundedIcon
                          sx={{
                            fontSize: 17,
                            mt: '2px',
                            flexShrink: 0,
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: {
                              xs: '0.88rem',
                              sm: '0.93rem',
                            },
                            lineHeight: 1.5,
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
                      fontSize: '8rem',
                      fontWeight: 900,
                      letterSpacing: '-0.12em',
                      opacity: 0.035,
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