import React, { useRef } from "react";
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
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import GroupsIcon from "@mui/icons-material/Groups";
import PublicIcon from "@mui/icons-material/Public";
import BoltIcon from "@mui/icons-material/Bolt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../context/ThemeContext";

export default function HeroSection() {
  const muiTheme = useTheme();
  const { isDark } = useCustomTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Parallax Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Desktop single image parallax transform
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [8, 0]);

  const smoothY = useSpring(rawY, { stiffness: 90, damping: 25, mass: 0.8 });
  const smoothRotate = useSpring(rawRotate, { stiffness: 90, damping: 25, mass: 0.8 });

  // Mobile 3 images parallax transform: fan-out tilts straighten toward 0deg on scroll
  const mobileRawY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const mobileRawRotateLeft = useTransform(scrollYProgress, [0, 1], [-10, 0]);
  const mobileRawRotateCenter = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const mobileRawRotateRight = useTransform(scrollYProgress, [0, 1], [10, 0]);

  const mobileSmoothY = useSpring(mobileRawY, { stiffness: 90, damping: 25, mass: 0.8 });
  const mobileRotateLeft = useSpring(mobileRawRotateLeft, { stiffness: 90, damping: 25, mass: 0.8 });
  const mobileRotateCenter = useSpring(mobileRawRotateCenter, { stiffness: 90, damping: 25, mass: 0.8 });
  const mobileRotateRight = useSpring(mobileRawRotateRight, { stiffness: 90, damping: 25, mass: 0.8 });

  const titleWords = [
    "Ditch The Chaos, Keep The Memories!",
    "Plan, Split & Travel Together",
    "Instant Group Budgets & Fair Splits",
    "Live Location, Chat & Fast Sync",
    "Your Ultimate Group Trip Companion",
  ];

  const stats = [
    {
      icon: <GroupsIcon sx={{ fontSize: { xs: 15, sm: 18 }, color: "#bdbdbd" }} />,
      value: "10k+",
      label: "Trips",
      bg: "#30405a",
      color: "rgba(56, 191, 248, 0.95)",
      borderGradient: "linear-gradient(135deg, rgba(56, 191, 248, 0.8), rgba(37, 100, 235, 0))",
    },
    {
      icon: <StarIcon sx={{ fontSize: { xs: 15, sm: 18 }, color: "#bdbdbd" }} />,
      value: "4.9",
      label: "Rating",
      bg: "#263B35",
      color: "rgba(52, 211, 153, 0.95)",
      borderGradient: "linear-gradient(135deg, rgba(52, 211, 153, 0.8), rgba(16, 185, 129, 0))",
    },
    {
      icon: <BoltIcon sx={{ fontSize: { xs: 15, sm: 18 }, color: "#bdbdbd" }} />,
      value: "99.9%",
      label: "Sync",
      bg: "#40372A",
      color: "rgba(251, 191, 36, 0.95)",
      borderGradient: "linear-gradient(135deg, rgba(251, 191, 36, 0.8), rgba(217, 119, 6, 0))",
    },
    {
      icon: <PublicIcon sx={{ fontSize: { xs: 15, sm: 18 }, color: "#bdbdbd" }} />,
      value: "50+",
      label: "Global",
      bg: "#402E31",
      color: "rgba(255, 86, 86, 0.95)",
      borderGradient: "linear-gradient(135deg, rgba(251, 113, 133, 0.8), rgba(225, 29, 72, 0))",
    },
  ];

  return (
    <Box
      id="hero"
      ref={heroRef}
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
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
        boxShadow: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 1.5, sm: 3, md: 6 },
        pt: { xs: 14, md: 16 },
        pb: { xs: 6, md: 8 },
        color: "#ffffff",
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

      {/* Main Container */}
      <Container maxWidth={false} disableGutters sx={{ position: "relative", zIndex: 2, px: { xs: 1.5, md: 5, lg: 8 } }}>
        <Grid
          container
          spacing={{ xs: 4, md: 4 }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left Section: Badges, Typography, Buttons & Stats */}
          <Grid item xs={12} md={6} lg={6} sx={{ textAlign: { xs: "center", md: "left" }, zIndex: 3 }}>
            {/* Top Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Box
                sx={{
                  backdropFilter: "blur(20px)",
                  background: "rgba(255, 255, 255, 0.04)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: { xs: 2, sm: 2.8 },
                  py: 0.75,
                  borderRadius: "28px",
                  fontSize: { xs: "0.78rem", sm: "0.88rem" },
                  fontWeight: 700,
                  color: "#ffffff",
                  boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 2px 10px rgba(0, 0, 0, 0.3)",
                  mb: { xs: 2, sm: 2.5 },
                }}
              >
                <span style={{ fontSize: "0.95rem" }}>✨</span> Smart Group Travel, Simplified
              </Box>
            </motion.div>

            {/* Dynamic Typewriter Headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <Typography
                variant={isMobile ? "h4" : "h2"}
                fontWeight={800}
                sx={{
                  mb: 2,
                  lineHeight: 1.15,
                  color: "#ffffff",
                  letterSpacing: "-0.5px",
                  textShadow: "0 4px 25px rgba(0, 0, 0, 0.8)",
                  minHeight: { xs: "58px", sm: "75px" },
                  fontSize: { xs: "1.65rem", sm: "2.3rem", md: "2.8rem", lg: "3.2rem" },
                }}
              >
                <Typewriter
                  words={titleWords}
                  loop
                  cursor
                  cursorStyle="_"
                  typeSpeed={45}
                  deleteSpeed={30}
                  delaySpeed={2000}
                />
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
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: { xs: "0.88rem", sm: "1.05rem" },
                  lineHeight: 1.6,
                }}
              >
                One unified platform to coordinate itineraries, split group expenses in real time, 
                and keep everyone connected effortlessly.
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
                    py: { xs: 1.1, sm: 1.3 },
                    px: { xs: 1.5, sm: 3 },
                    borderRadius: "28px",
                    fontWeight: 700,
                    fontSize: { xs: "0.82rem", sm: "0.95rem" },
                    textTransform: "none",
                    backgroundColor: "#ffffff",
                    color: "#020617",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.8,
                    whiteSpace: "nowrap",
                    boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.23), 0 1px 0px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease, background-color 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#d1d1d1",
                    },
                  }}
                >
                  <DownloadIcon sx={{ fontSize: { xs: 16, sm: 19 } }} />
                  Get App Free
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  href="https://bunk-mates.vercel.app/waitlist"
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: 15, sm: 18 } }} />}
                  sx={{
                    py: { xs: 1.1, sm: 1.3 },
                    px: { xs: 1.5, sm: 3 },
                    borderRadius: "28px",
                    fontWeight: 600,
                    fontSize: { xs: "0.82rem", sm: "0.95rem" },
                    textTransform: "none",
                    border: "0px solid rgba(56, 189, 248, 0.35)",
                    color: "#ffffff",
                    backdropFilter: "blur(20px)",
                    background: "rgba(255, 255, 255, 0.1)",
                    whiteSpace: "nowrap",
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.13), 0 2px 10px rgba(0, 0, 0, 0.3)",
                    transition: "transform 0.2s ease, background 0.2s ease",
                    "&:hover": {
                      background: "rgba(97, 97, 97, 0.2)",
                      borderColor: "rgba(0, 0, 0, 0.6)",
                    },
                  }}
                >
                  Beta Access
                </Button>
              </Stack>
            </motion.div>

            {/* Accent Stats Ticker - Horizontal Row */}
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
            position: "relative",
            p: "1px",
            background: "transparent",
            width: 105,
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            overflow: "hidden",
            "&:hover .stat-gloss-layer": {
              opacity: 1,
            },
            "&:hover .stat-icon-wrap": {
              transform: "scale(1.1) rotate(4deg)",
            },
          }}
        >

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              p: { xs: 1, sm: 1.4 },
              height: "100%",
              borderRadius: 1,
              boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.13), 0 2px 10px rgba(0, 0, 0, 0.3)",
              background: "rgba(255, 255, 255, 0.09)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: { xs: 0.4, sm: 0.6 },
            }}
          >
            {/* Top Row: Icon + Metric Value */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 0.5, sm: 0.8 }}
              sx={{ width: "100%", minWidth: 0 }}
            >
              {item.icon && (
                <Box
                  className="stat-icon-wrap"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#bdbdbd",
                    fontSize: { xs: "0.95rem", sm: "1.15rem" },
                    transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {item.icon}
                </Box>
              )}

              <Typography
                component="span"
                fontWeight={800}
                noWrap
                sx={{
                  color: "#ffffff",
                  fontSize: { xs: "0.82rem", sm: "0.98rem", md: "1.05rem" },
                  letterSpacing: "-0.4px",
                  lineHeight: 1.2,
                  fontFeatureSettings: '"tnum"',
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                }}
              >
                {item.value}
              </Typography>
            </Stack>

            {/* Bottom Row: Label */}
