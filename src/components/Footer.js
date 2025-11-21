// src/components/Footer.js
import React, { useEffect, useState, useMemo } from "react";
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
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import * as MuiIcons from "@mui/icons-material";
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

// small compatibility map for names you may have used historically
const STATIC_ICON_MAP = {
  InstagramIcon: InstagramIcon,
  YouTubeIcon: YouTubeIcon,
  YoutubeIcon: YouTubeIcon,
  "Mail Us": EmailIcon,
  Email: EmailIcon,
  FacebookIcon: FacebookIcon,
};

function resolveIcon(name) {
  if (!name) return EmailIcon;
  // direct dynamic lookup in @mui/icons-material
  if (MuiIcons[name]) return MuiIcons[name];
  // fallback to static mapping
  if (STATIC_ICON_MAP[name]) return STATIC_ICON_MAP[name];
  // try adding/removing 'Icon' suffix
  if (MuiIcons[name + "Icon"]) return MuiIcons[name + "Icon"];
  const withoutIcon = name.replace(/Icon$/, "");
  if (MuiIcons[withoutIcon]) return MuiIcons[withoutIcon];
  // final fallback
  return EmailIcon;
}

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [socialLinks, setSocialLinks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to landing_page -> links (you requested links doc, not home)
    const docRef = doc(db, "landing_page", "links");
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          setSocialLinks(null);
          setLoading(false);
          return;
        }
        const data = snap.data();
        const hotlinks = data?.hotlinks ?? null;

        if (!hotlinks) {
          setSocialLinks(null);
          setLoading(false);
          return;
        }

        // Firestore fields in your DB: hotlinks.icons, hotlinks.name, hotlinks.link, hotlinks.live
        // Be defensive: sometimes field names vary. Accept 'icons' or 'icon'.
        const iconsArr = Array.isArray(hotlinks.icons)
          ? hotlinks.icons
          : Array.isArray(hotlinks.icon)
          ? hotlinks.icon
          : [];
        const linksArr = Array.isArray(hotlinks.link) ? hotlinks.link : [];
        const namesArr = Array.isArray(hotlinks.name) ? hotlinks.name : [];
        const liveArr = Array.isArray(hotlinks.live) ? hotlinks.live : null;

        const maxLen = Math.max(iconsArr.length, linksArr.length, namesArr.length);

        const built = Array.from({ length: maxLen }).map((_, i) => {
          const rawIcon = iconsArr[i] ?? namesArr[i] ?? null;
          const IconComponent = resolveIcon(rawIcon);
          const name = namesArr[i] ?? iconsArr[i] ?? `Link ${i + 1}`;
          const url = linksArr[i] ?? "#";
          // If live array is missing, treat as true
          const live = Array.isArray(liveArr) ? Boolean(liveArr[i]) : true;

          return { name, url, IconComponent, live };
        });

        setSocialLinks(built);
        setLoading(false);
      },
      (err) => {
        console.error("Footer onSnapshot error:", err);
        setSocialLinks(null);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Fallback static links if Firestore not available or empty
  const FALLBACK = [
    { name: "Instagram", url: "https://www.instagram.com/bunkmates.app", IconComponent: InstagramIcon, live: true },
    { name: "Youtube", url: "https://www.youtube.com/@Team_BunkMates", IconComponent: YouTubeIcon, live: true },
    { name: "Mail Us", url: "mailto:help.bunkmates@gmail.com", IconComponent: EmailIcon, live: true },
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
      {/* subtle decorative background (optional) */}
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

        {/* Contact & Social (fetched) */}
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
                    const Icon = item.IconComponent ?? resolveIcon(item.name);
                    const isLive = item.live !== false; // default true
                    const btnSx = {
                      minWidth: 44,
                      height: 44,
                      p: 0,
                      borderRadius: 2,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // different look when not live
                      backgroundColor: isLive ? "rgba(255,255,255,0.04)" : "rgba(255,0,0,0.06)",
                      color: isLive ? "rgba(255,255,255,0.87)" : "rgba(255,100,100,0.95)",
                      "&:hover": {
                        backgroundColor: isLive ? "rgba(255,255,255,0.12)" : "rgba(255,0,0,0.12)",
                        transform: "translateY(-3px)",
                      },
                    };

                    return (
                      <motion.div key={idx} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
                        <Tooltip title={`${item.name} ${isLive ? "" : "(Not live - disabled)"} `} arrow>
                          {/* wrap in <span> because disabled buttons can't show tooltip reliably */}
                          <span>
                            <Button
                              aria-label={item.name}
                              onClick={() => {
                                try {
                                  if (!isLive) return; // do nothing when not live
                                  if ((item.url || "").startsWith("mailto:")) {
                                    window.location.href = item.url;
                                  } else {
                                    window.open(item.url, "_blank", "noopener,noreferrer");
                                  }
                                } catch (err) {
                                  console.error("Failed to open link", err);
                                }
                              }}
                              sx={btnSx}
                              disabled={!isLive}
                            >
                              <Icon sx={{ fontSize: 20 }} />
                              <OpenInNewIcon sx={{ fontSize: 12, ml: 0.5, opacity: 0.0 }} />
                            </Button>
                          </span>
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
