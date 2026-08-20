import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import { motion } from "framer-motion";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useCustomTheme } from "../context/ThemeContext";

export default function WhatMakesDifferent() {
  const { isDark } = useCustomTheme();

  const colors = {
    background: isDark ? "#000000" : "#ffffff",
    surface: isDark ? "#0d0d0d" : "#f7f7f7",
    surfaceStrong: isDark ? "#141414" : "#ffffff",
    text: isDark ? "#ffffff" : "#111111",
    secondaryText: isDark ? "#a3a3a3" : "#737373",
    border: isDark
      ? "rgba(255, 255, 255, 0.09)"
      : "rgba(0, 0, 0, 0.08)",
    subtleBorder: isDark
      ? "rgba(255, 255, 255, 0.06)"
      : "rgba(0, 0, 0, 0.05)",
  };

  const features = [
    {
      icon: <GroupsRoundedIcon sx={{ fontSize: 24 }} />,
      title: "Travel, Together",
      desc: "BunkMates centers the trip around your group. Plan itineraries, sync stops, and automatically balance shared expenses in one collaborative space.",
    },
    {
      icon: <MapRoundedIcon sx={{ fontSize: 24 }} />,
      title: "Smart, Seamless Logistics",
      desc: "Replace chaotic app-switching with unified routes, offline-ready documents, and real-time updates built for uninterrupted journeys.",
    },
    {
      icon: <ChecklistRoundedIcon sx={{ fontSize: 24 }} />,
      title: "Organize Without Overthinking",
      desc: "From packing checklists to on-the-fly bill splits, every tool is designed to eliminate mental clutter and keep travel light.",
    },
    {
      icon: <ForumRoundedIcon sx={{ fontSize: 24 }} />,
      title: "Connect Beyond the Trip",
      desc: "Keep travel moments intact. Integrated group messaging and shared photo vaults ensure your adventures live on long after unpacking.",
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 10, sm: 12, md: 16 },
        backgroundColor: colors.background,
        color: colors.text,
        position: "relative",
        overflow: "hidden",
        transition: "background-color 0.35s ease, color 0.35s ease",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 4, md: 5 } }}>
        <Box sx={{ maxWidth: 780, mx: "auto", textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.8,
                px: 1.4,
                py: 0.75,
                mb: 3,
                borderRadius: "999px",
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.035)"
                  : "rgba(0, 0, 0, 0.025)",
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 15, color: colors.text }} />
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  color: colors.secondaryText,
                }}
              >
                THE DIFFERENCE
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.3rem", md: "4rem" },
                lineHeight: 1.03,
                fontWeight: 850,
                letterSpacing: "-0.065em",
                color: colors.text,
                mb: 2.5,
              }}
            >
              What sets BunkMates apart.
            </Typography>

            <Typography
              sx={{
                maxWidth: 600,
                mx: "auto",
                fontSize: { xs: "0.98rem", md: "1.05rem" },
                lineHeight: 1.75,
                color: colors.secondaryText,
              }}
            >
              A purpose-built ecosystem crafted to make group coordination intuitive, lightweight, and cohesive.
            </Typography>
          </motion.div>
        </Box>

        {/* Flexbox Layout */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2.5, md: 3 },
            justifyContent: "center",
          }}
        >
          {features.map((item, index) => (
            <Box
              key={index}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                },
                display: "flex",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                style={{ width: "100%", display: "flex" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 3.5 },
                    borderRadius: "26px",
                    width: "100%",
                    backgroundColor: colors.surfaceStrong,
                    border: `1px solid ${colors.border}`,
                    boxShadow: isDark
                      ? "0 16px 40px rgba(0,0,0,0.2)"
                      : "0 12px 30px rgba(0,0,0,0.035)",
                    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      borderColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)",
                      boxShadow: isDark
                        ? "0 24px 50px rgba(0,0,0,0.28)"
                        : "0 18px 40px rgba(0,0,0,0.07)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "14px",
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.subtleBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors.text,
                      mb: 2.2,
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      color: colors.text,
                      fontWeight: 800,
                      fontSize: "1.2rem",
                      letterSpacing: "-0.03em",
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.secondaryText,
                      lineHeight: 1.7,
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Paper>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}