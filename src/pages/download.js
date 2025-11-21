// src/pages/DownloadPage.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Paper,
  Chip,
  Divider,
  Rating,
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
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// Reviews subcollection path under landing_page/download_page
const REVIEWS_COLLECTION_PATH = ["landing_page", "download_page", "reviews"];

export default function DownloadPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: "success", message: "" });
  const [expanded, setExpanded] = useState(false);

  // Fields pulled from Firestore's landing_page/download_page
  const [appVersionInfo, setAppVersionInfo] = useState(null);
  const [whatsNew, setWhatsNew] = useState(null);
  const [loadingPageMeta, setLoadingPageMeta] = useState(true);

  // Listen for PWA beforeinstallprompt
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
    try {
      await deferredPrompt.userChoice;
    } catch {
      // ignore
    }
    setDeferredPrompt(null);
  };

  const handleExternalDownload = () => {
    // file link for APK — keep your existing path or update if needed
    window.open("/assets/application/BunkMates_Beta.apk", "_blank");
  };

  // Robust parser for app_version object in Firestore:
  // - Handles keys like "App version", "Build version", app_version, build_version
  // - If unknown keys, tries to pick first/second string values
  function parseAppVersionObject(obj) {
    if (!obj || typeof obj !== "object") return null;

    // normalize keys -> lowercase trimmed
    const entries = Object.entries(obj)
      .filter(([, v]) => typeof v === "string" && v.trim() !== "")
      .map(([k, v]) => [String(k).trim(), String(v).trim()]);

    if (entries.length === 0) return null;

    // helper to find key that contains substring
    const findByKeySub = (subs) => {
      const key = entries.find(([k]) => subs.some((s) => k.toLowerCase().includes(s)));
      return key ? key[1] : null;
    };

    const appV =
      findByKeySub(["app version", "app_version", "app-version", "apk version", "apk_version"]) ||
      findByKeySub(["version", "app"]) ||
      (entries[0] ? entries[0][1] : null);

    const buildV =
      findByKeySub(["build version", "build_version", "build-version", "build"]) ||
      findByKeySub(["beta", "build"]) ||
      (entries.length > 1 ? entries[1][1] : null);

    return {
      app_version: appV ?? null,
      build_version: buildV ?? null,
      raw: obj,
    };
  }

  // --- Realtime: listen to landing_page/download_page doc for app_version & whats_new
  useEffect(() => {
    setLoadingPageMeta(true);
    const docRef = doc(db, "landing_page", "download_page");
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          setAppVersionInfo(null);
          setWhatsNew(null);
          setLoadingPageMeta(false);
          return;
        }
        const data = snap.data();

        // parse app_version field robustly
        if (data?.app_version) {
          const parsed = parseAppVersionObject(data.app_version);
          setAppVersionInfo(parsed);
        } else {
          setAppVersionInfo(null);
        }

        // whats_new — expected to be an array of objects with title and description (array)
        if (Array.isArray(data?.whats_new) && data.whats_new.length > 0) {
          const normalized = data.whats_new.map((entry) => {
            if (typeof entry === "string") {
              return { title: entry, description: [] };
            }
            return {
              title: entry.title ?? entry.name ?? "What's new",
              description: Array.isArray(entry.description)
                ? entry.description
                : typeof entry.description === "string"
                ? [entry.description]
                : [],
            };
          });
          setWhatsNew(normalized);
        } else {
          setWhatsNew(null);
        }

        setLoadingPageMeta(false);
      },
      (err) => {
        console.error("Failed to load download_page metadata:", err);
        setAppVersionInfo(null);
        setWhatsNew(null);
        setLoadingPageMeta(false);
      }
    );

    return () => unsub();
  }, []);

  // --- Reviews listener (subcollection under landing_page/download_page/reviews) ---
  useEffect(() => {
    setLoadingReviews(true);
    try {
      const reviewsCol = collection(db, ...REVIEWS_COLLECTION_PATH);
      const q = query(reviewsCol, orderBy("createdAt", "desc"));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const arr = [];
          snapshot.forEach((d) => arr.push({ id: d.id, ...d.data() }));
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
    } catch (err) {
      console.error("Reviews listener setup failed:", err);
      setReviewsError("Failed to load reviews.");
      setLoadingReviews(false);
      return () => {};
    }
  }, []);

  const handleSubmitReview = async () => {
    const current = auth.currentUser;
    if (!current) {
      setToast({ open: true, severity: "warning", message: "Please sign in to submit a review." });
      return;
    }
    if (!newText.trim()) {
      setToast({ open: true, severity: "warning", message: "Write a short review first." });
      return;
    }

    setSubmitting(true);
    try {
      const reviewsCol = collection(db, ...REVIEWS_COLLECTION_PATH);
      await addDoc(reviewsCol, {
        userId: current.uid,
        userName: current.displayName || "Anonymous",
        userPhotoURL: current.photoURL || null,
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

  // Fallback content for whats new / app version
  const FALLBACK_WHATS_NEW = [
    {
      title: "✨ Trips & Itineraries",
      description: [
        "Plan, create, and manage detailed trips effortlessly.",
        "Offline trip viewing & caching support.",
      ],
    },
    {
      title: "💬 Chats & Group Rooms",
      description: ["Real-time private & group messaging powered by Firestore."],
    },
  ];

  const FALLBACK_APP_VERSION = {
    app_version: "1.0.31",
    build_version: "Beta_1.10.1.012",
  };

  // compute render values
  const whatsNewToRender = !loadingPageMeta && whatsNew && whatsNew.length ? whatsNew : FALLBACK_WHATS_NEW;
  const parsedAppVersion = !loadingPageMeta && appVersionInfo ? appVersionInfo : { app_version: FALLBACK_APP_VERSION.app_version, build_version: FALLBACK_APP_VERSION.build_version };

  // badge text
  const versionBadgeText = (() => {
    const appV = parsedAppVersion?.app_version;
    const buildV = parsedAppVersion?.build_version;
    if (appV && buildV) return `App Version: v${appV} · Build Version: ${buildV}`;
    if (appV) return `v${appV}`;
    if (buildV) return `${buildV}`;
    return "vN/A";
  })();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #111 0%, #000000ff 40%, #000 100%)",
        color: "#fff",
      }}
    >
      {/* Hero background image (keeps your asset usage) */}
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
            borderColor: "#333",
            color: "#ccc",
            "&:hover": { borderColor: "#555", background: "#1a1a1a" },
          }}
        >
          ← Back
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "center", sm: "flex-start" }} textAlign={{ xs: "center", sm: "left" }} mb={5}>
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
              <Box display="flex" alignItems="left" flexDirection={"column"} gap={2}>
                <Typography variant="h4" fontWeight={800} sx={{ color: "#fff" }}>BunkMates</Typography>

                {/* Version badge - clickable to open About */}
                <Box sx={{ ml: 0 }}>
                  {loadingPageMeta ? (
                    <Chip label={<CircularProgress size={14} color="inherit" />} size="small" sx={{ bgcolor: "rgba(255,255,255,0.06)", color: "#fff" }} />
                  ) : (
                    <Chip
                      label={versionBadgeText}
                      size="small"
                      onClick={() => setAboutOpen(true)}
                      clickable
                      sx={{
                        ml: 0,
                        bgcolor: "rgba(0,188,212,0.08)",
                        color: "#00bcd4",
                        fontWeight: 700,
                        border: "1px solid rgba(0,188,212,0.12)",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </Box>
              </Box>

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

        {/* Install button */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <Box display="flex" justifyContent={isMobile ? "center" : "left"} mb={8}>
            <Button variant="contained" size="large" startIcon={<InstallMobileIcon />} onClick={handleExternalDownload} sx={{ borderRadius: "34px", px: 10, py: 1.5, fontWeight: 700, textTransform: "none", backgroundColor: "#fff", color: "#000", boxShadow: "none", "&:hover": { backgroundColor: "#272727ff", color: "#fff" } }}>
              Install
            </Button>
            {deferredPrompt && <Button sx={{ ml: 2 }} onClick={handleInstallClick} variant="outlined" color="inherit">Install PWA</Button>}
          </Box>
        </motion.div>

        {/* Screenshots carousel */}
        <Box sx={{ display: "flex", overflowX: "auto", gap: 2, pb: 2, pt: 8, scrollSnapType: "x mandatory", "&::-webkit-scrollbar": { height: 8 }, "&::-webkit-scrollbar-thumb": { backgroundColor: "#333", borderRadius: 10 } }}>
          {[
            "/assets/BM-screenshots/1.png",
            "/assets/BM-screenshots/12.png",
            "/assets/BM-screenshots/17.png",
            "/assets/BM-screenshots/6.png",
            "/assets/BM-screenshots/7.png",
          ].map((src, i) => (
            <Paper key={i} component={motion.div} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }} onClick={() => setPreviewImage(src)} sx={{ flex: "0 0 auto", width: { xs: 140, sm: 200, md: 240 }, height: { xs: 320, sm: 400, md: 540 }, borderRadius: 3, overflow: "hidden", cursor: "pointer", scrollSnapAlign: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.6)" }}>
              <Box component="img" src={src} alt={`BunkMates Screenshot ${i + 1}`} sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", "&:hover": { transform: "scale(1.05)" } }} />
            </Paper>
          ))}
        </Box>

        {/* Image Preview */}
        {previewImage && (
          <Box onClick={() => setPreviewImage(null)} sx={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.12)", backdropFilter: "blur(24px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, cursor: "zoom-out" }}>
            <motion.img src={previewImage} alt="Preview" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ maxWidth: "90%", maxHeight: "85%", borderRadius: "12px", boxShadow: "0 0 30px rgba(0,0,0,0.5)" }} />
          </Box>
        )}

        {/* About clickable box */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 6 }}>About this app</Typography>
        <Paper onClick={() => setAboutOpen(true)} sx={{ p: 3, mb: 4, borderRadius: 3, cursor: "pointer", background: "#111", "&:hover": { background: "#1a1a1a", boxShadow: "0 0 15px rgba(255,255,255,0.04)" } }}>
          <Typography variant="body2" sx={{ color: "#aaa", lineHeight: 1.7 }}>BunkMates helps you plan and manage group trips effortlessly — from chats and itineraries to budgets and offline maps. (Click to read more)</Typography>
        </Paper>

        {/* What's New */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#fff" }}>What's New in <span style={{ color: "#00bcd4" }}>BunkMates</span> 🚀</Typography>

        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: "linear-gradient(145deg, #000000ff, #000000ff)", border: "0px solid rgba(255,255,255,0.08)", boxShadow: "none", transition: "all 0.3s ease" }}>
          <Typography variant="h6" sx={{ color: "#fff", mb: 2, fontWeight: 600, letterSpacing: "0.5px" }}>🔍 BunkMates Core Features</Typography>

          <Collapse in={expanded} collapsedSize={180}>
            <Box sx={{ color: "#bbb", lineHeight: 1.8, fontSize: "0.95rem" }}>
              {whatsNewToRender.map((item, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography sx={{ color: "#fff", fontWeight: 700 }}>{item.title}</Typography>
                  {Array.isArray(item.description) ? (
                    <Box component="ul" sx={{ pl: 2, mt: 0, color: "#bbb" }}>
                      {item.description.map((d, j) => (
                        <li key={j}>
                          <Typography variant="body2" sx={{ color: "#bbb", fontSize: 14 }}>{d}</Typography>
                        </li>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: "#bbb" }}>{String(item.description)}</Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Collapse>

          <Box textAlign="center" mt={2}>
            <Button onClick={() => setExpanded(!expanded)} endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />} sx={{ color: "#00bcd4", textTransform: "none", borderRadius: 2, fontWeight: 500, "&:hover": { background: "rgba(0,188,212,0.08)" } }}>
              {expanded ? "View Less" : "View More"}
            </Button>
          </Box>
        </Paper>

        {/* Reviews */}
        <Typography variant="h6" fontWeight={700} gutterBottom>Reviews</Typography>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, background: "#11111185" }}>
          <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Rating value={newRating} onChange={(e, v) => setNewRating(v || 0)} sx={{ color: "#ffd700" }} />
              <Button variant="contained" endIcon={submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <SendIcon />} disabled={submitting} onClick={handleSubmitReview} sx={{ background: "#cdcdcd47", "&:hover": { background: "#1b1b1bff" }, color: "#ffffffff", borderRadius: 2, fontWeight: 600 }}>
                Submit
              </Button>
            </Box>
            <TextField placeholder="Share your experience..." multiline minRows={2} value={newText} onChange={(e) => setNewText(e.target.value)} fullWidth variant="outlined" size="small" sx={{ "& .MuiOutlinedInput-root": { background: "#1a1a1a", color: "#fff", "& fieldset": { borderColor: "#333" }, "&:hover fieldset": { borderColor: "#555" }, "&.Mui-focused fieldset": { borderColor: "#00c6ff" } } }} />
          </Stack>
        </Paper>

        {loadingReviews ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
        ) : reviewsError ? (
          <Alert severity="error">{reviewsError}</Alert>
        ) : (
          reviews.map((review) => (
            <Paper key={review.id} sx={{ p: 2, mb: 2, borderRadius: 3, background: "#111", border: "1px solid #1f1f1f" }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar src={review.userPhotoURL || undefined} sx={{ width: 36, height: 36, mr: 1, bgcolor: "#333" }}>
                  {!review.userPhotoURL && (review.userName ? review.userName.charAt(0) : "U")}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ color: "#fff" }}>{review.userName || "Anonymous"}</Typography>
                  <Rating value={review.rating || 0} size="small" readOnly sx={{ color: "#ffd700" }} />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: "#aaa" }}>{review.text}</Typography>
            </Paper>
          ))
        )}
      </Container>

      {/* About Drawer (shows app_version parsed from Firestore when available) */}
      <SwipeableDrawer anchor="bottom" open={aboutOpen} onClose={() => setAboutOpen(false)} PaperProps={{ sx: { background: "#00000018", backdropFilter: "blur(22px)", color: "#f5f5f5", borderTopLeftRadius: 20, borderTopRightRadius: 20, px: { xs: 3, md: 6 }, py: 4, maxHeight: "88vh", overflowY: "auto" } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={700} letterSpacing={0.4}>About BunkMates</Typography>
          <IconButton onClick={() => setAboutOpen(false)} sx={{ color: "#aaa" }}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ mb: 3, borderColor: "#1e1e1e" }} />

        <Typography variant="body2" sx={{ color: "#bdbdbd", lineHeight: 1.8, mb: 4, fontSize: 15 }}>
          <strong style={{ color: "#90caf9" }}>BunkMates</strong> is your intelligent group travel companion — helping you plan, manage, and enjoy every trip seamlessly. From budgeting and messaging to maps and reminders, it keeps your adventures organized, smart, and stress-free.
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, letterSpacing: 0.3, color: "#fafafa" }}>Core Features</Typography>
        <Box component="ul" sx={{ listStyle: "none", pl: 0, color: "#bdbdbd", lineHeight: 1.9, mb: 4, fontSize: 14.5 }}>
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
              <Typography variant="body2" sx={{ color: "#e0e0e0", fontWeight: 500 }}>{title}</Typography>
              <Typography variant="body2" sx={{ color: "#9e9e9e", ml: 0.5, fontSize: 13.5 }}>{desc}</Typography>
            </li>
          ))}
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, letterSpacing: 0.3, color: "#fafafa" }}>App Information</Typography>
        <Typography variant="body2" sx={{ color: "#bdbdbd", lineHeight: 1.8, fontSize: 14.5, mb: 4 }}>
          Version (Build): <strong>{parsedAppVersion?.build_version ?? parsedAppVersion?.app_version ?? FALLBACK_APP_VERSION.build_version}</strong><br />
          APK Version: <strong>{parsedAppVersion?.app_version ?? FALLBACK_APP_VERSION.app_version}</strong><br />
          Supported: Android 9 (Pie) and above<br />
          Recommended RAM: 2GB+<br />
          Storage: ~120MB (with offline cache)<br />
          Network: Online + Limited Offline Support
        </Typography>

        <Typography variant="body2" sx={{ color: "#bdbdbd", lineHeight: 1.8, fontSize: 14.5, mb: 2 }}>
          Developed at <strong>BunkMates Lab</strong><br />
          Year: 2025 Public Beta<br />
          Contact: <a href="mailto:team.bunkmates@gmail.com" style={{ color: "#90caf9" }}>Support Team</a>
        </Typography>

        <Divider sx={{ my: 3, borderColor: "#1e1e1e" }} />

        <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#666", fontSize: "0.75rem" }}>
          © {new Date().getFullYear()} BunkMates. All rights reserved.
        </Typography>
      </SwipeableDrawer>

      {/* Toast */}
      <Snackbar open={toast.open} autoHideDuration={3500} onClose={() => setToast((t) => ({ ...t, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setToast((t) => ({ ...t, open: false }))} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
