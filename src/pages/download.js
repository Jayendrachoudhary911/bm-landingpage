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
  Drawer,
  SwipeableDrawer,
  IconButton,
  TextField,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// --- FIX: Define the correct path to the subcollection of reviews ---
const REVIEWS_COLLECTION_PATH = ["reviews", "userReviews", "items"]; 
// This creates a reference to: collection(db, "reviews/userReviews/items")

export default function DownloadPage() {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: "success", message: "" });
  const [expanded, setExpanded] = useState(false);

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
    window.open("/assets/application/BunkMates_Beta.apk", "_blank");
  };

  useEffect(() => {
    setLoadingReviews(true);
    // --- FIX: Correct collection reference ---
    const reviewsCol = collection(db, ...REVIEWS_COLLECTION_PATH);
    const q = query(reviewsCol, orderBy("createdAt", "desc"));
    
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => arr.push({ id: doc.id, ...doc.data() }));
        setReviews(arr);
        setLoadingReviews(false);
      },
      (err) => {
        console.error("Failed to load reviews:", err);
        setReviewsError("Failed to load reviews.");
        setLoadingReviews(false);
      }
    );
    return () => unsub();
  }, []);

  const handleSubmitReview = async () => {
    const user = auth.currentUser;
    if (!user) {
      setToast({ open: true, severity: "warning", message: "Please sign in to submit a review." });
      return;
    }
    if (!newText.trim()) {
      setToast({ open: true, severity: "warning", message: "Write a short review first." });
      return;
    }

    setSubmitting(true);
    try {
      // --- FIX: Correct collection reference ---
      const reviewsCol = collection(db, ...REVIEWS_COLLECTION_PATH);
      await addDoc(reviewsCol, {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhotoURL: user.photoURL || null,
        rating: Number(newRating),
        text: newText.trim(),
        createdAt: serverTimestamp(),
      });
      setNewText("");
      setNewRating(5);
      setToast({ open: true, severity: "success", message: "Thanks! Your review was posted." });
    } catch (error) {
       console.error("Failed to submit review:", error);
      setToast({ open: true, severity: "error", message: "Failed to submit. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // --- DARK THEME BACKGROUND ---
        background: "radial-gradient(circle at top left, #111 0%, #000000ff 40%, #000 100%)",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: { xs: "40vh", md: "60vh" },
          backgroundImage: "url('/assets/bm_download.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          p: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          zIndex: 3,
        }}
      />
      <Container maxWidth="md" sx={{ py: 6, zIndex: 9, position: "relative", mt: { xs: "8vh", md: "15vh" } }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            borderRadius: "10px",
            textTransform: "none",
            // --- DARK THEME BUTTON ---
            borderColor: "#333",
            color: "#ccc",
            "&:hover": { borderColor: "#555", background: "#1a1a1a" },
          }}
        >
          ← Back
        </Button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "center", sm: "flex-start" }}
            textAlign={{ xs: "center", sm: "left" }}
            mb={5}
          >
            <Avatar
              src="/logo512.png"
              alt="BunkMates"
              sx={{
                width: 180,
                height: 180,
                borderRadius: 5,
                mb: { xs: 2, sm: 0 },
                mr: { sm: 3 },
                boxShadow: "none",
                border: "2px solid #222",
              }}
            />
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ color: "#fff" }}>BunkMates</Typography>
              <Typography variant="body1" sx={{ color: "#aaa", mb: 1 }}>
                Plan, share & enjoy trips with friends.
              </Typography>
              <Box mb={1}>
                <Chip label="Travel" size="small" sx={{ mr: 1, bgcolor: "#222", color: "#fff" }} />
                <Chip label="Productivity" size="small" sx={{ bgcolor: "#222", color: "#fff" }} />
              </Box>
              <Box display="flex" alignItems="center" justifyContent={{ xs: "center", sm: "flex-start" }}>
                <Rating value={4.8} precision={0.1} readOnly size="small" sx={{ color: "#ffd700", mr: 1 }} />
                <Typography variant="body2" sx={{ color: "#999" }}>
                  5.0 • {reviews.length} reviews
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Install Button */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <Box display="flex" justifyContent={isMobile ? "center" : "left"} mb={8}>
            <Button
              variant="contained"
              size="large"
              startIcon={<InstallMobileIcon />}
              onClick={handleExternalDownload}
              sx={{
                borderRadius: "34px",
                px: 10,
                py: 1.5,
                fontWeight: 700,
                textTransform: "none",
                // --- ACCENT COLOR FOR DARK THEME ---
                backgroundColor: "#fff",
                color: "#000",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#272727ff",
                  color: "#fff",
                },
              }}
            >
              Install
            </Button>
          </Box>
        </motion.div>

