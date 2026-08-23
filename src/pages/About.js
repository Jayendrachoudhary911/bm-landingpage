import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import AboutHero from "../components/AboutHero";
import AboutBunkMate from "../components/AboutBunkMates";
import ContactSection from "../components/ContactSection";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../context/ThemeContext";
import OurMissionSection from "../components/omp";
import WhatMakesDifferent from "../components/wmbmd";
import FAQSection from "../sections/FAQSection";

export default function About() {
  const { user } = useAuth();
  const { isDark } = useCustomTheme();

  useEffect(() => {
    const section = document.getElementById("about-start");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: isDark ? "#000000" : "#f1f3f5",
        color: isDark ? "#ffffff" : "#09090b",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowX: "hidden",
        transition: "background-color 0.35s ease, color 0.35s ease",
      }}
    >

      <Box
        component={motion.div}
        id="about-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          position: "relative",
          zIndex: 1,
          pt: { xs: 1.5, sm: 2.5, md: 3 },
          px: { xs: 1.5, sm: 2.5, md: 3 },
        }}
      >
        {/* Main Hero Card Container */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
            minHeight: "calc(90vh - 8px)",
            maxHeight: {xs: '110vh', md: "calc(90vh - 38px)"},
            mt: {xs: 6, md: 7},
            borderRadius: { xs: "24px", sm: "32px", md: "40px" },
            backgroundColor: isDark ? "#0c0c0c" : "#ffffff",
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), inset 0 -1px 1px rgba(255, 255, 255, 0.07), 0 1px 0px rgba(0,0,0,0.1)',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 8, md: 10 },
            pb: { xs: 4, md: 6 },
            color: isDark ? "#ffffff" : "#09090b",
          }}
        >
          {/* Background Grid Pattern */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: isDark
                ? `
                  linear-gradient(to right, #1f1f1f4e 1px, transparent 1px),
                  linear-gradient(to bottom, #1f1f1f4e 1px, transparent 1px)
                `
                : `
                  linear-gradient(to right, #edf0f2 1px, transparent 1px),
                  linear-gradient(to bottom, #edf0f2 1px, transparent 1px)
                `,
              backgroundSize: "55px 55px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

        <Typography
          sx={{
            position: "absolute",
            right: { xs: -10, sm: 10 },
            bottom: -25,
            fontSize: { xs: "5rem", sm: "7rem" },
            fontWeight: 900,
            letterSpacing: "-0.08em",
            color: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(0, 0, 0, 0.025)",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        >
          BUNKMATE
        </Typography>

          {/* Foreground Hero & About Sub-Hero */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <AboutHero />
            <AboutBunkMate />
          </Box>
        </Box>

        {/* Following Page Flow */}
        <OurMissionSection />
        <WhatMakesDifferent />
        <FAQSection />
        <ContactSection />
      </Box>
    </Box>
  );
}