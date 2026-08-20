import React, { useState, useEffect } from "react";
import { Box, Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { useCustomTheme } from "../context/ThemeContext";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
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
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollPercentage(progress);
      setVisible(scrollTop > 280);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercentage / 100) * circumference;

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
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: colors.surfaceStrong,
                border: `1px solid ${colors.border}`,
                boxShadow: isDark
                  ? "0 10px 30px rgba(0, 0, 0, 0.45)"
                  : "0 8px 24px rgba(0, 0, 0, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                p: 0,
                color: colors.text,
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.18)",
                },
              }}
            >
              <svg
                width="44"
                height="44"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "rotate(-90deg)",
                }}
              >
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  stroke={colors.subtleBorder}
                  strokeWidth="2"
                  fill="transparent"
                />
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  stroke={colors.text}
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-dashoffset 0.1s linear",
                  }}
                />
              </svg>

              <KeyboardArrowUpRoundedIcon sx={{ fontSize: 22, zIndex: 1 }} />
            </Box>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}