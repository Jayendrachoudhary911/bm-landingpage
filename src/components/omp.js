import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import missionImage from "../assets/team/1.jpeg"; // <-- replace this path

export default function OurMissionSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 5, md: 10 },
        background: "radial-gradient(circle at center, #000000ff, #0f172a, #000000ff, #000000ff, #000000ff, #000000ff)",
        color: "#e2e8f0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}
      <Box
        sx={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle, rgba(0, 0, 0, 0.15), transparent 70%)",
          borderRadius: "50%",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        sx={{
          color: "#fff",
          mb: 3,
          position: "relative",
          zIndex: 2,
        }}
      >
        Our Mission
      </Typography>

      <Typography
        variant="subtitle1"
        textAlign="center"
        sx={{
          maxWidth: 750,
          mx: "auto",
          mb: 10,
          color: "#94a3b8",
          zIndex: 2,
          position: "relative",
          lineHeight: 1.7,
        }}
      >
        Every great journey starts with an idea — and at BunkMates, ours is to
        make exploring the world simpler, smarter, and more connected. We’re
        building tools that bring people together, turning travel plans into
        lifelong memories.
      </Typography>

      {/* 4 Grid Layout */}
      <Grid
        container
        spacing={6}
        justifyContent="center"
        alignItems="center"
        sx={{ zIndex: 2, position: "relative" }}
      >
        {/* Grid 1 - Text */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                  width: "100%",
                  maxWidth: 400,
                  height: 400,
                  borderRadius: "20px",
                  mb: 4,
              }}
            >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "#f8fafc", mb: 2 }}
            >
              Empower Every Traveller
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#94a3b8", lineHeight: 1.8 }}
            >
              We believe that every traveler — whether a spontaneous explorer or
              a meticulous planner — deserves the freedom to plan their journey
              with ease. BunkMates was built to give you control, flexibility,
              and creativity when designing your adventures.  
              <br />
              <br />
              From tracking budgets to organizing trip details, our mission is
              to empower you with tools that remove friction and add joy. Every
              feature, every tap, is designed to make your next escape smoother,
              simpler, and more personal.
            </Typography>
            </Box>
          </motion.div>
        </Grid>

        {/* Grid 2 - Text */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Box
              sx={{
                  width: "100%",
                  maxWidth: 400,
                  height: 400,
                  borderRadius: "20px",
                  mb: 4,
              }}
            >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "#f8fafc", mb: 2 }}
            >
              Connect Like-Minded Explorers
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#94a3b8", lineHeight: 1.8 }}
            >
              The best journeys are the ones shared. BunkMates helps you
              discover friends, build travel groups, and stay connected through
              every step of your journey — from planning and chatting to sharing
              photos and memories.  
              <br />
              <br />
              Whether you’re heading on a weekend getaway or a cross-country
              road trip, BunkMates ensures you’re never traveling alone. You’ll
              always have your people — your bunkmates — right there with you.
            </Typography>
            </Box>
          </motion.div>
        </Grid>

        {/* Grid 3 - Text */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                  width: "100%",
                  maxWidth: 400,
                  height: 400,
                  borderRadius: "20px",
                  mb: 4,
              }}
            >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "#f8fafc", mb: 2 }}
            >
              Simplify Every Journey
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#94a3b8", lineHeight: 1.8 }}
            >
              We understand that planning can be overwhelming — juggling
              expenses, routes, checklists, and notes. That’s why BunkMates
              brings everything together in one place.  
              <br />
              <br />
              From smart reminders and real-time weather to synced itineraries
              and shared budgets, every feature is crafted to make your travels
              stress-free. Your plans, memories, and adventures all flow
              together — just like the journey itself.
            </Typography>
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* Bottom Glow */}
      <Box
        sx={{
          position: "absolute",
          bottom: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 800,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)",
          borderRadius: "50%",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />
    </Box>
  );
}
