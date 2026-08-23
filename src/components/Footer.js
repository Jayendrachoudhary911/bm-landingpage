import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Link,
  Button,
  Divider,
  CircularProgress,
  Tooltip,
  Container,
  alpha,
} from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ShopRoundedIcon from "@mui/icons-material/ShopRounded";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { useCustomTheme } from "../context/ThemeContext";

const M3_EXPRESSIVE_PALETTE = {
  blue: {
    accent: "#88b7f0",
    light: { bg: "#D7E3FF", text: "#001B3F", container: "#EEF2FF", onContainer: "#004785", badgeBg: "#BACDF8" },
    dark: { bg: "#d3e7ff", text: "#203362", container: "#e2f0ff", onContainer: "#457ed8", badgeBg: "#003F7D" },
  },
  amber: {
    accent: "#f5d397",
    light: { bg: "#FFDEA5", text: "#271900", container: "#FFF2D9", onContainer: "#765B00", badgeBg: "#F0CA85" },
    dark: { bg: "#ffefbe", text: "#271900", container: "#fff5e2", onContainer: "#d99f17", badgeBg: "#594300" },
  },
  emerald: {
    accent: "#8cefcb",
    light: { bg: "#A6F5BA", text: "#00210E", container: "#DBFCE3", onContainer: "#006D37", badgeBg: "#8CE3A3" },
    dark: { bg: "#b6ffd7", text: "#21542e", container: "#e4fff0", onContainer: "#17c14d", badgeBg: "#005228" },
  },
  orange: {
    accent: "#ffd6b4",
    light: { bg: "#FFDBCA", text: "#341000", container: "#FFECE2", onContainer: "#984013", badgeBg: "#F6C1A7" },
    dark: { bg: "#ffdac5", text: "#703e26", container: "#ffeae2", onContainer: "#fb712c", badgeBg: "#772F03" },
  },
  purple: {
    accent: "#c8b6ff",
    light: { bg: "#EBDCFF", text: "#25005A", container: "#F6EEFF", onContainer: "#6940A5", badgeBg: "#D4BFF2" },
    dark: { bg: "#e2d1ff", text: "#44236f", container: "#ecdeff", onContainer: "#a473ff", badgeBg: "#422271" },
  },
};

const SOCIAL_PALETTE_KEYS = ["purple", "orange", "blue", "emerald", "amber"];

