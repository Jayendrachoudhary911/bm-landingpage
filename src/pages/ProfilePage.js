// src/pages/ProfilePage.js
import React, { useEffect, useState, useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Stack,
  Chip,
  Dialog,
  Divider,
  MenuItem,
  Select,
  FormControl,
  Alert,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  PersonRounded,
  LockOutlined,
  SmartToyRounded,
  BookmarkRounded,
  BadgeRounded,
  LocationOnRounded,
  PhoneIphoneRounded,
  EmailRounded,
  VerifiedUserRounded,
  GroupsRounded,
  ArrowBackRounded,
  CheckCircleRounded,
  TerrainRounded as TerrainIcon,
  HikingRounded,
  ExploreRounded,
  MapRounded,
  CameraAltRounded,
  WbSunnyRounded,
  FlightTakeoffRounded,
  TurnRightRounded,
  SouthEastRounded,
  LuggageRounded,
  DirectionsCarRounded,
  SaveRounded,
  UploadRounded,
  KeyRounded,
  SecurityRounded,
  DeleteOutlineRounded,
  PersonRemoveRounded,
  EditRounded,
  CloseRounded,
  FavoriteRounded,
} from "@mui/icons-material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  updateDoc,
  onSnapshot,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import Cropper from "react-easy-crop";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomTheme } from "../context/ThemeContext";

const AVATAR_SIZE = 104;
const PALETTE_COLORS = ["#88b7f0", "#8cefcb", "#f5d397", "#ffd6b4", "#c8b6ff"];

const RAW_DOODLE_ICONS = [
  { Icon: TerrainIcon, top: "4%", left: "3%", size: 34, rotate: -10, floatDur: 6.5 },
  { Icon: FlightTakeoffRounded, top: "7%", left: "28%", size: 26, rotate: -18, floatDur: 6 },
  { Icon: TurnRightRounded, top: "12%", left: "46%", size: 28, rotate: 35, floatDur: 7.2 },
  { Icon: LocationOnRounded, top: "8%", right: "8%", size: 30, rotate: -8, floatDur: 7 },
  { Icon: TerrainIcon, top: "26%", left: "2%", size: 36, rotate: 12, floatDur: 8.5 },
  { Icon: SouthEastRounded, top: "34%", left: "22%", size: 26, rotate: -10, floatDur: 6 },
  { Icon: LuggageRounded, top: "52%", left: "4%", size: 30, rotate: 16, floatDur: 9 },
  { Icon: ExploreRounded, top: "32%", right: "4%", size: 32, rotate: -18, floatDur: 6.5 },
  { Icon: CameraAltRounded, top: "68%", left: "5%", size: 24, rotate: -10, floatDur: 8.5 },
  { Icon: WbSunnyRounded, top: "78%", left: "36%", size: 28, rotate: 15, floatDur: 7.5 },
  { Icon: TerrainIcon, top: "84%", right: "8%", size: 38, rotate: -6, floatDur: 8 },
  { Icon: DirectionsCarRounded, top: "88%", left: "14%", size: 28, rotate: -12, floatDur: 8 },
  { Icon: HikingRounded, top: "62%", right: "32%", size: 28, rotate: 8, floatDur: 7 },
  { Icon: MapRounded, top: "72%", right: "4%", size: 26, rotate: 14, floatDur: 8.2 },
];

const BACKGROUND_EMOJIS = [
  { emoji: "✨", top: "18%", left: "10%", size: "1.4rem", opacity: 0.35 },
  { emoji: "🚀", top: "22%", right: "12%", size: "1.6rem", opacity: 0.28 },
  { emoji: "🏕️", bottom: "24%", left: "8%", size: "1.5rem", opacity: 0.32 },
  { emoji: "🏖️", bottom: "16%", right: "16%", size: "1.8rem", opacity: 0.25 },
  { emoji: "🌟", top: "50%", right: "6%", size: "1.3rem", opacity: 0.3 },
  { emoji: "🎒", top: "45%", left: "14%", size: "1.6rem", opacity: 0.25 },
];

