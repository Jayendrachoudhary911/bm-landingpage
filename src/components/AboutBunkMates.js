import { Box, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const AboutBunkMate = () => (
  <Box
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.4 }}
    variants={fadeInUp}
    whileHover={{ scale: 1.01 }}
    sx={{
      px: { xs: 2, sm: 4 },
      py: { xs: 6, sm: 10 },
      borderRadius: "16px",
      boxShadow: "none",
      mx: "auto",
      my: 4,
      maxWidth: "1000px",
      backgroundColor: "#000",
      color: "#fff",
    }}
  >
    <Stack spacing={4} alignItems="center" textAlign="center">
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          background: "linear-gradient(to right, #ffffffff, #6e6e6eff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        What is BunkMate?
      </Typography>

      <Typography
        variant="body1"
        color="#9a9a9a"
        maxWidth="700px"
        component={motion.p}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        BunkMate is a modern trip collaboration platform for friends and travel enthusiasts.
        Whether it's budgeting, checklists, or shared memories — we simplify it all into one
        powerful experience. Designed with travelers in mind, BunkMate fosters planning, bonding,
        and coordination like never before.
      </Typography>
    </Stack>
  </Box>
);

export default AboutBunkMate;
