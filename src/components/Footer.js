// src/components/Footer.js
import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import FacebookIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import CopyrightIcon from "@mui/icons-material/Copyright";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed

const navLinks = ["Home", "Features", "FAQ", "About Us"];

// Map names stored in Firestore to actual icon components
const ICON_MAP = {
  InstagramIcon: InstagramIcon,
  YouTubeIcon: YouTubeIcon,
  YoutubeIcon: YouTubeIcon,
  "Mail Us": EmailIcon,
  Email: EmailIcon,
  FacebookIcon: FacebookIcon,
};

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [socialLinks, setSocialLinks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to landing_page/home doc for real-time updates
    const docRef = doc(db, "landing_page", "home");
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          setSocialLinks(null);
          setLoading(false);
          return;
        }
        const data = snap.data();

        // Defensive checks for links.hotlinks structure
        const hotlinks = data?.links?.hotlinks ?? null;

        if (hotlinks) {
          const icons = Array.isArray(hotlinks.icon) ? hotlinks.icon : [];
          const links = Array.isArray(hotlinks.link) ? hotlinks.link : [];
          const names = Array.isArray(hotlinks.name) ? hotlinks.name : [];

          const maxLen = Math.max(icons.length, links.length, names.length);

          const built = Array.from({ length: maxLen }).map((_, i) => {
            const rawIcon = icons[i] ?? names[i] ?? null;
            const IconComponent = ICON_MAP[rawIcon] ?? ICON_MAP[names[i]] ?? null;

            return {
              name: names[i] ?? icons[i] ?? `Link ${i + 1}`,
              url: links[i] ?? "#",
              IconComponent,
            };
          });

          setSocialLinks(built);
        } else {
          setSocialLinks(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to landing_page/home:", err);
        setSocialLinks(null);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Fallback static links if Firestore not available or empty
  const FALLBACK = [
    { name: "Instagram", url: "https://www.instagram.com/bunkmates.app", IconComponent: InstagramIcon },
    { name: "Youtube", url: "https://www.youtube.com/@Team_BunkMates", IconComponent: YouTubeIcon },
    { name: "Mail Us", url: "mailto:help.bunkmates@gmail.com", IconComponent: EmailIcon },
  ];

  const linksToRender = !loading && Array.isArray(socialLinks) && socialLinks.length > 0 ? socialLinks : FALLBACK;

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #040406 0%, #0b0b0f 100%)",
        px: isMobile ? 3 : { xs: 3, md: 12 },
        py: { xs: 6, md: 8 },
        boxShadow: "none",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative faint image background - local path will be transformed to URL by toolchain */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('/mnt/data/021ffc34-0399-4e71-b967-05199b15ff53.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.03,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Grid container spacing={6} sx={{ position: "relative", zIndex: 2, justifyContent: "space-between", display: "flex" }}>
        {/* Branding */}
        <Grid item xs={12} md={3}>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: "#fff" }}>
            BunkMates
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 280, lineHeight: 1.7, color: "rgba(255,255,255,0.72)" }}>
            Travel together, split smarter. All-in-one app for collaborative planning, budgeting & group communication.
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
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                underline="none"
                sx={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.82)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "rgba(255,218,179,1)",
                    transform: "translateX(6px)",
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
              <EmailIcon sx={{ color: "#d8d8d8", fontSize: 18 }} />
              <Link
                href="mailto:help.bunkmates@gmail.com"
                underline="hover"
                sx={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.82)",
                  transition: "all 0.2s ease",
                  "&:hover": { color: "#00ff94", transform: "translateX(4px)" },
                }}
              >
                Mail us
              </Link>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOnIcon sx={{ color: "#d8d8d8", fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.82)" }}>
                Remote · India
              </Typography>
            </Stack>

            {/* Social buttons (fetched) */}
            <Box sx={{ mt: 2 }}>
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Stack direction="row" spacing={1}>
                  {linksToRender.map((item, idx) => {
                    const Icon = item.IconComponent ?? (ICON_MAP[item.name] ?? EmailIcon);
                    return (
                      <motion.div key={idx} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
                        <Tooltip title={item.name ?? "Open link"}>
                          <Button
                            aria-label={item.name}
                            onClick={() => {
                              try {
                                // open external links in new tab; for mailto use location.href fallback
                                if ((item.url || "").startsWith("mailto:")) {
                                  window.location.href = item.url;
                                } else {
                                  window.open(item.url, "_blank", "noopener,noreferrer");
                                }
                              } catch (err) {
                                console.error("Failed to open link", err);
                              }
                            }}
                            sx={{
                              minWidth: 44,
                              height: 44,
                              p: 0,
                              borderRadius: 2,
                              backgroundColor: "rgba(255,255,255,0.04)",
                              color: "rgba(255,255,255,0.87)",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.12)",
                                color: "#fff",
                                transform: "translateY(-3px)",
                              },
                            }}
                          >
                            <Icon sx={{ fontSize: 20 }} />
                            <OpenInNewIcon sx={{ fontSize: 12, ml: 0.5, opacity: 0.0 }} />{/* keeps spacing consistent */}
                          </Button>
                        </Tooltip>
                      </motion.div>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Stack>
        </Grid>

        {/* Join Beta / Social */}
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            BunkMates Beta
          </Typography>

          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button
                href="https://bunk-mates.vercel.app/waitlist"
                sx={{
                  borderRadius: "30px",
                  textTransform: "none",
                  px: 3,
                  fontWeight: 600,
                  background: "linear-gradient(120deg, #923a00ff, #004377ff)",
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

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
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
                    backgroundColor: "#2a2a2a",
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
      <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.08)" }} />

      {/* Bottom Row */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ position: "relative", zIndex: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <CopyrightIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }} />
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
            {new Date().getFullYear()} BunkMate. All rights reserved.
          </Typography>
        </Stack>

        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.64)" }}>
          Built with ❤️ for modern travelers.
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
