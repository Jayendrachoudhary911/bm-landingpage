import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import TerrainRoundedIcon from "@mui/icons-material/TerrainRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import HikingRoundedIcon from "@mui/icons-material/HikingRounded";
import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../context/ThemeContext";

const ROTATING_PHRASES = [
  {
    text: "Trip Coordination",
    accent: "#88b7f0",
    btnBg: "#88b7f0",
    btnText: "#002047",
    btnHover: "#a9cbfa",
    bgDark: "#1a2c47",
    bgLight: "#dbe8fc",
    textColorDark: "#d7e8ff",
    textColorLight: "#002c60",
    borderDark: "#3b6998",
    borderLight: "#88b7f0",
  },
  {
    text: "Group Budgets",
    accent: "#8cefcb",
    btnBg: "#8cefcb",
    btnText: "#00381e",
    btnHover: "#aff6dc",
    bgDark: "#193c32",
    bgLight: "#d8faeb",
    textColorDark: "#c7ffeb",
    textColorLight: "#004720",
    borderDark: "#2d7a5b",
    borderLight: "#8cefcb",
  },
  {
    text: "Live Itineraries",
    accent: "#c8b6ff",
    btnBg: "#c8b6ff",
    btnText: "#2a0d5c",
    btnHover: "#ded2ff",
    bgDark: "#31234f",
    bgLight: "#eee8ff",
    textColorDark: "#ece4ff",
    textColorLight: "#3c1d71",
    borderDark: "#68499e",
    borderLight: "#c8b6ff",
  },
  {
    text: "Fair Contrii Splits",
    accent: "#ffd6b4",
    btnBg: "#ffd6b4",
    btnText: "#471800",
    btnHover: "#ffe4cf",
    bgDark: "#442a1b",
    bgLight: "#ffece0",
    textColorDark: "#ffe7d6",
    textColorLight: "#5a2100",
    borderDark: "#94532b",
    borderLight: "#ffd6b4",
  },
  {
    text: "Squad Adventures",
    accent: "#f5d397",
    btnBg: "#f5d397",
    btnText: "#382900",
    btnHover: "#fae2b8",
    bgDark: "#3f3319",
    bgLight: "#fef0d5",
    textColorDark: "#ffe9c4",
    textColorLight: "#423100",
    borderDark: "#856a29",
    borderLight: "#f5d397",
  },
];

const PALETTE_COLORS = ["#88b7f0", "#8cefcb", "#f5d397", "#ffd6b4", "#c8b6ff"];

const RAW_DOODLE_ICONS = [
  { Icon: TerrainRoundedIcon, top: "8%", left: "6%", size: 34, rotate: -12, floatDur: 6.5 },
  { Icon: FlightTakeoffRoundedIcon, top: "10%", right: "7%", size: 28, rotate: 18, floatDur: 6 },
  { Icon: LocationOnRoundedIcon, top: "28%", left: "7%", size: 30, rotate: 8, floatDur: 7.2 },
  { Icon: LuggageRoundedIcon, top: "30%", right: "9%", size: 32, rotate: -14, floatDur: 8 },
  { Icon: MapRoundedIcon, top: "68%", left: "7%", size: 28, rotate: 15, floatDur: 7.5 },
  { Icon: CameraAltRoundedIcon, top: "72%", right: "8%", size: 26, rotate: -10, floatDur: 8.5 },
  { Icon: WbSunnyRoundedIcon, top: "84%", left: "18%", size: 28, rotate: 12, floatDur: 6.8 },
  { Icon: DirectionsCarRoundedIcon, top: "82%", right: "18%", size: 30, rotate: -8, floatDur: 8 },
  { Icon: HikingRoundedIcon, top: "18%", left: "22%", size: 28, rotate: 10, floatDur: 7 },
  { Icon: ExploreRoundedIcon, top: "20%", right: "22%", size: 30, rotate: -16, floatDur: 6.6 },
];

