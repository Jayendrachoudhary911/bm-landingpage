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
import { onAuthStateChanged } from "firebase/auth"; // <-- Added import for auth listener
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Navbar from "../components/Navbar";

// Reviews collection path: now directly under the root of Firestore
const REVIEWS_COLLECTION_PATH = ["reviews"];

export default function DownloadPage() { // Component name updated
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  // --- Firebase Auth State Management ---
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Listener for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);
  // ------------------------------------

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: "success", message: "" });
  const [expanded, setExpanded] = useState(false);

  // Fields pulled from Firestore's app_metadata/download_page
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

  // --- Realtime: listen to app_metadata/download_page doc for app_version & whats_new
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

  // --- Reviews listener (top-level 'reviews' collection) ---
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
    // Prevent submission while auth state is being determined
    if (isAuthLoading) {
        setToast({ open: true, severity: "info", message: "Checking sign-in status, please wait." });
        return;
    }
    
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
      // Use the top-level reviews collection for submitting
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

  // Determine if the submit button should be disabled globally
  const isSubmitDisabled = submitting || isAuthLoading || !newText.trim();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
      }}
    >


      <Container maxWidth="md" sx={{ py: 6, zIndex: 9, position: "relative" }}>


        {/* Reviews */}
        <Typography variant="h6" fontWeight={700} gutterBottom>Reviews</Typography>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, background: "#11111185" }}>
          <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Rating value={newRating} onChange={(e, v) => setNewRating(v || 0)} sx={{ color: "#ffd700" }} disabled={isAuthLoading || !currentUser} />
              <Button 
                variant="contained" 
                endIcon={submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <SendIcon />} 
                disabled={isSubmitDisabled} 
                onClick={handleSubmitReview} 
                sx={{ background: "#cdcdcd47", "&:hover": { background: "#1b1b1bff" }, color: "#ffffffff", borderRadius: 2, fontWeight: 600 }}
              >
                {isAuthLoading ? "Loading Auth..." : (currentUser ? "Submit" : "Sign In to Submit")}
              </Button>
            </Box>
            <TextField 
              placeholder={isAuthLoading 
                ? "Checking user status..." 
                : (currentUser ? "Share your experience..." : "Sign in to leave a review.")
              } 
              multiline 
              minRows={2} 
              value={newText} 
              onChange={(e) => setNewText(e.target.value)} 
              fullWidth 
              variant="outlined" 
              size="small" 
              disabled={isAuthLoading || !currentUser}
              sx={{ "& .MuiOutlinedInput-root": { background: "#1a1a1a", color: "#fff", "& fieldset": { borderColor: "#333" }, "&:hover fieldset": { borderColor: "#555" }, "&.Mui-focused fieldset": { borderColor: "#00c6ff" } } }} 
            />
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

      {/* Toast */}
      <Snackbar open={toast.open} autoHideDuration={3500} onClose={() => setToast((t) => ({ ...t, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setToast((t) => ({ ...t, open: false }))} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}