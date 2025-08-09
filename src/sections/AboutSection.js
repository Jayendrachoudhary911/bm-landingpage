import React from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  useTheme,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';

const AboutSection = () => {
  const theme = useTheme();

  return (
    <Box
      id="about"
      sx={{
        position: 'relative',
        py: { xs: 10, md: 16 },
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        height: "100vh",
        minHeight: "110vh",
      }}
    >
      {/* Decorative Gradient Background Blobs */}
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, #6ee7b7, transparent 70%)',
          filter: "blur(120px)",
          top: "-150px",
          right: "-150px",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, #82baffff, transparent 70%)',
          filter: "blur(120px)",
          bottom: "-100px",
          left: "-100px",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, my: "10%", px: 6 }}>
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
              fontWeight={600}
              mb={2}
              sx={{
                color: "#000",
              }}
            >
              About BunkMates
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              fontSize="1.1rem"
              lineHeight={1.9}
              mb={4}
            >
              BunkMates is a social trip companion app that redefines how you plan,
              coordinate, and enjoy trips with your friends. Whether it’s a college
              getaway, weekend trek, or long vacation, we help you budget, chat,
              checklist, and collaborate — effortlessly.
              <br />
              <br />
              No more scattered spreadsheets or confusing chats. Just one unified,
              beautiful platform for all things travel.
            </Typography>

            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: '30px',
                px: 4,
                py: 1.5,
                backgroundColor: '#000000',
                border: "1.2px solid #00000000",
                boxShadow: 'none',
                transition: "ease-in-out 0.2s",
                '&:hover': {
                    backgroundColor: '#ffffffff',
                    border: "1.2px solid #333",
                    color: "#000",
                    boxShadow: 'none',
                },
              }}
            >
              Learn More
            </Button>
          </motion.div>

          {/* Illustration / Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ flex: 1 }}
          >
            <Box
              component="img"
              src="/assets/BunkMates_about.png"
              alt="BunkMates About Illustration"
              sx={{
                width: '100%',
                maxWidth: 540,
                mx: 'auto',
                borderRadius: 4,
                boxShadow: 'none',
              }}
            />
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default AboutSection;
