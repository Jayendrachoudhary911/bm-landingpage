import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ReplayCircleFilledOutlinedIcon from '@mui/icons-material/ReplayCircleFilledOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

const features = [
  {
    icon: <CodeOutlinedIcon fontSize="medium" />,
    title: 'Built for developers',
    description: 'Built for engineers, developers, dreamers, thinkers and doers.',
  },
  {
    icon: <BrushOutlinedIcon fontSize="medium" />,
    title: 'Ease of use',
    description: 'It\'s as easy as using an Apple, and as expensive as buying one.',
  },
  {
    icon: <AttachMoneyOutlinedIcon fontSize="medium" />,
    title: 'Pricing like no other',
    description: 'Our prices are best in the market. No cap, no lock, no credit card required.',
  },
  {
    icon: <CloudOutlinedIcon fontSize="medium" />,
    title: '100% Uptime guarantee',
    description: 'We just cannot be taken down by anyone.',
  },
  {
    icon: <CallSplitOutlinedIcon fontSize="medium" />,
    title: 'Multi-tenant Architecture',
    description: 'You can simply share passwords instead of buying new seats.',
  },
  {
    icon: <SupportAgentOutlinedIcon fontSize="medium" />,
    title: '24/7 Customer Support',
    description: 'We are available 100% of the time. At least our AI Agents are.',
  },
  {
    icon: <ReplayCircleFilledOutlinedIcon fontSize="medium" />,
    title: 'Money back guarantee',
    description: 'If you do not like our app, we will convince you to like us.',
  },
  {
    icon: <FavoriteBorderOutlinedIcon fontSize="medium" />,
    title: 'And everything else',
    description: 'I just ran out of copy ideas. Accept my sincere apologies.',
  },
];

const FeaturesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ backgroundColor: '#fdfdfd', py: 10 }}>
      <Container>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          Features That Make a Difference
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}>
          Designed with real users in mind — bold, functional, and full of character.
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  minHeight: 200,
                  width: isMobile ? "100%": 270,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  justifyContent: 'flex-start',
                  backgroundColor: '#fff',
                  transition: '0.3s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[3],
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box color="text.secondary">{feature.icon}</Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
