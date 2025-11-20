// src/components/FeaturesSection.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import AttractionsOutlinedIcon from "@mui/icons-material/AttractionsOutlined";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed

// Local fallback dataset (used when Firestore doc is missing)
const FALLBACK_FEATURES = [
  {
    icon: <NotificationsActiveOutlinedIcon fontSize="medium" />,
    title: "Live Alerts",
    description: "Instant updates for trip changes, invites, and important moments.",
    color: "#ff7675",
  },
  {
    icon: <TravelExploreOutlinedIcon fontSize="medium" />,
    title: "Trip Suggestions",
    description: "Smart trip ideas based on your travel style and past adventures.",
    color: "#00cec9",
  },
  {
    icon: <AttractionsOutlinedIcon fontSize="medium" />,
    title: "Nearby Attractions",
    description: "Discover cool spots, cafés, and sights near your travel route.",
    color: "#81ecec",
  },
  {
    icon: <AccessAlarmOutlinedIcon fontSize="medium" />,
    title: "Reminders",
    description: "Stay on track with trip, task, and event reminders — auto synced.",
    color: "#f9ca24",
  },
  {
    icon: <CalculateOutlinedIcon fontSize="medium" />,
    title: "Contri & Split",
    description: "Auto calculate and split expenses fairly among your trip mates.",
    color: "#55efc4",
  },
  {
    icon: <ChatOutlinedIcon fontSize="medium" />,
    title: "Private Chats",
    description: "Connect directly with your friends — anytime, anywhere.",
    color: "#74b9ff",
  },
  {
    icon: <GroupOutlinedIcon fontSize="medium" />,
    title: "Group Chats",
    description: "Real-time messaging for your entire travel group.",
    color: "#a29bfe",
  },
  {
    icon: <WbSunnyOutlinedIcon fontSize="medium" />,
    title: "Weather Updates",
    description: "Check live weather forecasts for your destinations and plans.",
    color: "#fdcb6e",
  },
  {
    icon: <NoteAltOutlinedIcon fontSize="medium" />,
    title: "Notes & Media",
    description: "Keep all trip notes, photos, and ideas organized together.",
    color: "#e17055",
  },
];

const FALLBACK_UPCOMING = [
  "Auto-save Notes",
  "Improved Trip Suggestions & Nearby Attractions",
  "Enhanced Search Experience",
  "More Interactive Live Alerts",
  "Option to Remove Members from Trip",
  "And many more coming soon...",
];

// map firestore icon name strings to actual icon components
const ICON_MAP = {
  NotificationsActiveOutlinedIcon: <NotificationsActiveOutlinedIcon fontSize="medium" />,
  TravelExploreOutlinedIcon: <TravelExploreOutlinedIcon fontSize="medium" />,
  AttractionsOutlinedIcon: <AttractionsOutlinedIcon fontSize="medium" />,
  AccessAlarmOutlinedIcon: <AccessAlarmOutlinedIcon fontSize="medium" />,
  CalculateOutlinedIcon: <CalculateOutlinedIcon fontSize="medium" />,
  ChatOutlinedIcon: <ChatOutlinedIcon fontSize="medium" />,
  GroupOutlinedIcon: <GroupOutlinedIcon fontSize="medium" />,
  WbSunnyOutlinedIcon: <WbSunnyOutlinedIcon fontSize="medium" />,
  NoteAltOutlinedIcon: <NoteAltOutlinedIcon fontSize="medium" />,
  SystemUpdateAltOutlinedIcon: <SystemUpdateAltOutlinedIcon fontSize="medium" />,
};

const FeaturesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [features, setFeatures] = useState(FALLBACK_FEATURES);
  const [upcoming, setUpcoming] = useState(FALLBACK_UPCOMING);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const docRef = doc(db, "landing_page", "home");

    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          setFeatures(FALLBACK_FEATURES);
          setUpcoming(FALLBACK_UPCOMING);
          setLoading(false);
          return;
        }
        const data = snap.data();

        // Parse features when stored as map-of-arrays:
        // features: { color: [...], description: [...], icon: [...], title: [...] }
        if (data?.features && typeof data.features === "object") {
          // try map-of-arrays
          const f = data.features;
          const titles = Array.isArray(f.title) ? f.title : [];
          const descriptions = Array.isArray(f.description) ? f.description : [];
          const colors = Array.isArray(f.color) ? f.color : [];
          const icons = Array.isArray(f.icon) ? f.icon : [];

          const maxLen = Math.max(titles.length, descriptions.length, colors.length, icons.length, 0);
          if (maxLen > 0) {
            const built = Array.from({ length: maxLen }).map((_, i) => {
              const iconName = icons[i] ?? null;
              const iconComp = ICON_MAP[iconName] ?? (iconName ? <HelpOutlineOutlinedIcon fontSize="medium" /> : null);

              return {
                icon: iconComp ?? <HelpOutlineOutlinedIcon fontSize="medium" />,
                title: titles[i] ?? `Feature ${i + 1}`,
                description: descriptions[i] ?? "",
                color: colors[i] ?? "#888",
              };
            });
            setFeatures(built);
          } else {
            // fallback: try if features itself is an array of objects
            if (Array.isArray(data.features) && data.features.length) {
              const arr = data.features.map((it) => ({
                icon: ICON_MAP[it.icon] ?? <HelpOutlineOutlinedIcon fontSize="medium" />,
                title: it.title ?? it.name ?? "Untitled",
                description: it.description ?? it.content ?? "",
                color: it.color ?? "#888",
              }));
              setFeatures(arr);
            } else {
              setFeatures(FALLBACK_FEATURES);
            }
          }
        } else if (Array.isArray(data?.features) && data.features.length) {
          // features as array of objects
          const arr = data.features.map((it) => ({
            icon: ICON_MAP[it.icon] ?? <HelpOutlineOutlinedIcon fontSize="medium" />,
            title: it.title ?? it.name ?? "Untitled",
            description: it.description ?? it.content ?? "",
            color: it.color ?? "#888",
          }));
          setFeatures(arr);
        } else {
          setFeatures(FALLBACK_FEATURES);
        }

        // parse upcoming_features (array)
        if (Array.isArray(data?.upcoming_features) && data.upcoming_features.length > 0) {
          setUpcoming(data.upcoming_features);
        } else if (Array.isArray(data?.upcomingFeatures) && data.upcomingFeatures.length > 0) {
          setUpcoming(data.upcomingFeatures);
        } else {
          setUpcoming(FALLBACK_UPCOMING);
        }

        setLoading(false);
      },
      (err) => {
        console.error("Error listening to landing_page/home:", err);
        setError("Failed to load features.");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return (
    <Box
      id="features"
      sx={{
        backgroundColor: "#000000",
        color: "#fff",
        py: { xs: 12, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* decorative background: local uploaded image path (will be transformed to url by your tooling) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('/mnt/data/1a3c2e37-3c3f-498c-a6fd-2a4cf27635d4.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.06,
          zIndex: 0,
        }}
      />

      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h3"
          fontWeight={700}
          align="center"
          gutterBottom
          sx={{
            color: "#ffffff",
            mb: 4,
            mt: 6,
          }}
        >
          Features That Make Traveling Smarter
        </Typography>

        <Typography
          variant="subtitle1"
          color="gray"
          align="center"
          sx={{ maxWidth: 600, mx: "auto", mb: 6 }}
        >
          From planning to exploring — BunkMates keeps every part of your journey effortless,
          fun, and connected.
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={36} color="inherit" />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mb: 4 }}>
            {error}
          </Typography>
        ) : (
          <Grid container spacing={1.3} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Paper
  sx={{
    p: isMobile ? 1 : 3,
    borderRadius: 4,
    display: "flex",
    flexDirection: isMobile ? "row" : "column",
    justifyContent: "flex-start",
    gap: 1.5,
    height: isMobile ? "100px" : "250px",
    width: isMobile ? "100%" : "200px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.01)",
    transition: "0.3s ease",
    position: "relative",
    overflow: "hidden", // ⬅ keeps ripple inside
    "&:hover": {
      boxShadow: `0 0 25px ${feature.color}55`,
      transform: "translateY(-6px)",
      background: "rgba(255, 255, 255, 0.1)",
    },
  }}
                  >
                    {/* Ripple + icon container */}
                    <Box
    sx={{
      position: "relative",
      width: 48,
      height: 48,
      mt: isMobile ? 2 : 0,
      ml: isMobile ? 1 : 0,
      alignSelf: isMobile ? "center" : "flex-start",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
                    >
                      {/* layered ripple background */}
    {[0.00, 0.00, 0.06, 0.00, 0.03, 0.00, 0.06, 0.00, 0.03, 0.00].map((opacity, idx) => (
      <Box
        key={idx}
        sx={{
          position: "absolute",
          width: 48 + idx * 38,
          height: 48 + idx * 38,
          borderRadius: "50%",
          background: `${feature.color}${Math.round(opacity * 255)
            .toString(16)
            .padStart(2, "0")}`,
          filter: `blur(${2 + idx}px)`,
          zIndex: 1,
        }}
      />
    ))}

                      <Box sx={{ zIndex: 2, color: feature.color ?? "#fff" }}>
                        {feature.icon ?? <HelpOutlineOutlinedIcon fontSize="medium" />}
                      </Box>
                    </Box>

                    {/* Text */}
                    <Box sx={{ mt: isMobile ? 0.6 : 8, ml: isMobile ? 2 : 0 }}>
                      <Typography variant="subtitle1" fontWeight={700} color="#fff">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="gray">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Upcoming Features Section */}
        <Box mt={12} textAlign="left" px={4}>
          <Typography variant="h5" fontWeight={700} gutterBottom color="#b0b0b0ff">
            *Upcoming Features
          </Typography>

          <Typography variant="body1" color="gray" sx={{ mb: 4, maxWidth: 700 }}>
            These features will be added via seamless OTA (Over-The-Air) updates.
            Major updates will be listed here, and you’ll be notified through in-app
            messages and emails.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              gap: 0.2,
            }}
          >
            {upcoming.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
              >
                <Typography variant="body1" sx={{ color: "#a0a0a0ff" }}>
                  - {item}
                </Typography>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
