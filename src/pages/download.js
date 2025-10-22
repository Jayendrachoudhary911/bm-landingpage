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
  useTheme,
  Drawer,
  IconButton,
  TextField,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import NavBar from "../components/Navbar";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom"; // at top with other imports
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function DownloadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [previewImage, setPreviewImage] = useState(null);

  const [aboutOpen, setAboutOpen] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  // New review form
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: "success", message: "" });

  // PWA install prompt capture
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

  // Firestore: subscribe to reviews list (real-time)
  useEffect(() => {
    setLoadingReviews(true);
    setReviewsError(null);

    try {
      // collection path: /reviews/userReviews/{reviewId}
      // We treat "reviews/userReviews" as a collection path.
      const reviewsCol = collection(db, "reviews", "userReviews");
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
          console.error("Error fetching reviews:", err);
          setReviewsError("Failed to load reviews.");
          setLoadingReviews(false);
        }
      );

      return () => unsub();
    } catch (err) {
      console.error("Firestore listener setup failed:", err);
      setReviewsError("Failed to initialize reviews subscription.");
      setLoadingReviews(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add a new review
  const handleSubmitReview = async () => {
    const user = auth.currentUser;
    if (!user) {
      setToast({ open: true, severity: "warning", message: "Please sign in to submit a review." });
      return;
    }
    if (!newText.trim()) {
      setToast({ open: true, severity: "warning", message: "Please write a short review before submitting." });
      return;
    }

    setSubmitting(true);
    try {
      const reviewsCol = collection(db, "reviews", "userReviews");
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
    } catch (err) {
      console.error("Failed to submit review:", err);
      setToast({ open: true, severity: "error", message: "Failed to submit. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background: isDark ? "#0a0a0a" : "#ffffff", // flat background - no gradients
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
<Box mb={3}>
  <Button
    variant="outlined"
    onClick={() => navigate(-1)}
    sx={{
      borderRadius: "12px",
      textTransform: "none",
      fontWeight: 600,
      px: 3,
      py: 1,
      color: isDark ? "#fff" : "#000",
      borderColor: isDark ? "#555" : "#ccc",
      "&:hover": {
        borderColor: isDark ? "#888" : "#999",
        background: isDark ? "#222" : "#f7f7f7",
      },
    }}
  >
    ← Back
  </Button>
</Box>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "center", sm: "flex-start" }}
            textAlign={{ xs: "center", sm: "left" }}
            mb={2}
            mt={10}
          >
            <Avatar
              src="/logo512.png"
              alt="BunkMates"
              sx={{
                width: { xs: 150, sm: 110 },
                height: { xs: 150, sm: 110 },
                borderRadius: 6,
                mb: { xs: 2, sm: 0 },
                mr: { sm: 3 },
                boxShadow: isDark ? "0 6px 20px rgba(0,0,0,0.6)" : "0 6px 18px rgba(0,0,0,0.08)",
              }}
            />
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ color: isDark ? "#fff" : "#000" }}>
                BunkMates
              </Typography>
              <Typography variant="body1" sx={{ color: isDark ? "#bbb" : "#555", fontWeight: 500, mb: 1 }}>
                Plan, share & enjoy trips with friends
              </Typography>
              <Box mb={1}>
                <Chip label="Travel" size="small" sx={{ mr: 1 }} />
                <Chip label="Productivity" size="small" />
              </Box>
              <Box display="flex" alignItems="center" justifyContent={{ xs: "center", sm: "flex-start" }}>
                <Rating value={4.8} precision={0.1} readOnly size="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  5.0 • 0 reviews
                </Typography>
              </Box>
            </Box>

        <Grid container spacing={2} paddingTop={2} paddingBottom={2}>
          {[
            { label: "Updated", value: "Oct 2025" },
            { label: "Size", value: "82 MB" },
            { label: "Installs", value: "" },
            { label: "Version", value: "1.0.21" },
          ].map((info, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <Typography variant="body2" fontWeight={600}>
                {info.label}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? "#aaa" : "#666" }}>
                {info.value}
              </Typography>
            </Grid>
          ))}
        </Grid>

          </Box>
        </motion.div>

                              {/* App Info */}


        {/* Install Button */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <Box display="flex" justifyContent={{ xs: "center", sm: "flex-start" }} mb={6}>
            <Button
              variant="contained"
              size="large"
              startIcon={<InstallMobileIcon />}
              onClick={handleExternalDownload}
              sx={{
                borderRadius: "14px",
                px: 10,
                py: 1.3,
                fontWeight: 700,
                textTransform: "none",
                backgroundColor: "#000",
                fontSize: "1rem",
                boxShadow: "none",
                borderRadius: 8,
              }}
            >
              {"Install"}
            </Button>
          </Box>
        </motion.div>

        <Divider sx={{ mb: 5, opacity: 0.12, borderColor: isDark ? "#222" : "#eee" }} />

{/* Screenshots (Scrollable + Click Preview) */}
<Box
  sx={{
    display: "flex",
    overflowX: "auto",
    gap: 2,
    pb: 2,
    scrollSnapType: "x mandatory",
    "&::-webkit-scrollbar": { height: 8 },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: isDark ? "#333" : "#ccc",
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
        width: { xs: 240, sm: 260, md: 300 },
        height: { xs: 420, sm: 480, md: 520 },
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        scrollSnapAlign: "center",
        boxShadow: isDark
          ? "0 6px 18px rgba(0,0,0,0.6)"
          : "0 6px 18px rgba(0,0,0,0.08)",
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

{/* Image Preview Dialog */}
{previewImage && (
  <Box
    onClick={() => setPreviewImage(null)}
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(4px)",
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



        {/* About Section (clickable) */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          About this app
        </Typography>
        <Paper
          onClick={() => setAboutOpen(true)}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 3,
            cursor: "pointer",
            background: isDark ? "#111" : "#fff",
            "&:hover": { boxShadow: 3 },
          }}
        >
          <Typography variant="body1" sx={{ color: isDark ? "#aaa" : "#555", lineHeight: 1.7 }}>
            BunkMates helps you plan and manage group trips effortlessly. Create trips, share itineraries, manage budgets,
            chat in real time, and enjoy seamless coordination with your friends — all in one app. (Click to read more)
          </Typography>
        </Paper>

        {/* What's New */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          What's New
        </Typography>
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: isDark ? "#111" : "#fff" }}>
          <Typography variant="body2" sx={{ color: isDark ? "#ccc" : "#555", lineHeight: 1.7 }}>
            - Added offline mode for itinerary viewing.<br />
            - Improved chat performance with faster load times.<br />
            - Bug fixes and smoother UI transitions.
          </Typography>
        </Paper>

        {/* Reviews header + Add review form */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            Reviews
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {/* Add Review */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, background: isDark ? "#111" : "#fff" }}>
          <Stack spacing={1}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <Rating
                  value={newRating}
                  onChange={(e, v) => setNewRating(v || 0)}
                />
                <Typography variant="body2" color="text.secondary">
                  {newRating.toFixed(1)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                endIcon={submitting ? <CircularProgress size={16} /> : <SendIcon />}
                onClick={handleSubmitReview}
                disabled={submitting}
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
            />
            <Typography variant="caption" color="text.secondary">
              Reviews are visible publicly and help others decide.
            </Typography>
          </Stack>
        </Paper>

        {/* Reviews list */}
        <Box mb={4}>
          {loadingReviews ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : reviewsError ? (
            <Alert severity="error">{reviewsError}</Alert>
          ) : reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No reviews yet — be the first to add one!
            </Typography>
          ) : (
            reviews.map((review) => (
              <Paper
                key={review.id}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  background: isDark ? "#111" : "#fff",
                  border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid #eee",
                }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar
                    src={review.userPhotoURL || undefined}
                    sx={{
                      width: 36,
                      height: 36,
                      mr: 1,
                      bgcolor: review.userPhotoURL ? "transparent" : undefined,
                    }}
                  >
                    {!review.userPhotoURL && (review.userName ? review.userName.charAt(0) : "U")}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {review.userName || "Anonymous"}
                    </Typography>
                    <Rating value={review.rating || 0} size="small" readOnly />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? "#aaa" : "#555" }}>
                  {review.text}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                  {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleString() : ""}
                </Typography>
              </Paper>
            ))
          )}
        </Box>

      </Container>

      {/* Full-screen bottom Drawer for About */}
      <Drawer
        anchor="bottom"
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        PaperProps={{
          sx: {
            height: { xs: "92vh", sm: "80vh" },
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            background: isDark ? "#0b0b0b" : "#fff",
            px: { xs: 2, md: 4 },
            py: { xs: 2, md: 3 },
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            About BunkMates
          </Typography>
          <IconButton onClick={() => setAboutOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ overflowY: "auto", pr: 1, pb: 2 }}>
          <Typography variant="body1" paragraph sx={{ color: isDark ? "#ccc" : "#444", lineHeight: 1.7 }}>
            BunkMates helps you plan and manage group trips effortlessly. Create trips, share itineraries, manage budgets,
            chat in real time, and enjoy seamless coordination with your friends — all in one app.
          </Typography>

          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Features
          </Typography>
          <ul>
            <li>Trip creation & itinerary sharing</li>
            <li>Group chat & private organizer rooms</li>
            <li>Budget manager & expense tracking</li>
            <li>Offline maps & itinerary caching</li>
            <li>Export data as PDF/CSV</li>
          </ul>

          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Offline Support
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: isDark ? "#ccc" : "#444" }}>
            BunkMates caches your trips so you can view itineraries and maps even when you lose internet connectivity.
          </Typography>

          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Permissions & Privacy
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: isDark ? "#ccc" : "#444" }}>
            We request only necessary permissions (location for maps, storage for offline cache). Your data is stored
            securely in Firebase — see the privacy policy for details.
          </Typography>

          {/* Close CTA */}
          <Box mt={3} display="flex" justifyContent="center">
            <Button variant="contained" onClick={() => setAboutOpen(false)}>
              Close
            </Button>
          </Box>
        </Box>
      </Drawer>

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