<Typography
  noWrap
  sx={{
    width: "100%",
    fontWeight: 700,
    fontSize: { xs: "0.58rem", sm: "0.7rem" },
    letterSpacing: "0.2px",
    lineHeight: 1.2,
    color: "rgba(255, 255, 255, 0.5)",
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
                /* Mobile: 3 Overlapping Screenshots that straighten on scroll */
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
                  {/* Left Screen (Tilts from -10deg to 0deg) */}
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
                        filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.8))",
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    />
                  </motion.div>

                  {/* Center Screen (Elevated center preview) */}
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
                        filter: "drop-shadow(0 20px 35px rgba(0, 0, 0, 0.9))",
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    />
                  </motion.div>

                  {/* Right Screen (Tilts from +10deg to 0deg) */}
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
                        filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.8))",
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
      maxHeight: "960px",
      marginBottom: { md: "-10vh", lg: "-15vh" },
      mx: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      background: "rgba(255, 255, 255, 0.05)", // Optional subtle background for contrast
      backdropFilter: "blur(12px)", // Optional blur for a glass effect
      p: 1.5,
      borderRadius: 2,
      overflow: "hidden", // Ensures the image cleanly clips to the curved boundary
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
        borderRadius: 2,
        objectFit: "contain",
        objectPosition: "center top",
        display: "block",
        userSelect: "none",
        pointerEvents: "none",
        border: "1px solid rgba(255, 255, 255, 0.08)", // Optional subtle glass border
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
  );
}