import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import { Typewriter } from "react-simple-typewriter";

// Background animation keyframes
const blobMovement = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.05); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const gridBackground = `
  linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
`;

export default function HeroLight() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const titleWords = [
    "Trips Made Simple",
    "Travel with Friends",
    "Budget Smarter",
    "Create Unforgettable Moments",
  ];

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        backgroundColor: "#fff",
        backgroundImage: gridBackground,
        backgroundSize: "40px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      {/* Animated Gradient Blobs */}
      <Box
        sx={{
          position: "absolute",
          top: "-120px",
          left: "-120px",
          width: 300,
          height: 300,
          background: "radial-gradient(circle, #ff80b5, transparent 70%)",
          filter: "blur(100px)",
          animation: `${blobMovement} 18s ease-in-out infinite`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-150px",
          right: "-150px",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, #6ee7b7, transparent 70%)",
          filter: "blur(120px)",
          animation: `${blobMovement} 22s ease-in-out infinite`,
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2 }}
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                bgcolor: "#f5f5f5",
                display: "inline-block",
                px: 2,
                py: 0.5,
                borderRadius: "999px",
                fontSize: "0.875rem",
                fontWeight: 500,
                mb: 3,
              }}
            >
              Plan Smarter. Travel Together.
            </Box>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography
              variant={isMobile ? "h3" : "h2"}
              fontWeight={700}
              sx={{ mb: 2, lineHeight: 1.2 }}
            >
              <Box component="span" sx={{ color: "#000000ff" }}>
                <Typewriter
                  words={titleWords}
                  loop
                  cursor
                  cursorStyle="_"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </Box>
            </Typography>
          </motion.div>

          {/* Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 620, mx: "auto", mb: 4 }}
            >
              BunkMate is the ultimate trip planner — manage budgets, create checklists,
              share moments, and chat with friends in one beautifully integrated platform.
            </Typography>
          </motion.div>

          {/* Call-to-action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "999px",
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "#000",
                  color: "#fff",
                  '&:hover': {
                    bgcolor: "#222",
                  },
                }}
                href="#get-started"
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "999px",
                  fontWeight: 600,
                  textTransform: "none",
                  border: "1.2px solid #000",
                  color: "#000"
                }}
                href="https://bunk-mates.vercel.app/waitlist"
              >
                Join Beta
              </Button>
            </Stack>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
