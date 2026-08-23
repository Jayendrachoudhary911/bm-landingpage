import React, { useRef } from "react";
import { Box, Typography, Container, Paper, Stack, alpha } from "@mui/material";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useCustomTheme } from "../context/ThemeContext";

const M3_EXPRESSIVE_PALETTE = {
  blue: {
    accent: "#e7f2ff",
    light: { bg: "#D7E3FF", text: "#001B3F", container: "#EEF2FF", onContainer: "#004785" },
    dark: { bg: "#d3e7ff", text: "#203362", container: "#e2f0ff", onContainer: "#457ed8" },
  },
  emerald: {
    accent: "#e6fff1",
    light: { bg: "#A6F5BA", text: "#00210E", container: "#DBFCE3", onContainer: "#006D37" },
    dark: { bg: "#c6ffe0", text: "#21542e", container: "#f1fff7", onContainer: "#17c14d" },
  },
  orange: {
    accent: "#ffefe9",
    light: { bg: "#EBDCFF", text: "#25005A", container: "#F6EEFF", onContainer: "#6940A5" },
    dark: { bg: "#ffdac5", text: "#703e26", container: "#ffeae2", onContainer: "#fb712c" },
  },
  purple: {
    accent: "#f7f3ff",
    light: { bg: "#EBDCFF", text: "#25005A", container: "#F6EEFF", onContainer: "#6940A5" },
    dark: { bg: "#e2d1ff", text: "#44236f", container: "#ecdeff", onContainer: "#a473ff" },
  },
};

