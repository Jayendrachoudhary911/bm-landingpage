import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import GroupIcon from "@mui/icons-material/Group";
import MapIcon from "@mui/icons-material/Map";
import ChatIcon from "@mui/icons-material/Chat";
import ChecklistIcon from "@mui/icons-material/Checklist";

export default function WhatMakesDifferent() {
  const features = [
    {
      icon: <GroupIcon sx={{ fontSize: 50, color: "#696969ff" }} />,
      title: "Travel, Together",
      desc: "BunkMates brings the joy of togetherness into travel. Plan your adventures with friends, sync itineraries, share budgets, and keep memories alive — all within one connected space designed for real people and real journeys.",
    },
    {
      icon: <MapIcon sx={{ fontSize: 50, color: "#696969ff" }} />,
      title: "Smart, Seamless Planning",
      desc: "Say goodbye to scattered apps and endless messages. With integrated maps, offline navigation, and weather forecasts, BunkMates makes organizing your trips simple, intuitive, and ready for any adventure — anywhere, anytime.",
    },
    {
      icon: <ChecklistIcon sx={{ fontSize: 50, color: "#696969ff" }} />,
      title: "Organize Without Overthinking",
      desc: "Manage your notes, to-do lists, budgets, and reminders in one beautiful interface. From pre-trip packing to post-trip expenses, every tool is crafted to make your experience effortless and enjoyable.",
    },
    {
      icon: <ChatIcon sx={{ fontSize: 50, color: "#696969ff" }} />,
      title: "Connect Beyond the Trip",
      desc: "BunkMates isn’t just a planner — it’s a community. Stay connected with your travel circle through built-in chats, shared media, and post-trip reflections. Keep your travel stories alive long after you’ve unpacked.",
    },
  ];

  return (
    <Box
      sx={{
        py: 10,
        px: { xs: 3, md: 10 },
        textAlign: "center",
        color: "#e2e8f0",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >

      {/* Section title */}
      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        sx={{
          color: "#fff",
          position: "relative",
          zIndex: 2,
        }}
      >
        What Makes BunkMates Different
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          maxWidth: 750,
          mx: "auto",
          mb: 8,
          color: "#b3b3b3ff",
          zIndex: 2,
          position: "relative",
        }}
      >
        We’re not just another travel app — BunkMates redefines the way you plan,
        connect, and explore. It’s built to make every trip feel smoother,
        smarter, and more social than ever before.
      </Typography>

      {/* Features Grid */}
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {features.map((item, index) => (
          <Grid
            container
            key={index}
            spacing={4}
            direction={
              index % 2 === 0
                ? { xs: "column", md: "row" }
                : { xs: "column", md: "row-reverse" }
            }
            alignItems="center"
            justifyContent="center"
            sx={{
              mb: 6,
              zIndex: 2,
              position: "relative",
            }}
          >
            {/* Text Section */}
            <Grid item xs={12} md={6} sx={{ width: "300px" }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: "left" }}
              >
                <Box sx={{ mb: 2 }}>{item.icon}</Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: "#ffffffff" }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#696969ff",
                    lineHeight: 1.8,
                    maxWidth: 500,
                  }}
                >
                  {item.desc}
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
