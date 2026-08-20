import React from "react";
import { Box, Typography, Stack, Container } from "@mui/material";
import { motion } from "framer-motion";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useCustomTheme } from "../context/ThemeContext";

const AboutBunkMate = () => {
  const { isDark } = useCustomTheme();

  const colors = {
    surfaceStrong: isDark ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.88)",
    text: isDark ? "#ffffff" : "#0f172a",
    secondaryText: isDark ? "#bababa" : "#64748b",
    border: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(2, 132, 199, 0.16)",
    subtleBorder: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)",
  };

  const highlights = [
    { label: "Coordinated Stops", desc: "Interactive shared itinerary" },
    { label: "Fair Splits", desc: "Automated group expense tracking" },
    { label: "Vault Offline", desc: "Documents & offline map pins" },
  ];

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 }, mb: 4, position: "relative", zIndex: 2 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 3, sm: 5 },
          borderRadius: { xs: "28px", sm: "32px" },
          backgroundColor: '#ffffff05',
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0, 0, 0, 0.01)',
          textAlign: "center",
        }}
      >
        {/* Radial Glow Mask in Background */}
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(204, 204, 204, 0.18) 0%, transparent 70%)",
            filter: "blur(30px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Ambient Grid Pattern Mask */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: isDark
              ? "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)"
              : "linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Decorative Watermark Mask */}
        <Typography
          sx={{
            position: "absolute",
            right: { xs: -10, sm: 10 },
            bottom: -35,
            fontSize: { xs: "6rem", sm: "8rem" },
            fontWeight: 900,
            letterSpacing: "-0.08em",
            color: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        >
          BUNKMATE
        </Typography>

        {/* Main Content */}
        <Stack spacing={2.5} alignItems="center" sx={{ width: "100%", position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              px: 1.4,
              py: 0.6,
              borderRadius: "999px",
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(2, 132, 199, 0.06)",
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: isDark ? "#ffffff" : "#0284c7" }} />
            <Typography
              sx={{
                fontSize: "0.74rem",
                fontWeight: 750,
                letterSpacing: "0.02em",
                color: isDark ? "#ffffff" : "#0369a1",
                textTransform: "uppercase",
              }}
            >
              The Squad Hub
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 850,
              letterSpacing: "-0.04em",
              color: colors.text,
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            What is BunkMates?
          </Typography>

          <Typography
            sx={{
              color: colors.secondaryText,
              maxWidth: "680px",
              fontSize: { xs: "0.92rem", sm: "1rem" },
              lineHeight: 1.8,
            }}
          >
            BunkMates is a collaborative trip platform designed for friends and travel crews[cite: 14]. Whether it is budgeting, offline packing lists, or shared memories—we unify the experience into one cohesive space designed to eliminate travel friction[cite: 14].
          </Typography>

          {/* Feature Highlights Strip */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1.5,
              width: "100%",
              pt: 1.5,
            }}
          >
            {highlights.map((item, index) => (
              <Box
                key={index}
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 calc(33.333% - 12px)" },
                  maxWidth: { sm: "220px" },
                  p: 1.8,
                  borderRadius: "18px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.7)",
                  border: `1px solid ${colors.subtleBorder}`,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 750,
                    color: colors.text,
                    mb: 0.3,
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: colors.secondaryText,
                    lineHeight: 1.4,
                  }}
                >
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default AboutBunkMate;