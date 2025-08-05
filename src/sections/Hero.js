import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import GeometricBackground from "../elements/GeometricBackground";
import { keyframes } from "@emotion/react";

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

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

  return (
    <>

      <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        backgroundColor: "#ffffffff",
        color: "#000",
        backgroundImage: gridBackground,
        backgroundSize: "40px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      {/* Blurred blobs */}
      <Box
        sx={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
    >
      {/* Tagline */}
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
        Flexible Plans for You →
      </Box>

      {/* Headline */}
      <Typography
        variant={isMobile ? "h4" : "h3"}
        fontWeight={700}
        sx={{ mb: 2 }}
      >
        Deploy your website
        <br />
        in <strong>seconds</strong>, not hours
      </Typography>

      {/* Subheading */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
      >
        With our state of the art, cutting edge, we are so back kinda hosting
        services, you can deploy your website in seconds.
      </Typography>

      {/* Buttons */}
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
            "&:hover": {
              bgcolor: "#333",
            },
          }}
        >
          Start a project
        </Button>

        <Button
          variant="outlined"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: "999px",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Book a call
        </Button>
      </Stack>
    </motion.div>
  </Container>
    </Box>

    </>
  );
}
