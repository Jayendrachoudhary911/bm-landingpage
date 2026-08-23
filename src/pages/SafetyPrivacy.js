import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  alpha,
  Divider,
  Button,
} from "@mui/material";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { useCustomTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const M3_EXPRESSIVE_PALETTE = {
  blue: {
    accent: "#88b7f0",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, #0e346e8c 0%, #09090b 75%)",
    light: { bg: "#D7E3FF", text: "#001B3F", container: "#EEF2FF", onContainer: "#004785", badgeBg: "#BACDF8" },
    dark: { bg: "#d3e7ff", text: "#203362", container: "#e2f0ff", onContainer: "#457ed8", badgeBg: "#003F7D" },
  },
  emerald: {
    accent: "#8cefcb",
    light: { bg: "#A6F5BA", text: "#00210E", container: "#DBFCE3", onContainer: "#006D37" },
    dark: { bg: "#b6ffd7", text: "#21542e", container: "#e4fff0", onContainer: "#17c14d" },
  },
  purple: {
    accent: "#c8b6ff",
    light: { bg: "#EBDCFF", text: "#25005A", container: "#F6EEFF", onContainer: "#6940A5" },
    dark: { bg: "#e2d1ff", text: "#44236f", container: "#ecdeff", onContainer: "#a473ff" },
  },
  orange: {
    accent: "#ffd6b4",
    light: { bg: "#FFDBCA", text: "#341000", container: "#FFECE2", onContainer: "#984013" },
    dark: { bg: "#ffdac5", text: "#703e26", container: "#ffeae2", onContainer: "#fb712c" },
  },
  amber: {
    accent: "#f5d397",
    light: { bg: "#FFDEA5", text: "#271900", container: "#FFF2D9", onContainer: "#765B00" },
    dark: { bg: "#ffefbe", text: "#271900", container: "#fff5e2", onContainer: "#d99f17" },
  },
};

const privacyPrinciples = [
  {
    icon: LockRoundedIcon,
    title: "End-to-End Encryption",
    desc: "Squad chats, split records, and trip itineraries are encrypted during transit and at rest using modern enterprise encryption standards.",
    palette: M3_EXPRESSIVE_PALETTE.blue,
  },
  {
    icon: VisibilityOffRoundedIcon,
    title: "Zero Data Brokerage",
    desc: "We never sell, rent, or trade your personal information, travel itineraries, or contact details to third-party ad networks.",
    palette: M3_EXPRESSIVE_PALETTE.emerald,
  },
  {
    icon: FingerprintRoundedIcon,
    title: "Granular Squad Permissions",
    desc: "You control who views budget balances, edits checklist items, or enters shared group channels at any given point.",
    palette: M3_EXPRESSIVE_PALETTE.purple,
  },
  {
    icon: CloudDoneRoundedIcon,
    title: "Safe Offline Vaults",
    desc: "Locally cached tickets, boarding passes, and notes stay contained within secure sandboxed on-device storage.",
    palette: M3_EXPRESSIVE_PALETTE.orange,
  },
];

const policyBreakdowns = [
  {
    title: "Information We Collect",
    points: [
      "Account credentials provided during authentication (Name, Email).",
      "Trip coordination metadata including stop markers, expense splits, and checklist entries.",
      "Diagnostic and performance crash analytics used strictly to optimize stability.",
    ],
  },
  {
    title: "How We Utilize Trip Data",
    points: [
      "Real-time squad synchronization across mobile and web interfaces.",
      "Automated calculation and balancing of shared group expenses.",
      "Push notification dispatching for itinerary modifications and flight updates.",
    ],
  },
  {
    title: "Your Privacy Rights & Controls",
    points: [
      "Permanent account and associated trip data deletion upon direct request.",
      "Export capability for all personal trip archives and historical split ledgers.",
      "Selective opt-outs for non-essential service communication and telemetry.",
    ],
  },
];

export default function SafetyPrivacyPage() {
  const { isDark } = useCustomTheme();
  const navigate = useNavigate();

  const blueTheme = M3_EXPRESSIVE_PALETTE.blue;

  const colors = {
    background: isDark ? "#000000" : "#f1f3f5",
    surface: isDark ? "#0d0e12" : "#ffffff",
    surfaceInner: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
    text: isDark ? "#ffffff" : "#09090b",
    secondaryText: isDark ? "#a1a1aa" : "#64748b",
    border: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: { xs: 12, sm: 14, md: 16 },
          pb: { xs: 8, md: 12 },
          px: { xs: 1.5, sm: 2.5, md: 3 },
        }}
      >
        <Container maxWidth="lg">
          {/* Header Badge & Title */}
          <Box
            sx={{
              maxWidth: 780,
              mx: "auto",
              textAlign: "center",
              mb: { xs: 5, md: 7 },
            }}
          >

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.2rem", sm: "3rem", md: "3.6rem" },
                lineHeight: 1.1,
                fontWeight: 850,
                letterSpacing: { xs: "-0.035em", md: "-0.05em" },
                color: '#bad9ff',
                mb: 2,
              }}
            >
              Your privacy on every{" "}
              <Box
                component="span"
                sx={{
                  color: isDark ? '#6e829a' : blueTheme.light.onContainer,
                }}
              >
                shared journey.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 640,
                mx: "auto",
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                lineHeight: 1.7,
                color: colors.secondaryText,
              }}
            >
              We engineer BunkMates with strict data isolation, private syncing protocols, and uncompromised user safety at every level of the stack.
            </Typography>
          </Box>

          {/* 4 Core Pillars */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
              gap: 2,
              mb: 4,
            }}
          >
            {privacyPrinciples.map((item, idx) => {
              const Icon = item.icon;
              const cardColor = isDark ? item.palette.dark : item.palette.light;

              return (
                <Box
                  key={idx}
                  sx={{
                    p: 2.5,
                    borderRadius: "22px",
                    backgroundColor: cardColor.container,
                    border: `1.2px solid ${alpha(item.palette.accent, isDark ? 0.35 : 0.45)}`,
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 180,
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: isDark ? alpha(item.palette.accent, 0.2) : "#ffffff",
                      color: isDark ? cardColor.text : cardColor.onContainer,
                      border: `1px solid ${alpha(item.palette.accent, isDark ? 0.45 : 0.5)}`,
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ fontSize: 22 }} />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        color: isDark ? cardColor.text : cardColor.onContainer,
                        fontWeight: 800,
                        fontSize: "0.95rem",
                        letterSpacing: "-0.02em",
                        mb: 0.6,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: isDark ? alpha(cardColor.text, 0.85) : alpha(cardColor.onContainer, 0.85),
                        fontSize: "0.8rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Detailed Policy Card */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              boxSizing: "border-box",
              width: "100%",
              p: { xs: 3, sm: 4.5, md: 5 },
              borderRadius: { xs: "32px", sm: "34px", md: "36px" },
              backgroundColor: 'transparent',
              boxShadow: isDark
                ? "inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 16px 40px rgba(0, 0, 0, 0.45)"
                : "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 12px 32px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Ambient Radial Accent */}
            <Box
              sx={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: blueTheme.ambientGradient,
                filter: "blur(40px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1.2fr)" },
                  gap: { xs: 4, md: 6 },
                  mb: 4,
                }}
              >
                <Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "15px",
                      mb: 2,
                      backgroundColor: isDark ? alpha(blueTheme.accent, 0.16) : blueTheme.light.container,
                      color: isDark ? blueTheme.accent : blueTheme.light.onContainer,
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    }}
                  >
                    <ShieldRoundedIcon sx={{ fontSize: 26 }} />
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 850,
                      letterSpacing: "-0.03em",
                      color: colors.text,
                      fontSize: { xs: "1.3rem", sm: "1.55rem" },
                      mb: 1.2,
                    }}
                  >
                    Privacy First Architecture
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      lineHeight: 1.7,
                      color: colors.secondaryText,
                      mb: 2.5,
                    }}
                  >
                    BunkMates is constructed from the ground up to minimize data retention. Everything you create stays contained to authorized collaborators inside your trip squad.
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "18px",
                      backgroundColor: colors.surfaceInner,
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography sx={{ fontSize: "0.82rem", fontWeight: 750, color: colors.text, mb: 0.3 }}>
                      Need personal data assistance?
                    </Typography>
                    <Typography sx={{ fontSize: "0.76rem", color: colors.secondaryText, mb: 1.5 }}>
                      Request full data exports or trigger complete deletion across all systems.
                    </Typography>
                    <Button
                      onClick={() => navigate("/contact")}
                      startIcon={<EmailRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        py: 0.6,
                        px: 2,
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 750,
                        fontSize: "0.8rem",
                        backgroundColor: isDark ? blueTheme.dark.bg : blueTheme.light.bg,
                        color: isDark ? blueTheme.dark.text : blueTheme.light.text,
                        "&:hover": {
                          backgroundColor: blueTheme.accent,
                          color: "#001B3F",
                        },
                      }}
                    >
                      Contact DPO Team
                    </Button>
                  </Box>
                </Box>

                {/* Structured Policy Cards */}
                <Stack spacing={2}>
                  {policyBreakdowns.map((section, sIdx) => (
                    <Box
                      key={sIdx}
                      sx={{
                        p: 2.4,
                        borderRadius: "20px",
                        backgroundColor: colors.surfaceInner,
                        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          color: colors.text,
                          letterSpacing: "-0.02em",
                          mb: 1.2,
                        }}
                      >
                        {section.title}
                      </Typography>
                      <Stack spacing={0.8}>
                        {section.points.map((point, pIdx) => (
                          <Box key={pIdx} sx={{ display: "grid", gridTemplateColumns: "14px 1fr", gap: 1, alignItems: "start" }}>
                            <Typography sx={{ color: blueTheme.accent, fontSize: "0.85rem", lineHeight: 1.6, fontWeight: 900 }}>
                              •
                            </Typography>
                            <Typography sx={{ color: colors.secondaryText, fontSize: "0.82rem", lineHeight: 1.6 }}>
                              {point}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Divider sx={{ borderColor: colors.border, my: 3 }} />

              {/* Bottom Assurance Footer */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                }}
              >
                <Typography variant="caption" sx={{ color: colors.secondaryText, fontSize: "0.78rem" }}>
                  Last updated: August 2026 · Compliant with standard global privacy directives.
                </Typography>

                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Button
                    onClick={() => navigate("/bm-install")}
                    startIcon={<DownloadRoundedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      px: 2,
                      py: 0.6,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 750,
                      fontSize: "0.8rem",
                      backgroundColor: '#1f1f1f',
                      color: colors.text,
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                      "&:hover": {
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    Install App
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}