const navCategories = {
  main: [
    { label: "Home", href: "/" },
    { label: "Community", href: "/community" },
    { label: "Download App", href: "/bm-install" },
    { label: "Contact & Support", href: "/contact" },
  ],
  features: [
    { label: "Plan Trips", href: "/features/plan-trips" },
    { label: "Group Chat", href: "/features/group-chat" },
    { label: "Split Expenses", href: "/features/expenses" },
    { label: "Tasks & Notes", href: "/features/tasks-notes" },
  ],
  explore: [
    { label: "Destinations", href: "/explore/destinations" },
    { label: "Travel Guides", href: "/explore/travel-guides" },
    { label: "App Preview", href: "/explore/app-preview" },
    { label: "What's New", href: "/explore/whats-new" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Community Guidelines", href: "/community-guidelines" },
  ],
};

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
  const location = useLocation();

  const [socialLinks, setSocialLinks] = useState(null);
  const [loading, setLoading] = useState(true);

  const colors = {
    background: isDark ? "#09090b" : "#ffffff",
    surface: isDark ? "#121216" : "#f7f7f9",
    text: isDark ? "#fafafa" : "#09090b",
    secondaryText: isDark ? "#a1a1aa" : "#64748b",
    border: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
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
    { name: "Mail Us", url: "mailto:team.bunkmates@gmail.com", IconComponent: EmailRoundedIcon, live: true },
  ];

  const linksToRender = !loading && Array.isArray(socialLinks) && socialLinks.length > 0 ? socialLinks : FALLBACK;

  const emeraldTheme = M3_EXPRESSIVE_PALETTE.emerald;
  const blueTheme = M3_EXPRESSIVE_PALETTE.blue;

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0c0c0c',
        borderRadius: '30px 30px 0 0',
        color: colors.text,
        pt: { xs: 7, md: 9 },
        pb: { xs: 4, md: 5 },
        px: 2,
        position: "relative",
        overflow: "hidden",
        borderTop: `1.5px solid ${colors.border}`,
        transition: "background-color 0.35s ease, color 0.35s ease",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, px: { xs: 2, sm: 4, md: 5 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            rowGap: { xs: 4, md: 4.5 },
          }}
        >
          {/* SECTION 1 (TOP): About / Brand Overview */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 850,
                letterSpacing: "-0.03em",
                color: colors.text,
                mb: 1.2,
              }}
            >
              BunkMates
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 680,
                lineHeight: 1.7,
                color: colors.secondaryText,
                fontSize: "0.88rem",
              }}
            >
              The all-in-one ecosystem crafted to eliminate travel frictions with real-time planning, automated budget splitting, and squad coordination.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: colors.border }} />

          {/* SECTION 2 (MIDDLE): Left Quicklinks + Right Details & Play Store */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              columnGap: { xs: 4, md: 8 },
              rowGap: { xs: 4.5, md: 5 },
            }}
          >
            {/* Left Side: 2x2 Structured Quicklinks */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "auto auto",
                rowGap: { xs: 3.5, sm: 4 },
                columnGap: { xs: 2.5, sm: 4 },
              }}
            >
              {/* Row 1, Col 1: Navigation */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "0.75rem",
                    color: colors.text,
                    mb: 1.8,
                  }}
                >
                  Navigation
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr", rowGap: 1.1 }}>
                  {navCategories.main.map((item, idx) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        underline="none"
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 800 : 550,
                          color: isActive ? (isDark ? emeraldTheme.accent : emeraldTheme.light.onContainer) : colors.secondaryText,
                          transition: "color 0.2s ease, transform 0.2s ease",
                          display: "inline-block",
                          width: "fit-content",
                          "&:hover": {
                            color: isDark ? blueTheme.dark.bg : blueTheme.light.onContainer,
                            transform: "translateX(3px)",
                          },
                        }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </Box>
              </Box>

              {/* Row 1, Col 2: Features */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "0.75rem",
                    color: colors.text,
                    mb: 1.8,
                  }}
                >
                  Features
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr", rowGap: 1.1 }}>
                  {navCategories.features.map((item, idx) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        underline="none"
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 800 : 550,
                          color: isActive ? (isDark ? emeraldTheme.accent : emeraldTheme.light.onContainer) : colors.secondaryText,
                          transition: "color 0.2s ease, transform 0.2s ease",
                          display: "inline-block",
                          width: "fit-content",
                          "&:hover": {
                            color: isDark ? blueTheme.dark.bg : blueTheme.light.onContainer,
                            transform: "translateX(3px)",
                          },
                        }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </Box>
              </Box>

              {/* Row 2, Col 1: Explore */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "0.75rem",
                    color: colors.text,
                    mb: 1.8,
                  }}
                >
                  Explore
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr", rowGap: 1.1 }}>
                  {navCategories.explore.map((item, idx) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        underline="none"
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 800 : 550,
                          color: isActive ? (isDark ? emeraldTheme.accent : emeraldTheme.light.onContainer) : colors.secondaryText,
                          transition: "color 0.2s ease, transform 0.2s ease",
                          display: "inline-block",
                          width: "fit-content",
                          "&:hover": {
                            color: isDark ? blueTheme.dark.bg : blueTheme.light.onContainer,
                            transform: "translateX(3px)",
                          },
                        }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </Box>
              </Box>

              {/* Row 2, Col 2: Company & Legal */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "0.75rem",
                    color: colors.text,
                    mb: 1.8,
                  }}
                >
                  Company & Legal
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr", rowGap: 1.1 }}>
                  {navCategories.company.map((item, idx) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        underline="none"
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 800 : 550,
                          color: isActive ? (isDark ? emeraldTheme.accent : emeraldTheme.light.onContainer) : colors.secondaryText,
                          transition: "color 0.2s ease, transform 0.2s ease",
                          display: "inline-block",
                          width: "fit-content",
                          "&:hover": {
                            color: isDark ? blueTheme.dark.bg : blueTheme.light.onContainer,
                            transform: "translateX(3px)",
                          },
                        }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/* Right Side: Contact, Play Store Section & Socials */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                rowGap: 2.2,
                alignContent: "start",
              }}
            >
              {/* Email & Location */}
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "auto auto" },
    justifyContent: "start",
    justifyItems: "start",
    alignItems: "center",
    gap: 2,
    width: "100%",
  }}
>
  {/* Email Item */}
  <Box
    sx={{
      display: "grid",
      gridAutoFlow: "column",
      alignItems: "center",
      justifyContent: "start",
      gap: 1,
      textAlign: "left",
    }}
  >
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "8px",
        display: "grid",
        placeItems: "center",
        backgroundColor: alpha(blueTheme.accent, isDark ? 0.14 : 0.12),
        color: blueTheme.accent,
        flexShrink: 0,
      }}
    >
      <EmailRoundedIcon sx={{ fontSize: 15 }} />
    </Box>
    <Link
      href="mailto:team.bunkmates@gmail.com"
      underline="hover"
      sx={{
        fontSize: "0.82rem",
        fontWeight: 600,
        color: colors.secondaryText,
        textAlign: "left",
        "&:hover": { color: colors.text },
      }}
    >
      team.bunkmates@gmail.com
    </Link>
  </Box>

  {/* Location Item */}
  <Box
    sx={{
      display: "grid",
      gridAutoFlow: "column",
      alignItems: "center",
      justifyContent: "start",
      gap: 1,
      textAlign: "left",
    }}
  >
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "8px",
        display: "grid",
        placeItems: "center",
        backgroundColor: alpha(M3_EXPRESSIVE_PALETTE.purple.accent, isDark ? 0.14 : 0.12),
        color: M3_EXPRESSIVE_PALETTE.purple.accent,
        flexShrink: 0,
      }}
    >
      <LocationOnRoundedIcon sx={{ fontSize: 15 }} />
    </Box>
    <Typography
      variant="body2"
      sx={{
        color: colors.secondaryText,
        fontSize: "0.82rem",
        textAlign: "left",
        fontWeight: 600,
      }}
    >
      Remote · Global
    </Typography>
  </Box>
