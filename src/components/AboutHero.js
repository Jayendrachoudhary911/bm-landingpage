import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useCustomTheme } from "../context/ThemeContext";

const AboutHero = () => {
  const { isDark } = useCustomTheme();

  const colors = {
    background: isDark ? "#00000000" : "#ffffff",
    text: isDark ? "#ffffff" : "#111111",
    secondaryText: isDark ? "#a3a3a3" : "#737373",
    border: isDark
      ? "rgba(255, 255, 255, 0.09)"
      : "rgba(0, 0, 0, 0.08)",
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: "55vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
        color: colors.text,
        pt: { xs: 12, md: 16 },
        pb: { xs: 8, md: 10 },
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        transition: "background-color 0.35s ease, color 0.35s ease",
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2.5, sm: 4 } }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
              ABOUT THE PLATFORM
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.4rem", sm: "3.2rem", md: "3.8rem" },
              lineHeight: 1.05,
              letterSpacing: { xs: "-0.045em", md: "-0.06em" },
              fontWeight: 850,
              color: colors.text,
              mb: 2.5,
            }}
          >
            Get to Know BunkMates
          </Typography>

          <Typography
            sx={{
              maxWidth: 640,
              mx: "auto",
              mb: 4,
              color: colors.secondaryText,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              lineHeight: 1.75,
            }}
          >
            Discover our mission, our tools, and the dedication behind making group travel simpler, smarter, and seamlessly connected.
          </Typography>

          <Button
            component={motion.button}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="/bm-install"
            startIcon={<DownloadRoundedIcon sx={{ fontSize: "1.15rem !important" }} />}
            sx={{
              minHeight: 48,
              px: 3.5,
              borderRadius: "16px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
              backgroundColor: colors.text,
              color: '#000000',
              boxShadow: isDark
                ? "0 12px 30px rgba(0, 0, 0, 0.35)"
                : "0 10px 25px rgba(0, 0, 0, 0.12)",
              "&:hover": {
                backgroundColor: isDark ? "#e8e8e8" : "#242424",
              },
            }}
          >
            Download Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutHero;