import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Avatar,
  ButtonBase,
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip,
  alpha,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ViewAgendaRoundedIcon from "@mui/icons-material/ViewAgendaRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import AttractionsRoundedIcon from "@mui/icons-material/AttractionsRounded";
import AlarmOnRoundedIcon from "@mui/icons-material/AlarmOnRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import NoteAltRoundedIcon from "@mui/icons-material/NoteAltRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useCustomTheme } from "../context/ThemeContext";

// Material 3 Expressive Tonal Palettes
const M3_EXPRESSIVE_PALETTE = {
  blue: {
    accent: "#88b7f0",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, #0e346e8c 0%, #09090b 75%)",
    light: { bg: "#D7E3FF", text: "#001B3F", container: "#EEF2FF", onContainer: "#004785", badgeBg: "#BACDF8" },
    dark: { bg: "#d3e7ff", text: "#203362", container: "#e2f0ff", onContainer: "#457ed8", badgeBg: "#003F7D" },
  },
  amber: {
    accent: "#f5d397",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(110, 75, 0, 0.55) 0%, #09090b 75%)",
    light: { bg: "#FFDEA5", text: "#271900", container: "#FFF2D9", onContainer: "#765B00", badgeBg: "#F0CA85" },
    dark: { bg: "#ffefbe", text: "#271900", container: "#fff5e2", onContainer: "#d99f17", badgeBg: "#594300" },
  },
  emerald: {
    accent: "#8cefcb",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(0, 85, 42, 0.55) 0%, #09090b 75%)",
    light: { bg: "#A6F5BA", text: "#00210E", container: "#DBFCE3", onContainer: "#006D37", badgeBg: "#8CE3A3" },
    dark: { bg: "#b6ffd7", text: "#21542e", container: "#e4fff0", onContainer: "#17c14d", badgeBg: "#005228" },
  },
  orange: {
    accent: "#ffd6b4",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(115, 45, 0, 0.55) 0%, #09090b 75%)",
    light: { bg: "#FFDBCA", text: "#341000", container: "#FFECE2", onContainer: "#984013", badgeBg: "#F6C1A7" },
    dark: { bg: "#ffdac5", text: "#703e26", container: "#ffeae2", onContainer: "#fb712c", badgeBg: "#772F03" },
  },
  purple: {
    accent: "#c8b6ff",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(75, 36, 140, 0.55) 0%, #09090b 75%)",
    light: { bg: "#EBDCFF", text: "#25005A", container: "#F6EEFF", onContainer: "#6940A5", badgeBg: "#D4BFF2" },
    dark: { bg: "#e2d1ff", text: "#44236f", container: "#ecdeff", onContainer: "#a473ff", badgeBg: "#422271" },
  },
};

