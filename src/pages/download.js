// src/pages/DownloadPage.js
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Paper,
  Chip,
  Rating,
  SwipeableDrawer,
  IconButton,
  TextField,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import InstallMobileRoundedIcon from "@mui/icons-material/InstallMobileRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import { motion, AnimatePresence } from "framer-motion";
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
import { useCustomTheme } from "../context/ThemeContext";

const REVIEWS_COLLECTION_PATH = ["landing_page", "download_page", "reviews"];

const SCREENSHOTS = [
  "/assets/BM-screenshots/1.png",
  "/assets/BM-screenshots/2.png",
  "/assets/BM-screenshots/12.png",
  "/assets/BM-screenshots/17.png",
  "/assets/BM-screenshots/6.png",
  "/assets/BM-screenshots/7.png",
];

export default function DownloadPage() {
  const { isDark } = useCustomTheme();
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Gallery Drawer & Pinch-Zoom State
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const touchStartRef = useRef({ distance: 0, x: 0, y: 0 });

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: "success", message: "" });
  const [expanded, setExpanded] = useState(false);

  // Metadata State
  const [appVersionInfo, setAppVersionInfo] = useState(null);
  const [whatsNew, setWhatsNew] = useState(null);
  const [loadingPageMeta, setLoadingPageMeta] = useState(true);

  const colors = {
    surface: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
    surfaceStrong: isDark ? "rgba(20, 20, 20, 0.6)" : "rgba(255, 255, 255, 0.7)",
    text: isDark ? "#ffffff" : "#111111",
    secondaryText: isDark ? "#a3a3a3" : "#737373",
    border: isDark ? "rgba(255, 255, 255, 0.09)" : "rgba(0, 0, 0, 0.08)",
    subtleBorder: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
  };

  const coreFeatures = [
    {
      title: "Trip Planning",
      desc: "Create, manage and track itineraries effortlessly.",
      icon: <MapRoundedIcon sx={{ fontSize: 20 }} />,
    },
    {
      title: "Group Chats",
      desc: "Real-time messaging with media, emoji, and voice notes.",
      icon: <ForumRoundedIcon sx={{ fontSize: 20 }} />,
    },
    {
      title: "Budget Manager",
      desc: "Split expenses, track spending, and view totals.",
      icon: <PaidRoundedIcon sx={{ fontSize: 20 }} />,
    },
    {
      title: "To-Do & Notes",
      desc: "Organize checklists and notes with attachments.",
      icon: <ChecklistRoundedIcon sx={{ fontSize: 20 }} />,
    },
    {
      title: "Weather & Events",
      desc: "Live forecasts and local event insights.",
      icon: <CloudQueueRoundedIcon sx={{ fontSize: 20 }} />,
    },
    {
      title: "Reminders",
      desc: "Smart alerts for trip activities and deadlines.",
      icon: <NotificationsActiveRoundedIcon sx={{ fontSize: 20 }} />,
    },
    {
      title: "Offline Mode",
      desc: "Access trips, notes, and maps without internet.",
      icon: <CloudOffRoundedIcon sx={{ fontSize: 20 }} />,
    },
    {
      title: "PWA Support",
      desc: "Install and sync seamlessly across devices.",
      icon: <InstallMobileRoundedIcon sx={{ fontSize: 20 }} />,
    },
    {
      title: "Authentication",
      desc: "Secure login via Supabase & Google Sign-In.",
      icon: <LockRoundedIcon sx={{ fontSize: 20 }} />,
    },
  ];

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
    setToast({ open: true, severity: "success", message: "Starting BunkMates APK download..." });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "BunkMates App",
        text: "Check out BunkMates for group trip planning!",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast({ open: true, severity: "success", message: "Link copied to clipboard!" });
    }
  };

  const openGallery = (index) => {
    setSelectedImageIndex(index);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setGalleryOpen(true);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % SCREENSHOTS.length);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + SCREENSHOTS.length) % SCREENSHOTS.length);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current.distance = distance;
    } else if (e.touches.length === 1) {
      touchStartRef.current.x = e.touches[0].clientX - panOffset.x;
      touchStartRef.current.y = e.touches[0].clientY - panOffset.y;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchStartRef.current.distance > 0) {
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDistance / touchStartRef.current.distance;
      setZoomScale((prev) => Math.min(Math.max(prev * ratio, 1), 4));
      touchStartRef.current.distance = currentDistance;
    } else if (e.touches.length === 1 && zoomScale > 1) {
      setPanOffset({
        x: e.touches[0].clientX - touchStartRef.current.x,
        y: e.touches[0].clientY - touchStartRef.current.y,
      });
    }
  };

  const handleWheelZoom = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoomScale((prev) => {
      const next = Math.min(Math.max(prev + zoomDelta, 1), 4);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
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
    };
  }

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
      () => {
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
        () => {
          setReviewsError("Failed to load reviews.");
          setLoadingReviews(false);
        }
      );
      return () => unsub();
    } catch {
      setLoadingReviews(false);
      return () => {};
    }
  }, []);

  const handleSubmitReview = async () => {
    const current = auth.currentUser;
    if (!current) {
      setToast({ open: true, severity: "warning", message: "Please log in to submit a review." });
      return;
    }
    if (!newText.trim()) {
      setToast({ open: true, severity: "warning", message: "Please write a review before submitting." });
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
      setToast({ open: true, severity: "success", message: "Thank you! Your review has been posted." });
    } catch {
      setToast({ open: true, severity: "error", message: "Failed to submit review. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const FALLBACK_WHATS_NEW = [
    {
      title: "Trips & Real-Time Itineraries",
      description: [
        "Plan, coordinate, and manage multi-day trips with friends effortlessly.",
        "Automatic offline trip caching for zero-signal zones.",
      ],
    },
    {
      title: "Smart Expense & Split Calculator",
      description: ["Instantly balance shared group expenses with automated debt simplification."],
    },
    {
      title: "Private & Group Chat Hub",
      description: ["Real-time group messaging, photo vaults, and live coordinates sharing."],
    },
  ];

  const FALLBACK_APP_VERSION = {
    app_version: "2.1.0",
    build_version: "Beta_2.12.0.000",
  };

  const whatsNewToRender = !loadingPageMeta && whatsNew && whatsNew.length ? whatsNew : FALLBACK_WHATS_NEW;
  const parsedAppVersion = !loadingPageMeta && appVersionInfo ? appVersionInfo : FALLBACK_APP_VERSION;

  const versionBadgeText = (() => {
    const buildV = parsedAppVersion?.build_version;
    const appV = parsedAppVersion?.app_version;
    if (buildV) return buildV;
    if (appV) return `v${appV}`;
    return "Beta_2.12.0.000";
  })();

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    window.location.origin + "/assets/application/BunkMates_Beta.apk"
  )}&bgcolor=ffffff&color=000000&margin=10`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: colors.text,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowX: "hidden",
        pb: 12,
        transition: "color 0.35s ease",
      }}
    >

      {/* Main Container */}
      <Container maxWidth="md" sx={{ mt: { xs: 11, md: 14 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            mb: 3,
            borderRadius: "12px",
            textTransform: "none",
            color: colors.secondaryText,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            fontSize: "0.85rem",
            fontWeight: 650,
            "&:hover": {
              backgroundColor: colors.surfaceStrong,
              color: colors.text,
            },
          }}
        >
          Back
        </Button>

        {/* Play Store Style Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: 3,
              mb: 4,
            }}
          >
            {/* Left Section: App Icon + App Titles */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
              <Avatar
                src="/logo512.png"
                alt="BunkMates"
                sx={{
                  width: { xs: 84, sm: 104, md: 116 },
                  height: { xs: 84, sm: 104, md: 116 },
                  borderRadius: { xs: "22px", sm: "26px" },
                  border: `1px solid ${colors.border}`,
                  boxShadow: isDark ? "0 12px 30px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.08)",
                  flexShrink: 0,
                }}
              />

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 850,
                    letterSpacing: "-0.04em",
                    fontSize: { xs: "1.6rem", sm: "2.1rem", md: "2.4rem" },
                    lineHeight: 1.1,
                    color: colors.text,
                    mb: 0.5,
                  }}
                >
                  BunkMates
                </Typography>

                <Typography
                  sx={{
                    color: isDark ? "#38bdf8" : "#0284c7",
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    mb: 0.8,
                  }}
                >
                  BunkMates Lab · Travel & Social
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={versionBadgeText}
                    size="small"
                    onClick={() => setAboutOpen(true)}
                    clickable
                    sx={{
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                      color: colors.text,
                      fontWeight: 750,
                      borderRadius: "8px",
                      border: `1px solid ${colors.border}`,
                      fontSize: "0.72rem",
                    }}
                  />
                  <Chip
                    icon={<VerifiedRoundedIcon sx={{ color: "#22c55e !important", fontSize: 14 }} />}
                    label="Verified"
                    size="small"
                    sx={{
                      backgroundColor: isDark ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.08)",
                      color: "#22c55e",
                      fontWeight: 700,
                      borderRadius: "8px",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                      fontSize: "0.72rem",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Right Section: Install & Action Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 1.5,
                flexShrink: 0,
              }}
            >
              <Button
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExternalDownload}
                startIcon={<DownloadRoundedIcon sx={{ fontSize: "1.15rem !important" }} />}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  minHeight: 46,
                  px: 4,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  fontWeight: 750,
                  backgroundColor: colors.text,
                  color: isDark ? "#000000" : "#ffffff",
                  boxShadow: isDark ? "0 10px 25px rgba(0, 0, 0, 0.35)" : "0 8px 20px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    backgroundColor: isDark ? "#e8e8e8" : "#242424",
                  },
                }}
              >
                Install
              </Button>

              <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" } }}>
                <IconButton
                  onClick={() => setQrOpen(true)}
                  sx={{
                    flex: { xs: 1, sm: "initial" },
                    borderRadius: "14px",
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    backgroundColor: colors.surface,
                    "&:hover": { backgroundColor: colors.surfaceStrong },
                  }}
                >
                  <QrCode2RoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>

                <IconButton
                  onClick={handleShare}
                  sx={{
                    flex: { xs: 1, sm: "initial" },
                    borderRadius: "14px",
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    backgroundColor: colors.surface,
                    "&:hover": { backgroundColor: colors.surfaceStrong },
                  }}
                >
                  <ShareRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Play Store Stats Bar */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            py: 1.8,
            px: 2,
            mb: 4,
            borderRadius: "20px",
            backgroundColor: colors.surface,
            border: `1px solid ${colors.subtleBorder}`,
            textAlign: "center",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
              <Typography sx={{ fontWeight: 850, fontSize: "0.95rem", color: colors.text }}>
                4.9
              </Typography>
              <Rating value={1} max={1} readOnly size="small" sx={{ color: "#fcd34d", fontSize: "0.95rem" }} />
            </Box>
            <Typography sx={{ color: colors.secondaryText, fontSize: "0.72rem", mt: 0.2 }}>
              {reviews.length || 24} reviews
            </Typography>
          </Box>

          <Box sx={{ width: "1px", height: 28, backgroundColor: colors.border }} />

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography sx={{ fontWeight: 850, fontSize: "0.95rem", color: colors.text }}>
              10K+
            </Typography>
            <Typography sx={{ color: colors.secondaryText, fontSize: "0.72rem", mt: 0.2 }}>
              Downloads
            </Typography>
          </Box>

          <Box sx={{ width: "1px", height: 28, backgroundColor: colors.border }} />

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography sx={{ fontWeight: 850, fontSize: "0.95rem", color: colors.text }}>
              ~120 MB
            </Typography>
            <Typography sx={{ color: colors.secondaryText, fontSize: "0.72rem", mt: 0.2 }}>
              Storage size
            </Typography>
          </Box>

          <Box sx={{ width: "1px", height: 28, backgroundColor: colors.border }} />

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography sx={{ fontWeight: 850, fontSize: "0.95rem", color: colors.text }}>
              Android 9+
            </Typography>
            <Typography sx={{ color: colors.secondaryText, fontSize: "0.72rem", mt: 0.2 }}>
              Compatibility
            </Typography>
          </Box>
        </Paper>

        {/* Screenshots Carousel */}
        <Box sx={{ mb: 5 }}>
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              pb: 2,
              scrollSnapType: "x mandatory",
              "&::-webkit-scrollbar": { height: 5 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
                borderRadius: 10,
              },
            }}
          >
            {SCREENSHOTS.map((src, i) => (
              <Box
                key={i}
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => openGallery(i)}
                sx={{
                  flex: "0 0 auto",
                  width: { xs: 155, sm: 195, md: 220 },
                  height: { xs: 310, sm: 390, md: 440 },
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  scrollSnapAlign: "start",
                  backgroundColor: colors.surfaceStrong,
                  border: `1px solid ${colors.border}`,
                  boxShadow: isDark ? "0 10px 25px rgba(0,0,0,0.4)" : "0 8px 20px rgba(0,0,0,0.06)",
                }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={`Screenshot ${i + 1}`}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* =========================================================
            COMBINED ABOUT & WHAT'S NEW SECTION (2x Mobile, 4x Desktop)
        ========================================================= */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 850,
                letterSpacing: "-0.04em",
                color: colors.text,
                fontSize: { xs: "1.25rem", sm: "1.45rem" },
              }}
            >
              About & What's New
            </Typography>
            <IconButton size="small" onClick={() => setAboutOpen(true)} sx={{ color: colors.secondaryText }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: "24px",
              backgroundColor: 'transparent',
              border: `0px solid ${colors.border}`,
              display: "flex",
              flexDirection: "column",
              gap: 3.5,
            }}
          >
            {/* App Overview */}
            <Typography sx={{ color: colors.secondaryText, fontSize: "0.92rem", lineHeight: 1.75 }}>
              <strong style={{ color: colors.text }}>BunkMates</strong> is your intelligent group travel companion — helping you plan, manage, and enjoy every trip seamlessly. From budgeting and messaging to maps and reminders, it keeps your adventures organized, smart, and stress-free[cite: 20, 21].
            </Typography>

            {/* Embedded What's New Release Updates */}
            <Box
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: "20px",
                backgroundColor: colors.surfaceStrong,
                border: `1px solid ${colors.subtleBorder}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <NewReleasesRoundedIcon sx={{ fontSize: 18, color: isDark ? "#38bdf8" : "#0284c7" }} />
                <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: colors.text }}>
                  Latest Updates ({versionBadgeText})
                </Typography>
              </Box>

              <Collapse in={expanded} collapsedSize={130}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
                  {whatsNewToRender.map((item, idx) => (
                    <Box key={idx}>
                      <Typography sx={{ color: colors.text, fontWeight: 750, fontSize: "0.88rem", mb: 0.3 }}>
                        {item.title}
                      </Typography>
                      {Array.isArray(item.description) ? (
                        <Box component="ul" sx={{ pl: 2, m: 0, color: colors.secondaryText }}>
                          {item.description.map((d, j) => (
                            <li key={j}>
                              <Typography sx={{ color: colors.secondaryText, fontSize: "0.82rem", lineHeight: 1.5 }}>
                                {d}
                              </Typography>
                            </li>
                          ))}
                        </Box>
                      ) : (
                        <Typography sx={{ color: colors.secondaryText, fontSize: "0.82rem", lineHeight: 1.5 }}>
                          {String(item.description)}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Collapse>

              <Box sx={{ textAlign: "center", mt: 1.5, pt: 0.5 }}>
                <Button
                  onClick={() => setExpanded(!expanded)}
                  endIcon={expanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                  sx={{
                    color: colors.text,
                    textTransform: "none",
                    borderRadius: "999px",
                    fontWeight: 750,
                    fontSize: "0.8rem",
                    px: 1.8,
                    py: 0.4,
                    backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
                  }}
                >
                  {expanded ? "Show Less" : "Show All Release Notes"}
                </Button>
              </Box>
            </Box>

            {/* Core Features: 2x in Mobile, 4x in Desktop */}
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: colors.text, mb: 1.5 }}>
                Core Features
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.25,
                }}
              >
                {coreFeatures.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: {
                        xs: "1 1 calc(50% - 10px)",
                        sm: "1 1 calc(33.333% - 10px)",
                        md: "1 1 calc(25% - 10px)",
                      },
                      minWidth: {
                        xs: "calc(50% - 10px)",
                        md: "calc(25% - 10px)",
                      },
                      p: 1.6,
                      borderRadius: "16px",
                      backgroundColor: colors.surfaceStrong,
                      border: `1px solid ${colors.subtleBorder}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.4,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: colors.text }}>
                      {item.icon}
                      <Typography sx={{ fontWeight: 750, fontSize: "0.86rem" }}>
                        {item.title}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: colors.secondaryText, fontSize: "0.75rem", lineHeight: 1.45 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* App Information: 2x in Mobile, 4x in Desktop */}
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: colors.text, mb: 1.5 }}>
                App Information
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.25,
                  p: 2,
                  borderRadius: "18px",
                  backgroundColor: colors.surfaceStrong,
                  border: `1px solid ${colors.subtleBorder}`,
                }}
              >
                {[
                  { label: "Version (Build)", value: parsedAppVersion?.build_version ?? FALLBACK_APP_VERSION.build_version },
                  { label: "APK Version", value: parsedAppVersion?.app_version ?? FALLBACK_APP_VERSION.app_version },
                  { label: "Compatibility", value: "Android 9 (Pie)+" },
                  { label: "Recommended RAM", value: "2GB+" },
                  { label: "Storage Footprint", value: "~120MB (offline)" },
                  { label: "Network", value: "Online + Offline" },
                ].map((spec, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: {
                        xs: "1 1 calc(50% - 10px)",
                        sm: "1 1 calc(33.333% - 10px)",
                        md: "1 1 calc(25% - 10px)",
                      },
                      minWidth: {
                        xs: "calc(50% - 10px)",
                        md: "calc(25% - 10px)",
                      },
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.2,
                    }}
                  >
                    <Typography sx={{ color: colors.secondaryText, fontSize: "0.74rem" }}>
                      {spec.label}
                    </Typography>
                    <Typography sx={{ color: colors.text, fontWeight: 750, fontSize: "0.84rem" }}>
                      {spec.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Footer Credits */}
            <Box sx={{ pt: 1, borderTop: `1px solid ${colors.subtleBorder}` }}>
              <Typography sx={{ color: colors.secondaryText, fontSize: "0.8rem" }}>
                Developed at <strong style={{ color: colors.text }}>BunkMates Lab</strong> · 2026 Public Beta
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* =========================================================
            RATINGS & REVIEWS SECTION
        ========================================================= */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 850,
              letterSpacing: "-0.04em",
              color: colors.text,
              mb: 2,
              fontSize: { xs: "1.25rem", sm: "1.45rem" },
            }}
          >
            Ratings and reviews
          </Typography>

          {/* Add Review Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2.5,
              borderRadius: "24px",
              backgroundColor: colors.surfaceStrong,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Rating value={newRating} onChange={(e, v) => setNewRating(v || 0)} sx={{ color: "#fcd34d" }} />
                <Button
                  variant="contained"
                  endIcon={submitting ? <CircularProgress size={15} color="inherit" /> : <SendRoundedIcon sx={{ fontSize: 16 }} />}
                  disabled={submitting}
                  onClick={handleSubmitReview}
                  sx={{
                    backgroundColor: colors.text,
                    color: isDark ? "#000000" : "#ffffff",
                    borderRadius: "12px",
                    fontWeight: 750,
                    textTransform: "none",
                    px: 2.5,
                    minHeight: 38,
                    fontSize: "0.88rem",
                    "&:hover": { backgroundColor: isDark ? "#e8e8e8" : "#242424" },
                  }}
                >
                  Post Review
                </Button>
              </Box>
              <TextField
                placeholder="Write a public review for BunkMates..."
                multiline
                minRows={2}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                fullWidth
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: "14px",
                    color: colors.text,
                    backgroundColor: colors.surface,
                    "& fieldset": { border: `1px solid ${colors.border}` },
                    "&:hover fieldset": { borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)" },
                    "&.Mui-focused fieldset": { borderColor: colors.text },
                  },
                }}
              />
            </Stack>
          </Paper>

          {/* Reviews List */}
          {loadingReviews ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={22} sx={{ color: colors.text }} />
            </Box>
          ) : reviewsError ? (
            <Alert severity="error" sx={{ borderRadius: "16px" }}>{reviewsError}</Alert>
          ) : (
            <Stack spacing={1.5}>
              {reviews.map((review) => (
                <Paper
                  key={review.id}
                  elevation={0}
                  sx={{
                    p: 2.2,
                    borderRadius: "18px",
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.subtleBorder}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.8 }}>
                    <Avatar
                      src={review.userPhotoURL || undefined}
                      sx={{
                        width: 34,
                        height: 34,
                        mr: 1.2,
                        bgcolor: colors.text,
                        color: isDark ? "#000000" : "#ffffff",
                        fontSize: "0.82rem",
                        fontWeight: 750,
                      }}
                    >
                      {!review.userPhotoURL && (review.userName ? review.userName.charAt(0) : "U")}
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: colors.text, fontWeight: 750, fontSize: "0.86rem" }}>
                        {review.userName || "Anonymous"}
                      </Typography>
                      <Rating value={review.rating || 0} size="small" readOnly sx={{ color: "#fcd34d", fontSize: "0.8rem" }} />
                    </Box>
                  </Box>
                  <Typography sx={{ color: colors.secondaryText, fontSize: "0.86rem", lineHeight: 1.6 }}>
                    {review.text}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </Container>

      {/* Image Gallery Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onOpen={() => setGalleryOpen(true)}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? "rgba(5, 8, 15, 0.96)" : "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            color: colors.text,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTop: `1px solid ${colors.border}`,
            height: "92vh",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2.5, sm: 4 },
            py: 2,
            borderBottom: `1px solid ${colors.subtleBorder}`,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
              App Gallery
            </Typography>
            <Chip
              label={`${selectedImageIndex + 1} / ${SCREENSHOTS.length}`}
              size="small"
              sx={{
                fontWeight: 750,
                backgroundColor: colors.surface,
                border: `1px solid ${colors.subtleBorder}`,
                color: colors.text,
                fontSize: "0.75rem",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setZoomScale((prev) => Math.min(prev + 0.3, 4))}
              sx={{
                color: colors.secondaryText,
                backgroundColor: colors.surface,
                border: `1px solid ${colors.subtleBorder}`,
                "&:hover": { color: colors.text },
              }}
            >
              <ZoomInRoundedIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => {
                setZoomScale((prev) => {
                  const next = Math.max(prev - 0.3, 1);
                  if (next === 1) setPanOffset({ x: 0, y: 0 });
                  return next;
                });
              }}
              sx={{
                color: colors.secondaryText,
                backgroundColor: colors.surface,
                border: `1px solid ${colors.subtleBorder}`,
                "&:hover": { color: colors.text },
              }}
            >
              <ZoomOutRoundedIcon fontSize="small" />
            </IconButton>

            {zoomScale > 1 && (
              <IconButton
                size="small"
                onClick={() => {
                  setZoomScale(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                sx={{
                  color: colors.secondaryText,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.subtleBorder}`,
                  "&:hover": { color: colors.text },
                }}
              >
                <RestartAltRoundedIcon fontSize="small" />
              </IconButton>
            )}

            <IconButton
              onClick={() => setGalleryOpen(false)}
              sx={{
                color: colors.secondaryText,
                backgroundColor: colors.surface,
                border: `1px solid ${colors.subtleBorder}`,
                ml: 1,
                "&:hover": { color: colors.text },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        <Box
          onWheel={handleWheelZoom}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          sx={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            p: 2,
            touchAction: "none",
            userSelect: "none",
          }}
        >
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: "absolute",
              left: { xs: 8, sm: 24 },
              zIndex: 10,
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.8)",
              border: `1px solid ${colors.border}`,
              color: colors.text,
              backdropFilter: "blur(8px)",
              "&:hover": {
                backgroundColor: isDark ? "rgba(0, 0, 0, 0.8)" : "#ffffff",
              },
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            onClick={handleNextImage}
            sx={{
              position: "absolute",
              right: { xs: 8, sm: 24 },
              zIndex: 10,
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.8)",
              border: `1px solid ${colors.border}`,
              color: colors.text,
              backdropFilter: "blur(8px)",
              "&:hover": {
                backgroundColor: isDark ? "rgba(0, 0, 0, 0.8)" : "#ffffff",
              },
            }}
          >
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={SCREENSHOTS[selectedImageIndex]}
                alt={`Expanded screenshot ${selectedImageIndex + 1}`}
                sx={{
                  maxHeight: "56vh",
                  maxWidth: "85vw",
                  objectFit: "contain",
                  borderRadius: "20px",
                  boxShadow: isDark
                    ? "0 25px 60px rgba(0, 0, 0, 0.85)"
                    : "0 20px 45px rgba(0, 0, 0, 0.15)",
                  border: `1px solid ${colors.border}`,
                  transform: `scale(${zoomScale}) translate(${panOffset.x / zoomScale}px, ${panOffset.y / zoomScale}px)`,
                  transition: zoomScale === 1 ? "transform 0.2s ease-out" : "none",
                  cursor: zoomScale > 1 ? "grab" : "zoom-in",
                }}
                onClick={() => {
                  if (zoomScale === 1) setZoomScale(2);
                  else {
                    setZoomScale(1);
                    setPanOffset({ x: 0, y: 0 });
                  }
                }}
              />
            </motion.div>
          </AnimatePresence>
        </Box>

        <Box
          sx={{
            py: 2,
            px: 3,
            backgroundColor: colors.surface,
            borderTop: `1px solid ${colors.subtleBorder}`,
            display: "flex",
            justifyContent: "center",
            overflowX: "auto",
            gap: 1.5,
            flexShrink: 0,
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
              borderRadius: 10,
            },
          }}
        >
          {SCREENSHOTS.map((src, index) => {
            const active = index === selectedImageIndex;
            return (
              <Box
                key={index}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedImageIndex(index);
                  setZoomScale(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                sx={{
                  flexShrink: 0,
                  width: { xs: 52, sm: 64 },
                  height: { xs: 80, sm: 100 },
                  borderRadius: "14px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: active
                    ? `2px solid ${isDark ? "#ffffff" : "#000000"}`
                    : `1px solid ${colors.border}`,
                  opacity: active ? 1 : 0.45,
                  transition: "all 0.2s ease",
                  transform: active ? "translateY(-4px)" : "none",
                  boxShadow: active
                    ? isDark
                      ? "0 6px 18px rgba(255,255,255,0.1)"
                      : "0 6px 18px rgba(0,0,0,0.15)"
                    : "none",
                }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            );
          })}
        </Box>
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor="bottom"
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        onOpen={() => setQrOpen(true)}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(15, 23, 42, 0.45)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
            },
          },
        }}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0)",
            color: colors.text,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            borderTop: `0px solid ${colors.border}`,
            maxHeight: "92vh",
            maxWidth: 480,
            mx: "auto",
            p: { xs: 2.5, sm: 3.5 },
            overflowY: "auto",
          },
        }}
      >

        {/* =========================================================
            TICKET / RECEIPT CONTAINER WITH CUTOUT NOTCHES
        ========================================================= */}
        <Box
          sx={{
            position: "relative",
            borderRadius: "26px",
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `0px solid ${colors.border}`,
            boxShadow: 'none',
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top Ticket Segment: App Header & Specs */}
          <Box sx={{ p: { xs: 2.5, sm: 3 }, pb: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  src="/logo512.png"
                  alt="BunkMates"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    border: `1px solid ${colors.border}`,
                  }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 850, fontSize: "1.15rem", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                    BunkMates
                  </Typography>
                  <Typography sx={{ color: isDark ? "#8e8e8e" : "#0284c7", fontSize: "0.76rem", fontWeight: 700, mt: 0.2 }}>
                    Travel Squad Pass
                  </Typography>
                </Box>
              </Box>

              <Chip
                label="BETA PASS"
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: "0.68rem",
                  letterSpacing: "0.04em",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(2, 132, 199, 0.08)",
                  color: isDark ? "#ffffff" : "#0284c7",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid rgba(2, 132, 199, 0.2)",
                  borderRadius: 4,
                }}
              />
            </Box>

            {/* Receipt Table Meta Grid */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                p: 1.8,
                borderRadius: "16px",
                backgroundColor: colors.surface,
                border: `1px solid ${colors.subtleBorder}`,
              }}
            >
              {[
                { label: "VERSION", value: versionBadgeText },
                { label: "PLATFORM", value: "Android 9+" },
                { label: "PACKAGE", value: "APK Direct" },
                { label: "SIZE", value: "~120 MB" },
              ].map((item, idx) => (
                <Box key={idx} sx={{ flex: "1 1 calc(50% - 10px)", display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ color: colors.secondaryText, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ color: colors.text, fontSize: "0.84rem", fontWeight: 750 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Ticket Perforation Divider with Left and Right Notches */}
          <Box sx={{ position: "relative", width: "100%", my: 0.5, display: "flex", alignItems: "center" }}>
            {/* Left Notch */}
            <Box
              sx={{
                position: "absolute",
                left: -14,
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: isDark ? "#070a0f" : "#f8fafc",
                border: `1px solid ${colors.border}`,
                zIndex: 2,
              }}
            />

            {/* Perforated Dashed Line */}
            <Box
              sx={{
                width: "100%",
                borderBottom: `2px dashed ${isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(0, 0, 0, 0.12)"}`,
                mx: 2,
              }}
            />

            {/* Right Notch */}
            <Box
              sx={{
                position: "absolute",
                right: -14,
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: isDark ? "#070a0f" : "#f8fafc",
                border: `1px solid ${colors.border}`,
                zIndex: 2,
              }}
            />
          </Box>

          {/* Bottom Ticket Segment: Scannable QR Code & Instructions */}
          <Box
            sx={{
              p: { xs: 2.5, sm: 3 },
              pt: 2.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: "20px",
                backgroundColor: "#ffffff",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                display: "inline-flex",
                mb: 1.8,
              }}
            >
              <Box
                component="img"
                src={qrCodeUrl}
                alt="Download QR Pass"
                sx={{
                  width: { xs: 180, sm: 200 },
                  height: { xs: 180, sm: 200 },
                  display: "block",
                }}
              />
            </Box>

            <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", color: colors.text, mb: 0.4 }}>
              Scan with mobile camera
            </Typography>
            <Typography sx={{ color: colors.secondaryText, fontSize: "0.78rem", maxWidth: 260, lineHeight: 1.5 }}>
              Point any camera or barcode scanner at the code to start your download instantly.
            </Typography>
          </Box>
        </Box>

        {/* Action Controls: Share Pass & Download Direct */}
        <Box sx={{ display: "flex", gap: 1.5, mt: 2.5 }}>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            startIcon={<ShareRoundedIcon sx={{ fontSize: "1.05rem !important" }} />}
            sx={{
              flex: 1,
              minHeight: 46,
              borderRadius: "14px",
              textTransform: "none",
              fontSize: "0.9rem",
              fontWeight: 750,
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(24px)",
              color: colors.text,
              border: `1px solid ${colors.border}`,
              "&:hover": {
                backgroundColor: colors.surfaceStrong,
              },
            }}
          >
            Share Pass
          </Button>

          <Button
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExternalDownload}
            startIcon={<DownloadRoundedIcon sx={{ fontSize: "1.1rem !important" }} />}
            sx={{
              flex: 1.2,
              minHeight: 46,
              borderRadius: "14px",
              textTransform: "none",
              fontSize: "0.9rem",
              fontWeight: 750,
              backgroundColor: colors.text,
              color: isDark ? "#000000" : "#ffffff",
              boxShadow: isDark ? "0 8px 24px rgba(0, 0, 0, 0.4)" : "0 6px 18px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: isDark ? "#e8e8e8" : "#242424",
              },
            }}
          >
            Download APK
          </Button>
        </Box>
      </SwipeableDrawer>

      {/* Swipeable Drawer for Quick Meta */}
      <SwipeableDrawer
        anchor="bottom"
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        onOpen={() => setAboutOpen(true)}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? "#0d0d0d" : "#ffffff",
            color: colors.text,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTop: `1px solid ${colors.border}`,
            maxHeight: "88vh",
            maxWidth: 620,
            mx: "auto",
          },
        }}
      >
        <Box sx={{ p: { xs: 2.5, sm: 3.5 }, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
              App Specifications
            </Typography>
            <IconButton
              onClick={() => setAboutOpen(false)}
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                color: colors.secondaryText,
                border: `1px solid ${colors.border}`,
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Typography sx={{ color: colors.secondaryText, fontSize: "0.9rem", lineHeight: 1.7, mb: 3 }}>
            BunkMates is an intelligent group travel companion engineered to help squads plan, coordinate, and experience seamless trips together[cite: 20, 21].
          </Typography>

          <Box sx={{ p: 2.5, borderRadius: "20px", backgroundColor: colors.surface, border: `1px solid ${colors.subtleBorder}`, mb: 3 }}>
            <Typography sx={{ fontWeight: 750, fontSize: "0.92rem", mb: 1 }}>Build Details</Typography>
            <Typography sx={{ color: colors.secondaryText, fontSize: "0.85rem", lineHeight: 1.75 }}>
              Version (Build): <strong>{parsedAppVersion?.build_version ?? FALLBACK_APP_VERSION.build_version}</strong><br />
              APK Version: <strong>{parsedAppVersion?.app_version ?? FALLBACK_APP_VERSION.app_version}</strong><br />
              Compatibility: Android 9.0 (Pie) and above<br />
              Storage footprint: ~120MB (with offline cache support)
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ color: colors.secondaryText, textAlign: "center", display: "block" }}>
            © {new Date().getFullYear()} BunkMates. All rights reserved.
          </Typography>
        </Box>
      </SwipeableDrawer>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}