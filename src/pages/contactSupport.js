import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Collapse,
  CircularProgress,
  alpha,
} from "@mui/material";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { useCustomTheme } from "../context/ThemeContext";

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

const supportHighlights = [
  {
    icon: AccessTimeRoundedIcon,
    title: "Quick Responses",
    description: "Our dedicated support team usually replies within 24 hours.",
    palette: M3_EXPRESSIVE_PALETTE.blue,
  },
  {
    icon: SupportAgentRoundedIcon,
    title: "Community Driven",
    description: "Your active feedback directly shapes our upcoming feature updates.",
    palette: M3_EXPRESSIVE_PALETTE.emerald,
  },
  {
    icon: ForumRoundedIcon,
    title: "Squad Assistance",
    description: "Real-time troubleshooting for group chats, budgets, and live trips.",
    palette: M3_EXPRESSIVE_PALETTE.purple,
  },
  {
    icon: HelpOutlineRoundedIcon,
    title: "Help Center & FAQs",
    description: "Browse comprehensive guides for instant resolutions on the go.",
    palette: M3_EXPRESSIVE_PALETTE.amber,
  },
];

export default function ContactSupportPage({ user }) {
  const { isDark } = useCustomTheme();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const colors = {
    background: isDark ? "#000000" : "#f1f3f5",
    surface: isDark ? "#0d0e12" : "#ffffff",
    surfaceInner: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
    text: isDark ? "#ffffff" : "#09090b",
    secondaryText: isDark ? "#a1a1aa" : "#64748b",
    border: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
  };

  const emeraldTheme = M3_EXPRESSIVE_PALETTE.emerald;
  const blueTheme = M3_EXPRESSIVE_PALETTE.blue;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus("");
    if (submitted) setSubmitted(false);
  };

  const isValid =
    form.name.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.message.trim().length > 4;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      setStatus("Please ensure all fields are filled out correctly.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const uid = auth?.currentUser?.uid || user?.uid || "anonymous";

      await addDoc(collection(db, "Contactus"), {
        name: form.name,
        email: form.email,
        subject: form.subject.trim() || `Support Request from ${form.name}`,
        message: form.message,
        timestamp: serverTimestamp(),
        uid,
      });

      try {
        await emailjs.send(
          "service_y1409lk",
          "template_2ap83c9",
          {
            name: form.name,
            email: form.email,
            message: form.message,
          },
          "-gCY06CnBGzAFg-Af"
        );
      } catch (error) {
        console.warn("EmailJS error (non-fatal):", error);
      }

      const notifRef = doc(collection(db, "notifications"));

      await setDoc(notifRef, {
        title: "📩 We've received your request!",
        content: `Hi ${form.name},\n\nWe've received your support request and will get back to you soon.`,
        timestamp: serverTimestamp(),
        uid,
        read: false,
        type: "contact",
      });

      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact request:", error);
      setStatus("❌ Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
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
          {/* Header Strip */}
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
                color: '#b6ffd7',
                mb: 2,
              }}
            >
              Let's make BunkMates{" "}
              <Box
                component="span"
                sx={{
                  color: isDark ? '#577464' : emeraldTheme.light.onContainer,
                }}
              >
                even better.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 620,
                mx: "auto",
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                lineHeight: 1.7,
                color: colors.secondaryText,
              }}
            >
              Have an idea, a question, or need assistance with your squad trip? Send us a message and our team will get right back to you.
            </Typography>
          </Box>

          {/* Main Content Layout Card with Rounded Glass Accents */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              boxSizing: "border-box",
              width: "100%",
              p: { xs: 2.5, sm: 4, md: 5 },
              borderRadius: { xs: "32px", sm: "34px", md: "36px" },
              backgroundColor: '#0c0c0c',
              boxShadow: isDark
                ? "inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 16px 40px rgba(0, 0, 0, 0.45)"
                : "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 12px 32px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Background Ambient Radial Glow */}
            <Box
              sx={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: emeraldTheme.ambientGradient,
                filter: "blur(40px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* 2-Column Responsive CSS Grid to Prevent Flex Overflow */}
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1.15fr)" },
                gap: { xs: 4, md: 5, lg: 6 },
                alignItems: "start",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* Left Column: Direct Info & 2x2 Highlights Grid */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 3,
                  minWidth: 0,
                  width: "100%",
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
                      backgroundColor: isDark ? alpha(emeraldTheme.accent, 0.16) : emeraldTheme.light.container,
                      color: isDark ? emeraldTheme.accent : emeraldTheme.light.onContainer,
                      border: `1.5px solid ${alpha(emeraldTheme.accent, isDark ? 0.4 : 0.45)}`,
                      boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <TravelExploreRoundedIcon sx={{ fontSize: 24 }} />
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 850,
                      letterSpacing: "-0.03em",
                      color: colors.text,
                      fontSize: { xs: "1.25rem", sm: "1.45rem" },
                      mb: 1,
                    }}
                  >
                    Your feedback shapes the journey.
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.88rem",
                      lineHeight: 1.65,
                      color: colors.secondaryText,
                      mb: 2.5,
                    }}
                  >
                    Whether it's bug reporting, collaboration requests, feature proposals, or squad trip troubleshooting—we're here to assist.
                  </Typography>

                  {/* Direct Contact Pills */}
                  <Stack spacing={1.2}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.4,
                        borderRadius: "16px",
                        backgroundColor: colors.surfaceInner,
                        border: `1.2px solid ${colors.border}`,
                        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "10px",
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: alpha(blueTheme.accent, isDark ? 0.16 : 0.12),
                          color: blueTheme.accent,
                          border: `1.2px solid ${alpha(blueTheme.accent, isDark ? 0.35 : 0.4)}`,
                          flexShrink: 0,
                        }}
                      >
                        <EmailRoundedIcon sx={{ fontSize: 17 }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: "0.7rem", color: colors.secondaryText, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          Official Support Email
                        </Typography>
                        <Typography sx={{ fontSize: "0.84rem", fontWeight: 750, color: colors.text, wordBreak: "break-all" }}>
                          team.bunkmates@gmail.com
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.4,
                        borderRadius: "16px",
                        backgroundColor: colors.surfaceInner,
                        border: `1.2px solid ${colors.border}`,
                        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "10px",
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: alpha(emeraldTheme.accent, isDark ? 0.16 : 0.12),
                          color: emeraldTheme.accent,
                          border: `1.2px solid ${alpha(emeraldTheme.accent, isDark ? 0.35 : 0.4)}`,
                          flexShrink: 0,
                        }}
                      >
                        <LocationOnRoundedIcon sx={{ fontSize: 17 }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: "0.7rem", color: colors.secondaryText, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          Headquarters
                        </Typography>
                        <Typography sx={{ fontSize: "0.84rem", fontWeight: 750, color: colors.text }}>
                          Remote · Worldwide Squad Operations
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                {/* 2x2 Highlights Grid */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1.2,
                  }}
                >
                  {supportHighlights.map((item, idx) => {
                    const Icon = item.icon;
                    const cardPalette = isDark ? item.palette.dark : item.palette.light;

                    return (
                      <Box
                        key={idx}
                        sx={{
                          p: 1.6,
                          borderRadius: "16px",
                          backgroundColor: cardPalette.container,
                          border: `1.2px solid ${alpha(item.palette.accent, isDark ? 0.35 : 0.45)}`,
                          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.12)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: 100,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "9px",
                            display: "grid",
                            placeItems: "center",
                            backgroundColor: isDark ? alpha(item.palette.accent, 0.2) : "#ffffff",
                            color: isDark ? cardPalette.text : cardPalette.onContainer,
                            border: `1px solid ${alpha(item.palette.accent, isDark ? 0.45 : 0.5)}`,
                            mb: 1,
                            flexShrink: 0,
                          }}
                        >
                          <Icon sx={{ fontSize: 17 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ color: isDark ? cardPalette.text : cardPalette.onContainer, fontWeight: 800, fontSize: "0.82rem", lineHeight: 1.2, mb: 0.2 }}>
                            {item.title}
                          </Typography>
                          <Typography sx={{ color: isDark ? alpha(cardPalette.text, 0.8) : alpha(cardPalette.onContainer, 0.8), fontSize: "0.72rem", lineHeight: 1.35 }}>
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Right Column: Contained Support Form */}
              <Box
                sx={{
                  minWidth: 0,
                  width: "100%",
                  boxSizing: "border-box",
                  p: { xs: 2.2, sm: 3.5 },
                  borderRadius: "22px",
                  backgroundColor: colors.surfaceInner,
                  border: `1.5px solid ${colors.border}`,
                  boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.05)",
                }}
              >
                <Stack spacing={2} component="form" onSubmit={handleSubmit} sx={{ width: "100%", boxSizing: "border-box" }}>
                  <TextField
                    name="name"
                    label="Your Name"
                    placeholder="Enter your name"
                    fullWidth
                    value={form.name}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                      sx: {
                        color: colors.secondaryText,
                        "&.Mui-focused": { color: isDark ? emeraldTheme.accent : emeraldTheme.light.onContainer },
                      },
                    }}
                    InputProps={{
                      sx: {
                        color: colors.text,
                        borderRadius: "14px",
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
                        "& fieldset": { borderColor: colors.border },
                        "&:hover fieldset": { borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)" },
                        "&.Mui-focused fieldset": { borderColor: emeraldTheme.accent },
                      },
                    }}
                  />

                  <TextField
                    name="email"
                    label="Email Address"
                    placeholder="name@example.com"
                    fullWidth
                    value={form.email}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                      sx: {
                        color: colors.secondaryText,
                        "&.Mui-focused": { color: isDark ? emeraldTheme.accent : emeraldTheme.light.onContainer },
                      },
                    }}
                    InputProps={{
                      sx: {
                        color: colors.text,
                        borderRadius: "14px",
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
                        "& fieldset": { borderColor: colors.border },
                        "&:hover fieldset": { borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)" },
                        "&.Mui-focused fieldset": { borderColor: emeraldTheme.accent },
                      },
                    }}
                  />

                  <TextField
                    name="subject"
                    label="Subject"
                    placeholder="What is this inquiry about?"
                    fullWidth
                    value={form.subject}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                      sx: {
                        color: colors.secondaryText,
                        "&.Mui-focused": { color: isDark ? emeraldTheme.accent : emeraldTheme.light.onContainer },
                      },
                    }}
                    InputProps={{
                      sx: {
                        color: colors.text,
                        borderRadius: "14px",
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
                        "& fieldset": { borderColor: colors.border },
                        "&:hover fieldset": { borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)" },
                        "&.Mui-focused fieldset": { borderColor: emeraldTheme.accent },
                      },
                    }}
                  />

                  <TextField
                    name="message"
                    label="Your Message"
                    placeholder="Describe how we can assist your squad..."
                    fullWidth
                    multiline
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                      sx: {
                        color: colors.secondaryText,
                        "&.Mui-focused": { color: isDark ? emeraldTheme.accent : emeraldTheme.light.onContainer },
                      },
                    }}
                    InputProps={{
                      sx: {
                        color: colors.text,
                        borderRadius: "16px",
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
                        "& fieldset": { borderColor: colors.border },
                        "&:hover fieldset": { borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)" },
                        "&.Mui-focused fieldset": { borderColor: emeraldTheme.accent },
                      },
                    }}
                  />

                  {/* Submission Row */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column-reverse", sm: "row" },
                      alignItems: { xs: "stretch", sm: "center" },
                      justifyContent: "space-between",
                      gap: 1.5,
                      pt: 0.5,
                    }}
                  >
                    <Typography sx={{ color: colors.secondaryText, fontSize: "0.72rem" }}>
                      Your information is protected under our privacy policy.
                    </Typography>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      endIcon={
                        loading ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <SendRoundedIcon sx={{ fontSize: "16px !important" }} />
                        )
                      }
                      sx={{
                        flexShrink: 0,
                        minHeight: 44,
                        px: 3,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: "0.88rem",
                        backgroundColor: isDark ? emeraldTheme.dark.bg : emeraldTheme.light.bg,
                        color: isDark ? emeraldTheme.dark.text : emeraldTheme.light.text,
                        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 1px 0px rgba(0,0,0,0.01)",
                        "&:hover": {
                          backgroundColor: emeraldTheme.accent,
                          color: "#00210E",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
                          color: colors.secondaryText,
                        },
                      }}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Box>

                  {/* Success Alert */}
                  <Collapse in={submitted}>
                    <Box
                      sx={{
                        mt: 1,
                        p: 1.6,
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        backgroundColor: isDark ? "rgba(140, 239, 203, 0.12)" : "#e6f9f0",
                        border: `1.5px solid ${isDark ? "rgba(140, 239, 203, 0.4)" : "#8cefcb"}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "8px",
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: "#8cefcb",
                          color: "#00210E",
                          flexShrink: 0,
                        }}
                      >
                        <CheckRoundedIcon sx={{ fontSize: 16 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: colors.text, fontWeight: 750, fontSize: "0.84rem" }}>
                          Message Sent Successfully!
                        </Typography>
                        <Typography sx={{ color: colors.secondaryText, fontSize: "0.74rem" }}>
                          Thank you for reaching out. We will respond shortly.
                        </Typography>
                      </Box>
                    </Box>
                  </Collapse>

                  {/* Error Alert */}
                  {status && !submitted && (
                    <Alert
                      severity="error"
                      sx={{
                        mt: 1,
                        borderRadius: "12px",
                        backgroundColor: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(254, 242, 242, 0.9)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        color: isDark ? "#fca5a5" : "#b91c1c",
                      }}
                    >
                      {status}
                    </Alert>
                  )}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}