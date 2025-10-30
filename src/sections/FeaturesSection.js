import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
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

const features = [
  {
    icon: <NotificationsActiveOutlinedIcon fontSize="medium" />,
    title: "Live Alerts",
    description: "Instant updates for trip changes, invites, and important moments.",
    color: "#ff7675", // soft red
  },
  {
    icon: <TravelExploreOutlinedIcon fontSize="medium" />,
    title: "Trip Suggestions",
    description: "Smart trip ideas based on your travel style and past adventures.",
    color: "#00cec9", // aqua blue
  },
  {
    icon: <AttractionsOutlinedIcon fontSize="medium" />,
    title: "Nearby Attractions",
    description: "Discover cool spots, cafés, and sights near your travel route.",
    color: "#81ecec", // teal glow
  },
  {
    icon: <AccessAlarmOutlinedIcon fontSize="medium" />,
    title: "Reminders",
    description: "Stay on track with trip, task, and event reminders — auto synced.",
    color: "#f9ca24", // amber yellow
  },
  {
    icon: <CalculateOutlinedIcon fontSize="medium" />,
    title: "Contri & Split",
    description: "Auto calculate and split expenses fairly among your trip mates.",
    color: "#55efc4", // mint green
  },
  {
    icon: <ChatOutlinedIcon fontSize="medium" />,
    title: "Private Chats",
    description: "Connect directly with your friends — anytime, anywhere.",
    color: "#74b9ff", // light blue
  },
  {
    icon: <GroupOutlinedIcon fontSize="medium" />,
    title: "Group Chats",
    description: "Real-time messaging for your entire travel group.",
    color: "#a29bfe", // soft purple
  },
  {
    icon: <WbSunnyOutlinedIcon fontSize="medium" />,
    title: "Weather Updates",
    description: "Check live weather forecasts for your destinations and plans.",
    color: "#fdcb6e", // warm sun orange
  },
  {
    icon: <NoteAltOutlinedIcon fontSize="medium" />,
    title: "Notes & Media",
    description: "Keep all trip notes, photos, and ideas organized together.",
    color: "#e17055", // coral orange
  },
];

const upcomingFeatures = [
  "Auto-save Notes",
  "Improved Trip Suggestions & Nearby Attractions",
  "Enhanced Search Experience",
  "More Interactive Live Alerts",
  "Option to Remove Members from Trip",
  "And many more coming soon...",
];

const FeaturesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      id="features"
      sx={{
        backgroundColor: "#000000",
        color: "#fff",
        py: { xs: 12, md: 10 },
      }}
    >
      <Container>
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
    {/* Layered ripple background (contained) */}
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

    {/* Icon */}
    <Box sx={{ zIndex: 2, color: feature.color }}>{feature.icon}</Box>
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

        {/* Upcoming Features Section */}
        <Box mt={12} textAlign="left" px={4}>
          <Typography variant="h5" fontWeight={700} gutterBottom color="#b0b0b0ff">
            *Upcoming Features
          </Typography>

          <Typography
            variant="body1"
            color="gray"
            sx={{ mb: 4, maxWidth: 700, }}
          >
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
            {upcomingFeatures.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
              >
                <Typography variant="body1" sx={{ color: "#a0a0a0ff" }}>
                  -  {item}
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
