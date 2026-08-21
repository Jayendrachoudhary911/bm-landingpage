import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useCustomTheme } from '../context/ThemeContext';

const stats = [
  {
    icon: FlightTakeoffRoundedIcon,
    label: 'Built for Travelers',
    sub: 'Tested on trails & routes',
    accent: '#60a5fa',
  },
  {
    icon: GroupsRoundedIcon,
    label: 'Squad Centric',
    sub: 'Zero-friction coordination',
    accent: '#f59e0b',
  },
  {
    icon: SecurityRoundedIcon,
    label: 'Offline First',
    sub: 'Always ready anywhere',
    accent: '#a78bfa',
  },
  {
    icon: FavoriteRoundedIcon,
    label: 'Made with Passion',
    sub: 'Constantly evolving',
    accent: '#34d399',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const AboutSectionTeam = () => {
  const { isDark } = useCustomTheme();

  const colors = {
    background: isDark ? '#09090b' : '#ffffff',
    surface: isDark ? '#141417' : '#f7f7f8',
    text: isDark ? '#fafafa' : '#09090b',
    secondaryText: isDark ? '#a1a1aa' : '#71717a',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
  };

  return (
    <Box
      id="about-team"
      sx={{
        py: { xs: 8, sm: 10, md: 14 },
        px: 2.5,
        backgroundColor: colors.background,
        color: colors.text,
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.35s ease, color 0.35s ease',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: 450,
          height: 450,
          borderRadius: '50%',
          backgroundColor: isDark ? 'rgba(96, 165, 250, 0.03)' : 'rgba(96, 165, 250, 0.05)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', lg: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 5, md: 6, lg: 8 },
          }}
        >
          {/* =============================================
              LEFT (DESKTOP) / BOTTOM (MOBILE): 2x2 CARDS
          ============================================= */}
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            sx={{
              flex: { xs: '1 1 100%', lg: '0 0 52%' },
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            {stats.map((item, index) => {
              const IconComponent = item.icon;
              return (
<Box
  key={index}
  component={motion.div}
  variants={cardVariants}
  whileHover={{ y: -4, scale: 1.02 }}
  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
  sx={{
    width: {
      xs: 'calc(50% - 6px)',
      sm: 'calc(50% - 8px)',
    },
    display: 'flex',
  }}
>
  <Paper
    elevation={0}
    sx={{
      width: '100%',
      p: { xs: 2, sm: 2.6 },
      borderRadius: { xs: '18px', sm: '22px' },
      backgroundColor: isDark ? '#003e7d37' : 'rgba(247, 247, 248, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isDark
        ? 'inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 8px 24px rgba(0, 0, 0, 0.35)'
        : 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 8px 24px rgba(0, 0, 0, 0.04)',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        '& .pattern-icon': {
          opacity: isDark ? 0.12 : 0.09,
          transform: 'rotate(-4deg) scale(1.06)',
        },
      },
    }}
  >

    {/* Repetitive Tilted Pattern Matrix on the Right */}
    <Box
      className="pattern-icon"
      sx={{
        position: 'absolute',
        top: -12,
        right: -12,
        bottom: -12,
        width: '50%',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 2fr)',
        gap: { xs: 1.2, sm: 1 },
        placeItems: 'center',
        transform: 'rotate(-14deg)',
        opacity: isDark ? 0.025 : 0.045,
        color: '#aed4ff',
        pointerEvents: 'none',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
        maskImage: 'linear-gradient(to left, black 35%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to left, black 35%, transparent 100%)',
      }}
    >
      {[...Array(6)].map((_, i) => (
        <IconComponent
          key={i}
          sx={{
            fontSize: { xs: 24, sm: 30 },
            transform: i % 2 === 0 ? 'translateY(4px)' : 'translateY(-4px)',
          }}
        />
      ))}
    </Box>

    {/* Card Typography */}
<Box sx={{ position: 'relative', zIndex: 1 }}>
  {/* Multi-Shaded Gradient Title */}
  <Typography
    sx={{
      fontSize: { xs: '1.28rem', sm: '2.38rem' },
      fontWeight: 850,
      letterSpacing: '-0.035em',
      lineHeight: 1.12,
      mb: 0.8,
      background: isDark
        ? `linear-gradient(135deg, #ffffff 0%, ${alpha('#ffffff', 0.55)} 55%, ${alpha('#cfcfcf', 0.45)} 100%)`
        : `linear-gradient(135deg, #09090b 0%, ${alpha(item.accent || '#09090b', 0.9)} 60%, #52525b 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      transition: 'all 0.3s ease',
    }}
  >
    {item.label}
  </Typography>

  {/* Multi-Shaded Tonal Description */}
  <Typography
    sx={{
      fontSize: { xs: '0.75rem', sm: '1.05rem' },
      fontWeight: 500,
      lineHeight: 1.45,
      letterSpacing: '-0.01em',
      background: isDark
        ? `linear-gradient(180deg, ${alpha('#e4e4e7', 0.95)} 0%, ${alpha(colors.secondaryText, 0.75)} 100%)`
        : `linear-gradient(180deg, #3f3f46 0%, ${alpha('#71717a', 0.85)} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    {item.sub}
  </Typography>
</Box>
  </Paper>
</Box>
              );
            })}
          </Box>

          {/* =============================================
              RIGHT (DESKTOP) / TOP (MOBILE): DETAILS
          ============================================= */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            sx={{
              flex: { xs: '1 1 100%', lg: '0 0 44%' },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                px: 1.4,
                py: 0.6,
                mb: 2,
                borderRadius: '999px',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: colors.text }} />
              <Typography
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 750,
                  letterSpacing: '0.04em',
                  color: colors.secondaryText,
                  textTransform: 'uppercase',
                }}
              >
                Our Mission
              </Typography>
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.9rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.1,
                fontWeight: 850,
                letterSpacing: '-0.04em',
                color: '#8bbaef',
                textAlign: 'left',
                mb: 2,
              }}
            >
              Built by travelers,{' '}
              <Box component="span" sx={{ color: colors.secondaryText }}>
                for travelers.
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.9rem', sm: '0.98rem', md: '1.02rem' },
                color: colors.secondaryText,
                textAlign: 'left',
                lineHeight: 1.75,
                mb: 2.5,
                maxWidth: 500,
              }}
            >
              We are a passionate team building BunkMate to make group trips fun, collaborative, and stress-free. We remove coordination overhead so you can focus on the journey.
            </Typography>

            <Box
              sx={{
                p: 1.8,
                borderRadius: 1.4,
                backgroundColor: isDark ? '#8bbaef' : 'rgba(0,0,0,0.025)',
                textAlign: 'left',
                width: '100%',
                maxWidth: 500,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#203362',
                  lineHeight: 1.55,
                }}
              >
                "Replace scattered group chats and lost plans with a single fluid ecosystem tailored for active adventures."
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutSectionTeam;