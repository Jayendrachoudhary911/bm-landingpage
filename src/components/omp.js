import React from "react";
import { Box, Typography, Container, Paper, Stack } from "@mui/material";
import { motion } from "framer-motion";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useCustomTheme } from "../context/ThemeContext";

export default function OurMissionSection() {
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

  const missions = [
    {
      title: "Empower Every Traveller",
      description:
        "Every traveler deserves the freedom to plan journeys with total ease. BunkMates gives you flexibility and control when designing group trips, keeping details organized and stress-free.",
      icon: "🧭",
    },
    {
      title: "Connect Like-Minded Explorers",
      description:
        "The best journeys are the ones shared. BunkMates connects squads through every phase of the trip—from itineraries and chats to shared budgets and live coordination.",
      icon: "🤝",
    },
    {
      title: "Simplify Every Journey",
      description:
        "Eliminate fragmented apps and disjointed group messages. BunkMates integrates offline storage, fair cost splitting, and real-time alerts into a cohesive flow.",
      icon: "✨",
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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "flex-start" },
            justifyContent: "space-between",
            gap: { xs: 6, md: 8, lg: 10 },
          }}
        >
          {/* Left Sticky Header Section */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            sx={{
              flex: { xs: "1 1 100%", md: "0 0 42%" },
              position: { md: "sticky" },
              top: { md: 100 },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "left" },
            }}
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
                OUR VALUES
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.4rem", sm: "3.1rem", md: "3.6rem" },
                lineHeight: 1.05,
                fontWeight: 850,
                letterSpacing: "-0.055em",
                color: colors.text,
                mb: 2.5,
              }}
            >
              Built to make travel
              <br />
              <Box component="span" sx={{ color: colors.secondaryText }}>
                simpler, smarter, and shared.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 480,
                fontSize: { xs: "0.98rem", md: "1.05rem" },
                lineHeight: 1.75,
                color: colors.secondaryText,
              }}
            >
              Every adventure starts with an idea. We build tools that bring squads together, turning travel plans into effortless memories.
            </Typography>
          </Box>

          {/* Right Stacked Cards Section */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "0 0 54%" },
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {missions.map((item, idx) => (
              <Box
                key={idx}
                component={motion.div}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4 }}
                sx={{ width: "100%", display: "flex" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 3.5 },
                    borderRadius: "26px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
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
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        flexShrink: 0,
                        borderRadius: "14px",
                        backgroundColor: colors.surface,
                        border: `1px solid ${colors.subtleBorder}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.35rem",
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        color: colors.text,
                        fontWeight: 800,
                        fontSize: { xs: "1.15rem", sm: "1.25rem" },
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.secondaryText,
                      lineHeight: 1.75,
                      fontSize: "0.92rem",
                    }}
                  >
                    {item.description}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}