export default function WhatMakesDifferent() {
  const { isDark } = useCustomTheme();
  const sectionRef = useRef(null);

  // Parallax Scroll Tracking across the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Responsive spring physics for fluid swipe and scroll handling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 18,
    mass: 0.6,
    restDelta: 0.001,
  });

  // Sensitive inverse parallax: Left card container moves down, Right sticky details move up
  const leftParallaxY = useTransform(smoothProgress, [0, 1], [-90, 140]);
  const rightParallaxY = useTransform(smoothProgress, [0, 1], [130, -130]);

  const colors = {
    background: isDark ? "#000000" : "#f1f3f5",
    surface: isDark ? "#0d0e12" : "#ffffff",
    text: isDark ? "#ffffff" : "#09090b",
    secondaryText: isDark ? "#a1a1aa" : "#64748b",
    border: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
  };

  const features = [
    {
      icon: <GroupsRoundedIcon sx={{ fontSize: 24 }} />,
      title: "Travel, Together",
      desc: "BunkMates centers the trip around your group. Plan itineraries, sync stops, and automatically balance shared expenses in one collaborative space.",
      palette: M3_EXPRESSIVE_PALETTE.blue,
      rotateZ: -3.5,
      rotateX: 5,
      rotateY: -4,
    },
    {
      icon: <MapRoundedIcon sx={{ fontSize: 24 }} />,
      title: "Smart Logistics",
      desc: "Replace chaotic app-switching with unified routes, offline-ready documents, and real-time updates built for uninterrupted journeys.",
      palette: M3_EXPRESSIVE_PALETTE.emerald,
      rotateZ: 3.2,
      rotateX: -4,
      rotateY: 4,
    },
    {
      icon: <ChecklistRoundedIcon sx={{ fontSize: 24 }} />,
      title: "Stay Organized",
      desc: "From packing checklists to on-the-fly bill splits, every tool is designed to eliminate mental clutter and keep travel light.",
      palette: M3_EXPRESSIVE_PALETTE.purple,
      rotateZ: 3,
      rotateX: 4,
      rotateY: -3,
    },
    {
      icon: <ForumRoundedIcon sx={{ fontSize: 24 }} />,
      title: "Connect Beyond",
      desc: "Keep travel moments intact. Integrated group messaging and shared photo vaults ensure your adventures live on long after unpacking.",
      palette: M3_EXPRESSIVE_PALETTE.orange,
      rotateZ: -3.8,
      rotateX: -5,
      rotateY: 4,
    },
  ];

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        py: { xs: 10, sm: 14, md: 20 },
        backgroundColor: colors.background,
        color: colors.text,
        position: "relative",
        overflow: "hidden",
        transition: "background-color 0.35s ease, color 0.35s ease",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3.5, md: 5 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            gap: { xs: 6, md: 8, lg: 10 },
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          {/* Left Column: 4 Tilted Cards in 2x2 Flexbox Layout */}
          <Box
            component={motion.div}
            style={{ y: leftParallaxY }}
            sx={{
              flex: { xs: "1 1 100%", md: "0 0 58%" },
              width: "100%",
              perspective: 1200,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 3, sm: 3.5 },
                width: "100%",
              }}
            >
              {features.map((item, index) => {
                const cardColor = isDark ? item.palette.dark : item.palette.light;
                const cardBg = isDark ? cardColor.bg : cardColor.container;
                const cardTextColor = isDark ? cardColor.text : cardColor.onContainer;

                return (
                  <Box
                    key={index}
                    component={motion.div}
                    initial={{
                      opacity: 0,
                      y: 28,
                      rotateZ: item.rotateZ,
                      rotateX: item.rotateX,
                      rotateY: item.rotateY,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      rotateZ: item.rotateZ,
                      rotateX: item.rotateX,
                      rotateY: item.rotateY,
                    }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      scale: 1.04,
                      rotateZ: 0,
                      rotateX: 0,
                      rotateY: 0,
                      y: -6,
                      transition: { duration: 0.25, ease: "easeOut" },
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "center center",
                    }}
                    sx={{
                      flex: {
                        xs: "1 1 100%",
                        sm: "1 1 calc(50% - 14px)",
                      },
                      cursor: "pointer",
                      touchAction: "pan-y",
                      display: "flex",
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2.8, sm: 3.2 },
                        borderRadius: "26px",
                        width: "100%",
                        backgroundColor: cardBg,
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 220,
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          borderColor: item.palette.accent,
                          boxShadow: isDark
                            ? `0 24px 50px rgba(0,0,0,0.65), 0 0 28px ${alpha(item.palette.accent, 0.3)}`
                            : `0 18px 45px rgba(0,0,0,0.12), 0 0 24px ${alpha(item.palette.accent, 0.25)}`,
                        },
                      }}
                    >
                      {/* Corner Ambient Glow */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: -45,
                          right: -45,
                          width: 140,
                          height: 140,
                          borderRadius: "50%",
                          background: `radial-gradient(circle, ${alpha(item.palette.accent, isDark ? 0.4 : 0.45)} 0%, transparent 70%)`,
                          filter: "blur(22px)",
                          pointerEvents: "none",
                        }}
                      />

                      <Box sx={{ position: "relative", zIndex: 1 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "15px",
                            backgroundColor: isDark ? alpha(item.palette.accent, 0.2) : "#ffffff",
                            color: cardTextColor,
                            border: `1.5px solid ${alpha(item.palette.accent, isDark ? 0.55 : 0.6)}`,
                            boxShadow: isDark
                              ? "inset 0 1px 1px rgba(255, 255, 255, 0.18)"
                              : "0 2px 8px rgba(0,0,0,0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          {item.icon}
                        </Box>

                        <Typography
                          variant="h5"
                          sx={{
                            color: cardTextColor,
                            fontWeight: 850,
                            fontSize: { xs: "1.15rem", sm: "1.25rem" },
                            letterSpacing: "-0.03em",
                            mb: 1,
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: isDark ? alpha(cardTextColor, 0.85) : alpha(cardTextColor, 0.85),
                            lineHeight: 1.65,
                            fontSize: "0.88rem",
                          }}
                        >
                          {item.desc}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Right Column: Sticky Details Section with Upward Parallax */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "0 0 38%" },
              position: { md: "sticky" },
              top: { md: 100 },
              zIndex: 2,
              width: "100%",
            }}
          >
            <motion.div
              style={{ y: rightParallaxY }}
              initial={{ opacity: 0, y: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Box
                sx={{
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
                    px: 1.5,
                    py: 0.65,
                    mb: 2.5,
                    borderRadius: "999px",
                    backgroundColor: isDark ? alpha(M3_EXPRESSIVE_PALETTE.blue.dark.text, 0.3) : M3_EXPRESSIVE_PALETTE.emerald.light.container,
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.01)",
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: M3_EXPRESSIVE_PALETTE.blue.dark.bg }} />
                  <Typography
                    sx={{
                      fontSize: "0.76rem",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: isDark ? M3_EXPRESSIVE_PALETTE.blue.dark.bg : M3_EXPRESSIVE_PALETTE.emerald.light.onContainer,
                    }}
                  >
                    THE DIFFERENCE
                  </Typography>
                </Box>

                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2.1rem", sm: "2.8rem", md: "3.2rem" },
                    lineHeight: 1.12,
                    fontWeight: 850,
                    letterSpacing: { xs: "-0.035em", md: "-0.045em" },
                    color: '#c2ddff',
                    mb: 2.2,
                  }}
                >
                  What sets BunkMates{" "}
                  <Box
                    component="span"
                    sx={{
                      color: isDark ? '#5d7088' : M3_EXPRESSIVE_PALETTE.emerald.light.onContainer,
                    }}
                  >
                    apart.
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 460,
                    fontSize: { xs: "0.92rem", md: "1rem" },
                    lineHeight: 1.7,
                    color: colors.secondaryText,
                  }}
                >
                  A purpose-built ecosystem crafted to make group coordination intuitive, lightweight, and cohesive through every stop of the journey.
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}