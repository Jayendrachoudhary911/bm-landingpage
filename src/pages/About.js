import React, { useEffect } from "react";
import AboutHero from "../components/AboutHero";
import AboutBunkMates from "../components/AboutBunkMates";
import TeamSection from "../components/TeamSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import ScrollToSection from "../components/ScrollToSection";
import { useAuth } from '../context/AuthContext';
import Navbar from "../components/Navbar";

const About = () => {
  const { user } = useAuth();
  useEffect(() => {
    const section = document.getElementById("about-start");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", overflowX: "hidden" }}>
      <Navbar user={user} />
      <ScrollToSection />
      <motion.div id="about-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <AboutHero />
        <AboutBunkMates />
        <TeamSection />
        <ContactSection />
        <Footer />
      </motion.div>
    </Box>
  );
};

export default About;
