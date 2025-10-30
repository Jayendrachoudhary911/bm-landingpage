import React, { useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { keyframes } from "@emotion/react";
import { Typewriter } from "react-simple-typewriter";
import DownloadIcon from "@mui/icons-material/Download";

// Background animation keyframes
const blobMovement = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(40px, -30px) scale(1.05); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const gridBackground = `
  linear-gradient(to right, rgba(255, 255, 255, 0.01) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
`;

export default function HeroDark() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax transformations — middle moves opposite
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const y3 = useTransform(scrollYProgress, [1, 1], [0, -120]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y5 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y6 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const titleWords = [
    "Bunk The Chaos, Keep The Fun!",
    "Trips Made Simple",
    "Travel with Friends",
    "Budget Smarter",
    "Create Unforgettable Moments",
  ];

  return (
    <Box
      id="hero"
      ref={ref}
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: isMobile ? "30vh" : "90vh",
        backgroundColor: "#000000ff",
        backgroundImage: gridBackground,
        backgroundSize: "50px 50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
        color: "#fff",
      }}
    >
      {/* Animated Gradient Blobs */}
      <Box
        sx={{
          position: "absolute",
          top: "-300px",
          left: isMobile ? "-450px" : "-300px",
          width: isMobile ? 800 : 1000,
          height: isMobile ? 800 : 1200,
          background: "radial-gradient(circle, #ff812dff, transparent 70%)",
          filter: "blur(120px)",
          animation: `${blobMovement} 20s ease-in-out infinite`,
          opacity: isMobile ? 0.3 : 0.5,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-340px",
          right: isMobile ? "-450px" : "-350px",
          width: isMobile ? 800 : 1200,
          height: isMobile ? 800 : 1200,
          background: "radial-gradient(circle, #000aff, transparent 70%)",
          filter: "blur(150px)",
          animation: `${blobMovement} 25s ease-in-out infinite`,
          opacity: isMobile ? 0.2 : 0.4,
        }}
      />

      {/* Content */}
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 999, mt: 30 }}>
        <Box sx={{ mb: isMobile ? 6 : 8 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2 }}
        >
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                backdropFilter: "blur(10px)",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "inline-block",
                px: 2,
                py: 0.6,
                borderRadius: "999px",
                fontSize: "0.875rem",
                fontWeight: 500,
                mb: 3,
              }}
            >
              Bunk The Chaos, Keep The Fun!
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
              fontWeight={800}
              sx={{
                mb: 2,
                lineHeight: 1.2,
                color: "#ffffffa1",
              }}
            >
              <Typewriter
                words={titleWords}
                loop
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
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
              sx={{
                maxWidth: 620,
                mx: "auto",
                mb: 4,
                color: "#d8d8d8bf",
                fontSize: "1.1rem",
              }}
            >
              BunkMate is your ultimate trip companion — plan adventures, track
              budgets, create checklists, and chat with friends. All in one
              seamless app.
            </Typography>
          </motion.div>

          {/* CTA Buttons */}
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
              zIndex={9}
            >
 <Button
  variant="contained"
  sx={{
    px: 4,
    py: 1.5,
    borderRadius: "999px",
    fontWeight: 600,
    textTransform: "none",
    backgroundColor: "#ffffff",
    color: "#000",
    display: "flex",
    alignItems: "center",
    gap: 1.2,
    backgroundSize: "200%",
    transition: "0.4s",
    boxShadow: "0 0 20px rgba(255,255,255,0.15)",
    cursor: "pointer",
    "&:hover": {
      backgroundPosition: "right center",
      transform: "translateY(-3px)",
      boxShadow: "0 0 30px rgba(255,255,255,0.25)",
      backgroundColor: "#000",
      color: "#fff",
    },
  }}
  href="bm-install"
>
  <DownloadIcon sx={{ fontSize: 22 }} />
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
                  border: "1.5px solid rgba(255,255,255,0.5)",
                  color: "#fff",
                  transition: "0.3s",
                  "&:hover": {
                    background: "rgba(255,255,255,0.1)",
                    borderColor: "#00fff0",
                    transform: "translateY(-3px)",
                  },
                }}
                href="https://bunk-mates.vercel.app/waitlist"
              >
                Join Beta
              </Button>
            </Stack>
          </motion.div>
        </motion.div>
        </Box>
      {/* Parallax App Preview Section */}
      <Box
        sx={{
          position: "relative",
          width: "160%",
          height: isMobile ? "250px" : "700px",
          overflow: "hidden",
          left: "-30%",
          mt: isMobile ? 10 : -7,
          zIndex: 999,
        }}
      >
        <motion.img
          src="/assets/BM-screenshots/18.png"
          alt="App Preview 1"
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "0%",
            width: isMobile ? "200px" : "280px",
            borderRadius: "20px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            y: y1,
            transition: "transform 0.3s ease-out",
            display: isMobile ? "none" : "block",
          }}
        />
        <motion.img
          src="/assets/BM-screenshots/2.png"
          alt="App Preview 2"
          style={{
            position: "absolute",
            bottom: isMobile ? "-250px" : "-100px",
            left: isMobile ? "10%" : "16%",
            width: isMobile ? "220px" : "300px",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            y: y2,
            transition: "transform 0.3s ease-out",
          }}
        />
        <motion.img
          src="/assets/BM-screenshots/1.png"
          alt="App Preview 3"
          style={{
            position: "absolute",
            bottom: isMobile ? "-190px" : "-120px",
            right: "45%",
            width: isMobile ? "150px" : "280px",
            height: isMobile ? "300px" : "580px",
            borderRadius: "20px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            y: y3,
            transition: "transform 0.3s ease-out",
          }}
        />
        <motion.img
          src="/assets/BM-screenshots/17.png"
          alt="App Preview 3"
          style={{
            position: "absolute",
            bottom: isMobile ? "-220px" : "-120px",
            right: isMobile ? "20%" : "30%",
            width: isMobile ? "200px" : "280px",
            borderRadius: "20px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            y: y4,
            transition: "transform 0.3s ease-out",
          }}
        />
        <motion.img
          src="/assets/BM-screenshots/7.png"
          alt="App Preview 3"
          style={{
            position: "absolute",
            bottom: isMobile ? "-320px" : "-120px",
            right: isMobile ? "0%" : "17%",
            width: isMobile ? "200px" : "280px",
            borderRadius: "20px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            y: y5,
            transition: "transform 0.3s ease-out",
          }}
        />
        <motion.img
          src="/assets/BM-screenshots/6.png"
          alt="App Preview 3"
          style={{
            position: "absolute",
            bottom: isMobile ? "-220px" : "-120px",
            right: "0%",
            width: isMobile ? "200px" : "280px",
            borderRadius: "20px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            y: y6,
            transition: "transform 0.3s ease-out",
            display: isMobile ? "none" : "block",
          }}
        />
      </Box>
      </Container>
    </Box>
  );
}
