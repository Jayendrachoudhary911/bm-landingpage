import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import AboutHero from "../components/AboutHero";
import AboutBunkMate from "../components/AboutBunkMates";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import ScrollToSection from "../components/ScrollToSection";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import OurMissionSection from "../components/omp";
import WhatMakesDifferent from "../components/wmbmd";
import FAQSection from "../sections/FAQSection";

const About = () => {
  const { user } = useAuth();
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

  useEffect(() => {
    const section = document.getElementById("about-start");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowX: "hidden",
        transition: "background-color 0.35s ease, color 0.35s ease",
      }}
    >
      <Navbar user={user} />
      <ScrollToSection />

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
        }}
      >
        {/* Header Hero Container with Hero Section Background Style */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            backgroundColor: "#000000",
            background: isDark
              ? `
                radial-gradient(ellipse at 0% 0%, rgba(0, 0, 0, 0.96) 0%, rgba(0, 0, 0, 0.98) 55%, rgba(0, 167, 204, 0.3) 88%, rgba(0, 92, 110, 0.6) 100%),
                #000000
              `
              : `
                radial-gradient(ellipse at 20% 20%, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.98) 55%, rgba(14, 165, 233, 0.45) 88%, rgba(56, 189, 248, 0.8) 100%),
                #0f172a
              `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            pt: { xs: 14, md: 18 },
            pb: { xs: 6, md: 8 },
            px: { xs: 1.5, sm: 3, md: 6 },
            color: "#ffffff",
            borderBottom: `1px solid ${colors.subtleBorder}`,
            transition: "background 0.5s ease",
          }}
        >
          {/* Intense Cyan Edge Glow */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 80px 10px rgba(0, 84, 110, 0.4)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Grid Texture */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(to right, rgba(0, 48, 58, 0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 48, 58, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Foreground Hero & About Content */}
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

        {/* Section Flow */}
        <OurMissionSection />
        <WhatMakesDifferent />
        <FAQSection />
        <ContactSection />
        <Footer />
      </Box>
    </Box>
  );
};

export default About;