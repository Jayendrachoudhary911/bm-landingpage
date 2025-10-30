import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  Button,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import FacebookIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import CopyrightIcon from "@mui/icons-material/Copyright";

const navLinks = ["Home", "Features", "FAQ", "About Us"];

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const socialLinks = [
    { icon: InstagramIcon, url: "https://www.instagram.com/bunkmates.app" },
    { icon: YouTubeIcon, url: "https://www.youtube.com/@Team_BunkMates" },
  ];

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #111 100%)",
        px: isMobile ? 6 : { xs: 3, md: 12 },
        py: { xs: 6, md: 8 },
        boxShadow: "none",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Layered ripple background */}
      {/* <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 40%, rgba(0,255,180,0.06), transparent 60%), radial-gradient(circle at 80% 70%, rgba(0,140,255,0.05), transparent 60%)",
          zIndex: 0,
        }}
      /> */}

      <Grid
        container
        spacing={6}
        justifyContent="space-between"
        sx={{ position: "relative", zIndex: 2 }}
      >
        {/* Branding */}
        <Grid item xs={12} md={3}>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            sx={{
              color: `#fff`
            }}
          >
            BunkMates
          </Typography>
          <Typography
            variant="body2"
            sx={{ maxWidth: 280, lineHeight: 1.7, color: "rgba(255,255,255,0.7)" }}
          >
            Travel together, split smarter. All-in-one app for collaborative
            planning, budgeting & group communication.
          </Typography>
        </Grid>

        {/* Navigation Links */}
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Explore
          </Typography>
          <Stack spacing={1.2}>
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href="#"
                underline="none"
                sx={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#ffdab3ff",
                    transform: "translateX(4px)",
                  },
                }}
              >
                {link}
              </Link>
            ))}
          </Stack>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Contact
          </Typography>
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EmailIcon sx={{ color: "#d8d8d8ff", fontSize: 18 }} />
              <Link
                href="mailto:team.bunkmates@gmail.com"
                underline="hover"
                sx={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#00ff94",
                    transform: "translateX(2px)",
                  },
                }}
              >
                Mail us
              </Link>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOnIcon sx={{ color: "#d8d8d8ff", fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Remote · India
              </Typography>
            </Stack>

    <Stack direction="row" spacing={1} mt={3}>
      {socialLinks.map(({ icon: Icon, url }, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
            sx={{
              fontSize: 24,
              backgroundColor: "#2a2a2a",
              padding: 1,
              borderRadius: 2,
              width: 42,
              height: 42,
              color: "rgba(255,255,255,0.75)",
              transition: "0.3s",
              "&:hover": {
                color: "#000",
                backgroundColor: "#fff",
              },
              cursor: "pointer",
            }}
          />
        </motion.div>
      ))}
    </Stack>
          </Stack>
        </Grid>

        {/* Join Beta / Social */}
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            BunkMates Beta
          </Typography>

          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
              <Button
                href="https://bunk-mates.vercel.app/waitlist"
                sx={{
                  borderRadius: "30px",
                  textTransform: "none",
                  px: 3,
                  fontWeight: 600,
                  background: 'linear-gradient(120deg, #923a00ff, #004377ff)',
                  color: "#fff",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Join Beta
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
              <Button
                href="https://bunk-mates.vercel.app/community"
                sx={{
                  borderRadius: "30px",
                  textTransform: "none",
                  px: 3,
                  fontWeight: 600,
                  backgroundColor: "#fff",
                  color: "#000",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                    transform: "translateY(-2px)",
                    backgroundColor: "#2a2a2aff",
                    color: "#fff",
                  },
                }}
              >
                Join Community
              </Button>
            </motion.div>
          </Stack>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

      {/* Bottom Row */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ position: "relative", zIndex: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <CopyrightIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }} />
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
            {new Date().getFullYear()} BunkMate. All rights reserved.
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
          Built with ❤️ for modern travelers.
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