export default function AboutHero() {
  const muiTheme = useTheme();
  const { isDark } = useCustomTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const activePhrase = ROTATING_PHRASES[phraseIndex];

  const assignedDoodles = useMemo(() => {
    return RAW_DOODLE_ICONS.map((doodle, idx) => ({
      ...doodle,
      color: PALETTE_COLORS[idx % PALETTE_COLORS.length],
    }));
  }, []);

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 4, sm: 6, md: 8 },
        pb: { xs: 3, sm: 4, md: 5 },
      }}
    >
      {/* Floating Travel Doodles & Glyphs */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            top: "15%",
            right: "32%",
            fontSize: "1.4rem",
            fontWeight: 900,
            color: "#ffd6b4",
            opacity: isDark ? 0.35 : 0.45,
            userSelect: "none",
          }}
        >
          ✦
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: "16%",
            left: "30%",
            fontSize: "1.6rem",
            fontWeight: 900,
            color: "#8cefcb",
            opacity: isDark ? 0.3 : 0.4,
            userSelect: "none",
          }}
        >
          ▲
        </Typography>

        {assignedDoodles.map((doodle, i) => {
          const DoodleIconComponent = doodle.Icon;
          return (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                rotate: [doodle.rotate, doodle.rotate + 6, doodle.rotate],
              }}
              transition={{
                duration: doodle.floatDur,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                top: doodle.top,
                left: doodle.left,
                right: doodle.right,
              }}
            >
              <DoodleIconComponent
                sx={{
                  fontSize: { xs: doodle.size * 0.75, md: doodle.size },
                  color: doodle.color,
                  opacity: isDark ? 0.22 : 0.28,
                }}
              />
            </motion.div>
          );
        })}
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, px: { xs: 1.5, sm: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.9,
              px: { xs: 1.8, sm: 2.4 },
              py: 0.75,
              borderRadius: "999px",
              fontSize: { xs: "0.76rem", sm: "0.84rem" },
              fontWeight: 750,
              color: isDark ? "#ffffff" : "#09090b",
              backgroundColor: isDark ? activePhrase.accent+"15" : "#f1f4f7",
              backdropFilter: 'blur(10px)',
              boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.01)",
              mb: { xs: 2.2, sm: 3 },
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 15, color: activePhrase.accent }} />
            <span>ABOUT THE PLATFORM</span>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        >
          <Typography
            component="h1"
            fontWeight={850}
            sx={{
              fontSize: { xs: "1.95rem", sm: "2.85rem", md: "3.5rem" },
              lineHeight: { xs: 1.25, sm: 1.18 },
              letterSpacing: { xs: "-0.035em", sm: "-0.045em" },
              color: isDark ? "#ffffff" : "#09090b",
              mb: 2.5,
            }}
          >
            Built to revolutionize{" "}
            <Box
              component="span"
              sx={{
                display: { xs: "block", sm: "inline-flex" },
                position: "relative",
                verticalAlign: "middle",
                mt: { xs: 0.8, sm: 0 },
                minWidth: { xs: 220, sm: 260, md: 300 },
                height: { xs: 42, sm: 50, md: 56 },
                overflow: "hidden",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ y: 26, opacity: 0, scale: 0.94 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -26, opacity: 0, scale: 0.94 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 26,
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    padding: "4px 16px",
                    borderRadius: "20px",
                    backgroundColor: isDark ? activePhrase.bgDark : activePhrase.bgLight,
                    color: isDark ? activePhrase.textColorDark : activePhrase.textColorLight,
                    whiteSpace: "nowrap",
                  }}
                >
                  {activePhrase.text}
                </motion.span>
              </AnimatePresence>
            </Box>
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <Typography
            variant="body1"
            sx={{
              maxWidth: 640,
              mx: "auto",
              mb: { xs: 3.5, sm: 4.5 },
              color: isDark ? "#a1a1aa" : "#52525b",
              fontSize: { xs: "0.92rem", sm: "1.05rem" },
              lineHeight: 1.7,
            }}
          >
            Discover our mission, our tools, and the dedication behind making group travel simpler, smarter, and seamlessly connected for squads across the globe.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.6, ease: "easeOut" }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
            alignItems="center"
            sx={{
              width: "100%",
              maxWidth: { xs: 280, sm: 420 },
              mx: "auto",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/bm-install")}
              startIcon={<DownloadRoundedIcon sx={{ fontSize: "1.15rem !important" }} />}
              sx={{
                py: 1.25,
                px: 3,
                borderRadius: 1.15,
                fontWeight: 800,
                fontSize: "0.92rem",
                textTransform: "none",
                backgroundColor: activePhrase.btnBg,
                color: activePhrase.btnText,
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: activePhrase.btnHover,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Download Now
            </Button>

            <Button
              variant="contained"
              fullWidth
              href="https://bunk-mates.vercel.app/waitlist"
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "1rem !important" }} />}
              sx={{
                py: 1.25,
                px: 2.8,
                borderRadius: 1.15,
                fontWeight: 650,
                fontSize: "0.92rem",
                textTransform: "none",
                backdropFilter: 'blur(10px)',
                color: isDark ? "#ffffff" : "#09090b",
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#f8fafc",
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f1f5f9",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.25)" : "#9ca3af",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Beta Access
            </Button>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}