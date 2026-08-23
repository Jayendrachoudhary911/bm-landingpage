// src/pages/LoginPage.js
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Dialog,
  DialogContent,
  Avatar,
  Alert,
  CircularProgress,
  Stack,
  Grid,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Google,
  ArrowBack,
  LockOutlined,
  BadgeOutlined,
  PhoneIphoneRounded,
  CheckCircleRounded,
  CancelRounded,
  TerrainRounded as TerrainIcon,
} from "@mui/icons-material";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import HikingRoundedIcon from "@mui/icons-material/HikingRounded";
import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";
import SouthEastRoundedIcon from "@mui/icons-material/SouthEastRounded";
import TurnRightRoundedIcon from "@mui/icons-material/TurnRightRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import {
  setDoc,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../context/ThemeContext";

const provider = new GoogleAuthProvider();

const PALETTE_COLORS = ["#88b7f0", "#8cefcb", "#f5d397", "#ffd6b4", "#c8b6ff"];

const RAW_DOODLE_ICONS = [
  { Icon: TerrainIcon, top: "6%", left: "4%", size: 34, rotate: -10, floatDur: 6.5 },
  { Icon: FlightTakeoffRoundedIcon, top: "8%", left: "30%", size: 26, rotate: -18, floatDur: 6 },
  { Icon: TurnRightRoundedIcon, top: "12%", left: "48%", size: 28, rotate: 35, floatDur: 7.2 },
  { Icon: LocationOnRoundedIcon, top: "8%", right: "10%", size: 30, rotate: -8, floatDur: 7 },
  { Icon: LandscapeRoundedIcon, top: "28%", left: "3%", size: 36, rotate: 12, floatDur: 8.5 },
  { Icon: SouthEastRoundedIcon, top: "34%", left: "24%", size: 26, rotate: -10, floatDur: 6 },
  { Icon: LuggageRoundedIcon, top: "50%", left: "5%", size: 30, rotate: 16, floatDur: 9 },
  { Icon: ExploreRoundedIcon, top: "32%", right: "5%", size: 32, rotate: -18, floatDur: 6.5 },
  { Icon: NavigationRoundedIcon, top: "45%", right: "20%", size: 24, rotate: 45, floatDur: 7.5 },
  { Icon: CameraAltRoundedIcon, top: "68%", left: "6%", size: 24, rotate: -10, floatDur: 8.5 },
  { Icon: WbSunnyRoundedIcon, top: "78%", left: "38%", size: 28, rotate: 15, floatDur: 7.5 },
  { Icon: TerrainIcon, top: "82%", right: "10%", size: 38, rotate: -6, floatDur: 8 },
  { Icon: DirectionsCarRoundedIcon, top: "86%", left: "16%", size: 28, rotate: -12, floatDur: 8 },
  { Icon: HikingRoundedIcon, top: "60%", right: "34%", size: 28, rotate: 8, floatDur: 7 },
  { Icon: LocalActivityRoundedIcon, top: "90%", left: "32%", size: 24, rotate: -22, floatDur: 9 },
  { Icon: MapRoundedIcon, top: "70%", right: "5%", size: 26, rotate: 14, floatDur: 8.2 },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);

  // Google Profile Completion States
  const [googleDialogOpen, setGoogleDialogOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [googleUsername, setGoogleUsername] = useState("");
  const [googleMobile, setGoogleMobile] = useState("");
  const [isCheckingGoogleUsername, setIsCheckingGoogleUsername] = useState(false);
  const [googleUsernameStatus, setGoogleUsernameStatus] = useState(null);
  const [googleDialogError, setGoogleDialogError] = useState("");
  const [savingGoogleProfile, setSavingGoogleProfile] = useState(false);

  const { user } = useAuth();
  const { isDark } = useCustomTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !googleDialogOpen) {
      navigate("/", { replace: true });
    }
  }, [user, googleDialogOpen, navigate]);

  const assignedDoodles = useMemo(() => {
    return RAW_DOODLE_ICONS.map((doodle, idx) => ({
      ...doodle,
      color: PALETTE_COLORS[idx % PALETTE_COLORS.length],
    }));
  }, []);

  // Username validation for Google modal
  useEffect(() => {
    const cleanUsername = googleUsername.trim().toLowerCase();

    if (!cleanUsername) {
      setGoogleUsernameStatus(null);
      setIsCheckingGoogleUsername(false);
      return;
    }

    if (cleanUsername.length < 3) {
      setGoogleUsernameStatus("invalid");
      setIsCheckingGoogleUsername(false);
      return;
    }

    setIsCheckingGoogleUsername(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", cleanUsername));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setGoogleUsernameStatus("taken");
        } else {
          setGoogleUsernameStatus("available");
        }
      } catch (err) {
        console.error("Error checking username:", err);
      } finally {
        setIsCheckingGoogleUsername(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [googleUsername]);

  const saveUserToFirestore = async (usr, customUsername, customName, mobileNum = "") => {
    const userRef = doc(db, "users", usr.uid);
    await setDoc(userRef, {
      bio: "",
      email: usr.email,
      friends: [],
      mobile: mobileNum.trim(),
      name: customName || usr.displayName || "",
      nicknames: {},
      photoURL: usr.photoURL || "",
      type: "Regular",
      username: customUsername.toLowerCase().trim(),
    });
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message.replace("Firebase: ", ""));
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const usr = result.user;
      const userDoc = await getDoc(doc(db, "users", usr.uid));

      if (userDoc.exists()) {
        navigate("/");
        return;
      }

      setGoogleUser(usr);
      setGoogleUsername(usr.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, ""));
      setGoogleDialogOpen(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message.replace("Firebase: ", ""));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleDetailsSubmit = async () => {
    setGoogleDialogError("");
    if (!googleUsername.trim()) {
      setGoogleDialogError("Username is required.");
      return;
    }

    if (googleUsername.trim().length < 3) {
      setGoogleDialogError("Username must be at least 3 characters long.");
      return;
    }

    if (googleUsernameStatus === "taken") {
      setGoogleDialogError("This username is already taken. Please choose another one.");
      return;
    }

    setSavingGoogleProfile(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", googleUsername.toLowerCase().trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setGoogleDialogError("This username is already taken. Please enter a different one.");
        setSavingGoogleProfile(false);
        return;
      }

      await updateProfile(googleUser, {
        displayName: googleUser.displayName || googleUsername,
      });
      await saveUserToFirestore(
        googleUser,
        googleUsername,
        googleUser.displayName,
        googleMobile
      );
      setGoogleDialogOpen(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      setGoogleDialogError(err.message);
    } finally {
      setSavingGoogleProfile(false);
    }
  };

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
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      pl: 1.5,
      pr: 1.5,
      py: 0.2,
      "& fieldset": {
        border: "none",
      },
      "&:hover": {
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.07)" : "#ffffff",
        boxShadow: isDark
          ? "inset 0 1px 1px rgba(255, 255, 255, 0.18), 0 4px 14px rgba(0, 0, 0, 0.25)"
          : "inset 0 1px 1px rgba(255, 255, 255, 1), 0 4px 12px rgba(0, 0, 0, 0.06)",
        "& fieldset": {
          border: "none",
        },
      },
      "&.Mui-focused": {
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#ffffff",
        boxShadow: isDark
          ? "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 0 0 2px rgba(136, 183, 240, 0.25)"
          : "inset 0 1px 1px rgba(255, 255, 255, 1), 0 0 0 2px rgba(0, 71, 133, 0.18)",
        "& fieldset": {
          border: "none",
        },
      },
      "& input": {
        px: 1.2,
        py: 1.5,
        fontSize: "0.92rem",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        "&::placeholder": {
          color: isDark ? "rgba(161, 161, 170, 0.5)" : "rgba(100, 116, 139, 0.5)",
          opacity: 1,
        },
      },
    },
  };

  const iconSx = {
    color: isDark ? "#a1a1aa" : "#64748b",
    fontSize: 20,
  };

  return (
    <>
      <Box
        sx={{
          p: { xs: 1.5, sm: 2.5, md: 3 },
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
            minHeight: "calc(100vh - 48px)",
            borderRadius: { xs: "24px", sm: "32px", md: 3 },
            backgroundColor: isDark ? "#0c0c0c" : "#ffffff",
            boxShadow:
              "inset 0 1px 1px rgba(255, 255, 255, 0.11), inset 0 -1px 1px rgba(255, 255, 255, 0.07), 0 1px 0px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2, sm: 4, md: 6 },
            py: { xs: 6, sm: 7, md: 8 },
            color: isDark ? "#ffffff" : "#09090b",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: { xs: 20, md: 28 },
              left: { xs: 20, md: 36 },
              zIndex: 10,
            }}
          >
            <Button
              startIcon={<ArrowBack sx={{ fontSize: 18 }} />}
              onClick={() => navigate("/")}
              sx={{
                color: isDark ? "#ffffff" : "#09090b",
                backgroundColor: isDark ? "#ffffff10" : "#f1f4f8",
                boxShadow:
                  "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)",
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
              Back to Home
            </Button>
          </Box>

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 1,
              overflow: "hidden",
            }}
          >
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

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: isDark
                ? `
                  linear-gradient(to right, #1f1f1f4e 1px, transparent 1px),
                  linear-gradient(to bottom, #1f1f1f4d 1px, transparent 1px)
                `
                : `
                  linear-gradient(to right, #edf0f2 1px, transparent 1px),
                  linear-gradient(to bottom, #edf0f2 1px, transparent 1px)
                `,
              backgroundSize: "55px 55px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <Box
            sx={{
              width: "100%",
              position: "relative",
              zIndex: 2,
              mt: { xs: 5, md: 0 },
            }}
          >
            <Grid
              container
              spacing={{ xs: 4, md: 4 }}
              alignItems="center"
              justifyContent="space-around"
            >
              {/* Left Headline in Two Clean Lines */}
              <Grid
                item
                xs={12}
                md={5.5}
                lg={5}
                sx={{ textAlign: { xs: "center", md: "left" } }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: { xs: 1.6, sm: 2.2 },
                      py: 0.65,
                      borderRadius: "999px",
                      fontSize: { xs: "0.74rem", sm: "0.85rem" },
                      fontWeight: 750,
                      color: isDark ? "#ffffff" : "#09090b",
                      backgroundColor: isDark ? "#171a22" : "#f1f4f7",
                      boxShadow:
                        "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)",
                      mb: { xs: 2, sm: 2.5 },
                    }}
                  >
                    <TerrainIcon sx={{ fontSize: 16, color: "#88b7f0" }} />
                    <span>Authentication Portal</span>
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                >
                  <Typography
                    component="h1"
                    fontWeight={850}
                    sx={{
                      mb: 2.5,
                      color: isDark ? "#ffffff" : "#09090b",
                      letterSpacing: { xs: "-0.04em", sm: "-0.05em" },
                      fontSize: {
                        xs: "2rem",
                        sm: "2.8rem",
                        md: "3.5rem",
                        lg: "4rem",
                      },
                      lineHeight: 1.15,
                    }}
                  >
                    Welcome back to
                    <br />
                    <Box
                      component="span"
                      sx={{
                        color: "#88b7f0",
                        display: "inline-block",
                      }}
                    >
                      BunkMates.
                    </Box>
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                >
                  <Typography
                    sx={{
                      maxWidth: 520,
                      mx: { xs: "auto", md: 0 },
                      color: isDark ? "#a1a1aa" : "#52525b",
                      fontSize: { xs: "0.95rem", sm: "1.1rem" },
                      lineHeight: 1.7,
                    }}
                  >
                    Sign in to access your squad's live itineraries, automated expense
                    splits, shared vaults, and private group conversations.
                  </Typography>
                </motion.div>
              </Grid>

              {/* Right Centered Login Form */}
              <Grid
                item
                xs={12}
                md={6}
                lg={5.5}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    x: shake ? [-8, 8, -8, 8, 0] : 0,
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Box
                    sx={{
                      p: { xs: 1.2, sm: 4.5, md: 5 },
                      borderRadius: "30px",
                      backgroundColor: isDark ? "#00000000" : "#f8fafc",
                      width: { xs: 360, sm: 440, md: 480 },
                    }}
                  >
                    {errorMsg && (
                      <Alert
                        severity="error"
                        sx={{
                          mb: 2.5,
                          borderRadius: "14px",
                          backgroundColor: isDark
                            ? "rgba(239, 68, 68, 0.12)"
                            : "rgba(254, 242, 242, 0.9)",
                          color: isDark ? "#fca5a5" : "#b91c1c",
                          fontSize: "0.82rem",
                        }}
                      >
                        {errorMsg}
                      </Alert>
                    )}

                    <Stack spacing={2.2} component="form" onSubmit={handleLogin}>
                      {/* Email Address */}
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 750,
                            color: isDark ? "#d4d4d8" : "#3f3f46",
                            mb: 0.6,
                            ml: 0.5,
                          }}
                        >
                          Email Address{" "}
                          <Box component="span" sx={{ color: "#ef4444" }}>
                            *
                          </Box>
                        </Typography>
                        <TextField
                          placeholder="e.g. travel@bunkmates.app"
                          fullWidth
                          variant="outlined"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          sx={fieldStyleProps}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={iconSx} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>

                      {/* Password */}
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 750,
                            color: isDark ? "#d4d4d8" : "#3f3f46",
                            mb: 0.6,
                            ml: 0.5,
                          }}
                        >
                          Password{" "}
                          <Box component="span" sx={{ color: "#ef4444" }}>
                            *
                          </Box>
                        </Typography>
                        <TextField
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          fullWidth
                          variant="outlined"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          sx={fieldStyleProps}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockOutlined sx={iconSx} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end" sx={{ mr: 0.5 }}>
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  sx={{
                                    color: isDark ? "#a1a1aa" : "#64748b",
                                    p: 0.8,
                                    "&:hover": { color: isDark ? "#ffffff" : "#09090b" },
                                  }}
                                >
                                  {showPassword ? (
                                    <VisibilityOff sx={{ fontSize: 18 }} />
                                  ) : (
                                    <Visibility sx={{ fontSize: 18 }} />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>

                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{
                          mt: 1,
                          borderRadius: "14px",
                          py: 1.4,
                          fontWeight: 800,
                          fontSize: "0.95rem",
                          textTransform: "none",
                          backgroundColor: "#88b7f0",
                          color: "#002047",
                          boxShadow:
                            "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 4px 14px rgba(136, 183, 240, 0.3)",
                          "&:hover": {
                            backgroundColor: "#a9cbfa",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "Log In"
                        )}
                      </Button>
                    </Stack>

                    <Divider
                      sx={{
                        my: 3,
                        borderColor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.08)",
                        color: isDark ? "#71717a" : "#94a3b8",
                        fontSize: "0.76rem",
                        fontWeight: 800,
                      }}
                    >
                      OR
                    </Divider>

                    <Button
                      variant="outlined"
                      fullWidth
                      disabled={googleLoading}
                      startIcon={
                        googleLoading ? (
                          <CircularProgress size={16} />
                        ) : (
                          <Google sx={{ fontSize: 18 }} />
                        )
                      }
                      sx={{
                        borderRadius: "14px",
                        py: 1.25,
                        textTransform: "none",
                        fontWeight: 750,
                        fontSize: "0.88rem",
                        color: isDark ? "#ffffff" : "#09090b",
                        backgroundColor: isDark
                          ? "rgba(255, 255, 255, 0.04)"
                          : "#ffffff",
                        backdropFilter: "blur(20px)",
                        boxShadow:
                          "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)",
                        border: "none",
                        "&:hover": {
                          backgroundColor: isDark
                            ? "rgba(255, 255, 255, 0.08)"
                            : "#f8fafc",
                        },
                      }}
                      onClick={handleGoogleLogin}
                    >
                      {googleLoading ? "Connecting..." : "Continue with Google"}
                    </Button>

                    <Typography
                      sx={{
                        mt: 3,
                        textAlign: "center",
                        color: isDark ? "#a1a1aa" : "#64748b",
                        fontSize: "0.84rem",
                      }}
                    >
                      Don’t have an account?{" "}
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: "#88b7f0",
                          fontWeight: 850,
                          textTransform: "none",
                          p: 0,
                          minWidth: "auto",
                          fontSize: "0.84rem",
                          textDecoration: "underline",
                          "&:hover": {
                            textDecoration: "underline",
                            backgroundColor: "transparent",
                          },
                        }}
                        onClick={() => navigate("/signup")}
                      >
                        Sign Up
                      </Button>
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* Mandatory Google Details Dialog (Cannot close until submitted) */}
      <Dialog
        open={googleDialogOpen}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            backgroundColor: isDark ? "#12151d" : "#ffffff",
            border: `1.5px solid ${
              isDark ? "rgba(136, 183, 240, 0.3)" : "rgba(0,0,0,0.1)"
            }`,
            color: isDark ? "#ffffff" : "#09090b",
            borderRadius: "28px",
            p: 2,
            minWidth: { xs: 320, sm: 400 },
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {googleUser && (
            <Box textAlign="center" mb={3}>
              <Avatar
                src={googleUser.photoURL}
                sx={{
                  width: 72,
                  height: 72,
                  mx: "auto",
                  mb: 1.5,
                  border: "2.5px solid #88b7f0",
                  boxShadow: "0 0 20px rgba(136, 183, 240, 0.35)",
                }}
              />
              <Typography
                sx={{
                  fontWeight: 850,
                  color: isDark ? "#ffffff" : "#09090b",
                  fontSize: "1.15rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Complete Your Squad Profile
              </Typography>
              <Typography
                sx={{
                  color: isDark ? "#a1a1aa" : "#64748b",
                  fontSize: "0.82rem",
                  mt: 0.4,
                }}
              >
                Set up your traveler username to finish signing in.
              </Typography>
            </Box>
          )}

          {googleDialogError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: "12px",
                backgroundColor: isDark
                  ? "rgba(239, 68, 68, 0.12)"
                  : "rgba(254, 242, 242, 0.9)",
                color: isDark ? "#fca5a5" : "#b91c1c",
                fontSize: "0.8rem",
              }}
            >
              {googleDialogError}
            </Alert>
          )}

          <Stack spacing={2}>
            {/* Username */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 750,
                  color: isDark ? "#d4d4d8" : "#3f3f46",
                  mb: 0.6,
                  ml: 0.5,
                }}
              >
                Username{" "}
                <Box component="span" sx={{ color: "#ef4444" }}>
                  *
                </Box>
              </Typography>
              <TextField
                placeholder="e.g. squad_explorer"
                fullWidth
                variant="outlined"
                value={googleUsername}
                onChange={(e) => setGoogleUsername(e.target.value)}
                helperText={
                  googleUsernameStatus === "available"
                    ? "Username is available!"
                    : googleUsernameStatus === "taken"
                    ? "Username is already taken."
                    : googleUsernameStatus === "invalid"
                    ? "Must be at least 3 characters."
                    : ""
                }
                FormHelperTextProps={{
                  sx: {
                    color:
                      googleUsernameStatus === "available"
                        ? "#8cefcb"
                        : googleUsernameStatus === "taken"
                        ? "#ef4444"
                        : "#a1a1aa",
                    fontWeight: 750,
                    fontSize: "0.75rem",
                    ml: 1,
                    mt: 0.5,
                  },
                }}
                sx={fieldStyleProps}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlined sx={iconSx} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" sx={{ mr: 0.5 }}>
                      {isCheckingGoogleUsername ? (
                        <CircularProgress size={18} sx={{ color: "#88b7f0" }} />
                      ) : googleUsernameStatus === "available" ? (
                        <CheckCircleRounded sx={{ color: "#8cefcb", fontSize: 20 }} />
                      ) : googleUsernameStatus === "taken" ? (
                        <CancelRounded sx={{ color: "#ef4444", fontSize: 20 }} />
                      ) : null}
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Mobile Number */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 750,
                  color: isDark ? "#d4d4d8" : "#3f3f46",
                  mb: 0.6,
                  ml: 0.5,
                }}
              >
                Mobile Number
              </Typography>
              <TextField
                placeholder="e.g. +91 98765 43210"
                fullWidth
                variant="outlined"
                value={googleMobile}
                onChange={(e) => setGoogleMobile(e.target.value)}
                sx={fieldStyleProps}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIphoneRounded sx={iconSx} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              disabled={savingGoogleProfile || isCheckingGoogleUsername}
              onClick={handleGoogleDetailsSubmit}
              sx={{
                mt: 1,
                backgroundColor: "#88b7f0",
                color: "#002047",
                textTransform: "none",
                borderRadius: "14px",
                py: 1.3,
                fontWeight: 800,
                fontSize: "0.95rem",
                boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 4px 14px rgba(136, 183, 240, 0.3)",
                "&:hover": {
                  backgroundColor: "#a9cbfa",
                },
              }}
            >
              {savingGoogleProfile ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Finish & Enter BunkMates"
              )}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}