const formatTimestamp = (ts) => {
  if (!ts) return "Not updated";
  if (typeof ts === "string") return ts;
  if (typeof ts.toDate === "function") return ts.toDate().toLocaleString();
  if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString();
  return String(ts);
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  return canvas.toDataURL("image/jpeg");
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const { isDark } = useCustomTheme();
  const navigate = useNavigate();

  const [userDoc, setUserDoc] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active section view (null on mobile for menu root)
  const [activeTab, setActiveTab] = useState(isMobile ? null : "overview");

  // Editable toggles for each distinct section
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [isEditingAi, setIsEditingAi] = useState(false);
  const [isEditingNicknames, setIsEditingNicknames] = useState(false);

  // Combined Editable Form State
  const [formValues, setFormValues] = useState({
    name: "",
    username: "",
    bio: "",
    mobile: "",
    photoURL: "",
    groqApiKey: "",
    canBeAddedToGroups: "everyone",
    canBeAddedToTrips: "friends",
    profileVisibility: "private",
    nicknames: {},
  });

  // Detailed Lists
  const [friendsList, setFriendsList] = useState([]);
  const [blockedUsersList, setBlockedUsersList] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  // Image Cropper
  const [imagePreview, setImagePreview] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);
        const unsubUserDoc = onSnapshot(userRef, async (userSnap) => {
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserDoc(data);
            setFormValues({
              name: data.name || authUser.displayName || "",
              username: data.username || "",
              bio: data.bio || "",
              mobile: data.mobile || "",
              photoURL: data.photoURL || authUser.photoURL || "",
              groqApiKey: data.groqApiKey || "",
              canBeAddedToGroups: data.privacy?.canBeAddedToGroups || "everyone",
              canBeAddedToTrips: data.privacy?.canBeAddedToTrips || "friends",
              profileVisibility: data.privacy?.profileVisibility || "private",
              nicknames: data.nicknames || {},
            });

            // Fetch Squad Friends Data
            const friendUids = data.friends || [];
            if (friendUids.length > 0) {
              setLoadingFriends(true);
              try {
                const friendsData = await Promise.all(
                  friendUids.map(async (fUid) => {
                    const fSnap = await getDoc(doc(db, "users", fUid));
                    if (fSnap.exists()) {
                      return { uid: fUid, ...fSnap.data() };
                    }
                    return { uid: fUid, name: "Squad Member", username: "member" };
                  })
                );
                setFriendsList(friendsData);
              } catch (err) {
                console.error("Error fetching squad friends:", err);
              } finally {
                setLoadingFriends(false);
              }
            } else {
              setFriendsList([]);
            }

            // Fetch Blocked Users Data
            const blockedUids = data.blockedUids || [];
            if (blockedUids.length > 0) {
              const blockedData = await Promise.all(
                blockedUids.map(async (bUid) => {
                  const bSnap = await getDoc(doc(db, "users", bUid));
                  if (bSnap.exists()) {
                    return { uid: bUid, ...bSnap.data() };
                  }
                  return { uid: bUid, name: "Blocked User", username: "blocked" };
                })
              );
              setBlockedUsersList(blockedData);
            } else {
              setBlockedUsersList([]);
            }
          }
          setLoading(false);
        });
        return () => unsubUserDoc();
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const assignedDoodles = useMemo(() => {
    return RAW_DOODLE_ICONS.map((doodle, idx) => ({
      ...doodle,
      color: PALETTE_COLORS[idx % PALETTE_COLORS.length],
    }));
  }, []);

  // Save Settings Handlers
  const handleSaveSettings = async () => {
    if (!user) return;
    setSavingSettings(true);
    try {
      const ref = doc(db, "users", user.uid);
      const updatedPayload = {
        name: formValues.name,
        username: formValues.username?.toLowerCase().trim(),
        bio: formValues.bio,
        mobile: formValues.mobile,
        photoURL: formValues.photoURL,
        groqApiKey: formValues.groqApiKey,
        nicknames: formValues.nicknames,
        privacy: {
          canBeAddedToGroups: formValues.canBeAddedToGroups,
          canBeAddedToTrips: formValues.canBeAddedToTrips,
          profileVisibility: formValues.profileVisibility,
        },
      };
      await updateDoc(ref, updatedPayload);
      setSaveSuccess(true);
      setIsEditingOverview(false);
      setIsEditingAi(false);
      setIsEditingNicknames(false);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleRemoveFriend = async (friendUid) => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        friends: arrayRemove(friendUid),
      });
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  const handleUnblockUser = async (blockedUid) => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        blockedUids: arrayRemove(blockedUid),
      });
    } catch (err) {
      console.error("Error unblocking member:", err);
    }
  };

  const handleRemoveLikedTrip = async (tripName) => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        likedTrips: arrayRemove(tripName),
      });
    } catch (err) {
      console.error("Error removing liked trip:", err);
    }
  };

  const handleRemoveSavedTrip = async (tripName) => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        savedTrips: arrayRemove(tripName),
      });
    } catch (err) {
      console.error("Error removing saved trip:", err);
    }
  };

  const handleNicknameChange = (uid, newNick) => {
    setFormValues((prev) => ({
      ...prev,
      nicknames: {
        ...prev.nicknames,
        [uid]: newNick,
      },
    }));
  };

  const navMenuItems = [
    { id: "overview", label: "Account & Profile", icon: PersonRounded },
    { id: "friends", label: `Squad Friends (${(userDoc.friends || []).length})`, icon: GroupsRounded },
    { id: "likedTrips", label: "Liked Trips", icon: FavoriteRounded },
    { id: "savedTrips", label: "Saved Trips", icon: BookmarkRounded },
    { id: "ai", label: "AI & Groq API", icon: SmartToyRounded },
    { id: "nicknames", label: "Squad Nicknames", icon: BadgeRounded },
  ];

  const fieldStyleProps = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      color: isDark ? "#ffffff" : "#09090b",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow: isDark
        ? "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)"
        : "inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 2px 6px rgba(0, 0, 0, 0.03)",
      pl: 1.5,
      pr: 1.5,
      py: 0.2,
      "& fieldset": { border: "none" },
      "&:hover": {
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.07)" : "#ffffff",
      },
      "&.Mui-focused": {
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#ffffff",
        boxShadow: isDark
          ? "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 0 0 2px rgba(140, 239, 203, 0.25)"
          : "inset 0 1px 1px rgba(255, 255, 255, 1), 0 0 0 2px rgba(0, 109, 55, 0.18)",
      },
      "& input, & textarea": {
        px: 1.2,
        py: 1.4,
        fontSize: "0.92rem",
        fontWeight: 600,
      },
    },
  };

  const iconSx = {
    color: isDark ? "#a1a1aa" : "#64748b",
    fontSize: 20,
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "#000" : "#f1f3f5" }}>
        <CircularProgress sx={{ color: "#8cefcb" }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "#000" : "#f1f3f5", p: 3 }}>
        <Typography variant="h5" fontWeight={850} color={isDark ? "#fff" : "#09090b"} mb={2}>
          Please sign in to view your profile
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            borderRadius: "14px",
            backgroundColor: "#8cefcb",
            color: "#00381e",
            fontWeight: 800,
            px: 3.5,
            py: 1.2,
            "&:hover": { backgroundColor: "#aff6dc" },
          }}
        >
          Sign In to BunkMates
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 0, sm: 2.5, md: 3 },
        backgroundColor: isDark ? "#000000" : "#f1f3f5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          minHeight: { xs: "100vh", sm: "calc(100vh - 48px)" },
          borderRadius: { xs: 0, sm: "32px", md: 3 },
          backgroundColor: isDark ? "#0c0c0c" : "#ffffff",
          boxShadow: {
            xs: "none",
            sm: "inset 0 1px 1px rgba(255, 255, 255, 0.11), inset 0 -1px 1px rgba(255, 255, 255, 0.07), 0 1px 0px rgba(0,0,0,0.1)",
          },
          display: "flex",
          flexDirection: "column",
          px: { xs: 2, sm: 3.5, md: 5 },
          py: { xs: 2.5, sm: 4, md: 5 },
          color: isDark ? "#ffffff" : "#09090b",
        }}
      >
        {/* Floating Background Doodles */}
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
          {BACKGROUND_EMOJIS.map((item, idx) => (
            <Typography
              key={idx}
              sx={{
                position: "absolute",
                top: item.top,
                bottom: item.bottom,
                left: item.left,
                right: item.right,
                fontSize: item.size,
                opacity: item.opacity,
                userSelect: "none",
              }}
            >
              {item.emoji}
            </Typography>
          ))}

          {assignedDoodles.map((doodle, i) => {
            const DoodleIconComponent = doodle.Icon;
            return (
              <motion.div
                key={i}
                animate={{
                  y: [0, -12, 0],
                  rotate: [doodle.rotate, doodle.rotate + 6, doodle.rotate],
                }}
                transition={{
                  duration: doodle.floatDur,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: doodle.top,
                  left: doodle.left,
                  right: doodle.right,
                }}
              >
                <DoodleIconComponent
                  sx={{
                    fontSize: { xs: doodle.size * 0.75, md: doodle.size },
                    color: doodle.color,
                    opacity: isDark ? 0.22 : 0.28,
                  }}
                />
              </motion.div>
            );
          })}
        </Box>

        {/* Grid Texture */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: isDark
              ? `linear-gradient(to right, #1f1f1f4e 1px, transparent 1px), linear-gradient(to bottom, #1f1f1f4d 1px, transparent 1px)`
              : `linear-gradient(to right, #edf0f2 1px, transparent 1px), linear-gradient(to bottom, #edf0f2 1px, transparent 1px)`,
            backgroundSize: "55px 55px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Top Header Navigation Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            position: "relative",
            zIndex: 3,
            mb: { xs: 2.5, md: 3.5 },
          }}
        >
          <Button
            startIcon={<ArrowBackRounded sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/")}
            sx={{
              color: isDark ? "#ffffff" : "#09090b",
              backgroundColor: isDark ? "#ffffff10" : "#f1f4f8",
              boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)",
              px: 2.2,
              py: 0.7,
              borderRadius: "12px",
              fontWeight: 750,
              fontSize: "0.82rem",
              textTransform: "none",
              backdropFilter: "blur(10px)",
              "&:hover": {
                backgroundColor: isDark ? "#ffffff20" : "#e2e8f0",
                transform: "translateX(-2px)",
              },
            }}
          >
            Landing Page
          </Button>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              icon={<VerifiedUserRounded sx={{ fontSize: 16, color: "#8cefcb !important" }} />}
              label={userDoc.type || "Dev Beta"}
              sx={{
                height: 32,
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "0.78rem",
                backgroundColor: isDark ? "rgba(140, 239, 203, 0.14)" : "#e6f9f0",
                color: isDark ? "#8cefcb" : "#006D37",
                border: "1px solid rgba(140, 239, 203, 0.3)",
              }}
            />
            {userDoc.isOnline !== undefined && (
              <Chip
                label={userDoc.isOnline ? "Online" : "Offline"}
                sx={{
                  height: 32,
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  backgroundColor: isDark ? "#ffffff10" : "#f1f4f8",
                  color: isDark ? "#ffffff" : "#09090b",
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Responsive Workspace Layout */}
        <Box
          sx={{
            width: "100%",
            position: "relative",
            zIndex: 2,
            flex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            justifyContent: "space-between",
            gap: { xs: 2.5, md: 4 },
          }}
        >
          {/* Left Navigation Sidebar (Hidden on mobile if a tab is currently active) */}
          <Box
            sx={{
              display: { xs: activeTab !== null ? "none" : "flex", md: "flex" },
              flex: { xs: "1 1 100%", md: "0 0 310px", lg: "0 0 340px" },
              p: { xs: 2.5, sm: 3 },
              borderRadius: "28px",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.025)" : "#f8fafc",
              backdropFilter: "blur(20px)",
              boxShadow: isDark
                ? "inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 10px 30px rgba(0,0,0,0.5)"
                : "inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 4px 20px rgba(0,0,0,0.04)",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* User Identity Head */}
            <Box textAlign="center" mb={2}>
              <Box sx={{ position: "relative", display: "inline-block", mb: 1.8 }}>
                <Avatar
                  src={formValues.photoURL || userDoc.photoURL || user.photoURL}
                  sx={{
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    border: "3px solid #8cefcb",
                    boxShadow: "0 0 25px rgba(140, 239, 203, 0.35)",
                  }}
                />
                <IconButton
                  component="label"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#8cefcb",
                    color: "#00381e",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    "&:hover": { backgroundColor: "#aff6dc" },
                  }}
                >
                  <UploadRounded sx={{ fontSize: 16 }} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setImagePreview(reader.result);
                          setCropDialogOpen(true);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </IconButton>
              </Box>

              <Typography variant="h5" fontWeight={850} sx={{ color: isDark ? "#fff" : "#09090b", fontSize: "1.25rem" }}>
                {formValues.name || userDoc.name || user.displayName || "Traveler"}
              </Typography>

              <Typography sx={{ color: "#8cefcb", fontWeight: 750, fontSize: "0.85rem", mt: 0.2 }}>
                @{formValues.username || userDoc.username || "traveler_01"}
              </Typography>

              <Typography
                sx={{
                  color: isDark ? "#a1a1aa" : "#64748b",
                  fontSize: "0.82rem",
                  lineHeight: 1.5,
                  mt: 1.2,
                  px: 1,
                }}
              >
                "{formValues.bio || userDoc.bio || "Designing the future, one interface at a time. Powered by caffeine & creativity."}"
              </Typography>
            </Box>

            <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", my: 1.5 }} />

            {/* Menu List */}
            <Stack spacing={1}>
              {navMenuItems.map((item) => {
                const isSelected = activeTab === item.id;
                const IconComp = item.icon;

                return (
                  <Button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    fullWidth
                    startIcon={<IconComp sx={{ fontSize: 19, color: isSelected ? "#00381e" : iconSx.color }} />}
                    sx={{
                      justifyContent: "flex-start",
                      py: 1.2,
                      px: 2,
                      borderRadius: "14px",
                      fontWeight: 800,
                      fontSize: "0.86rem",
                      textTransform: "none",
                      backgroundColor: isSelected
                        ? "#8cefcb"
                        : isDark
                        ? "rgba(255, 255, 255, 0.02)"
                        : "transparent",
                      color: isSelected ? "#00381e" : isDark ? "#d4d4d8" : "#3f3f46",
                      boxShadow: isSelected ? "0 4px 14px rgba(140, 239, 203, 0.25)" : "none",
                      "&:hover": {
                        backgroundColor: isSelected ? "#8cefcb" : isDark ? "rgba(255, 255, 255, 0.06)" : "#f1f5f9",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
          </Box>

          {/* Right Content Area (Rendered as full page on mobile when tab is selected) */}
          <Box
            sx={{
              display: { xs: activeTab === null ? "none" : "flex", md: "flex" },
              flex: 1,
              p: { xs: 2.5, sm: 4 },
              borderRadius: { xs: "20px", sm: "28px" },
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.025)" : "#f8fafc",
              backdropFilter: "blur(20px)",
              boxShadow: isDark
                ? "inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 10px 30px rgba(0,0,0,0.5)"
                : "inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 4px 20px rgba(0,0,0,0.04)",
              minHeight: "560px",
              flexDirection: "column",
            }}
          >
            {/* Mobile Back Button to Menu List */}
            {isMobile && activeTab !== null && (
              <Box mb={2}>
                <Button
                  startIcon={<ArrowBackRounded sx={{ fontSize: 16 }} />}
                  onClick={() => setActiveTab(null)}
                  sx={{
                    color: isDark ? "#8cefcb" : "#006D37",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    p: 0,
                  }}
                >
                  Back to Profile Menu
                </Button>
              </Box>
            )}

            <AnimatePresence mode="wait">
              {/* SECTION 1: ACCOUNT & PROFILE (EDITABLE ON TOGGLE) */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
                    <Box>
                      <Typography variant="h5" fontWeight={850} sx={{ color: isDark ? "#fff" : "#09090b", fontSize: "1.35rem" }}>
                        Account, Profile & Privacy
                      </Typography>
                      <Typography sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontSize: "0.84rem", mt: 0.3 }}>
                        {isEditingOverview ? "Modify your profile and permissions below, then save." : "View your squad profile details and security permissions."}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.2}>
                      {!isEditingOverview ? (
                        <Button
                          variant="outlined"
                          startIcon={<EditRounded />}
                          onClick={() => setIsEditingOverview(true)}
                          sx={{
                            borderRadius: "14px",
                            borderColor: "#8cefcb",
                            color: isDark ? "#8cefcb" : "#006D37",
                            fontWeight: 800,
                            px: 2.5,
                            py: 0.8,
                            textTransform: "none",
                            "&:hover": { backgroundColor: "rgba(140, 239, 203, 0.12)" },
                          }}
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="text"
                            startIcon={<CloseRounded />}
                            onClick={() => setIsEditingOverview(false)}
                            sx={{
                              color: isDark ? "#a1a1aa" : "#64748b",
                              fontWeight: 750,
                              textTransform: "none",
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            disabled={savingSettings}
                            startIcon={<SaveRounded />}
                            onClick={handleSaveSettings}
                            sx={{
                              borderRadius: "14px",
                              backgroundColor: "#8cefcb",
                              color: "#00381e",
                              fontWeight: 800,
                              px: 3,
                              py: 0.8,
                              textTransform: "none",
                              "&:hover": { backgroundColor: "#aff6dc" },
                            }}
                          >
                            {savingSettings ? <CircularProgress size={18} color="inherit" /> : "Save Changes"}
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Box>

                  {saveSuccess && (
                    <Alert severity="success" sx={{ mb: 2.5, borderRadius: "14px", fontWeight: 700 }}>
                      Profile and preferences updated successfully!
                    </Alert>
                  )}

                  {!isEditingOverview ? (
                    <Stack spacing={2.5}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {[
                          { label: "Display Name", val: formValues.name || userDoc.name || user.displayName, icon: PersonRounded },
                          { label: "Username ID", val: `@${formValues.username || userDoc.username || "not_set"}`, icon: BadgeRounded },
                          { label: "Account Email", val: userDoc.email || user.email, icon: EmailRounded },
                          { label: "Registered Mobile", val: formValues.mobile || userDoc.mobile || "Not linked", icon: PhoneIphoneRounded },
                          { label: "Account Tier", val: userDoc.type || "Dev Beta", icon: VerifiedUserRounded },
                          { label: "Squad Friends", val: `${(userDoc.friends || []).length} Connected Members`, icon: GroupsRounded },
                          { label: "Group Additions", val: formValues.canBeAddedToGroups.toUpperCase(), icon: GroupsRounded },
                          { label: "Trip Invites", val: formValues.canBeAddedToTrips.toUpperCase(), icon: ExploreRounded },
                          { label: "Profile Visibility", val: formValues.profileVisibility.toUpperCase(), icon: LockOutlined },
                          {
                            label: "Last Profile Update",
                            val: formatTimestamp(userDoc.updatedAt),
                            icon: CheckCircleRounded,
                          },
                        ].map((item, idx) => {
                          const ItemIcon = item.icon;
                          return (
                            <Box
                              key={idx}
                              sx={{
                                flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" },
                                p: 2.2,
                                borderRadius: "18px",
                                backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
                                boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.08)",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1.5,
                              }}
                            >
                              <ItemIcon sx={iconSx} />
                              <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography sx={{ fontSize: "0.74rem", fontWeight: 750, color: isDark ? "#a1a1aa" : "#64748b" }}>
                                  {item.label}
                                </Typography>
                                <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: isDark ? "#ffffff" : "#09090b", mt: 0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {String(item.val || "")}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    </Stack>
                  ) : (
                    <Stack spacing={2.2}>
                      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 750, color: isDark ? "#d4d4d8" : "#3f3f46", mb: 0.6, ml: 0.5 }}>
                            Full Name
                          </Typography>
                          <TextField
                            fullWidth
                            value={formValues.name}
                            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                            sx={fieldStyleProps}
                          />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 750, color: isDark ? "#d4d4d8" : "#3f3f46", mb: 0.6, ml: 0.5 }}>
                            Username
                          </Typography>
                          <TextField
                            fullWidth
                            value={formValues.username}
                            onChange={(e) => setFormValues({ ...formValues, username: e.target.value })}
                            sx={fieldStyleProps}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 750, color: isDark ? "#d4d4d8" : "#3f3f46", mb: 0.6, ml: 0.5 }}>
                            Mobile Number
                          </Typography>
                          <TextField
                            fullWidth
                            value={formValues.mobile}
                            onChange={(e) => setFormValues({ ...formValues, mobile: e.target.value })}
                            sx={fieldStyleProps}
                          />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 750, color: isDark ? "#d4d4d8" : "#3f3f46", mb: 0.6, ml: 0.5 }}>
                            Email Address (Read-only)
                          </Typography>
                          <TextField
                            fullWidth
                            disabled
                            value={userDoc.email || user.email || ""}
                            sx={fieldStyleProps}
                          />
                        </Box>
                      </Box>

                      <Box>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 750, color: isDark ? "#d4d4d8" : "#3f3f46", mb: 0.6, ml: 0.5 }}>
                          Bio
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={formValues.bio}
                          onChange={(e) => setFormValues({ ...formValues, bio: e.target.value })}
                          sx={fieldStyleProps}
                        />
                      </Box>

                      <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", my: 1 }} />

                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 850, color: isDark ? "#fff" : "#09090b" }}>
                        Privacy & Squad Permissions
                      </Typography>

                      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 750, color: isDark ? "#d4d4d8" : "#3f3f46", mb: 0.6, ml: 0.5 }}>
                            Group Additions Permission
                          </Typography>
                          <FormControl fullWidth sx={fieldStyleProps}>
                            <Select
                              value={formValues.canBeAddedToGroups}
                              onChange={(e) => setFormValues({ ...formValues, canBeAddedToGroups: e.target.value })}
                            >
                              <MenuItem value="everyone">Everyone</MenuItem>
                              <MenuItem value="friends">Friends Only</MenuItem>
                              <MenuItem value="nobody">Nobody</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 750, color: isDark ? "#d4d4d8" : "#3f3f46", mb: 0.6, ml: 0.5 }}>
                            Trip Invitations Acceptance
                          </Typography>
                          <FormControl fullWidth sx={fieldStyleProps}>
                            <Select
                              value={formValues.canBeAddedToTrips}
                              onChange={(e) => setFormValues({ ...formValues, canBeAddedToTrips: e.target.value })}
                            >
                              <MenuItem value="friends">Friends Only</MenuItem>
                              <MenuItem value="everyone">Everyone</MenuItem>
                              <MenuItem value="nobody">Nobody</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 750, color: isDark ? "#d4d4d8" : "#3f3f46", mb: 0.6, ml: 0.5 }}>
                            Profile Visibility Setting
                          </Typography>
                          <FormControl fullWidth sx={fieldStyleProps}>
                            <Select
                              value={formValues.profileVisibility}
                              onChange={(e) => setFormValues({ ...formValues, profileVisibility: e.target.value })}
                            >
                              <MenuItem value="public">Public</MenuItem>
                              <MenuItem value="private">Private</MenuItem>
                              <MenuItem value="friends">Friends Only</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    </Stack>
                  )}

                  {/* Blocked Users Section */}
                  <Box
                    sx={{
                      mt: 3,
                      p: 2.2,
                      borderRadius: "18px",
                      backgroundColor: isDark ? "rgba(239, 68, 68, 0.06)" : "#fef2f2",
                      border: "1px solid rgba(239, 68, 68, 0.15)",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                      <SecurityRounded sx={{ color: isDark ? "#fca5a5" : "#991b1b", fontSize: 20 }} />
                      <Typography sx={{ fontSize: "0.88rem", fontWeight: 800, color: isDark ? "#fca5a5" : "#991b1b" }}>
                        Blocked Members Registry ({blockedUsersList.length})
                      </Typography>
                    </Stack>

                    {blockedUsersList.length === 0 ? (
                      <Typography sx={{ fontSize: "0.8rem", color: isDark ? "#a1a1aa" : "#64748b" }}>
                        No blocked members in your account.
                      </Typography>
                    ) : (
                      <Stack spacing={1}>
                        {blockedUsersList.map((bUser, bIdx) => (
                          <Box
                            key={bIdx}
                            sx={{
                              p: 1.4,
                              borderRadius: "12px",
                              backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box>
                              <Typography sx={{ fontSize: "0.86rem", fontWeight: 800, color: isDark ? "#fff" : "#09090b" }}>
                                {bUser.name || "Blocked Traveler"}
                              </Typography>
                              <Typography sx={{ fontSize: "0.75rem", color: isDark ? "#a1a1aa" : "#64748b" }}>
                                UID: {bUser.uid}
                              </Typography>
                            </Box>
                            <Button
                              size="small"
                              onClick={() => handleUnblockUser(bUser.uid)}
                              sx={{
                                color: "#ef4444",
                                textTransform: "none",
                                fontWeight: 800,
                                fontSize: "0.75rem",
                              }}
                            >
                              Unblock
                            </Button>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </motion.div>
              )}

              {/* SECTION 2: SQUAD FRIENDS LIST (FULL HEIGHT SCROLLABLE CONTAINER) */}
              {activeTab === "friends" && (
                <motion.div
                  key="friends"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}
                >
                  <Box mb={2}>
                    <Typography variant="h5" fontWeight={850} sx={{ color: isDark ? "#fff" : "#09090b", fontSize: "1.35rem" }}>
                      Squad Friends List ({friendsList.length})
                    </Typography>
                    <Typography sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontSize: "0.84rem", mt: 0.3 }}>
                      Scroll through your connected friends or remove members directly.
                    </Typography>
                  </Box>

                  {loadingFriends ? (
                    <Box display="flex" justifyContent="center" py={6}>
                      <CircularProgress sx={{ color: "#8cefcb" }} />
                    </Box>
                  ) : friendsList.length === 0 ? (
                    <Box textAlign="center" py={6}>
                      <Typography sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontSize: "0.95rem" }}>
                        No connected squad members yet. Share your invite QR to connect.
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        flex: 1,
                        height: "100%",
                        maxHeight: "640px",
                        overflowY: "auto",
                        pr: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        "&::-webkit-scrollbar": { width: "6px" },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)",
                          borderRadius: "4px",
                        },
                      }}
                    >
                      {friendsList.map((friend, fIdx) => (
                        <Box
                          key={fIdx}
                          sx={{
                            p: 2,
                            borderRadius: "18px",
                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
                            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar
                              src={friend.photoURL}
                              sx={{ width: 46, height: 46, border: "2px solid #8cefcb" }}
                            />
                            <Box>
                              <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: isDark ? "#fff" : "#09090b" }}>
                                {friend.name || "Squad Explorer"}
                              </Typography>
                              <Typography sx={{ fontSize: "0.78rem", color: "#8cefcb", fontWeight: 700 }}>
                                @{friend.username || friend.uid?.slice(0, 8)}
                              </Typography>
                              {friend.email && (
                                <Typography sx={{ fontSize: "0.74rem", color: isDark ? "#a1a1aa" : "#64748b" }}>
                                  {friend.email}
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          {/* Icon Only Action Button */}
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFriend(friend.uid)}
                            sx={{
                              color: "#ef4444",
                              backgroundColor: isDark ? "rgba(239, 68, 68, 0.1)" : "#fee2e2",
                              p: 1,
                              borderRadius: "10px",
                              "&:hover": { backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : "#fecaca" },
                            }}
                          >
                            <PersonRemoveRounded sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </motion.div>
              )}

              {/* SECTION 3: LIKED TRIPS SEPARATE SECTION */}
              {activeTab === "likedTrips" && (
                <motion.div
                  key="likedTrips"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box mb={2.5}>
                    <Typography variant="h5" fontWeight={850} sx={{ color: isDark ? "#fff" : "#09090b", fontSize: "1.35rem" }}>
                      Liked Trips Catalog
                    </Typography>
                    <Typography sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontSize: "0.84rem", mt: 0.3 }}>
                      Destinations and itineraries marked with your endorsement.
                    </Typography>
                  </Box>

                  <Stack spacing={1.5}>
                    {(userDoc.likedTrips || ["Lalbagh_Botanical_Garden_BLR", "Jaipur_Heritage_Expedition", "Goa_Coastal_Sprint"]).map((t, i) => {
                      const tripName = typeof t === "string" ? t : JSON.stringify(t);
                      return (
                        <Box
                          key={i}
                          sx={{
                            p: 2,
                            borderRadius: "16px",
                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1.2}>
                            <FavoriteRounded sx={{ color: "#ef4444", fontSize: 18 }} />
                            <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: isDark ? "#fff" : "#09090b" }}>
                              {tripName.replace(/_/g, " ")}
                            </Typography>
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() => handleRemoveLikedTrip(t)}
                            sx={{ color: isDark ? "#a1a1aa" : "#64748b", "&:hover": { color: "#ef4444" } }}
                          >
                            <DeleteOutlineRounded sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      );
                    })}
                  </Stack>
                </motion.div>
              )}

              {/* SECTION 4: SAVED TRIPS SEPARATE SECTION */}
              {activeTab === "savedTrips" && (
                <motion.div
                  key="savedTrips"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box mb={2.5}>
                    <Typography variant="h5" fontWeight={850} sx={{ color: isDark ? "#fff" : "#09090b", fontSize: "1.35rem" }}>
                      Saved Trips Registry
                    </Typography>
                    <Typography sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontSize: "0.84rem", mt: 0.3 }}>
                      Bookmarked routes and schedules saved for upcoming travels.
                    </Typography>
                  </Box>

                  <Stack spacing={1.5}>
                    {(userDoc.savedTrips || ["Sinhagad_Fort_MH_Pune", "Manali_Snow_Pass", "Udaipur_Lakes_Tour"]).map((t, i) => {
                      const tripName = typeof t === "string" ? t : JSON.stringify(t);
                      return (
                        <Box
                          key={i}
                          sx={{
                            p: 2,
                            borderRadius: "16px",
                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1.2}>
                            <BookmarkRounded sx={{ color: "#ffd6b4", fontSize: 20 }} />
                            <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: isDark ? "#fff" : "#09090b" }}>
                              {tripName.replace(/_/g, " ")}
                            </Typography>
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() => handleRemoveSavedTrip(t)}
                            sx={{ color: isDark ? "#a1a1aa" : "#64748b", "&:hover": { color: "#ef4444" } }}
                          >
                            <DeleteOutlineRounded sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      );
                    })}
                  </Stack>
                </motion.div>
              )}

              {/* SECTION 5: AI & GROQ API (EDITABLE ON TOGGLE) */}
              {activeTab === "ai" && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
                    <Box>
                      <Typography variant="h5" fontWeight={850} sx={{ color: isDark ? "#fff" : "#09090b", fontSize: "1.35rem" }}>
                        AI & Groq Engine Configuration
                      </Typography>
                      <Typography sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontSize: "0.84rem", mt: 0.3 }}>
                        Add, view or update your Groq API Key used for AI route estimation and squad splits.
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.2}>
                      {!isEditingAi ? (
                        <Button
                          variant="outlined"
                          startIcon={<EditRounded />}
                          onClick={() => setIsEditingAi(true)}
                          sx={{
                            borderRadius: "14px",
                            borderColor: "#8cefcb",
                            color: isDark ? "#8cefcb" : "#006D37",
                            fontWeight: 800,
                            px: 2.5,
                            py: 0.8,
                            textTransform: "none",
                            "&:hover": { backgroundColor: "rgba(140, 239, 203, 0.12)" },
                          }}
                        >
                          Edit API Key
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="text"
                            startIcon={<CloseRounded />}
                            onClick={() => setIsEditingAi(false)}
                            sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontWeight: 750, textTransform: "none" }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            disabled={savingSettings}
                            startIcon={<SaveRounded />}
                            onClick={handleSaveSettings}
                            sx={{
                              borderRadius: "14px",
                              backgroundColor: "#8cefcb",
                              color: "#00381e",
                              fontWeight: 800,
                              px: 3,
                              py: 0.8,
                              textTransform: "none",
                              "&:hover": { backgroundColor: "#aff6dc" },
                            }}
                          >
                            {savingSettings ? <CircularProgress size={18} color="inherit" /> : "Save API Key"}
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Box>

                  {saveSuccess && (
                    <Alert severity="success" sx={{ mb: 2.5, borderRadius: "14px", fontWeight: 700 }}>
                      Groq API settings updated successfully!
                    </Alert>
                  )}

                  <Stack spacing={2.5}>
                    <Box>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 750, color: isDark ? "#d4d4d8" : "#3f3f46", mb: 0.6, ml: 0.5 }}>
                        Groq API Token Key
                      </Typography>
                      <TextField
                        fullWidth
                        disabled={!isEditingAi}
                        placeholder="gsk_..."
                        value={formValues.groqApiKey}
                        onChange={(e) => setFormValues({ ...formValues, groqApiKey: e.target.value })}
                        sx={fieldStyleProps}
                      />
                    </Box>

                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: "20px",
                        backgroundColor: isDark ? "rgba(200, 182, 255, 0.06)" : "#f5f0ff",
                        border: "1px solid rgba(200, 182, 255, 0.2)",
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <KeyRounded sx={{ color: "#c8b6ff", fontSize: 18 }} />
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, color: "#c8b6ff" }}>
                          TOKEN STATUS
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                        <Chip label={`Status: ${userDoc.groqApiKeyStatus || "valid"}`} size="small" sx={{ backgroundColor: "#8cefcb", color: "#00381e", fontWeight: 850 }} />
                        <Chip label={`Validated: ${formatTimestamp(userDoc.groqApiKeyValidatedAt)}`} size="small" sx={{ backgroundColor: isDark ? "#ffffff15" : "#ffffff", color: isDark ? "#fff" : "#09090b", fontWeight: 700 }} />
                      </Stack>
                    </Box>

                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: "20px",
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 850, color: isDark ? "#fff" : "#09090b", mb: 1.5 }}>
                        Connected Inference Models
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {(userDoc.groqModels || ["qwen/qwen3.6-27b", "openai/gpt-oss", "meta-llama/llama-3.3-70b-versatile"]).map((m, i) => (
                          <Chip key={i} label={m} sx={{ borderRadius: "10px", fontWeight: 750, backgroundColor: isDark ? "#ffffff12" : "#f1f4f8", color: isDark ? "#fff" : "#09090b" }} />
                        ))}
                      </Box>
                    </Box>
                  </Stack>
                </motion.div>
              )}

              {/* SECTION 6: SQUAD NICKNAMES WITH AVATAR & FULL DETAILS */}
              {activeTab === "nicknames" && (
                <motion.div
                  key="nicknames"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
                    <Box>
                      <Typography variant="h5" fontWeight={850} sx={{ color: isDark ? "#fff" : "#09090b", fontSize: "1.35rem" }}>
                        Custom Squad Nicknames
                      </Typography>
                      <Typography sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontSize: "0.84rem", mt: 0.3 }}>
                        Edit assigned aliases for friends in your travel network.
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.2}>
                      {!isEditingNicknames ? (
                        <Button
                          variant="outlined"
                          startIcon={<EditRounded />}
                          onClick={() => setIsEditingNicknames(true)}
                          sx={{
                            borderRadius: "14px",
                            borderColor: "#8cefcb",
                            color: isDark ? "#8cefcb" : "#006D37",
                            fontWeight: 800,
                            px: 2.5,
                            py: 0.8,
                            textTransform: "none",
                            "&:hover": { backgroundColor: "rgba(140, 239, 203, 0.12)" },
                          }}
                        >
                          Edit Nicknames
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="text"
                            startIcon={<CloseRounded />}
                            onClick={() => setIsEditingNicknames(false)}
                            sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontWeight: 750, textTransform: "none" }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            disabled={savingSettings}
                            startIcon={<SaveRounded />}
                            onClick={handleSaveSettings}
                            sx={{
                              borderRadius: "14px",
                              backgroundColor: "#8cefcb",
                              color: "#00381e",
                              fontWeight: 800,
                              px: 3,
                              py: 0.8,
                              textTransform: "none",
                              "&:hover": { backgroundColor: "#aff6dc" },
                            }}
                          >
                            {savingSettings ? <CircularProgress size={18} color="inherit" /> : "Save Nicknames"}
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Box>

                  {saveSuccess && (
                    <Alert severity="success" sx={{ mb: 2.5, borderRadius: "14px", fontWeight: 700 }}>
                      Squad nicknames updated successfully!
                    </Alert>
                  )}

                  <Stack spacing={2}>
                    {Object.entries(formValues.nicknames || {
                      "AQFqN8xu01ce8upTmGzFxJi04Qr2": "Ankiii",
                      "uBiSPNgHqlVOCQcRuiGTXnOcoTU2": "Chota Chornr",
                    }).map(([uid, nick], idx) => {
                      const matchedFriend = friendsList.find((f) => f.uid === uid);

                      return (
                        <Box
                          key={idx}
                          sx={{
                            p: 2.2,
                            borderRadius: "18px",
                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            gap: 2,
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar
                              src={matchedFriend?.photoURL}
                              sx={{ width: 48, height: 48, border: "2px solid #8cefcb" }}
                            >
                              <PersonRounded />
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: "0.95rem", fontWeight: 850, color: isDark ? "#fff" : "#09090b" }}>
                                {matchedFriend?.name || "Squad Member"}
                              </Typography>
                              <Typography sx={{ fontSize: "0.78rem", color: "#8cefcb", fontWeight: 700 }}>
                                @{matchedFriend?.username || "member"} · UID: {uid.slice(0, 10)}...
                              </Typography>
                              {matchedFriend?.email && (
                                <Typography sx={{ fontSize: "0.74rem", color: isDark ? "#a1a1aa" : "#64748b" }}>
                                  {matchedFriend.email}
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          <Box sx={{ width: { xs: "100%", sm: 220 } }}>
                            <TextField
                              size="small"
                              disabled={!isEditingNicknames}
                              placeholder="Nickname"
                              value={nick}
                              onChange={(e) => handleNicknameChange(uid, e.target.value)}
                              sx={fieldStyleProps}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      {/* Picture Cropper Dialog */}
      <Dialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)}>
        <Box sx={{ p: 3, backgroundColor: isDark ? "#12151d" : "#fff", minWidth: 320 }}>
          <Typography variant="h6" fontWeight={800} mb={2} color={isDark ? "#fff" : "#09090b"}>
            Crop Avatar
          </Typography>
          {imagePreview && (
            <Box sx={{ position: "relative", width: 280, height: 260, mx: "auto", overflow: "hidden", borderRadius: 3 }}>
              <Cropper
                image={imagePreview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
              />
            </Box>
          )}
          <Box mt={3} display="flex" justifyContent="flex-end" gap={1.5}>
            <Button onClick={() => setCropDialogOpen(false)} sx={{ color: isDark ? "#a1a1aa" : "#64748b" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#8cefcb", color: "#00381e", fontWeight: 800 }}
              onClick={async () => {
                const cropped = await getCroppedImg(imagePreview, croppedAreaPixels);
                setFormValues((prev) => ({ ...prev, photoURL: cropped }));
                setCropDialogOpen(false);
              }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}