</Box>

              {/* Social Icons Strip */}
              <Box sx={{ display: "grid", gridAutoFlow: "column", justifyContent: "start", gap: 1, mt: 0.2 }}>
                {loading ? (
                  <CircularProgress size={16} sx={{ color: colors.text }} />
                ) : (
                  linksToRender.map((item, idx) => {
                    const Icon = item.IconComponent ?? resolveIcon(item.name);
                    const isLive = item.live !== false;
                    const paletteKey = SOCIAL_PALETTE_KEYS[idx % SOCIAL_PALETTE_KEYS.length];
                    const palette = M3_EXPRESSIVE_PALETTE[paletteKey];

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
                              minWidth: 34,
                              height: 34,
                              p: 0,
                              borderRadius: "10px",
                              backgroundColor: isDark ? palette.dark.container : palette.light.container,
                              color: isDark ? palette.dark.text : palette.light.onContainer,
                              border: `1.2px solid ${alpha(palette.accent, isDark ? 0.35 : 0.4)}`,
                              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                backgroundColor: palette.accent,
                                color: isDark ? "#09090b" : "#ffffff",
                                borderColor: palette.accent,
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <Icon sx={{ fontSize: 16 }} />
                          </Button>
                        </span>
                      </Tooltip>
                    );
                  })
                )}
              </Box>
              
              {/* Compact Google Play Store Strip */}
              <Box
                sx={{
                  py: 1.2,
                  px: 1.8,
                  borderRadius: "14px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr" },
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: "grid", gridAutoFlow: "column", alignItems: "center", justifyContent: "start", gap: 1.2 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "8px",
                      backgroundColor: alpha(emeraldTheme.accent, isDark ? 0.16 : 0.14),
                      color: emeraldTheme.accent,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <ShopRoundedIcon sx={{ fontSize: 16 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 750, fontSize: "0.82rem", color: colors.text, lineHeight: 1.2 }}>
                      Available on Google Play Store
                    </Typography>
                    <Typography sx={{ color: colors.secondaryText, fontSize: "0.72rem" }}>
                      Real-time squad sync for mobile
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "grid", gridAutoFlow: "column", gap: 1, width: { xs: "100%", sm: "auto" } }}>
                  <Button
                    href="https://play.google.com/store/apps/details?id=com.bunkmates.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<ShopRoundedIcon sx={{ fontSize: 15 }} />}
                    sx={{
                      px: 1.8,
                      py: 0.5,
                      borderRadius: "9px",
                      textTransform: "none",
                      fontWeight: 750,
                      fontSize: "0.76rem",
                      backgroundColor: isDark ? emeraldTheme.dark.bg : emeraldTheme.light.bg,
                      color: isDark ? emeraldTheme.dark.text : emeraldTheme.light.text,
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                      whiteSpace: "nowrap",
                      "&:hover": {
                        backgroundColor: emeraldTheme.accent,
                        color: "#00210E",
                      },
                    }}
                  >
                    Google Play
                  </Button>

                  <Button
                    onClick={() => navigate("/bm-install")}
                    startIcon={<DownloadRoundedIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "9px",
                      textTransform: "none",
                      fontWeight: 650,
                      fontSize: "0.76rem",
                      backgroundColor: colors.surface,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 1px 0px rgba(0,0,0,0.1)',
                      whiteSpace: "nowrap",
                      "&:hover": {
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    Direct APK
                  </Button>
                </Box>
              </Box>

            </Box>
          </Box>

          <Divider sx={{ borderColor: colors.border }} />

          {/* SECTION 3 (BOTTOM): Copyrights & Tagline */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "auto auto" },
              justifyContent: "space-between",
              alignItems: "center",
              rowGap: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: colors.secondaryText, fontSize: "0.78rem", fontWeight: 500 }}>
              © {new Date().getFullYear()} BunkMates. All rights reserved.
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: isDark ? colors.secondaryText : blueTheme.light.onContainer,
                fontSize: "0.78rem",
                fontWeight: 650,
              }}
            >
              Built for modern group adventures.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;