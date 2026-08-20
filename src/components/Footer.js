import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  Button,
  Stack,
  Divider,
  CircularProgress,
  Tooltip,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import * as MuiIcons from "@mui/icons-material";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../context/ThemeContext";

const navLinks = [
  { label: "Home", href: "/#hero" },
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
  { label: "Our Story", href: "/about" },
];

const STATIC_ICON_MAP = {
  InstagramIcon: InstagramIcon,
  YouTubeIcon: YouTubeIcon,
  YoutubeIcon: YouTubeIcon,
  "Mail Us": EmailRoundedIcon,
  Email: EmailRoundedIcon,
};

function resolveIcon(name) {
  if (!name) return EmailRoundedIcon;
  if (MuiIcons[name]) return MuiIcons[name];
  if (STATIC_ICON_MAP[name]) return STATIC_ICON_MAP[name];
  if (MuiIcons[name + "Icon"]) return MuiIcons[name + "Icon"];
  const withoutIcon = name.replace(/Icon$/, "");
  if (MuiIcons[withoutIcon]) return MuiIcons[withoutIcon];
  return EmailRoundedIcon;
}

const Footer = () => {
  const { isDark } = useCustomTheme();
  const navigate = useNavigate();

  const [socialLinks, setSocialLinks] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const FALLBACK = [
    { name: "Instagram", url: "https://www.instagram.com/bunkmates.app", IconComponent: InstagramIcon, live: true },
    { name: "Youtube", url: "https://www.youtube.com/@Team_BunkMates", IconComponent: YouTubeIcon, live: true },
    { name: "Mail Us", url: "mailto:help.bunkmates@gmail.com", IconComponent: EmailRoundedIcon, live: true },
  ];

  const linksToRender = !loading && Array.isArray(socialLinks) && socialLinks.length > 0 ? socialLinks : FALLBACK;

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.background,
        color: colors.text,
        pt: { xs: 8, md: 12 },
        pb: { xs: 6, md: 8 },
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${colors.border}`,
        transition: "background-color 0.35s ease, color 0.35s ease",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 4, md: 5 } }}>
        <Grid container spacing={{ xs: 5, md: 6 }} justifyContent="space-between">
          {/* Brand Column */}
          <Grid item xs={12} md={3.5}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 850,
                letterSpacing: "-0.04em",
                color: colors.text,
                mb: 1.5,
              }}
            >
              BunkMates
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 320,
                lineHeight: 1.75,
                color: colors.secondaryText,
              }}
            >
              Travel together, coordinate seamlessly. The all-in-one platform for collaborative trip itineraries, group expenses, and squad connectivity.
            </Typography>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={6} sm={4} md={2.5}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 750,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: colors.text,
                mb: 2,
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1.2}>
              {navLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  underline="none"
                  sx={{
                    fontSize: "0.9rem",
                    color: colors.secondaryText,
                    transition: "color 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                      color: colors.text,
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Column */}
          <Grid item xs={12} sm={8} md={3}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 750,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: colors.text,
                mb: 2,
              }}
            >
              Connect
            </Typography>

            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <EmailRoundedIcon sx={{ color: colors.secondaryText, fontSize: 18 }} />
                <Link
                  href="mailto:help.bunkmates@gmail.com"
                  underline="hover"
                  sx={{
                    fontSize: "0.88rem",
                    color: colors.secondaryText,
                    "&:hover": { color: colors.text },
                  }}
                >
                  help.bunkmates@gmail.com
                </Link>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1.2}>
                <LocationOnRoundedIcon sx={{ color: colors.secondaryText, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: colors.secondaryText, fontSize: "0.88rem" }}>
                  Remote · Global
                </Typography>
              </Stack>

              <Box sx={{ pt: 1 }}>
                {loading ? (
                  <CircularProgress size={18} sx={{ color: colors.text }} />
                ) : (
                  <Stack direction="row" spacing={1}>
                    {linksToRender.map((item, idx) => {
                      const Icon = item.IconComponent ?? resolveIcon(item.name);
                      const isLive = item.live !== false;

                      return (
                        <Tooltip title={item.name} key={idx} arrow>
                          <span>
                            <Button
                              aria-label={item.name}
                              onClick={() => {
                                if (!isLive) return;
                                if ((item.url || "").startsWith("mailto:")) {
                                  window.location.href = item.url;
                                } else {
                                  window.open(item.url, "_blank", "noopener,noreferrer");
                                }
                              }}
                              disabled={!isLive}
                              sx={{
                                minWidth: 40,
                                height: 40,
                                p: 0,
                                borderRadius: "12px",
                                backgroundColor: colors.surface,
                                color: colors.text,
                                border: `1px solid ${colors.border}`,
                                "&:hover": {
                                  backgroundColor: colors.surfaceStrong,
                                  borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)",
                                },
                              }}
                            >
                              <Icon sx={{ fontSize: 18 }} />
                            </Button>
                          </span>
                        </Tooltip>
                      );
                    })}
                  </Stack>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* Action Column */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 750,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: colors.text,
                mb: 2,
              }}
            >
              Get Started
            </Typography>
            <Typography variant="body2" sx={{ color: colors.secondaryText, mb: 2.5, lineHeight: 1.6 }}>
              Join travel squads building seamless journeys with BunkMates today.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
              <Button
                onClick={() => navigate("/bm-install")}
                startIcon={<DownloadRoundedIcon sx={{ fontSize: "1.1rem !important" }} />}
                sx={{
                  minHeight: 42,
                  px: 2.5,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  backgroundColor: colors.text,
                  color: colors.background,
                  boxShadow: isDark
                    ? "0 8px 24px rgba(0, 0, 0, 0.4)"
                    : "0 6px 18px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    backgroundColor: isDark ? "#e8e8e8" : "#242424",
                  },
                }}
              >
                Install App
              </Button>

              <Button
                href="https://bunk-mates.vercel.app/waitlist"
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "1rem !important" }} />}
                sx={{
                  minHeight: 42,
                  px: 2,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 650,
                  fontSize: "0.88rem",
                  color: colors.text,
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.045)" : "rgba(0, 0, 0, 0.035)",
                  border: `1px solid ${colors.border}`,
                  "&:hover": {
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                  },
                }}
              >
                Beta Access
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5, borderColor: colors.border }} />

        {/* Bottom Row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1.5}
        >
          <Typography variant="caption" sx={{ color: colors.secondaryText, fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} BunkMates. All rights reserved.
          </Typography>

          <Typography variant="caption" sx={{ color: colors.secondaryText, fontSize: "0.8rem" }}>
            Built for modern group adventures.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;