const FALLBACK_BUNKMATE_FEATURES = [
  {
    id: "trip-reminders",
    tag: "Schedules",
    title: "Reminders",
    description: "Stay on track with trips, tasks, and event reminders — auto synced.",
    secondaryTitle: "Automated Time, Activity & Packing Alarms",
    longDescription:
      "Coordinate departures, check-in deadlines, shared tasks, and excursion timings with synchronized reminders delivered directly to every traveler in the group.",
    paletteKey: "amber",
    category: "Planning",
    previewType: "reminders",
  },
  {
    id: "weather-updates",
    tag: "Forecast",
    title: "Weather Updates",
    description: "Check live weather forecasts for your destinations and plans.",
    secondaryTitle: "Multi-Stop Live Forecasts & AQI Metrics",
    longDescription:
      "Stay ahead of sudden mountain rain, temperature shifts, and air quality index variations along all upcoming checkpoints in your journey schedule.",
    paletteKey: "amber",
    category: "Planning",
    previewType: "dashboard",
  },  
  {
    id: "notes-media",
    tag: "Vault",
    title: "Notes & Media",
    description: "Keep all trip lists, todos, notes and ideas organised together.",
    secondaryTitle: "Centralized Packing Checklists & Document Vault",
    longDescription:
      "Store hotel reservation confirmations, trail permits, packing checklists, and shared trip memories in one collaborative offline-accessible hub.",
    paletteKey: "orange",
    category: "Offline",
    previewType: "timeline",
  },  
  {
    id: "live-alerts",
    tag: "Safety",
    title: "Live Alerts",
    description: "Instant updates for trip changes, invites, and important moments.",
    secondaryTitle: "Real-Time Group Pushes & Urgent Checkpoints",
    longDescription:
      "Keep everyone aware of emergency notifications, route modifications, meeting point changes, and immediate itinerary updates as soon as they happen on the road.",
    paletteKey: "orange",
    category: "Planning",
    previewType: "alerts",
  },
  {
    id: "nearby-attractions",
    tag: "Explore",
    title: "Nearby Attractions",
    description: "Discover cool spots, cafés, and sights near your travel route.",
    secondaryTitle: "Hidden Gems & Trailside Discoveries",
    longDescription:
      "Pinpoint popular landmarks, authentic roadside diners, fuel stops, and hidden viewpoints along your active driving or hiking trail without switching mapping apps.",
    paletteKey: "blue",
    category: "Planning",
    previewType: "attractions",
  },
  {
    id: "private-chats",
    tag: "Direct",
    title: "Private Chats",
    description: "Connect directly with your friends — anytime, anywhere.",
    secondaryTitle: "End-to-End Direct Messaging & Location Pins",
    longDescription:
      "Send 1-on-1 direct messages, shared coordinates, private voice memos, and direct photos within the trip network without cluttering the group feed.",
    paletteKey: "blue",
    category: "Social",
    previewType: "chat",
  },
  {
    id: "group-chats",
    tag: "Squads",
    title: "Group Chats",
    description: "Real-time messaging for your entire travel group.",
    secondaryTitle: "Context-Aware Trip Squad Communication",
    longDescription:
      "Centralize all announcements, spontaneous coordination, itinerary updates, and group polls in a dedicated room attached to your active journey.",
    paletteKey: "purple",
    category: "Social",
    previewType: "chat",
  },
  {
    id: "trips-suggestions",
    tag: "Discovery",
    title: "Trips Suggestions",
    description: "Smart trips ideas based on travel style and past adventures.",
    secondaryTitle: "AI-Powered Destination & Itinerary Suggestions",
    longDescription:
      "Get tailored journey recommendations, route ideas, and curated spots based on your squad's past itineraries, travel pace, and preference for nature, cityscapes, or thrill-seeking.",
    paletteKey: "emerald",
    category: "Planning",
    previewType: "suggestions",
  },  
  {
    id: "contri-split",
    tag: "Expenses",
    title: "Contri & Split",
    description: "Auto calculate and split expenses fairly among your trip mates.",
    secondaryTitle: "Smart Multi-Currency Split & Ledger",
    longDescription:
      "Track shared bills, group contributions, and balances without confusion or spreadsheets, ensuring automatic mathematical distribution at every transaction.",
    paletteKey: "emerald",
    category: "Finance",
    previewType: "expenses",
  }, 

];

const FALLBACK_UPCOMING = [
  "AI itinerary generation from shared links and reels",
  "Offline maps with custom places and trail pins",
  "Faster UPI and multi-currency squad settlements",
  "Interactive trip scrapbook and memory reels",
  "Collaborative packing checklists with weight estimator",
  "Real-time flight and train gate status updates",
];

const CATEGORIES = ["All", "Planning", "Finance", "Social", "Offline"];



const getPreviewIcon = (type) => {
  switch (type) {
    case "suggestions":
      return ExploreRoundedIcon;
    case "alerts":
      return NotificationsActiveRoundedIcon;
    case "attractions":
      return AttractionsRoundedIcon;
    case "reminders":
      return AlarmOnRoundedIcon;
    case "expenses":
      return CalculateRoundedIcon;
    case "chat":
      return GroupsRoundedIcon;
    case "private-chat":
      return PersonRoundedIcon;
    case "dashboard":
    case "weather":
      return WbSunnyRoundedIcon;
    case "timeline":
    case "notes":
      return NoteAltRoundedIcon;
    default:
      return ExploreRoundedIcon;
  }
};

const BunkMateFeatureMockup = ({ type, isDark, m3Theme }) => {
  const BackgroundIcon = getPreviewIcon(type);

  const basePreview = {
    width: "100%",
    minHeight: 195,
    borderRadius: "22px",
    backgroundColor: m3Theme.container,
    border: `1px solid ${alpha(m3Theme.onContainer, 0.2)}`,
    overflow: "hidden",
    position: "relative",
  };

  return (
    <Box sx={basePreview}>
      {/* M3 Watermark Background Icon */}
      <Box
        sx={{
          position: "absolute",
          bottom: -22,
          right: -22,
          zIndex: 0,
          pointerEvents: "none",
          transform: "rotate(-12deg)",
          opacity: isDark ? 0.16 : 0.14,
        }}
      >
        <BackgroundIcon
          sx={{
            fontSize: { xs: 145, sm: 180 },
            color: m3Theme.onContainer,
          }}
        />
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: { xs: 1.8, sm: 2.2 },
        }}
      >
        {/* 1. Trips Suggestions */}
        {type === "suggestions" && (
          <>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "10px",
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: alpha(m3Theme.onContainer, 0.15),
                    border: `1px solid ${alpha(m3Theme.onContainer, 0.25)}`,
                  }}
                >
                  <ExploreRoundedIcon sx={{ fontSize: 18, color: m3Theme.onContainer }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.7rem", color: alpha(m3Theme.text, 0.75), lineHeight: 1 }}>
                    Curated Recommendation
                  </Typography>
                  <Typography sx={{ fontSize: "0.82rem", color: m3Theme.text, fontWeight: 700, mt: 0.3 }}>
                    Spiti High Pass Circuit
                  </Typography>
                </Box>
              </Stack>
              <Box
                sx={{
                  px: 1.2,
                  py: 0.4,
                  borderRadius: "999px",
                  backgroundColor: alpha(m3Theme.onContainer, 0.15),
                  border: `1px solid ${alpha(m3Theme.onContainer, 0.3)}`,
                }}
              >
                <Typography sx={{ fontSize: "0.68rem", color: m3Theme.onContainer, fontWeight: 700 }}>
                  98% Match
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                p: 1.4,
                mt: 1.2,
                borderRadius: "16px",
                backgroundColor: m3Theme.bg,
                border: `1px solid ${alpha(m3Theme.onContainer, 0.2)}`,
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
              }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.4 }}>
                <AutoAwesomeRoundedIcon sx={{ fontSize: 13, color: m3Theme.onContainer }} />
                <Typography sx={{ fontSize: "0.65rem", color: m3Theme.onContainer, fontWeight: 800, letterSpacing: "0.05em" }}>
                  BASED ON PAST ADVENTURES
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: "0.88rem", fontWeight: 750, color: m3Theme.text, mb: 0.2 }}>
                Scenic Off-road · Stargazing Camp
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: alpha(m3Theme.text, 0.75) }}>
                Tailored for 4x4 overland squads & high-altitude trails
              </Typography>
            </Box>
          </>
        )}

        {/* 2. Live Alerts */}
        {type === "alerts" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, my: "auto" }}>
            <Box
              sx={{
                p: 1.3,
                borderRadius: "16px",
                backgroundColor: m3Theme.bg,
                border: `1px solid ${alpha(m3Theme.onContainer, 0.35)}`,
                display: "flex",
                alignItems: "center",
                gap: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: alpha("#ef4444", 0.15),
                  color: "#ef4444",
                  flexShrink: 0,
                }}
              >
                <PriorityHighRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: "0.78rem", fontWeight: 750, color: m3Theme.text }}>
                  Route Diverted: Rohtang Pass Closed
                </Typography>
                <Typography sx={{ fontSize: "0.68rem", color: alpha(m3Theme.text, 0.75) }}>
                  Rerouting via Atal Tunnel · +15 mins saved
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                p: 1.2,
                borderRadius: "14px",
                backgroundColor: alpha(m3Theme.onContainer, 0.12),
                display: "flex",
                alignItems: "center",
                gap: 1.2,
              }}
            >
              <NotificationsActiveRoundedIcon sx={{ fontSize: 18, color: m3Theme.onContainer }} />
              <Typography sx={{ fontSize: "0.72rem", color: m3Theme.text, fontWeight: 600 }}>
                Aman updated the rendezvous point to Dhankar Monastery
              </Typography>
            </Box>
          </Box>
        )}

        {/* 3. Nearby Attractions */}
        {type === "attractions" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, my: "auto" }}>
            {[
              { name: "Hidden Waterfall Café", dist: "0.8 km", tag: "Food & Chill" },
              { name: "Monastery Sunset Point", dist: "2.4 km", tag: "Scenic Spot" },
              { name: "High-Altitude Fuel Depot", dist: "4.1 km", tag: "Utility" },
            ].map((spot, idx) => (
              <Box
                key={spot.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1.4,
                  py: 0.85,
                  borderRadius: "14px",
                  backgroundColor: idx === 0 ? m3Theme.bg : alpha(m3Theme.onContainer, 0.08),
                  border: `1px solid ${idx === 0 ? alpha(m3Theme.onContainer, 0.3) : "transparent"}`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <PlaceRoundedIcon sx={{ fontSize: 17, color: m3Theme.onContainer }} />
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: m3Theme.text }}>
                      {spot.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.62rem", color: alpha(m3Theme.text, 0.7) }}>
                      {spot.tag}
                    </Typography>
                  </Box>
                </Stack>
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: m3Theme.onContainer }}>
                  {spot.dist}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* 4. Reminders */}
        {type === "reminders" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, my: "auto" }}>
            {[
              { task: "Pack thermal gear & powerbanks", time: "Tomorrow, 6:00 AM", done: true },
              { task: "Vehicle permit verification check", time: "Tomorrow, 9:30 AM", done: false },
              { task: "Check-in at Kaza Homestay", time: "Tomorrow, 4:00 PM", done: false },
            ].map((rem, idx) => (
              <Box
                key={rem.task}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1.4,
                  py: 0.9,
                  borderRadius: "14px",
                  backgroundColor: rem.done ? alpha(m3Theme.onContainer, 0.08) : m3Theme.bg,
                  border: `1px solid ${!rem.done ? alpha(m3Theme.onContainer, 0.25) : "transparent"}`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeFilledRoundedIcon sx={{ fontSize: 16, color: rem.done ? alpha(m3Theme.onContainer, 0.5) : m3Theme.onContainer }} />
                  <Typography
                    sx={{
                      fontSize: "0.74rem",
                      fontWeight: 650,
                      color: m3Theme.text,
                      textDecoration: rem.done ? "line-through" : "none",
                      opacity: rem.done ? 0.65 : 1,
                    }}
                  >
                    {rem.task}
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: m3Theme.onContainer }}>
                  {rem.time.split(",")[1]}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* 5. Contri & Split */}
        {type === "expenses" && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", my: "auto", textAlign: "center" }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "13px",
                display: "grid",
                placeItems: "center",
                mb: 0.8,
                backgroundColor: alpha(m3Theme.onContainer, 0.15),
                border: `1px solid ${alpha(m3Theme.onContainer, 0.3)}`,
              }}
            >
              <CalculateRoundedIcon sx={{ fontSize: 24, color: m3Theme.onContainer }} />
            </Box>
            <Typography sx={{ fontSize: "0.66rem", color: m3Theme.onContainer, fontWeight: 750, letterSpacing: "0.08em" }}>
              CURRENT TOTAL POT
            </Typography>
            <Typography sx={{ fontSize: "1.95rem", fontWeight: 850, color: m3Theme.text, letterSpacing: "-0.05em", my: 0.2 }}>
              ₹24,500
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: alpha(m3Theme.text, 0.75), fontWeight: 600 }}>
              ₹4,900 / person · Split equally among 5
            </Typography>
          </Box>
        )}

        {/* 6 & 7. Group and Private Chats */}
        {type === "chat" && (
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 1 }}>
            <Stack direction="row" spacing={0.8} alignItems="flex-end" sx={{ maxWidth: "88%", alignSelf: "flex-start" }}>
              <Avatar sx={{ width: 20, height: 20, fontSize: "0.6rem", fontWeight: 700, bgcolor: m3Theme.badgeBg, color: m3Theme.onContainer }}>
                A
              </Avatar>
              <Box sx={{ px: 1.2, py: 0.7, borderRadius: "18px 18px 18px 4px", backgroundColor: m3Theme.bg, border: `1px solid ${alpha(m3Theme.onContainer, 0.2)}` }}>
                <Typography sx={{ fontSize: "0.72rem", color: m3Theme.text, lineHeight: 1.3 }}>
                  Basecamp reached. Pinning coordinates 📍
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ alignSelf: "flex-end", maxWidth: "82%", px: 1.2, py: 0.7, borderRadius: "18px 18px 4px 18px", backgroundColor: m3Theme.onContainer, color: m3Theme.bg }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: m3Theme.bg, lineHeight: 1.3 }}>
                Refueled 4x4. 15 mins away 🚙
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.8} alignItems="flex-end" sx={{ maxWidth: "88%", alignSelf: "flex-start" }}>
              <Avatar sx={{ width: 20, height: 20, fontSize: "0.6rem", fontWeight: 700, bgcolor: alpha("#f59e0b", 0.2), color: "#f59e0b" }}>
                S
              </Avatar>
              <Box sx={{ px: 1.2, py: 0.7, borderRadius: "18px 18px 18px 4px", backgroundColor: m3Theme.bg, border: `1px solid ${alpha(m3Theme.onContainer, 0.2)}` }}>
                <Typography sx={{ fontSize: "0.72rem", color: m3Theme.text, lineHeight: 1.3 }}>
                  Offline passes verified by forest guard 👍
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ alignSelf: "flex-end", maxWidth: "78%", px: 1.2, py: 0.65, borderRadius: "18px 18px 4px 18px", backgroundColor: m3Theme.onContainer, color: m3Theme.bg }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: m3Theme.bg, lineHeight: 1.3 }}>
                Adding permit fees to pot ⚡
              </Typography>
            </Box>
          </Box>
        )}

        {/* 8. Weather Updates / Dashboard */}
        {type === "dashboard" && (
          <>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "10px",
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: alpha(m3Theme.onContainer, 0.15),
                    border: `1px solid ${alpha(m3Theme.onContainer, 0.25)}`,
                  }}
                >
                  <WbSunnyRoundedIcon sx={{ fontSize: 18, color: m3Theme.onContainer }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.7rem", color: alpha(m3Theme.text, 0.75), lineHeight: 1 }}>
                    Live Forecast · Multi-Stop
                  </Typography>
                  <Typography sx={{ fontSize: "0.82rem", color: m3Theme.text, fontWeight: 700, mt: 0.3 }}>
                    28°C · Clear Visibility
                  </Typography>
                </Box>
              </Stack>
              <Box
                sx={{
                  px: 1.2,
                  py: 0.4,
                  borderRadius: "999px",
                  backgroundColor: alpha(m3Theme.onContainer, 0.15),
                  border: `1px solid ${alpha(m3Theme.onContainer, 0.3)}`,
                }}
              >
                <Typography sx={{ fontSize: "0.68rem", color: m3Theme.onContainer, fontWeight: 700 }}>
                  AQI 32 (Good)
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                p: 1.5,
                mt: 1.2,
                borderRadius: "16px",
                backgroundColor: m3Theme.bg,
                border: `1px solid ${alpha(m3Theme.onContainer, 0.2)}`,
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
              }}
            >
              <Typography sx={{ fontSize: "0.65rem", color: m3Theme.onContainer, fontWeight: 800, letterSpacing: "0.05em", mb: 0.3 }}>
                NEXT CHECKPOINT
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 750, color: m3Theme.text, mb: 0.3 }}>
                Kunzum Pass (4,551 m)
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: alpha(m3Theme.text, 0.75) }}>
                Light breeze · Wind 14 km/h · Zero rain probability
              </Typography>
            </Box>
          </>
        )}

        {/* 9. Notes & Media / Timeline */}
        {type === "timeline" && (
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 1, my: "auto" }}>
            {["Wilderness Pass PDF", "Offline Topo Map", "Emergency Contact Beacon"].map((item, index) => (
              <Box
                key={item}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.4,
                  py: 0.8,
                  borderRadius: "14px",
                  backgroundColor: index === 1 ? alpha(m3Theme.onContainer, 0.15) : m3Theme.bg,
                  border: `1px solid ${alpha(m3Theme.onContainer, 0.25)}`,
                }}
              >
                {index === 1 ? (
                  <PlaceRoundedIcon sx={{ fontSize: 17, color: m3Theme.onContainer }} />
                ) : (
                  <NoteAltRoundedIcon sx={{ fontSize: 17, color: m3Theme.onContainer }} />
                )}
                <Typography sx={{ fontSize: "0.74rem", color: m3Theme.text, fontWeight: 600 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const FeaturesSection = () => {
  const { isDark } = useCustomTheme();
  const [features, setFeatures] = useState(FALLBACK_BUNKMATE_FEATURES);
  const [upcoming, setUpcoming] = useState(FALLBACK_UPCOMING);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const [enableTilt, setEnableTilt] = useState(true);
  const [viewMode, setViewMode] = useState("deck");

  const cardRefs = useRef([]);

  const colors = {
    background: isDark ? "#09090b" : "#fcfcfd",
    surface: isDark ? "#121215" : "#f4f4f6",
    surfaceStrong: isDark ? "#18181b" : "#ffffff",
    text: isDark ? "#fafafa" : "#09090b",
    secondaryText: isDark ? "#a1a1aa" : "#71717a",
    border: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
    subtleBorder: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  useEffect(() => {
    const docRef = doc(db, "landing_page", "home");
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          setFeatures(FALLBACK_BUNKMATE_FEATURES);
          setUpcoming(FALLBACK_UPCOMING);
          return;
        }

        const data = snap.data();
        if (Array.isArray(data?.features) && data.features.length) {
          const keys = ["blue", "amber", "emerald", "orange", "purple"];
          const arr = data.features.map((it, idx) => ({
            id: it.id ?? `feat-${idx}`,
            tag: it.tag ?? it.category ?? "Feature",
            title: it.title ?? it.name ?? "BunkMates Tool",
            description: it.description ?? it.content ?? "",
            paletteKey: keys[idx % keys.length],
            category:
              it.category ??
              (idx % 3 === 0 ? "Planning" : idx % 3 === 1 ? "Finance" : "Social"),
            previewType:
              it.previewType ??
              (idx % 5 === 0
                ? "dashboard"
                : idx % 5 === 1
                ? "qr-squad"
                : idx % 5 === 2
                ? "expenses"
                : idx % 5 === 3
                ? "chat"
                : "timeline"),
          }));
          setFeatures(arr);
        } else {
          setFeatures(FALLBACK_BUNKMATE_FEATURES);
        }

        if (Array.isArray(data?.upcoming_features) && data.upcoming_features.length > 0) {
          setUpcoming(data.upcoming_features);
        } else {
          setUpcoming(FALLBACK_UPCOMING);
        }
      },
      (err) => {
        console.error("Error listening to features:", err);
        setFeatures(FALLBACK_BUNKMATE_FEATURES);
        setUpcoming(FALLBACK_UPCOMING);
      }
    );

    return () => unsub();
  }, []);

  const filteredFeatures =
    selectedCategory === "All"
      ? features
      : features.filter((feature) => feature.category === selectedCategory);

  useEffect(() => {
    if (viewMode === "grid") return;

    const handleScroll = () => {
      if (!cardRefs.current.length) return;

      const triggerY = window.innerHeight * 0.45;
      let currentIdx = 0;

      for (let i = 0; i < cardRefs.current.length; i++) {
        const el = cardRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY) {
            currentIdx = i;
          }
        }
      }

      setActiveCardIndex((prev) => (prev !== currentIdx ? currentIdx : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredFeatures, viewMode]);

  const scrollToCard = (index) => {
    setActiveCardIndex(index);
    if (cardRefs.current[index]) {
      const topOffset = cardRefs.current[index].getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const activeFeature = filteredFeatures[activeCardIndex] || filteredFeatures[0] || FALLBACK_BUNKMATE_FEATURES[0];
  const activePalette = M3_EXPRESSIVE_PALETTE[activeFeature?.paletteKey] || M3_EXPRESSIVE_PALETTE.blue;
  const activeAccent = activePalette.accent;

  return (
    <Box
      id="features"
      sx={{
        position: "relative",
        py: { xs: 5, sm: 10, md: 16 },
        // m: 3,
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      {/* Dynamic Ambient Gradient Backdrop */}
          {/* <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: isDark
                ? activePalette.ambientGradient
                : `radial-gradient(ellipse at 90% 10%, ${alpha(activeAccent, 0.12)} 0%, #000000 75%)`,
              transition: "background 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          /> */}

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, px: { xs: 2, sm: 4, md: 6 } }}>

        {/* Master Content Area */}
        {viewMode === "deck" ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1.25fr" },
              gap: { xs: 3, lg: 8 },
              alignItems: "start",
              px: 3,
            }}
          >
            {/* LEFT SECTION (Interactive Synchronized Viewport) */}
            <Box
              sx={{
                position: "sticky",
                top: { xs: 75, lg: 250 },
                pt: { xs: 2, lg: 0 },
                pb: { xs: 10, lg: 0 },
                zIndex: { xs: 40, lg: 10 },
                backdropFilter: { xs: "blur(16px)", lg: "none" },
                backgroundColor: {
                  xs: isDark ? "rgba(9, 9, 11, 0.85)" : "rgba(252, 252, 253, 0.85)",
                  lg: "transparent",
                },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, lg: 2.5 },
              }}
            >
              {/* Badge Tag */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,
                  px: 1.4,
                  py: 0.5,
                  borderRadius: "999px",
                  boxShadow: `inset 0 1px 1px ${alpha(activeAccent, 0.35)}, 0 1px 0px rgba(0,0,0,0.1)`,
                  backgroundColor: alpha(activeAccent, isDark ? 0.12 : 0.08),
                  width: "fit-content",
                }}
              >
                <SparklesIcon sx={{ fontSize: 15, color: activeAccent }} />
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 750, letterSpacing: "0.04em", color: activeAccent }}>
                  FEATURES HIGHLIGHT · 0{activeCardIndex + 1}
                </Typography>
              </Box>

              {/* Dynamic Title with Animated Crossfade */}
              <Box sx={{ minHeight: { xs: 85, sm: 110, lg: 150 } }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature?.id || "header-text"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: "2.85rem", sm: "2.4rem", md: "3.2rem", lg: "3.5rem" },
                        lineHeight: 1.08,
                        fontWeight: 850,
                        color: colors.text,
                        letterSpacing: "-0.04em",
                        mb: { xs: 0.5, lg: 1.2 },
                      }}
                    >
                      {activeFeature?.secondaryTitle}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1.05rem" },
                        lineHeight: 1.55,
                        color: colors.secondaryText,
                      }}
                    >
                      {activeFeature?.longDescription}
                    </Typography>
                  </motion.div>
                </AnimatePresence>
              </Box>

              {/* Interactive Card Step Timeline */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ my: 0.5 }}>
                {filteredFeatures.map((f, i) => (
                  <ButtonBase
                    key={f.id || i}
                    sx={{
                      height: 6,
                      width: i === activeCardIndex ? 36 : 14,
                      borderRadius: 3,
                      backgroundColor: i === activeCardIndex ? activeAccent : alpha(colors.text, 0.2),
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                ))}
              </Stack>

            </Box>

            {/* RIGHT SECTION: Sticky Stacking Deck */}
            <Box sx={{ position: "relative", pb: { xs: 8, md: 14 }, zIndex: { xs: 40, lg: 10 }, }}>
              {filteredFeatures.map((feature, index) => {
                const tiltDegree = enableTilt ? (index % 2 === 0 ? -1 : 1) * (3.5 - (index % 2) * 1) : 0;
                const palette = M3_EXPRESSIVE_PALETTE[feature.paletteKey] || M3_EXPRESSIVE_PALETTE.blue;
                const m3Theme = isDark ? palette.dark : palette.light;

                return (
                  <Box
                    key={feature.id || index}
                    ref={(el) => (cardRefs.current[index] = el)}
                    sx={{
                      position: "sticky",
                      top: { xs: 475, sm: 295, lg: 220 },
                      zIndex: index + 1,
                      mb: index === filteredFeatures.length - 1 ? 0 : { xs: 14, sm: 20, md: 24 },
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        width: "100%",
                        maxWidth: 560,
                        p: { xs: 2.2, sm: 3.5 },
                        borderRadius: { xs: "24px", sm: "30px" },
                        backgroundColor: m3Theme.bg,
                        color: m3Theme.text,
                        boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.07), 0 1px 0px rgba(0, 0, 0, 0.18)',
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: 1.8, sm: 2.5 },
                        transform: `rotate(${tiltDegree}deg)`,
                        position: "relative",
                        overflow: "hidden",
                        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
                      }}
                    >
                      <Box>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.2 }}>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              px: 1.3,
                              py: 0.45,
                              borderRadius: "999px",
                              backgroundColor: m3Theme.badgeBg,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.68rem",
                                textTransform: "uppercase",
                                fontWeight: 800,
                                letterSpacing: "0.08em",
                                color: m3Theme.onContainer,
                              }}
                            >
                              {feature.tag || feature.category || "Feature"}
                            </Typography>
                          </Box>

                          <Typography
                            sx={{
                              fontSize: "0.78rem",
                              fontWeight: 800,
                              color: m3Theme.onContainer,
                              opacity: 0.9,
                            }}
                          >
                            0{index + 1} / 0{filteredFeatures.length}
                          </Typography>
                        </Stack>

                        <Typography
                          sx={{
                            fontSize: { xs: "1.15rem", sm: "1.45rem" },
                            lineHeight: 1.2,
                            fontWeight: 850,
                            letterSpacing: "-0.04em",
                            color: m3Theme.text,
                            mb: 0.8,
                          }}
                        >
                          {feature.title}
                        </Typography>

                        <Typography sx={{ fontSize: { xs: "0.82rem", sm: "0.9rem" }, lineHeight: 1.55, color: alpha(m3Theme.text, 0.8) }}>
                          {feature.description}
                        </Typography>
                      </Box>

                      <BunkMateFeatureMockup
                        type={feature.previewType || "dashboard"}
                        isDark={isDark}
                        m3Theme={m3Theme}
                      />
                    </Paper>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : (
          /* Grid View Mode */
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" },
              gap: 3,
              pb: { xs: 8, md: 14 },
            }}
          >
            {filteredFeatures.map((feature, index) => {
              const palette = M3_EXPRESSIVE_PALETTE[feature.paletteKey] || M3_EXPRESSIVE_PALETTE.blue;
              const m3Theme = isDark ? palette.dark : palette.light;

              return (
                <Paper
                  key={feature.id || index}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "26px",
                    backgroundColor: m3Theme.bg,
                    color: m3Theme.text,
                    border: `1.5px solid ${alpha(m3Theme.onContainer, isDark ? 0.35 : 0.25)}`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 2.5,
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        px: 1.2,
                        py: 0.4,
                        borderRadius: "999px",
                        backgroundColor: m3Theme.badgeBg,
                        mb: 1.5,
                      }}
                    >
                      <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: m3Theme.onContainer }}>
                        {feature.tag}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: m3Theme.text, mb: 0.8 }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ fontSize: "0.85rem", color: alpha(m3Theme.text, 0.8) }}>
                      {feature.description}
                    </Typography>
                  </Box>

                  <BunkMateFeatureMockup type={feature.previewType} isDark={isDark} m3Theme={m3Theme} />
                </Paper>
              );
            })}
          </Box>
        )}

        {/* ROADMAP OVERLAY BANNER (Slides & Stacks Over All Components at the End) */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          sx={{
            position: "relative",
            zIndex: 100, // Elevated to stack on top of all deck cards
            mt: { xs: 4, md: 8 },
            mb: { xs: 2, md: 4 },
            p: { xs: 3, sm: 5, md: 6.5 },
            borderRadius: { xs: "28px", md: "40px" },
            overflow: "hidden",
          }}
        >
          {/* Subtle Ambient Radial Glow inside the overlay */}
          <Box
            sx={{
              position: "absolute",
              top: -60,
              left: -60,
              width: 250,
              height: 250,
              borderRadius: "50%",
              backgroundColor: activeAccent,
              opacity: isDark ? 0.12 : 0.08,
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: -60,
              right: -60,
              width: 250,
              height: 250,
              borderRadius: "50%",
              backgroundColor: activeAccent,
              opacity: isDark ? 0.12 : 0.08,
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          {/* Large Watermark Icon in Bottom Right */}
          <LuggageRoundedIcon
            sx={{
              position: "absolute",
              bottom: -40,
              right: -30,
              fontSize: { xs: 180, sm: 260, md: 340 },
              color: isDark ? "#ffffff" : "#000000",
              opacity: isDark ? 0.04 : 0.03,
              transform: "rotate(-15deg)",
              pointerEvents: "none",
            }}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={{ xs: 4, md: 6 }}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box sx={{ maxWidth: 460 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "16px",
                  mb: 2.2,
                  backgroundColor: alpha(activeAccent, 0.15),
                  border: `1px solid ${alpha(activeAccent, 0.3)}`,
                  color: activeAccent,
                }}
              >
                <TravelExploreRoundedIcon sx={{ fontSize: 26 }} />
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" },
                  lineHeight: 1.05,
                  fontWeight: 850,
                  letterSpacing: "-0.045em",
                  color: colors.text,
                  mb: 1.5,
                }}
              >
                Still packing more into <Typography sx={{ fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" }, fontWeight: 850, color: colors.secondaryText }}>BunkMates.</Typography>
              </Typography>

              <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.7, color: colors.secondaryText }}>
                BunkMates keeps evolving with new ways to plan, coordinate, and experience trips together.
              </Typography>
            </Box>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.3 }}>
              {upcoming.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.35 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.4,
                      px: 1.8,
                      py: 1.35,
                      borderRadius: "18px",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(10px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "10px",
                        backgroundColor: alpha(activeAccent, 0.15),
                        border: `1px solid ${alpha(activeAccent, 0.3)}`,
                        color: activeAccent,
                      }}
                    >
                      <CheckRoundedIcon sx={{ fontSize: 16 }} />
                    </Box>

                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: colors.text }}>
                      {item}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;