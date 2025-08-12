import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
  Rating,
} from "@mui/material";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";

export default function DownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Capture install prompt (only works if same origin)
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const handleExternalDownload = () => {
    window.open("https://app.bunkmates.com", "_blank"); // hosted PWA domain
  };

  return (
    <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "center", sm: "flex-start" }}
          textAlign={{ xs: "center", sm: "left" }}
          mb={4}
        >
          <Avatar
            src="/images/bunkmates-icon.png"
            alt="BunkMates"
            sx={{
              width: { xs: 90, sm: 100 },
              height: { xs: 90, sm: 100 },
              borderRadius: 2,
              mb: { xs: 2, sm: 0 },
              mr: { sm: 3 },
            }}
          />
          <Box>
            <Typography variant="h5" fontWeight={700}>
              BunkMates
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Plan, share & enjoy trips with friends
            </Typography>
            <Box mb={1}>
              <Chip label="Travel" size="small" sx={{ mr: 1 }} />
              <Chip label="Productivity" size="small" />
            </Box>
            <Box display="flex" alignItems="center" justifyContent={{ xs: "center", sm: "flex-start" }}>
              <Rating value={4.8} precision={0.1} readOnly size="small" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                4.8 • 2K reviews • 10K+ installs
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Install / Get App Buttons */}
        <Box display="flex" flexWrap="wrap" gap={2} justifyContent={{ xs: "center", sm: "flex-start" }} mb={4}>
          {deferredPrompt ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<InstallMobileIcon />}
              onClick={handleInstallClick}
              sx={{
                backgroundColor: "#000",
                "&:hover": { backgroundColor: "#222" },
                borderRadius: "12px",
                px: 3,
              }}
            >
              Install
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              startIcon={<InstallMobileIcon />}
              onClick={handleExternalDownload}
              sx={{
                backgroundColor: "#000",
                "&:hover": { backgroundColor: "#222" },
                borderRadius: "12px",
                px: 3,
              }}
            >
              Get App
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Screenshots */}
        <Grid container spacing={2} mb={4}>
          {[
            "/images/screenshot1.png",
            "/images/screenshot2.png",
            "/images/screenshot3.png",
          ].map((src, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  pt: "56%", // responsive 16:9
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* About */}
        <Typography variant="h6" fontWeight={600} gutterBottom>
          About this app
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4} sx={{ lineHeight: 1.6 }}>
          BunkMates helps you plan and manage group trips effortlessly. Create trips,
          share itineraries, manage budgets, chat in real time, and enjoy seamless
          coordination with your friends — all in one app. Works offline and online,
          so you never lose track of your plans.
        </Typography>

        {/* What's New */}
        <Typography variant="h6" fontWeight={600} gutterBottom>
          What's New
        </Typography>
        <Paper sx={{ p: 2, mb: 4, borderRadius: 2, backgroundColor: "#fff" }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            - Added offline mode for itinerary viewing.<br />
            - Improved chat performance with faster load times.<br />
            - Bug fixes and UI improvements.
          </Typography>
        </Paper>

        {/* Reviews */}
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Reviews
        </Typography>
        <Box mb={4}>
          {[
            { name: "Alex T.", rating: 5, comment: "Best trip planner app I’ve used. Super easy to share with friends!" },
            { name: "Maria P.", rating: 4, comment: "Great features but could use more customization options." },
            { name: "John D.", rating: 5, comment: "Offline mode is a lifesaver during travel. Highly recommended!" },
          ].map((review, i) => (
            <Paper
              key={i}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: "#fff",
                border: "1px solid #eee",
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                  {review.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {review.name}
                  </Typography>
                  <Rating value={review.rating} size="small" readOnly />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {review.comment}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Additional Info */}
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[
            { label: "Updated", value: "Aug 2025" },
            { label: "Size", value: "~2 MB" },
            { label: "Installs", value: "10K+" },
            { label: "Version", value: "1.2.5" },
          ].map((info, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <Typography variant="body2" fontWeight={600}>
                {info.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {info.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
