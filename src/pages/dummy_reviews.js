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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import { onAuthStateChanged } from "firebase/auth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Navbar from "../components/Navbar";
import { useCustomTheme } from "../context/ThemeContext";

const REVIEWS_COLLECTION_PATH = ["reviews"];

export default function DownloadPageReviews() {
  const muiTheme = useTheme();
  const { isDark, gradients } = useCustomTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: "success", message: "" });
  const [expanded, setExpanded] = useState(false);

  const [appVersionInfo, setAppVersionInfo] = useState(null);
  const [whatsNew, setWhatsNew] = useState(null);
  const [loadingPageMeta, setLoadingPageMeta] = useState(true);

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
    window.open("/assets/application/BunkMates_Beta.apk", "_blank");
  };

  function parseAppVersionObject(obj) {
    if (!obj || typeof obj !== "object") return null;

    const entries = Object.entries(obj)
      .filter(([, v]) => typeof v === "string" && v.trim() !== "")
      .map(([k, v]) => [String(k).trim(), String(v).trim()]);

    if (entries.length === 0) return null;

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

  useEffect(() => {
    setLoadingPageMeta(true);
    const docRef = doc(db, "app_metadata", "download_page");
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

        if (data?.app_version) {
          const parsed = parseAppVersionObject(data.app_version);
          setAppVersionInfo(parsed);
        } else {
          setAppVersionInfo(null);
        }

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
    if (!currentUser) {
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
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous",
        userPhotoURL: currentUser.photoURL || null,
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

  const whatsNewToRender = !loadingPageMeta && whatsNew && whatsNew.length ? whatsNew : FALLBACK_WHATS_NEW;
  const parsedAppVersion = !loadingPageMeta && appVersionInfo ? appVersionInfo : { app_version: FALLBACK_APP_VERSION.app_version, build_version: FALLBACK_APP_VERSION.build_version };

  const versionBadgeText = (() => {
    const appV = parsedAppVersion?.app_version;
    const buildV = parsedAppVersion?.build_version;
    if (appV && buildV) return `v${appV} · ${buildV}`;
    if (appV) return `v${appV}`;
    if (buildV) return `${buildV}`;
    return "v1.0.31";
  })();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#000000" : "#f8fafc",
        color: isDark ? "#fff" : "#0f172a",
        pb: 8,
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Navbar user={currentUser} />

      {/* Signature Header Gradient Section */}
      <Box
        sx={{
          background: isDark ? gradients.headerDark : gradients.headerLight,
          pt: { xs: 10, md: 12 },
          pb: { xs: 8, md: 12 },
          px: 3,
          color: "#ffffff",
          borderBottomLeftRadius: { xs: "32px", md: "48px" },
          borderBottomRightRadius: { xs: "32px", md: "48px" },
          boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.6)" : "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "center", sm: "flex-start" }}
              textAlign={{ xs: "center", sm: "left" }}
              gap={3}
            >
              <Avatar
                src="/logo512.png"
                alt="BunkMates"
                sx={{
                  width: { xs: 110, sm: 130 },
                  height: { xs: 110, sm: 130 },
                  borderRadius: 4,
                  border: "3px solid #ffffff",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                }}
              />
              <Box>
                <Typography variant="h3" fontWeight={800} sx={{ color: "#ffffff", letterSpacing: "-0.5px" }}>
                  BunkMates
                </Typography>

                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", my: 1, fontSize: "1.05rem" }}>
                  Plan, share & enjoy unforgettable trips with friends.
                </Typography>

                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" justifyContent={{ xs: "center", sm: "flex-start" }} mb={1.5}>
                  <Chip
                    label={versionBadgeText}
                    size="small"
                    onClick={() => setAboutOpen(true)}
                    clickable
                    sx={{
                      bgcolor: "rgba(56, 189, 248, 0.2)",
                      color: "#38bdf8",
                      fontWeight: 700,
                      border: "1px solid rgba(56, 189, 248, 0.4)",
                    }}
                  />
                  <Chip label="Travel & Social" size="small" sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#fff" }} />
                </Box>

                <Box display="flex" alignItems="center" justifyContent={{ xs: "center", sm: "flex-start" }}>
                  <Rating value={4.9} precision={0.1} readOnly size="small" sx={{ color: "#fcd34d", mr: 1 }} />
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                    4.9 • {reviews.length || 24} ratings
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Install button banner */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
          <Box display="flex" gap={2} flexWrap="wrap" mb={5}>
            <Button
              variant="contained"
              size="large"
              startIcon={<InstallMobileIcon />}
              onClick={handleExternalDownload}
              sx={{
                borderRadius: "999px",
                px: 5,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                color: "#ffffff",
                boxShadow: "0 8px 25px rgba(37, 99, 235, 0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #60a5fa, #1d4ed8)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Download APK
            </Button>
            {deferredPrompt && (
              <Button
                onClick={handleInstallClick}
                variant="outlined"
                sx={{
                  borderRadius: "999px",
                  px: 4,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Install Web App
              </Button>
            )}
          </Box>
        </motion.div>

        {/* Screenshots carousel */}
        <Typography variant="h6" fontWeight={700} sx={{ color: isDark ? "#fff" : "#0f172a", mb: 2 }}>
          App Preview
        </Typography>
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            pb: 2,
            scrollSnapType: "x mandatory",
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": { backgroundColor: isDark ? "#334155" : "#cbd5e1", borderRadius: 10 },
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
                width: { xs: 150, sm: 200, md: 230 },
                height: { xs: 300, sm: 400, md: 460 },
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                scrollSnapAlign: "center",
                boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.08)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              <Box
                component="img"
                src={src}
                alt={`Screenshot ${i + 1}`}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Paper>
          ))}
        </Box>

        {/* Full Image Preview Modal */}
        {previewImage && (
          <Box
            onClick={() => setPreviewImage(null)}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(12px)",
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
              style={{ maxWidth: "90%", maxHeight: "85%", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.8)" }}
            />
          </Box>
        )}

        {/* What's New Section */}
        <Typography variant="h6" fontWeight={700} sx={{ color: isDark ? "#fff" : "#0f172a", mt: 6, mb: 2 }}>
          What's New in BunkMates 🚀
        </Typography>

        <Paper
          sx={{
            p: 3.5,
            mb: 5,
            borderRadius: 4,
            background: isDark ? "rgba(15, 23, 42, 0.85)" : "#ffffff",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <Collapse in={expanded} collapsedSize={160}>
            <Box sx={{ color: isDark ? "#94a3b8" : "#475569", lineHeight: 1.8 }}>
              {whatsNewToRender.map((item, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography sx={{ color: isDark ? "#fff" : "#0f172a", fontWeight: 700 }}>{item.title}</Typography>
                  {Array.isArray(item.description) ? (
                    <Box component="ul" sx={{ pl: 2.5, mt: 0.5, color: isDark ? "#94a3b8" : "#475569" }}>
                      {item.description.map((d, j) => (
                        <li key={j}>
                          <Typography variant="body2" sx={{ color: isDark ? "#94a3b8" : "#475569", fontSize: 14 }}>
                            {d}
                          </Typography>
                        </li>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: isDark ? "#94a3b8" : "#475569" }}>
                      {String(item.description)}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Collapse>

          <Box textAlign="center" mt={2}>
            <Button
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ color: "#38bdf8", textTransform: "none", borderRadius: "999px", fontWeight: 600 }}
            >
              {expanded ? "View Less" : "View More"}
            </Button>
          </Box>
        </Paper>

        {/* Reviews Section */}
        <Typography variant="h6" fontWeight={700} sx={{ color: isDark ? "#fff" : "#0f172a", mb: 2 }}>
          User Reviews & Ratings
        </Typography>

        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            background: isDark ? "rgba(15, 23, 42, 0.85)" : "#ffffff",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
          }}
        >
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Rating value={newRating} onChange={(e, v) => setNewRating(v || 0)} sx={{ color: "#fcd34d" }} />
              <Button
                variant="contained"
                endIcon={submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <SendIcon sx={{ fontSize: 16 }} />}
                disabled={submitting}
                onClick={handleSubmitReview}
                sx={{
                  background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                  color: "#ffffff",
                  borderRadius: "999px",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Submit Review
              </Button>
            </Box>
            <TextField
              placeholder="Share your experience with BunkMates..."
              multiline
              minRows={2}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                sx: {
                  borderRadius: 3,
                  color: isDark ? "#fff" : "#0f172a",
                  backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
                },
              }}
            />
          </Stack>
        </Paper>

        {loadingReviews ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress color="primary" /></Box>
        ) : reviewsError ? (
          <Alert severity="error">{reviewsError}</Alert>
        ) : (
          reviews.map((review) => (
            <Paper
              key={review.id}
              sx={{
                p: 2.5,
                mb: 2,
                borderRadius: 3,
                background: isDark ? "rgba(15, 23, 42, 0.6)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"}`,
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar src={review.userPhotoURL || undefined} sx={{ width: 36, height: 36, mr: 1.5, bgcolor: "#38bdf8" }}>
                  {!review.userPhotoURL && (review.userName ? review.userName.charAt(0) : "U")}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={700} sx={{ color: isDark ? "#fff" : "#0f172a" }}>
                    {review.userName || "Anonymous"}
                  </Typography>
                  <Rating value={review.rating || 0} size="small" readOnly sx={{ color: "#fcd34d" }} />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: isDark ? "#94a3b8" : "#475569", lineHeight: 1.7 }}>
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
        onOpen={() => setAboutOpen(true)}
        PaperProps={{
          sx: {
            background: isDark ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(22px)",
            color: isDark ? "#f8fafc" : "#0f172a",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            px: { xs: 3, md: 6 },
            py: 4,
            maxHeight: "85vh",
            maxWidth: 600,
            mx: "auto",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={800}>About BunkMates</Typography>
          <IconButton onClick={() => setAboutOpen(false)} sx={{ color: isDark ? "#94a3b8" : "#64748b" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3, borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />

        <Typography variant="body2" sx={{ color: isDark ? "#94a3b8" : "#475569", lineHeight: 1.8, mb: 3 }}>
          <strong style={{ color: "#38bdf8" }}>BunkMates</strong> is your intelligent group travel companion — helping you plan, manage, and enjoy every trip seamlessly.
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>App Information</Typography>
        <Typography variant="body2" sx={{ color: isDark ? "#94a3b8" : "#475569", lineHeight: 1.8, mb: 3 }}>
          Version: <strong>{parsedAppVersion?.build_version ?? parsedAppVersion?.app_version ?? FALLBACK_APP_VERSION.build_version}</strong><br />
          Supported: Android 9 and above<br />
          Network: Online + Offline Caching
        </Typography>

        <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: isDark ? "#64748b" : "#94a3b8" }}>
          © {new Date().getFullYear()} BunkMates. All rights reserved.
        </Typography>
      </SwipeableDrawer>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setToast((t) => ({ ...t, open: false }))} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}