<></>
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            pb: 2,
            pt: 8,
            scrollSnapType: "x mandatory",
            "&::-webkit-scrollbar": { height: 8 },
            "&::-webkit-scrollbar-thumb": {
              // --- DARK THEME SCROLLBAR ---
              backgroundColor: "#333", 
              borderRadius: 10,
            },
          }}
        >
          {[
            "/assets/BM-screenshots/1.png",
            "/assets/BM-screenshots/12.png",
            "/assets/BM-screenshots/17.png",
            "/assets/BM-screenshots/6.png",
            "/assets/BM-screenshots/7.png",
          ].map((src, i) => (
            <Paper
              key={i}
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              onClick={() => setPreviewImage(src)}
              sx={{
                flex: "0 0 auto",
                width: { xs: 140, sm: 200, md: 240 },
                height: { xs: 320, sm: 400, md: 540 },
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                scrollSnapAlign: "center",
                boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
              }}
            >
              <Box
                component="img"
                src={src}
                alt={`BunkMates Screenshot ${i + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            </Paper>
          ))}
        </Box>

        {/* Image Preview Dialog - Background is already dark, just adding the cursor style */}
        {previewImage && (
          <Box
            onClick={() => setPreviewImage(null)}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(24px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              cursor: "zoom-out",
            }}
          >
            <motion.img
              src={previewImage}
              alt="Preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                maxWidth: "90%",
                maxHeight: "85%",
                borderRadius: "12px",
                boxShadow: "0 0 30px rgba(0,0,0,0.5)",
              }}
            />
          </Box>
        )}

        {/* About Section */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 6 }}>
          About this app
        </Typography>
        <Paper
          onClick={() => setAboutOpen(true)}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            cursor: "pointer",
            // --- DARK THEME PAPER ---
            background: "#111",
            "&:hover": { background: "#1a1a1a", boxShadow: "0 0 15px rgba(255,255,255,0.04)" },
          }}
        >
          <Typography variant="body2" sx={{ color: "#aaa", lineHeight: 1.7 }}>
            BunkMates helps you plan and manage group trips effortlessly — from chats and itineraries to budgets and offline maps.
            (Click to read more)
          </Typography>
        </Paper>

        {/* What's New */}
  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#fff" }}>
  What's New in <span style={{ color: "#00bcd4" }}>BunkMates</span> 🚀
</Typography>

    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        background: "linear-gradient(145deg, #000000ff, #000000ff)",
        border: "0px solid rgba(255,255,255,0.08)",
        boxShadow: "none",
        transition: "all 0.3s ease",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          mb: 2,
          fontWeight: 600,
          letterSpacing: "0.5px",
        }}
      >
        🔍 BunkMates Core Features
      </Typography>

      <Collapse in={expanded} collapsedSize={180}>
        <Typography
          variant="body2"
          sx={{
            color: "#bbb",
            lineHeight: 1.8,
            fontSize: "0.95rem",
          }}
        >
          <strong style={{ color: "#fff" }}>✨ Trips & Itineraries</strong><br />
          • Plan, create, and manage detailed trips effortlessly.<br />
          • Offline trip viewing & caching support.<br />
          • See routes & directions via Google Maps.<br /><br />

          <strong style={{ color: "#fff" }}>💬 Chats & Group Rooms</strong><br />
          • Real-time private & group messaging powered by Firestore.<br />
          • Send quick reactions.<br /><br />

          <strong style={{ color: "#fff" }}>💰 Budget & Expenses</strong><br />
          • Smart budget tracker with per-member contributions.<br />
          • Add, edit, and view expenses in real-time.<br /><br />

          <strong style={{ color: "#fff" }}>🧾 Notes & Checklists</strong><br />
          • Add rich notes and share with trip members.<br />
          • Keep personal and group to-do lists organized.<br /><br />

          <strong style={{ color: "#fff" }}>🌦️ Weather & Events</strong><br />
          • Real-time weather forecasts for your destinations.<br /><br />

          <strong style={{ color: "#fff" }}>🔔 Reminders & Notifications</strong><br />
          • Set reminders for upcoming events and expenses.<br />
          • Smart push notifications for updates.<br /><br />

          <strong style={{ color: "#fff" }}>🔐 Authentication & Sync</strong><br />
          • Secure login with Firebase & Google Sign-In.<br />
          • Sync data across all your devices automatically.<br /><br />

          <strong style={{ color: "#fff" }}>🌍 Progressive Web App</strong><br />
          • Works seamlessly online and offline.<br /><br />

          <strong style={{ color: "#fff" }}>🎉 UI & Performance</strong><br />
          • Clean dark theme with glassy panels.<br />
          • Optimized for speed and smooth transitions.<br />
          • A fresh, delightful travel companion! 💙
        </Typography>
      </Collapse>

      <Box textAlign="center" mt={2}>
        <Button
          onClick={() => setExpanded(!expanded)}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            color: "#00bcd4",
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 500,
            "&:hover": {
              background: "rgba(0,188,212,0.08)",
            },
          }}
        >
          {expanded ? "View Less" : "View More"}
        </Button>
      </Box>
    </Paper>

        {/* Reviews */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Reviews
        </Typography>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, background: "#11111185" }}>
          <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Rating
                value={newRating}
                onChange={(e, v) => setNewRating(v || 0)}
                sx={{ color: "#ffd700" }}
              />
              <Button
                variant="contained"
                endIcon={submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <SendIcon />}
                disabled={submitting}
                onClick={handleSubmitReview}
                sx={{
                  background: "#cdcdcd47",
                  "&:hover": { background: "#1b1b1bff" },
                  color: "#ffffffff",
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Submit
              </Button>
            </Box>
            <TextField
              placeholder="Share your experience..."
              multiline
              minRows={2}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: "#1a1a1a",
                  color: "#fff",
                  "& fieldset": { borderColor: "#333" },
                  "&:hover fieldset": { borderColor: "#555" },
                  "&.Mui-focused fieldset": { borderColor: "#00c6ff" },
                },
              }}
            />
          </Stack>
        </Paper>

        {loadingReviews ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : reviewsError ? (
          <Alert severity="error">{reviewsError}</Alert>
        ) : (
          reviews.map((review) => (
            <Paper
              key={review.id}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                background: "#111",
                border: "1px solid #1f1f1f",
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar src={review.userPhotoURL || undefined} sx={{ width: 36, height: 36, mr: 1, bgcolor: "#333" }}>
                  {!review.userPhotoURL && (review.userName ? review.userName.charAt(0) : "U")}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ color: "#fff" }}>
                    {review.userName || "Anonymous"}
                  </Typography>
                  <Rating value={review.rating || 0} size="small" readOnly sx={{ color: "#ffd700" }} />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                {review.text}
              </Typography>
            </Paper>
          ))
        )}
      </Container>

      {/* About Drawer */}
<SwipeableDrawer
  anchor="bottom"
  open={aboutOpen}
  onClose={() => setAboutOpen(false)}
  PaperProps={{
    sx: {
      background: "#00000018",
      backdropFilter: "blur(22px)",
      color: "#f5f5f5",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      px: { xs: 3, md: 6 },
      py: 4,
      maxHeight: "88vh",
      overflowY: "auto",
    },
  }}
>
  {/* HEADER */}
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
    <Typography variant="h6" fontWeight={700} letterSpacing={0.4}>
      About BunkMates
    </Typography>
    <IconButton onClick={() => setAboutOpen(false)} sx={{ color: "#aaa" }}>
      <CloseIcon />
    </IconButton>
  </Box>
  <Divider sx={{ mb: 3, borderColor: "#1e1e1e" }} />

  {/* ABOUT SECTION */}
  <Typography
    variant="body2"
    sx={{
      color: "#bdbdbd",
      lineHeight: 1.8,
      mb: 4,
      fontSize: 15,
    }}
  >
    <strong style={{ color: "#90caf9" }}>BunkMates</strong> is your intelligent
    group travel companion — helping you plan, manage, and enjoy every trip
    seamlessly. From budgeting and messaging to maps and reminders, it keeps
    your adventures organized, smart, and stress-free.
  </Typography>

  {/* FEATURES */}
  <Typography
    variant="subtitle1"
    sx={{
      mb: 1.5,
      fontWeight: 600,
      letterSpacing: 0.3,
      color: "#fafafa",
    }}
  >
    Core Features
  </Typography>
  <Box
    component="ul"
    sx={{
      listStyle: "none",
      pl: 0,
      color: "#bdbdbd",
      lineHeight: 1.9,
      mb: 4,
      fontSize: 14.5,
    }}
  >
    {[
      ["Trip Planning", "Create, manage and track itineraries effortlessly."],
      ["Group Chats", "Real-time messaging with media, emoji, and voice notes."],
      ["Budget Manager", "Split expenses, track spending, and view totals."],
      ["To-Do & Notes", "Organize checklists and notes with attachments."],
      ["Weather & Events", "Live forecasts and local event insights."],
      ["Reminders", "Smart alerts for trip activities and deadlines."],
      ["Offline Mode", "Access trips, notes, and maps without internet."],
      ["PWA Support", "Install and sync seamlessly across devices."],
      ["Authentication", "Secure login via Supabase & Google Sign-In."],
    ].map(([title, desc], i) => (
      <li key={i}>
        <Typography variant="body2" sx={{ color: "#e0e0e0", fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#9e9e9e", ml: 0.5, fontSize: 13.5 }}
        >
          {desc}
        </Typography>
      </li>
    ))}
  </Box>


  {/* VERSION INFO */}
  <Typography
    variant="subtitle1"
    sx={{
      mb: 1.5,
      fontWeight: 600,
      letterSpacing: 0.3,
      color: "#fafafa",
    }}
  >
    App Information
  </Typography>
  <Typography
    variant="body2"
    sx={{
      color: "#bdbdbd",
      lineHeight: 1.8,
      fontSize: 14.5,
      mb: 4,
    }}
  >
    Version (Beta): <strong>Beta_1.10.1.001</strong><br />
    APK Version: <strong>1.0.31</strong><br />
    Supported: Android 9 (Pie) and above<br />
    Recommended RAM: 2GB+<br />
    Storage: ~120MB (with offline cache)<br />
    Network: Online + Limited Offline Support
  </Typography>


  <Typography
    variant="body2"
    sx={{
      color: "#bdbdbd",
      lineHeight: 1.8,
      fontSize: 14.5,
      mb: 2,
    }}
  >
    Developed at <strong>BunkMates Lab</strong><br />
    Year: 2025 Public Beta<br />
    Contact: <a href="mailto:team.bunkmates@gmail.com" style={{ color: "#90caf9" }}>Support Team</a>
  </Typography>

  <Divider sx={{ my: 3, borderColor: "#1e1e1e" }} />

  <Typography
    variant="caption"
    sx={{
      display: "block",
      textAlign: "center",
      color: "#666",
      fontSize: "0.75rem",
    }}
  >
    © {new Date().getFullYear()} BunkMates. All rights reserved.
  </Typography>
</SwipeableDrawer>


      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}