import React, { useEffect } from "react";
import AboutHero from "../components/AboutHero";
import AboutBunkMate from "../components/AboutBunkMates";
import TeamSection from "../components/TeamSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import ScrollToSection from "../components/ScrollToSection";
import { useAuth } from '../context/AuthContext';
import Navbar from "../components/Navbar";
import OurMissionSection from "../components/omp";
import WhatMakesDifferent from "../components/wmbmd";
import FAQSection from "../sections/FAQSection";

const About = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    const section = document.getElementById("about-start");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <Box
      sx={{ 
        backgroundColor: "#000000ff",
        color: "#e2e8f0",
        minHeight: "100vh"
      }}
    >
        <Navbar user={user} />
        <ScrollToSection />
        <motion.div 
          id="about-start" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #211300a1, #40240062, #8f510022, #000, #00219922, #000a2d96, #00061d96)",
              borderBottomLeftRadius: "40px",
              borderBottomRightRadius: "40px",
              pb: 6,
            }}
          >
          <AboutHero />
          <AboutBunkMate />
          </Box>
          <OurMissionSection />
          <WhatMakesDifferent />
          <FAQSection />
          <ContactSection />
          <Footer />
        </motion.div>
    </Box>
  );
};

export default About;
