import React from "react";
import { Box, Typography, Stack, Container, alpha } from "@mui/material";
import { motion } from "framer-motion";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useCustomTheme } from "../context/ThemeContext";

const highlights = [
  { label: "Coordinated Stops", desc: "Interactive shared itinerary", color: "#88b7f0" },
  { label: "Fair Splits", desc: "Automated group expense tracking", color: "#8cefcb" },
  { label: "Vault Offline", desc: "Documents & offline map pins", color: "#ffd6b4" },
];

export default function AboutBunkMate() {
  const { isDark } = useCustomTheme();

  return (
    <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 3 }, mb: 4, position: "relative", zIndex: 2 }}>
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
          p: { xs: 3, sm: 4.5 },
          borderRadius: { xs: "22px", sm: "28px" },
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.6)",
          boxShadow: isDark
            ? "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 12px 32px rgba(0, 0, 0, 0.4)"
            : "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 8px 24px rgba(0, 0, 0, 0.04)",
          textAlign: "center",
        }}
      >
        {/* Radial Ambient Glow */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(140, 239, 203, 0.15) 0%, transparent 70%)",
            filter: "blur(30px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Main Content */}
        <Stack spacing={2} alignItems="center" sx={{ width: "100%", position: "relative", zIndex: 1 }}>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 850,
              letterSpacing: "-0.03em",
              color: isDark ? "#ffffff" : "#09090b",
              fontSize: { xs: "1.45rem", sm: "1.85rem" },
            }}
          >
            What is BunkMates?
          </Typography>

          <Typography
            sx={{
              color: isDark ? "#a1a1aa" : "#52525b",
              maxWidth: "640px",
              fontSize: { xs: "0.9rem", sm: "0.98rem" },
              lineHeight: 1.75,
            }}
          >
            BunkMates is a collaborative trip platform designed for friends and travel crews. Whether it is budgeting, offline packing lists, or shared memories—we unify the experience into one cohesive space designed to eliminate travel friction.
          </Typography>

          {/* Highlights 3-Column Strip */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              gap: 1.5,
              width: "100%",
              pt: 1,
            }}
          >
            {highlights.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 1.6,
                  borderRadius: "16px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.8)",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)"}`,
                  boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.08)",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.86rem",
                    fontWeight: 750,
                    color: isDark ? "#ffffff" : "#09090b",
                    mb: 0.3,
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.74rem",
                    color: isDark ? "#8b8b8b" : "#64748b",
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
}