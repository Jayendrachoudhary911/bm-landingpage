import React, { useRef } from "react";
import { Box, Typography, Container, Paper, Stack, alpha } from "@mui/material";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useCustomTheme } from "../context/ThemeContext";

const M3_EXPRESSIVE_PALETTE = {
  blue: {
    accent: "#e2f0ff",
    light: { bg: "#D7E3FF", text: "#001B3F", container: "#EEF2FF", onContainer: "#004785" },
    dark: { bg: "#d3e7ff", text: "#203362", container: "#e2f0ff", onContainer: "#457ed8" },
  },
  emerald: {
    accent: "#dbffeb",
    light: { bg: "#A6F5BA", text: "#00210E", container: "#DBFCE3", onContainer: "#006D37" },
    dark: { bg: "#c6ffe0", text: "#21542e", container: "#f1fff7", onContainer: "#17c14d" },
  },
  purple: {
    accent: "#ffe2d7",
    light: { bg: "#EBDCFF", text: "#25005A", container: "#F6EEFF", onContainer: "#6940A5" },
    dark: { bg: "#ffdac5", text: "#703e26", container: "#ffeae2", onContainer: "#fb712c" },
  },
};

export default function OurMissionSection() {
  const { isDark } = useCustomTheme();
  const sectionRef = useRef(null);

  // Track scroll progress across the container
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Responsive spring with lower damping for snappier mobile & desktop responsiveness
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 18,
    mass: 0.6,
    restDelta: 0.001,
  });

  // High-sensitivity displacement: Left column rises significantly while Right column glides down
  const leftParallaxY = useTransform(smoothProgress, [0, 1], [140, -140]);
  const rightParallaxY = useTransform(smoothProgress, [0, 1], [-100, 160]);

  const colors = {
    background: isDark ? "#000000" : "#f1f3f5",
    surface: isDark ? "#0d0e12" : "#ffffff",
    text: isDark ? "#ffffff" : "#09090b",
    secondaryText: isDark ? "#a1a1aa" : "#64748b",
    border: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
  };

  const missions = [
    {
      title: "Empower Every Traveller",
      description:
        "Every traveler deserves the freedom to plan journeys with total ease. BunkMates gives you flexibility and control when designing group trips, keeping details organized and stress-free.",
      icon: "🧭",
      palette: M3_EXPRESSIVE_PALETTE.blue,
      rotateZ: -4,
      rotateX: 6,
      rotateY: -4,
    },
    {
      title: "Connect Like-Minded Explorers",
      description:
        "The best journeys are the ones shared. BunkMates connects squads through every phase of the trip—from itineraries and chats to shared budgets and live coordination.",
      icon: "🤝",
      palette: M3_EXPRESSIVE_PALETTE.emerald,
      rotateZ: 3.5,
      rotateX: -4,
      rotateY: 5,
    },
    {
      title: "Simplify Every Journey",
      description:
        "Eliminate fragmented apps and disjointed group messages. BunkMates integrates offline storage, fair cost splitting, and real-time alerts into a cohesive flow.",
      icon: "✨",
      palette: M3_EXPRESSIVE_PALETTE.purple,
      rotateZ: -3.2,
      rotateX: 5,
      rotateY: -3,
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
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "4.8fr 7.2fr" },
            columnGap: { xs: 4, md: 8, lg: 10 },
            rowGap: { xs: 6, md: 8 },
            alignItems: "start",
          }}
        >
          {/* Left Column (Sticky Container with High-Sensitivity Upward Parallax) */}
          <Box
            sx={{
              position: { md: "sticky" },
              top: { md: 100 },
              zIndex: 2,
            }}
          >
            <motion.div
              style={{ y: leftParallaxY }}
              initial={{ opacity: 0, y: 20 }}
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
                    backgroundColor: isDark ? "#d99f171e" : M3_EXPRESSIVE_PALETTE.blue.light.container,
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.01)",
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: "#ffefbe" }} />
                  <Typography
                    sx={{
                      fontSize: "0.76rem",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: isDark ? "#ffefbe" : M3_EXPRESSIVE_PALETTE.blue.light.onContainer,
                    }}
                  >
                    OUR VALUES
                  </Typography>
                </Box>

                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2.1rem", sm: "2.8rem", md: "3.2rem" },
                    lineHeight: 1.12,
                    fontWeight: 850,
                    letterSpacing: { xs: "-0.035em", md: "-0.045em" },
                    color: "#ffefbe",
                    mb: 2.2,
                  }}
                >
                  Built to make travel{" "}
                  <Box
                    component="span"
                    sx={{
                      color: isDark ? "#625847" : M3_EXPRESSIVE_PALETTE.blue.light.onContainer,
                    }}
                  >
                    simpler, smarter, and shared.
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
                  Every adventure starts with an idea. We build tools that bring squads together, turning travel plans into effortless memories.
                </Typography>
              </Box>
            </motion.div>
          </Box>

          {/* Right Column (Stacked Cards with High-Sensitivity Downward Parallax & 3D Tilt) */}
          <motion.div
            style={{ y: rightParallaxY }}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 4, sm: 5 },
              perspective: 1200,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 4, sm: 5 },
                perspective: 1200,
              }}
            >
              {missions.map((item, idx) => {
                const cardColor = isDark ? item.palette.dark : item.palette.light;
                const cardBg = isDark ? cardColor.bg : cardColor.container;
                const cardTextColor = isDark ? cardColor.text : cardColor.onContainer;

                return (
                  <Box
                    key={idx}
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
                      delay: idx * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      scale: 1.035,
                      rotateZ: 0,
                      rotateX: 0,
                      rotateY: 0,
                      y: -6,
                      transition: { duration: 0.25, ease: "easeOut" },
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "center center",
                    }}
                    sx={{
                      width: "100%",
                      cursor: "pointer",
                      touchAction: "pan-y",
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 3, sm: 3.8 },
                        borderRadius: "26px",
                        width: "100%",
                        backgroundColor: cardBg,
                        position: "relative",
                        overflow: "hidden",
                        border: `1.5px solid ${alpha(item.palette.accent, isDark ? 0.3 : 0.4)}`,
                        boxShadow: isDark
                          ? `inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${alpha(item.palette.accent, 0.1)}`
                          : `inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 12px 32px rgba(0,0,0,0.06), 0 0 16px ${alpha(item.palette.accent, 0.08)}`,
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          borderColor: item.palette.accent,
                          boxShadow: isDark
                            ? `0 24px 50px rgba(0,0,0,0.65), 0 0 28px ${alpha(item.palette.accent, 0.25)}`
                            : `0 18px 45px rgba(0,0,0,0.12), 0 0 24px ${alpha(item.palette.accent, 0.2)}`,
                        },
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, position: "relative", zIndex: 1 }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            flexShrink: 0,
                            borderRadius: "15px",
                            backgroundColor: isDark ? alpha(item.palette.accent, 0.2) : "#ffffff",
                            color: cardTextColor,
                            border: `1.5px solid ${alpha(item.palette.accent, isDark ? 0.55 : 0.6)}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.45rem",
                          }}
                        >
                          {item.icon}
                        </Box>

                        <Typography
                          variant="h5"
                          sx={{
                            color: cardTextColor,
                            fontWeight: 850,
                            fontSize: { xs: "1.18rem", sm: "1.32rem" },
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark ? alpha(cardTextColor, 0.85) : alpha(cardTextColor, 0.85),
                          lineHeight: 1.75,
                          fontSize: "0.92rem",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Paper>
                  </Box>
                );
              })}
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}