import React, { useState, useEffect } from "react";
import { Box, Tooltip, alpha } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { useCustomTheme } from "../context/ThemeContext";

const M3_EXPRESSIVE_PALETTE = {
  emerald: {
    accent: "#8cefcb",
    light: { bg: "#A6F5BA", text: "#00210E", container: "#DBFCE3", onContainer: "#006D37" },
    dark: { bg: "#b6ffd7", text: "#21542e", container: "#e4fff0", onContainer: "#17c14d" },
  },
};

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { isDark } = useCustomTheme();

  const emeraldTheme = M3_EXPRESSIVE_PALETTE.emerald;

  const colors = {
    background: isDark ? "#121216" : "#ffffff",
    surface: isDark ? "#18181d" : "#f8fafc",
    text: isDark ? "#fafafa" : "#09090b",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
    track: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      setVisible(scrollTop > 280);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 999,
          }}
        >
          <Tooltip title="Scroll to top" placement="left" arrow>
            <Box
              onClick={scrollToTop}
              component={motion.button}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92 }}
              sx={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                backgroundColor: isDark ? "rgba(18, 18, 22, 0.85)" : "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `0px solid ${colors.border}`,
                boxShadow: isDark
                  ? "inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 12px 30px rgba(0, 0, 0, 0.5)"
                  : "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 8px 24px rgba(0, 0, 0, 0.08)",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                position: "relative",
                p: 0,
                color: isDark ? "#ffffff" : "#09090b",
                outline: "none",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  borderColor: alpha(emeraldTheme.accent, 0.6),
                  color: isDark ? emeraldTheme.accent : emeraldTheme.light.onContainer,
                  boxShadow: `0 8px 24px ${alpha(emeraldTheme.accent, 0.25)}`,
                },
              }}
            >
              <KeyboardArrowUpRoundedIcon
                sx={{
                  fontSize: 22,
                  zIndex: 1,
                  transition: "transform 0.2s ease",
                  ".MuiBox-root:hover &": {
                    transform: "translateY(-1px)",
                  },
                }}
              />
            </Box>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}