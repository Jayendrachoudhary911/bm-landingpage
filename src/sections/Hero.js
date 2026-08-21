import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import GroupsIcon from "@mui/icons-material/Groups";
import PublicIcon from "@mui/icons-material/Public";
import BoltIcon from "@mui/icons-material/Bolt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import HikingRoundedIcon from "@mui/icons-material/HikingRounded";
import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";
import TerrainRoundedIcon from "@mui/icons-material/TerrainRounded";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";
import SouthEastRoundedIcon from "@mui/icons-material/SouthEastRounded";
import TurnRightRoundedIcon from "@mui/icons-material/TurnRightRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../context/ThemeContext";

// Dynamic rotating phrases with matched solid accent colors
const DIAL_PHRASES = [
  {
    text: "Memories",
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
    text: "Budgets",
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
    text: "Trails",
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
  {
    text: "Splits",
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
    text: "Plans",
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
];

// Palette colors distributed across doodles and glyphs
const PALETTE_COLORS = ["#88b7f0", "#8cefcb", "#f5d397", "#ffd6b4", "#c8b6ff"];

const RAW_DOODLE_ICONS = [
  { Icon: TerrainRoundedIcon, top: "7%", left: "5%", size: 36, rotate: -10, floatDur: 6.5 },
  { Icon: FlightTakeoffRoundedIcon, top: "8%", left: "32%", size: 28, rotate: -18, floatDur: 6 },
  { Icon: TurnRightRoundedIcon, top: "14%", left: "48%", size: 30, rotate: 35, floatDur: 7.2 },
  { Icon: LocationOnRoundedIcon, top: "9%", right: "12%", size: 32, rotate: -8, floatDur: 7 },
  { Icon: LandscapeRoundedIcon, top: "28%", left: "4%", size: 38, rotate: 12, floatDur: 8.5 },
  { Icon: SouthEastRoundedIcon, top: "34%", left: "26%", size: 28, rotate: -10, floatDur: 6 },
  { Icon: LuggageRoundedIcon, top: "48%", left: "6%", size: 32, rotate: 16, floatDur: 9 },
  { Icon: ExploreRoundedIcon, top: "32%", right: "6%", size: 34, rotate: -18, floatDur: 6.5 },
  { Icon: NavigationRoundedIcon, top: "44%", right: "22%", size: 26, rotate: 45, floatDur: 7.5 },
  { Icon: CameraAltRoundedIcon, top: "66%", left: "7%", size: 26, rotate: -10, floatDur: 8.5 },
  { Icon: WbSunnyRoundedIcon, top: "75%", left: "42%", size: 30, rotate: 15, floatDur: 7.5 },
  { Icon: TerrainRoundedIcon, top: "80%", right: "12%", size: 40, rotate: -6, floatDur: 8 },
  { Icon: DirectionsCarRoundedIcon, top: "84%", left: "18%", size: 30, rotate: -12, floatDur: 8 },
  { Icon: HikingRoundedIcon, top: "58%", right: "38%", size: 30, rotate: 8, floatDur: 7 },
  { Icon: LocalActivityRoundedIcon, top: "88%", left: "36%", size: 26, rotate: -22, floatDur: 9 },
  { Icon: MapRoundedIcon, top: "68%", right: "6%", size: 28, rotate: 14, floatDur: 8.2 },
];

export default function HeroSection() {
  const muiTheme = useTheme();
  const { isDark } = useCustomTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const [dialIndex, setDialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDialIndex((prev) => (prev + 1) % DIAL_PHRASES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const activePhrase = DIAL_PHRASES[dialIndex];

  // Assign fixed colors from the palette to doodles
  const assignedDoodles = useMemo(() => {
    return RAW_DOODLE_ICONS.map((doodle, idx) => ({
      ...doodle,
      color: PALETTE_COLORS[idx % PALETTE_COLORS.length],
    }));
  }, []);

  // Parallax Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const smoothY = useSpring(rawY, { stiffness: 90, damping: 25, mass: 0.8 });
  const smoothRotate = useSpring(rawRotate, { stiffness: 90, damping: 25, mass: 0.8 });

  const mobileRawY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const mobileRawRotateLeft = useTransform(scrollYProgress, [0, 1], [-10, 0]);
  const mobileRawRotateCenter = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const mobileRawRotateRight = useTransform(scrollYProgress, [0, 1], [10, 0]);

  const mobileSmoothY = useSpring(mobileRawY, { stiffness: 90, damping: 25, mass: 0.8 });
  const mobileRotateLeft = useSpring(mobileRawRotateLeft, { stiffness: 90, damping: 25, mass: 0.8 });
  const mobileRotateCenter = useSpring(mobileRawRotateCenter, { stiffness: 90, damping: 25, mass: 0.8 });
  const mobileRotateRight = useSpring(mobileRawRotateRight, { stiffness: 90, damping: 25, mass: 0.8 });

  const stats = [
    {
      icon: <GroupsIcon sx={{ fontSize: { xs: 15, sm: 18 }, color: "#88b7f0" }} />,
      value: "10k+",
      label: "Trips",
    },
    {
      icon: <StarIcon sx={{ fontSize: { xs: 15, sm: 18 }, color: "#f5d397" }} />,
      value: "4.9",
      label: "Rating",
    },
    {
      icon: <BoltIcon sx={{ fontSize: { xs: 15, sm: 18 }, color: "#8cefcb" }} />,
      value: "99.9%",
      label: "Sync",
    },
    {
      icon: <PublicIcon sx={{ fontSize: { xs: 15, sm: 18 }, color: "#ffd6b4" }} />,
      value: "50+",
      label: "Global",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2.5, md: 3 },
        backgroundColor: isDark ? "#000000" : "#f1f3f5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        id="hero"
        ref={heroRef}
        sx={{
          position: "relative",
          overflow: "hidden",
          mt: {xs: 6, md: 7},
          width: "100%",
          minHeight: "calc(90vh - 8px)",
          maxHeight: {xs: '100vh', md: "calc(90vh - 38px)"},
          borderRadius: { xs: "24px", sm: "32px", md: 3 },
          backgroundColor: isDark ? "#0c0c0c" : "#ffffff",
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), inset 0 -1px 1px rgba(255, 255, 255, 0.07), 0 1px 0px rgba(0,0,0,0.1)',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1.5, sm: 4, md: 6 },
          py: { xs: 7, sm: 9, md: 10 },
          color: isDark ? "#ffffff" : "#09090b",
        }}
      >
        {/* Static Curved Hand-Drawn Arrow SVG Indicator */}
        <Box
          component="svg"
          viewBox="0 0 120 70"
          sx={{
            position: "absolute",
            top: { xs: 65, md: 100 },
            left: { xs: "68%", md: "46%" },
            width: { xs: 48, sm: 75, md: 95 },
            height: "auto",
            pointerEvents: "none",
            zIndex: 3,
            display: { xs: "none", sm: "block" },
          }}
        >
          <path
            d="M 10,60 Q 55,-10 105,25"
            fill="none"
            stroke="#88b7f0"
            strokeWidth="2.5"
            strokeDasharray="4,4"
          />
          <polygon
            points="105,20 115,27 103,34"
            fill="#88b7f0"
          />
        </Box>

        {/* Meshed Floating Travel Doodles with Multi-Color Distribution */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          {/* Decorative Glyphs */}
          <Typography
            sx={{
              position: "absolute",
              top: "22%",
              right: "42%",
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
              bottom: "24%",
              left: "48%",
              fontSize: "1.6rem",
              fontWeight: 900,
              color: "#8cefcb",
              opacity: isDark ? 0.3 : 0.4,
              userSelect: "none",
            }}
          >
            ▲
          </Typography>
          <Typography
            sx={{
              position: "absolute",
              top: "48%",
              left: "14%",
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "#c8b6ff",
              opacity: isDark ? 0.3 : 0.4,
              userSelect: "none",
            }}
          >
            ↝
          </Typography>
          <Typography
            sx={{
              position: "absolute",
              bottom: "12%",
              right: "30%",
              fontSize: "1.8rem",
              fontWeight: 900,
              color: "#f5d397",
              opacity: isDark ? 0.3 : 0.4,
              userSelect: "none",
            }}
          >
            ⤹
          </Typography>

          {assignedDoodles.map((doodle, i) => {
            const DoodleIconComponent = doodle.Icon;
            return (
              <motion.div
                key={i}
                animate={{
                  y: [0, -12, 0],
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

        {/* Grid Texture */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: isDark
              ? `
                linear-gradient(to right, #1f1f1f4e 1px, transparent 1px),
                linear-gradient(to bottom, #1f1f1f4d 1px, transparent 1px)
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

        {/* Main Content Container */}
        <Container maxWidth={false} disableGutters sx={{ position: "relative", zIndex: 2, px: { xs: 0.5, md: 4, lg: 6 } }}>
          <Grid
            container
            spacing={{ xs: 4, md: 4 }}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Left Section: Badges, Headline with Single-Line Dial Pill, Subtitle & CTAs */}
            <Grid item xs={12} md={6} lg={6} sx={{ textAlign: { xs: "center", md: "left" }, zIndex: 3 }}>
              {/* Top Tagline Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: { xs: 1.6, sm: 2.4 },
                    py: 0.65,
                    borderRadius: "999px",
                    fontSize: { xs: "0.74rem", sm: "0.85rem" },
                    fontWeight: 750,
                    color: isDark ? "#ffffff" : "#09090b",
                    backgroundColor: isDark ? "#171a22" : "#f1f4f7",
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    mb: { xs: 1.8, sm: 2.5 },
                  }}
                >
                  <TerrainRoundedIcon sx={{ fontSize: 16, color: activePhrase.accent }} />
                  <span>Smart Group Travel, Simplified</span>
                </Box>
              </motion.div>

              {/* Strict Single-Line Responsive Headline on Mobile & Desktop */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              >
                <Typography
                  component="h1"
                  fontWeight={850}
                  noWrap
                  sx={{
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "flex-start" },
                    gap: { xs: 0.6, sm: 1, md: 1.2 },
                    whiteSpace: "nowrap",
                    color: isDark ? "#ffffff" : "#09090b",
                    letterSpacing: { xs: "-0.04em", sm: "-0.045em" },
                    fontSize: { xs: "1.18rem", sm: "2.15rem", md: "2.85rem", lg: "3.4rem" },
                    lineHeight: 1.15,
                  }}
                >
                  <span>Ditch chaos, keep</span>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      position: "relative",
                      verticalAlign: "middle",
                      minWidth: { xs: 88, sm: 150, md: 200, lg: 240 },
                      height: { xs: 30, sm: 46, md: 54, lg: 62 },
                      overflow: "hidden",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={dialIndex}
                        initial={{ y: 24, opacity: 0, scale: 0.92 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -24, opacity: 0, scale: 0.92 }}
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
                          padding: "2px 10px",
                          borderRadius: '20px',
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

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: 580,
                    mx: { xs: "auto", md: 0 },
                    mb: { xs: 2.5, sm: 3.5 },
                    color: isDark ? "#a1a1aa" : "#52525b",
                    fontSize: { xs: "0.85rem", sm: "1.02rem" },
                    lineHeight: 1.6,
                  }}
                >
                  One unified ecosystem to coordinate live itineraries, split group expenses in real time, 
                  and keep your entire travel squad synced effortlessly.
                </Typography>
              </motion.div>

              {/* Action CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.6, ease: "easeOut" }}
              >
                <Stack
                  direction="row"
                  spacing={{ xs: 1.2, sm: 2 }}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                  alignItems="center"
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: 440, md: 460 },
                    mx: { xs: "auto", md: 0 },
                    mb: { xs: 3, sm: 4 },
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/bm-install')}
                    sx={{
                      py: { xs: 1, sm: 1.3 },
                      px: { xs: 1.5, sm: 3 },
                      borderRadius: 1.15,
                      fontWeight: 800,
                      fontSize: { xs: "0.82rem", sm: "0.95rem" },
                      textTransform: "none",
                      backgroundColor: activePhrase.btnBg,
                      color: activePhrase.btnText,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.8,
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      transition: "background-color 0.35s ease, color 0.35s ease, transform 0.2s ease",
                      "&:hover": {
                        backgroundColor: activePhrase.btnHover,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <DownloadIcon sx={{ fontSize: { xs: 16, sm: 19 } }} />
                    Get App Free
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    href="https://bunk-mates.vercel.app/waitlist"
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: 15, sm: 18 } }} />}
                    sx={{
                      py: { xs: 1, sm: 1.3 },
                      px: { xs: 1.5, sm: 3 },
                      borderRadius: 1.15,
                      fontWeight: 650,
                      fontSize: { xs: "0.82rem", sm: "0.95rem" },
                      textTransform: "none",
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                      color: isDark ? "#ffffff" : "#09090b",
                            backdropFilter: 'blur(10px)',
                      backgroundColor: isDark ? "#ffffff10" : "#f8fafc",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        backgroundColor: isDark ? "#1d222e" : "#f1f5f9",
                        borderColor: isDark ? "#3f4556" : "#9ca3af",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Beta Access
                  </Button>
                </Stack>
              </motion.div>

              {/* Accent Stats Ticker */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.25,
                    },
                  },
                }}
              >
                <Grid
                  container
                  spacing={{ xs: 1, sm: 1.5 }}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                  alignItems="stretch"
                  wrap="nowrap"
                  sx={{
                    maxWidth: { xs: "100%", md: 540, lg: 580 },
                    mx: { xs: "auto", md: 0 },
                  }}
                >
                  {stats.map((item, idx) => (
                    <Grid item xs={3} key={idx} sx={{ minWidth: 0, display: "flex" }}>
                      <Box
                        component={motion.div}
                        variants={{
                          hidden: { opacity: 0, y: 18, scale: 0.95 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: { type: "spring", stiffness: 360, damping: 24 },
                          },
                        }}
                        whileHover={{
                          y: -4,
                          scale: 1.025,
                          transition: { duration: 0.2, ease: "easeOut" },
                        }}
                        whileTap={{ scale: 0.97 }}
                        sx={{
                          width: 105,
                          display: "flex",
                          flexDirection: "column",
                          cursor: "pointer",
                        }}
                      >
                        <Box
                          sx={{
                            p: { xs: 1, sm: 1.4 },
                            height: "100%",
                            borderRadius: 1.2,
                            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                            backgroundColor: isDark ? "#ffffff10" : "#f8fafc",
                            display: "flex",
                            backdropFilter: 'blur(10px)',
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: { xs: 0.4, sm: 0.6 },
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={{ xs: 0.5, sm: 0.8 }}
                            sx={{ width: "100%", minWidth: 0 }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {item.icon}
                            </Box>

                            <Typography
                              component="span"
                              fontWeight={800}
                              noWrap
                              sx={{
                                color: isDark ? "#ffffff" : "#09090b",
                                fontSize: { xs: "0.82rem", sm: "0.98rem", md: "1.05rem" },
                                letterSpacing: "-0.4px",
                                lineHeight: 1.2,
                              }}
                            >
                              {item.value}
                            </Typography>
                          </Stack>

                          <Typography
                            noWrap
                            sx={{
                              width: "100%",
                              fontWeight: 750,
                              fontSize: { xs: "0.58rem", sm: "0.7rem" },
                              letterSpacing: "0.2px",
                              lineHeight: 1.2,
                              color: isDark ? "#71717a" : "#64748b",
                              textTransform: "uppercase",
                              display: "block",
                            }}
                          >
                            {item.label}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>

            {/* Right Section: Mobile 3-Image Fan Straightening / Desktop Single Parallax */}
            <Grid item xs={12} md={6} lg={6}>
              <motion.div
                style={{
                  y: isMobile ? mobileSmoothY : smoothY,
                  transformOrigin: "center top",
                }}
              >
                {isMobile ? (
                  /* Mobile: 3 Overlapping Screenshots */
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "460px",
                      mx: "auto",
                      mt: 2,
                      mb: "-28vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: { xs: 0.5, sm: 1 },
                    }}
                  >
                    {/* Left Screen */}
                    <motion.div
                      style={{
                        rotate: mobileRotateLeft,
                        transformOrigin: "bottom center",
                        width: "43%",
                        display: "flex",
                        justifyContent: "center",
                        zIndex: 1,
                      }}
                    >
                      <Box
                        component="img"
                        src="/assets/BM-screenshots/17.png"
                        alt="BunkMates Screen Left"
                        sx={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "15px",
                          maxHeight: { xs: "380px", sm: "390px" },
                          objectFit: "contain",
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      />
                    </motion.div>

                    {/* Center Screen */}
                    <motion.div
                      style={{
                        rotate: mobileRotateCenter,
                        transformOrigin: "bottom center",
                        width: "56%",
                        display: "flex",
                        justifyContent: "center",
                        zIndex: 3,
                      }}
                    >
                      <Box
                        component="img"
                        src="/assets/BM-screenshots/1.png"
                        alt="BunkMates Screen Center"
                        sx={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "15px",
                          maxHeight: { xs: "510px", sm: "570px" },
                          objectFit: "contain",
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      />
                    </motion.div>

                    {/* Right Screen */}
                    <motion.div
                      style={{
                        rotate: mobileRotateRight,
                        transformOrigin: "bottom center",
                        width: "43%",
                        display: "flex",
                        justifyContent: "center",
                        zIndex: 1,
                      }}
                    >
                      <Box
                        component="img"
                        src="/assets/BM-screenshots/2.png"
                        alt="BunkMates Screen Right"
                        sx={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "15px",
                          maxHeight: { xs: "380px", sm: "390px" },
                          objectFit: "contain",
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      />
                    </motion.div>
                  </Box>
                ) : (
                  /* Desktop: Single Parallax Straightening Screenshot */
                  <motion.div
                    style={{
                      rotate: smoothRotate,
                      transformOrigin: "center top",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: { md: "88vh", lg: "96vh" },
                        maxHeight: "850px",
                        marginBottom: { md: "-10vh", lg: "-15vh" },
                        mx: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        backgroundColor: isDark ? "#12151d" : "#f1f4f8",
                        border: `1px solid ${isDark ? "#202532" : "#e2e8f0"}`,
                        p: 1.5,
                        borderRadius: "24px",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src="/assets/BM-screenshots/1.png"
                        alt="BunkMates App Preview"
                        sx={{
                          width: "170%",
                          maxWidth: { md: "660px", lg: "880px" },
                          height: "120%",
                          borderRadius: "18px",
                          objectFit: "contain",
                          objectPosition: "center top",
                          display: "block",
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      />
                    </Box>
                  </motion.div>
                )}
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}