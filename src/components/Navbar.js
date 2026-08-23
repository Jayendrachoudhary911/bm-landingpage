import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Typography,
  Stack,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  Box,
  ListItemIcon,
  Badge,
  Tooltip,
  Dialog,
  DialogContent,
  Chip,
  CircularProgress,
  Paper,
  Link as MuiLink,
  Slide,
  Collapse,
  Popper,
  Fade,
  alpha,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import CloseIcon from "@mui/icons-material/Close";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query, where, doc, getDoc, writeBatch } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth"; 
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useCustomTheme } from '../context/ThemeContext';

const M3_EXPRESSIVE_PALETTE = {
  blue: {
    accent: "#88b7f0",
    light: { bg: "#D7E3FF", text: "#001B3F", container: "#EEF2FF", onContainer: "#004785", badgeBg: "#BACDF8" },
    dark: { bg: "#d3e7ff", text: "#203362", container: "#e2f0ff", onContainer: "#457ed8", badgeBg: "#003F7D" },
  },
  amber: {
    accent: "#f5d397",
    light: { bg: "#FFDEA5", text: "#271900", container: "#FFF2D9", onContainer: "#765B00", badgeBg: "#F0CA85" },
    dark: { bg: "#ffefbe", text: "#271900", container: "#fff5e2", onContainer: "#d99f17", badgeBg: "#594300" },
  },
  emerald: {
    accent: "#8cefcb",
    light: { bg: "#A6F5BA", text: "#00210E", container: "#DBFCE3", onContainer: "#006D37", badgeBg: "#8CE3A3" },
    dark: { bg: "#b6ffd7", text: "#21542e", container: "#e4fff0", onContainer: "#17c14d", badgeBg: "#005228" },
  },
  orange: {
    accent: "#ffd6b4",
    light: { bg: "#FFDBCA", text: "#341000", container: "#FFECE2", onContainer: "#984013", badgeBg: "#F6C1A7" },
    dark: { bg: "#ffdac5", text: "#703e26", container: "#ffeae2", onContainer: "#fb712c", badgeBg: "#772F03" },
  },
  purple: {
    accent: "#c8b6ff",
    light: { bg: "#EBDCFF", text: "#25005A", container: "#F6EEFF", onContainer: "#6940A5", badgeBg: "#D4BFF2" },
    dark: { bg: "#e2d1ff", text: "#44236f", container: "#ecdeff", onContainer: "#a473ff", badgeBg: "#422271" },
  },
};

const bounceSpring = {
  type: "spring",
  stiffness: 380,
  damping: 24,
  mass: 0.8,
};

const liquidSpring = {
  type: "spring",
  stiffness: 320,
  damping: 23,
  mass: 0.85,
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: bounceSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -10,
    transition: { duration: 0.15 },
  },
};

const DialogSlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const FormattedMessageContent = React.memo(({ content, isMobile = false }) => {
  if (!content) {
    return (
      <Typography variant="body2" sx={{ color: "#64748b", fontStyle: "italic" }}>
        No text content.
      </Typography>
    );
  }

  const parts = String(content).split(URL_REGEX);

  return (
    <Typography
      component="div"
      sx={{
        color: "#e2e8f0",
        lineHeight: 1.6,
        fontSize: isMobile ? "0.875rem" : "0.95rem",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {parts.map((part, index) => {
        if (part.match(URL_REGEX)) {
          return (
            <MuiLink
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              sx={{
                color: M3_EXPRESSIVE_PALETTE.blue.accent,
                textDecoration: "underline",
                textUnderlineOffset: 3,
                wordBreak: "break-all",
                "&:hover": { color: "#ffffff" },
              }}
            >
              {part}
            </MuiLink>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </Typography>
  );
});

// Navigation Data Definition with Category Palette Theming
const FEATURES_ITEMS = [
  { icon: '🗺', title: 'Plan Trips', subtitle: 'Create & manage trips together', mobileSub: 'Plan together', path: '/features/plan-trips', paletteKey: 'blue' },
  { icon: '💬', title: 'Stay Connected', subtitle: 'Group and private chats', mobileSub: 'Group chats', path: '/features/group-chat', paletteKey: 'purple' },
  { icon: '💰', title: 'Split Expenses', subtitle: 'Track group spending', mobileSub: 'Track spending', path: '/features/expenses', paletteKey: 'emerald' },
  { icon: '✓', title: 'Stay Organized', subtitle: 'Tasks, notes & reminders', mobileSub: 'Tasks and notes', path: '/features/tasks-notes', paletteKey: 'amber' },
];

const EXPLORE_ITEMS = [
  { icon: '📍', title: 'Destinations', subtitle: 'Curated spots & mountain trails', mobileSub: 'Top trails & spots', path: '/explore/destinations', paletteKey: 'orange' },
  { icon: '🧭', title: 'Travel Guides', subtitle: 'Expert squad planning tips', mobileSub: 'Squad travel tips', path: '/explore/travel-guides', paletteKey: 'blue' },
  { icon: '📱', title: 'App Preview', subtitle: 'Visual interactive sandbox', mobileSub: 'Visual walk-through', path: '/explore/app-preview', paletteKey: 'purple' },
  { icon: '✨', title: "What's New", subtitle: 'Latest features & releases', mobileSub: 'Latest app releases', path: '/explore/whats-new', paletteKey: 'emerald' },
];

const ABOUT_ITEMS = [
  { icon: '📖', title: 'Our Story', subtitle: 'Why we built BunkMates', mobileSub: 'Mission & founders', path: '/about', paletteKey: 'amber' },
  { icon: '🔒', title: 'Safety & Privacy', subtitle: 'Encrypted & privacy-first', mobileSub: 'Encrypted security', path: '/privacy', paletteKey: 'blue' },
  { icon: '🎧', title: 'Contact & Support', subtitle: '24/7 squad assistance', mobileSub: '24/7 squad help', path: '/contact', paletteKey: 'emerald' },
  { icon: '📜', title: 'Community Guidelines', subtitle: 'Respect on the trails', mobileSub: 'Trail rules & respect', path: '/community-guidelines', paletteKey: 'purple' },
];

const Navbar = ({ user }) => {
  const muiTheme = useTheme();
  const { isDark } = useCustomTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const [authAnchorEl, setAuthAnchorEl] = useState(null);

  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [featuresAnchorEl, setFeaturesAnchorEl] = useState(null);
  const [exploreAnchorEl, setExploreAnchorEl] = useState(null);
  const [aboutAnchorEl, setAboutAnchorEl] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(true);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const [notifDialogOpen, setNotifDialogOpen] = useState(false);
  const [bottomNavOpen, setBottomNavOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [senderProfiles, setSenderProfiles] = useState({});
  const [currentUserDbData, setCurrentUserDbData] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filterSenderId, setFilterSenderId] = useState(null);
  const [expandedMobileGroupId, setExpandedMobileGroupId] = useState(null);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Content-Aware Scroll Mask Hooks for Notifications Left and Right Panels
  const [leftCanScrollUp, setLeftCanScrollUp] = useState(false);
  const [leftCanScrollDown, setLeftCanScrollDown] = useState(false);
  const leftScrollRef = useRef(null);

  const [rightCanScrollUp, setRightCanScrollUp] = useState(false);
  const [rightCanScrollDown, setRightCanScrollDown] = useState(false);
  const rightScrollRef = useRef(null);

  const handleLeftScroll = useCallback(() => {
    const el = leftScrollRef.current;
    if (!el) return;
    setLeftCanScrollUp(el.scrollTop > 4);
    setLeftCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  const handleRightScroll = useCallback(() => {
    const el = rightScrollRef.current;
    if (!el) return;
    setRightCanScrollUp(el.scrollTop > 4);
    setRightCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  const leftMaskImage = useMemo(() => {
    if (leftCanScrollUp && leftCanScrollDown) {
      return "linear-gradient(to bottom, transparent 0%, black 28px, black calc(100% - 28px), transparent 100%)";
    }
    if (leftCanScrollUp) {
      return "linear-gradient(to bottom, transparent 0%, black 28px, black 100%)";
    }
    if (leftCanScrollDown) {
      return "linear-gradient(to bottom, black 0%, black calc(100% - 28px), transparent 100%)";
    }
    return "none";
  }, [leftCanScrollUp, leftCanScrollDown]);

  const rightMaskImage = useMemo(() => {
    if (rightCanScrollUp && rightCanScrollDown) {
      return "linear-gradient(to bottom, transparent 0%, black 28px, black calc(100% - 28px), transparent 100%)";
    }
    if (rightCanScrollUp) {
      return "linear-gradient(to bottom, transparent 0%, black 28px, black 100%)";
    }
    if (rightCanScrollDown) {
      return "linear-gradient(to bottom, black 0%, black calc(100% - 28px), transparent 100%)";
    }
    return "none";
  }, [rightCanScrollUp, rightCanScrollDown]);

  // Initial scroll check when notifications load or group changes
  useEffect(() => {
    if (notifDialogOpen) {
      setTimeout(() => {
        handleLeftScroll();
        handleRightScroll();
      }, 100);
    }
  }, [notifDialogOpen, notifications, selectedGroup, handleLeftScroll, handleRightScroll]);

  const isAuthMenuOpen = Boolean(authAnchorEl);
  const handleAuthMenuOpen = (e) => setAuthAnchorEl(e.currentTarget);
  const handleAuthMenuClose = () => setAuthAnchorEl(null);

  const isFeaturesActive = useMemo(() => {
    return location.pathname.startsWith('/features') || FEATURES_ITEMS.some((i) => i.path === location.pathname);
  }, [location.pathname]);

  const isExploreActive = useMemo(() => {
    return location.pathname.startsWith('/explore') || EXPLORE_ITEMS.some((i) => i.path === location.pathname);
  }, [location.pathname]);

  const isAboutActive = useMemo(() => {
    return ABOUT_ITEMS.some((i) => i.path === location.pathname);
  }, [location.pathname]);

  const activeDesktopNavId = useMemo(() => {
    if (location.pathname === '/') return 'home';
    if (isFeaturesActive) return 'features';
    if (isExploreActive) return 'explore';
    if (location.pathname === '/community') return 'community';
    if (isAboutActive) return 'about';
    return null;
  }, [location.pathname, isFeaturesActive, isExploreActive, isAboutActive]);

  const handleMenuMouseEnter = (menuKey, targetEl) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (menuKey === 'features') setFeaturesAnchorEl(targetEl);
    if (menuKey === 'explore') setExploreAnchorEl(targetEl);
    if (menuKey === 'about') setAboutAnchorEl(targetEl);
    setHoveredMenu(menuKey);
  };

  const handleMenuMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 180);
  };

  const handleCloseNotifDialog = () => {
    setNotifDialogOpen(false);
    setFilterSenderId(null);
    setExpandedMobileGroupId(null);
  };

  useEffect(() => {
    if (!user?.uid) {
      setCurrentUserDbData(null);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setCurrentUserDbData(docSnap.data());
        }
      },
      (err) => {
        console.error("Failed to sync current user profile:", err);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const userPhoto = useMemo(() => {
    return (
      currentUserDbData?.photoURL ||
      currentUserDbData?.profilePic ||
      currentUserDbData?.pic ||
      user?.photoURL ||
      ''
    );
  }, [currentUserDbData, user?.photoURL]);

  const userDisplayName = useMemo(() => {
    return (
      currentUserDbData?.displayName ||
      currentUserDbData?.name ||
      user?.displayName ||
      'User'
    );
  }, [currentUserDbData, user?.displayName]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      setSelectedGroup(null);
      return;
    }

    setLoadingNotifs(true);
    const q = query(
      collection(db, "notifications"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const notifData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setNotifications(notifData);
        setLoadingNotifs(false);

        const senderIds = [...new Set(notifData.map((n) => n.senderId).filter(Boolean))];
        const uncachedSenders = senderIds.filter((sId) => !senderProfiles[sId]);

        if (uncachedSenders.length > 0) {
          const newProfiles = {};
          await Promise.all(
            uncachedSenders.map(async (sId) => {
              try {
                const userDoc = await getDoc(doc(db, "users", sId));
                if (userDoc.exists()) {
                  newProfiles[sId] = userDoc.data();
                }
              } catch (err) {
                console.error("Failed to load user profile:", err);
              }
            })
          );
          if (Object.keys(newProfiles).length > 0) {
            setSenderProfiles((prev) => ({ ...prev, ...newProfiles }));
          }
        }
      },
      (err) => {
        console.error("Notifications fetch error:", err);
        setLoadingNotifs(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const getMillis = useCallback((ts) => {
    if (!ts) return 0;
    if (typeof ts?.toMillis === 'function') return ts.toMillis();
    if (typeof ts?.toDate === 'function') return ts.toDate().getTime();
    if (ts instanceof Date) return ts.getTime();
    if (typeof ts === 'number') return ts;
    return 0;
  }, []);

  const getSenderDetails = useCallback((senderId, fallbackPic, fallbackTitle) => {
    const profile = senderProfiles[senderId] || {};
    const name = profile.displayName || profile.name || fallbackTitle?.replace(/sent a new message|new message|:/gi, '').trim() || "User";
    const photo = profile.photoURL || profile.profilePic || profile.pic || fallbackPic || "";
    const email = profile.email || "";
    const username = profile.username || "";
    return { name, photo, email, username };
  }, [senderProfiles]);

  const groupedNotifications = useMemo(() => {
    if (!notifications.length) return [];

    const sorted = [...notifications].sort((a, b) => getMillis(b.timestamp) - getMillis(a.timestamp));
    const groups = [];
    const TEN_MINUTES_MS = 10 * 60 * 1000;

    sorted.forEach((notif) => {
      const notifTime = getMillis(notif.timestamp);
      const senderKey = notif.senderId || 'unknown_sender';
      const typeKey = notif.type || 'general';

      const existingGroup = groups.find((g) => {
        const sameSender = g.senderId === senderKey;
        const sameType = g.type === typeKey;
        const timeDiff = Math.abs(g.latestTime - notifTime);
        return sameSender && sameType && timeDiff <= TEN_MINUTES_MS;
      });

      if (existingGroup) {
        existingGroup.items.push(notif);
        if (notifTime > existingGroup.latestTime) {
          existingGroup.latestTime = notifTime;
          existingGroup.timestamp = notif.timestamp;
        }
        if (!notif.seen) {
          existingGroup.hasUnseen = true;
        }
      } else {
        groups.push({
          groupId: `${senderKey}_${notif.id}`,
          senderId: senderKey,
          type: typeKey,
          timestamp: notif.timestamp,
          latestTime: notifTime,
          hasUnseen: !notif.seen,
          pic: notif.pic,
          title: notif.title,
          items: [notif],
        });
      }
    });

    return groups;
  }, [notifications, getMillis]);

  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return 'Just now';
    if (typeof timestamp?.toDate === 'function') {
      return timestamp.toDate().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    }
    return String(timestamp);
  }, []);

  const formatTimeOnly = useCallback((timestamp) => {
    if (!timestamp) return '';
    if (typeof timestamp?.toDate === 'function') {
      return timestamp.toDate().toLocaleTimeString('en-US', { timeStyle: 'short' });
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString('en-US', { timeStyle: 'short' });
    }
    return '';
  }, []);

  const handleMarkGroupAsSeen = useCallback(async (group) => {
    const unreadItems = group.items.filter((item) => !item.seen);
    if (unreadItems.length === 0) return;

    try {
      const batch = writeBatch(db);
      unreadItems.forEach((item) => {
        const notifRef = doc(db, "notifications", item.id);
        batch.update(notifRef, { seen: true });
      });
      await batch.commit();
    } catch (err) {
      console.error("Failed to mark group as seen:", err);
    }
  }, []);

  const handleSelectGroup = useCallback((group) => {
    handleMarkGroupAsSeen(group);
    if (isMobile) {
      setExpandedMobileGroupId((prev) => (prev === group.groupId ? null : group.groupId));
    } else {
      setSelectedGroup(group);
    }
  }, [handleMarkGroupAsSeen, isMobile]);

  const handleLogout = async () => {
    handleAuthMenuClose();
    setBottomNavOpen(false);
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleRouteNavigate = (path) => {
    setHoveredMenu(null);
    setBottomNavOpen(false);
    navigate(path);
  };

  const unreadCount = user ? notifications.filter((n) => !n.seen).length : 0;

  const displayedGroups = useMemo(() => {
    if (!filterSenderId) return groupedNotifications;
    return groupedNotifications.filter((g) => g.senderId === filterSenderId);
  }, [groupedNotifications, filterSenderId]);

  const activeSenderAllMessages = useMemo(() => {
    if (!selectedGroup) return [];
    return notifications
      .filter((n) => n.senderId === selectedGroup.senderId)
      .sort((a, b) => getMillis(a.timestamp) - getMillis(b.timestamp));
  }, [notifications, selectedGroup, getMillis]);

  const emeraldColor = M3_EXPRESSIVE_PALETTE.emerald;
  const blueColor = M3_EXPRESSIVE_PALETTE.blue;

  const renderDesktopMegaPopper = (isOpen, anchorEl, title, subtitle, items, viewAllPath, menuKey) => (
    <Popper
      open={isOpen}
      anchorEl={anchorEl}
      placement="bottom"
      transition
      style={{ zIndex: 1200, pointerEvents: 'auto' }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 14],
          },
        },
      ]}
      onMouseEnter={() => handleMenuMouseEnter(menuKey, anchorEl)}
      onMouseLeave={handleMenuMouseLeave}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={180}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: "26px",
              width: 440,
              backgroundColor: isDark ? "#151515a9" : "#ffffff",
              backdropFilter: "blur(24px)",
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
              color: isDark ? "#f8fafc" : "#09090b",
            }}
          >
            <Box sx={{ px: 0.5, mb: 1.8 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: '#ffffff' }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? "#a1a1aa" : "#64748b", mt: 0.3, fontSize: "0.86rem" }}>
                {subtitle}
              </Typography>
            </Box>

            {/* 2x2 Grid with Palette Color Matching on Hover and Active */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.2, mb: 1.8 }}>
              {items.map((item, idx) => {
                const isOptionActive = location.pathname === item.path;
                const palette = M3_EXPRESSIVE_PALETTE[item.paletteKey || 'blue'];
                const cardActiveBg = isDark ? palette.dark.container : palette.light.container;
                const cardActiveText = isDark ? palette.dark.text : palette.light.onContainer;
                const cardHoverBg = isDark ? alpha(palette.accent, 0.96) : alpha(palette.accent, 0.16);

                return (
                  <Paper
                    key={idx}
                    component={motion.div}
                    whileHover={{ y: 0, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRouteNavigate(item.path)}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: "16px",
                      backgroundColor: isOptionActive
                        ? cardActiveBg
                        : isDark
                        ? "rgba(255, 255, 255, 0.04)"
                        : "rgba(0, 0, 0, 0.025)",
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(255, 255, 255, 0.01)',
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      color: isOptionActive
                        ? cardActiveText
                        : isDark
                        ? "#ffffff"
                        : "#09090b",
                      minHeight: 94,
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        backgroundColor: isOptionActive ? palette.accent : cardHoverBg,
                        color: cardActiveText,
                        "& .item-subtitle": {
                          color: alpha(cardActiveText, 0.85),
                        },
                        "& .item-arrow": {
                          color: cardActiveText,
                        },
                      },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: "1.2rem", mb: 0.4 }}>{item.icon}</Typography>
                      <Typography
                        sx={{
                          fontSize: "0.86rem",
                          fontWeight: isOptionActive ? 850 : 750,
                          lineHeight: 1.2,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        className="item-subtitle"
                        sx={{
                          fontSize: "0.72rem",
                          color: isOptionActive
                            ? isDark
                              ? alpha(cardActiveText, 0.85)
                              : alpha(cardActiveText, 0.8)
                            : isDark
                            ? "#888888"
                            : "#64748b",
                          mt: 0.3,
                          lineHeight: 1.3,
                          transition: "color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        {item.subtitle}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.8 }}>
                      <ArrowForwardRoundedIcon
                        className="item-arrow"
                        sx={{
                          fontSize: 14,
                          color: isOptionActive ? cardActiveText : palette.accent,
                          transition: "color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                    </Box>
                  </Paper>
                );
              })}
            </Box>

            {viewAllPath && (
              <Button
                fullWidth
                onClick={() => handleRouteNavigate(viewAllPath)}
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  py: 0.85,
                  borderRadius: "12px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
                  color: isDark ? "#ffffff" : "#09090b",
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.01)',
                  fontSize: "0.82rem",
                  fontWeight: 750,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                View All {title}
              </Button>
            )}
          </Box>
        </Fade>
      )}
    </Popper>
  );

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: { xs: 10, md: 16 },
          left: 0,
          right: 0,
          mx: "auto",
          width: { xs: "95%", md: "96%" },
          maxWidth: "1350px",
          zIndex: 1000,
          py: { xs: 0.6, md: 0.8 },
          px: { xs: 1.5, sm: 2.5 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "transparent",
          borderRadius: "999px",
          transition: "all 0.35s ease",
        }}
      >
        {/* Brand Logo */}
        <Box
          component={motion.div}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleRouteNavigate('/')}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            userSelect: 'none',
            pl: 0.5,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={850}
            sx={{
              color: isDark ? "#ffffff" : "#09090b",
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              backgroundColor: isMobile && isDark ? (isScrolled ? "rgba(26, 26, 26, 0.7)" : 'transparent') : "rgba(0, 0, 0, 0.13)",
              boxShadow: isScrolled ? 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)' : 'none',
              backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0)',
              WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(0)',
              px: 1.5,
              py: 0.3,
              borderRadius: 4,
            }}
          >
            BunkMates
          </Typography>
        </Box>

        {/* Desktop Direct Route Navigation Links */}
        {!isMobile && (
          <Stack
            direction="row"
            spacing={0.4}
            alignItems="center"
            sx={{
              backgroundColor: isDark ? (isScrolled ? "rgba(0, 0, 0, 0.7)" : 'transparent') : "rgba(0, 0, 0, 0.035)",
              boxShadow: isScrolled ? 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)' : 'none',
              backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
              WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
              p: 0.5,
              borderRadius: "999px",
            }}
          >
            <LayoutGroup id="desktopNavBarLayout">
              {/* 1. HOME */}
              <Box
                component={motion.div}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleRouteNavigate('/')}
                sx={{
                  position: "relative",
                  px: 1.8,
                  py: 0.65,
                  borderRadius: "999px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {activeDesktopNavId === 'home' && (
                  <motion.div
                    layoutId="desktopNavPill"
                    transition={bounceSpring}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      backgroundColor: isDark ? "#ffffff22" : "#09090b",
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                      zIndex: 0,
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  fontWeight={activeDesktopNavId === 'home' ? 800 : 750}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    color: activeDesktopNavId === 'home' ? "#ffffff" : (isDark ? "#c0c0c0" : "#64748b"),
                    fontSize: "0.86rem",
                  }}
                >
                  HOME
                </Typography>
              </Box>

              {/* 2. FEATURES ▾ */}
              <Box
                component={motion.div}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onMouseEnter={(e) => handleMenuMouseEnter('features', e.currentTarget)}
                onMouseLeave={handleMenuMouseLeave}
                sx={{
                  position: "relative",
                  px: 1.8,
                  py: 0.65,
                  borderRadius: "999px",
                  cursor: "pointer",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                  backgroundColor: hoveredMenu === 'features' && activeDesktopNavId !== 'features'
                    ? (isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0,0,0,0.05)")
                    : "transparent",
                }}
              >
                {activeDesktopNavId === 'features' && (
                  <motion.div
                    layoutId="desktopNavPill"
                    transition={bounceSpring}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      backgroundColor: isDark ? "#ffffff22" : "#09090b",
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                      zIndex: 0,
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  fontWeight={activeDesktopNavId === 'features' ? 800 : 750}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    color: activeDesktopNavId === 'features' ? "#ffffff" : (isDark ? "#c0c0c0" : "#64748b"),
                    fontSize: "0.86rem",
                  }}
                >
                  FEATURES
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    fontSize: 16,
                    color: activeDesktopNavId === 'features' ? "#ffffff" : (isDark ? "#c0c0c0" : "#64748b"),
                    transform: hoveredMenu === 'features' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Box>

              {/* 3. EXPLORE ▾ */}
              <Box
                component={motion.div}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onMouseEnter={(e) => handleMenuMouseEnter('explore', e.currentTarget)}
                onMouseLeave={handleMenuMouseLeave}
                sx={{
                  position: "relative",
                  px: 1.8,
                  py: 0.65,
                  borderRadius: "999px",
                  cursor: "pointer",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                  backgroundColor: hoveredMenu === 'explore' && activeDesktopNavId !== 'explore'
                    ? (isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0,0,0,0.05)")
                    : "transparent",
                }}
              >
                {activeDesktopNavId === 'explore' && (
                  <motion.div
                    layoutId="desktopNavPill"
                    transition={bounceSpring}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      backgroundColor: isDark ? "#ffffff22" : "#09090b",
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                      zIndex: 0,
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  fontWeight={activeDesktopNavId === 'explore' ? 800 : 750}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    color: activeDesktopNavId === 'explore' ? "#ffffff" : (isDark ? "#c0c0c0" : "#64748b"),
                    fontSize: "0.86rem",
                  }}
                >
                  EXPLORE
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    fontSize: 16,
                    color: activeDesktopNavId === 'explore' ? "#ffffff" : (isDark ? "#c0c0c0" : "#64748b"),
                    transform: hoveredMenu === 'explore' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Box>

              {/* 4. COMMUNITY */}
              <Box
                component={motion.div}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleRouteNavigate('/community')}
                sx={{
                  position: "relative",
                  px: 1.8,
                  py: 0.65,
                  borderRadius: "999px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {activeDesktopNavId === 'community' && (
                  <motion.div
                    layoutId="desktopNavPill"
                    transition={bounceSpring}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      backgroundColor: isDark ? "#ffffff22" : "#09090b",
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                      zIndex: 0,
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  fontWeight={activeDesktopNavId === 'community' ? 800 : 750}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    color: activeDesktopNavId === 'community' ? "#ffffff" : (isDark ? "#c0c0c0" : "#64748b"),
                    fontSize: "0.86rem",
                  }}
                >
                  COMMUNITY
                </Typography>
              </Box>

              {/* 5. ABOUT ▾ */}
              <Box
                component={motion.div}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onMouseEnter={(e) => handleMenuMouseEnter('about', e.currentTarget)}
                onMouseLeave={handleMenuMouseLeave}
                sx={{
                  position: "relative",
                  px: 1.8,
                  py: 0.65,
                  borderRadius: "999px",
                  cursor: "pointer",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                  backgroundColor: hoveredMenu === 'about' && activeDesktopNavId !== 'about'
                    ? (isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0,0,0,0.05)")
                    : "transparent",
                }}
              >
                {activeDesktopNavId === 'about' && (
                  <motion.div
                    layoutId="desktopNavPill"
                    transition={bounceSpring}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      backgroundColor: isDark ? "#ffffff22" : "#09090b",
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                      zIndex: 0,
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  fontWeight={activeDesktopNavId === 'about' ? 800 : 750}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    color: activeDesktopNavId === 'about' ? "#ffffff" : (isDark ? "#c0c0c0" : "#64748b"),
                    fontSize: "0.86rem",
                  }}
                >
                  ABOUT
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    fontSize: 16,
                    color: activeDesktopNavId === 'about' ? "#ffffff" : (isDark ? "#c0c0c0" : "#64748b"),
                    transform: hoveredMenu === 'about' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Box>
            </LayoutGroup>
          </Stack>
        )}

        {/* Right Header Action Items */}
        <Stack direction="row" spacing={1} alignItems="center">
          {!isMobile && (
            <Button
              component={motion.button}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              variant="contained"
              onClick={() => handleRouteNavigate('/bm-install')}
              startIcon={<DownloadRoundedIcon sx={{ fontSize: "1.1rem !important" }} />}
              sx={{
                borderRadius: "999px",
                px: 2,
                py: 0.7,
                backgroundColor: isDark ? emeraldColor.dark.bg : emeraldColor.light.bg,
                color: isDark ? emeraldColor.dark.text : emeraldColor.light.text,
                boxShadow: 'none',
                fontWeight: 800,
                fontSize: "0.84rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: emeraldColor.dark.text,
                  color: emeraldColor.dark.bg,
                },
              }}
            >
              DOWNLOAD APP
            </Button>
          )}

          {user && (
            <Tooltip title="Notifications" arrow>
              <IconButton
                component={motion.button}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  setNotifDialogOpen(true);
                  if (groupedNotifications.length > 0 && !selectedGroup) {
                    setSelectedGroup(groupedNotifications[0]);
                  }
                }}
                sx={{
                  color: isDark ? "#ffffff" : "#09090b",
                  backgroundColor: isDark ? "rgba(26, 26, 26, 0.7)" : "rgba(0, 0, 0, 0.05)",
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  width: 38,
                  height: 38,
                  borderRadius: 4,
                }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon sx={{ fontSize: 19 }} />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {user ? (
            <IconButton
              component={motion.button}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={isMobile ? () => setBottomNavOpen(true) : handleAuthMenuOpen}
              sx={{ p: 0.3 }}
            >
              <Avatar
                src={userPhoto}
                alt={userDisplayName}
                sx={{
                  width: 36,
                  height: 36,
                  border: `2px solid ${isDark ? "#2a2d36" : "#e2e6ea"}`,
                }}
              />
            </IconButton>
          ) : (
            <Button
              component={motion.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              variant="contained"
              size="small"
              onClick={isMobile ? () => setBottomNavOpen(true) : () => navigate('/login')}
              sx={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
                color: isDark ? "#ffffff" : "#09090b",
                px: { xs: 1.6, md: 2 },
                py: 0.7,
                borderRadius: "999px",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.84rem",
                "&:hover": {
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              {isMobile ? "Menu" : "SIGN IN"}
            </Button>
          )}
        </Stack>

        {/* Desktop Mega Menus */}
        {!isMobile && (
          <>
            {renderDesktopMegaPopper(
              hoveredMenu === 'features',
              featuresAnchorEl,
              "FEATURES",
              "Everything you need to plan together",
              FEATURES_ITEMS,
              "/features",
              'features'
            )}
            {renderDesktopMegaPopper(
              hoveredMenu === 'explore',
              exploreAnchorEl,
              "EXPLORE",
              "Discover spots, reels & trail guides",
              EXPLORE_ITEMS,
              "/explore",
              'explore'
            )}
            {renderDesktopMegaPopper(
              hoveredMenu === 'about',
              aboutAnchorEl,
              "ABOUT",
              "Learn about our mission, privacy & squad support",
              ABOUT_ITEMS,
              null,
              'about'
            )}

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={authAnchorEl}
              open={isAuthMenuOpen}
              onClose={handleAuthMenuClose}
              elevation={0}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                elevation: 0,
                sx: {
                  background: "transparent",
                  boxShadow: "none",
                  overflow: "visible",
                  mt: 1.5,
                },
              }}
              MenuListProps={{
                disablePadding: true,
                component: motion.ul,
                initial: { opacity: 0, scale: 0.92, y: -10 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.92, y: -10 },
                transition: bounceSpring,
                sx: {
                  p: 1,
                  borderRadius: "20px",
                  minWidth: 230,
                  background: isDark ? "#1d1d1db3" : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), inset 0 -1px 1px rgba(255, 255, 255, 0.07), 0 1px 0px rgba(0, 0, 0, 0)',
                  color: isDark ? "#f8fafc" : "#09090b",
                },
              }}
            >
              {user && (
                <>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" fontWeight={800} sx={{ color: isDark ? "#fff" : "#09090b" }} noWrap>
                      {userDisplayName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? "#c5c5c5" : "#64748b" }} noWrap display="block">
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 0.8, borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />
                  <MenuItem
                    onClick={() => {
                      handleAuthMenuClose();
                      navigate('/profile');
                    }}
                    sx={{ px: 2, py: 1.1, borderRadius: "12px", '&:hover' : { boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)' } }}
                  >
                    <ListItemIcon sx={{ color: '#c1c1c1', minWidth: 32 }}>
                      <AccountCircle sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <Typography fontSize="0.88rem" fontWeight={600}>Profile Details</Typography>
                  </MenuItem>

                  <Divider sx={{ my: 0.8, borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      px: 2,
                      py: 1.1,
                      borderRadius: "12px",
                      backgroundColor: "rgba(239, 68, 68, 0.17)",
                      boxShadow: 'inset 0 1px 1px rgba(255, 8, 8, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                      "&:hover": { backgroundColor: 'rgba(239, 68, 68, 0.16)' },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#ef4444", minWidth: 32 }}>
                      <Logout sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <Typography color="#ef4444" fontWeight={700} fontSize="0.88rem">Logout</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        )}
      </Box>

      {/* Swipeable Drawer for Mobile View */}
      <SwipeableDrawer
        anchor="bottom"
        open={bottomNavOpen && isMobile}
        onClose={() => setBottomNavOpen(false)}
        onOpen={() => setBottomNavOpen(true)}
        disableSwipeToOpen={false}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0)",
              backdropFilter: "blur(12px)",
            },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "32px",
            backgroundColor: isDark ? "#0e0e0ee0" : "#ffffff",
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
            p: 2.5,
            pb: 4,
            m: 1.5,
            maxHeight: "90vh",
            overflowY: "auto",
            color: isDark ? "#f8fafc" : "#09090b",
          },
        }}
      >
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          {/* Drag Handle */}
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: 10,
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)",
              mx: "auto",
              mb: 2,
            }}
          />

          {/* HOME Direct Link */}
          <ListItem
            button
            component={motion.div}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRouteNavigate('/')}
            sx={{
              px: 2,
              py: 1.1,
              borderRadius: "14px",
              mb: 1.2,
              backgroundColor: location.pathname === '/'
                ? (isDark ? emeraldColor.dark.container : emeraldColor.light.container)
                : (isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.035)"),
              border: `1px solid ${
                location.pathname === '/'
                  ? alpha(emeraldColor.accent, 0.5)
                  : isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)"
              }`,
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: location.pathname === '/'
                  ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer)
                  : "#fff",
              }}
            >
              <HomeOutlinedIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="Home"
              primaryTypographyProps={{
                fontSize: '0.92rem',
                fontWeight: location.pathname === '/' ? 850 : 750,
                color: location.pathname === '/'
                  ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer)
                  : "inherit",
              }}
            />
          </ListItem>

          {/* 1. FEATURES Expanding Section with Icon */}
          <Box sx={{ mb: 1.2 }}>
            <Box
              onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1.1,
                borderRadius: "14px",
                backgroundColor: isFeaturesActive
                  ? (isDark ? emeraldColor.dark.container : emeraldColor.light.container)
                  : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"),
                border: isFeaturesActive ? `1px solid ${alpha(emeraldColor.accent, 0.5)}` : "1px solid transparent",
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <ExtensionOutlinedIcon sx={{ fontSize: 20, color: isFeaturesActive ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer) : (isDark ? "#ffffff" : "#09090b") }} />
                <Typography sx={{ color: isFeaturesActive ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer) : (isDark ? "#ffffff" : "#09090b"), fontWeight: 800, fontSize: "0.92rem" }}>
                  Features
                </Typography>
              </Stack>
              <Typography sx={{ color: isFeaturesActive ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer) : (isDark ? blueColor.accent : "#004785"), fontWeight: 800, fontSize: "1.2rem", lineHeight: 1 }}>
                {mobileFeaturesOpen ? "−" : "+"}
              </Typography>
            </Box>

            <Collapse in={mobileFeaturesOpen} timeout="auto">
              <Box
                sx={{
                  mt: 0.8,
                  borderRadius: "18px",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                  overflow: "hidden",
                }}
              >
                {FEATURES_ITEMS.map((item, idx) => {
                  const isItemActive = location.pathname === item.path;
                  return (
                    <Box key={idx}>
                      <Box
                        component={motion.div}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRouteNavigate(item.path)}
                        sx={{
                          p: 1.4,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: isItemActive
                            ? (isDark ? emeraldColor.dark.container : emeraldColor.light.container)
                            : "transparent",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                          <Typography sx={{ fontSize: "1.1rem" }}>{item.icon}</Typography>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "0.85rem",
                                fontWeight: isItemActive ? 850 : 750,
                                color: isItemActive
                                  ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer)
                                  : (isDark ? "#ffffff" : "#09090b"),
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.74rem",
                                color: isItemActive
                                  ? (isDark ? alpha(emeraldColor.dark.text, 0.85) : alpha(emeraldColor.light.onContainer, 0.8))
                                  : (isDark ? "#8b8b8b" : "#64748b"),
                              }}
                            >
                              {item.mobileSub}
                            </Typography>
                          </Box>
                        </Box>
                        <ArrowForwardRoundedIcon
                          sx={{
                            fontSize: 16,
                            color: isItemActive
                              ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer)
                              : (isDark ? "#8b8b8b" : "#64748b"),
                          }}
                        />
                      </Box>
                      {idx < FEATURES_ITEMS.length - 1 && (
                        <Divider sx={{ borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)" }} />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Collapse>
          </Box>

          {/* 2. EXPLORE Expanding Section with Icon */}
          <Box sx={{ mb: 1.2 }}>
            <Box
              onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1.1,
                borderRadius: "14px",
                backgroundColor: isExploreActive
                  ? (isDark ? emeraldColor.dark.container : emeraldColor.light.container)
                  : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"),
                border: isExploreActive ? `1px solid ${alpha(emeraldColor.accent, 0.5)}` : "1px solid transparent",
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <ExploreOutlinedIcon sx={{ fontSize: 20, color: isExploreActive ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer) : (isDark ? "#ffffff" : "#09090b") }} />
                <Typography sx={{ color: isExploreActive ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer) : (isDark ? "#ffffff" : "#09090b"), fontWeight: 800, fontSize: "0.92rem" }}>
                  Explore
                </Typography>
              </Stack>
              <Typography sx={{ color: isExploreActive ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer) : (isDark ? blueColor.accent : "#004785"), fontWeight: 800, fontSize: "1.2rem", lineHeight: 1 }}>
                {mobileExploreOpen ? "−" : "+"}
              </Typography>
            </Box>

            <Collapse in={mobileExploreOpen} timeout="auto">
              <Box
                sx={{
                  mt: 0.8,
                  borderRadius: "18px",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                  overflow: "hidden",
                }}
              >
                {EXPLORE_ITEMS.map((item, idx) => {
                  const isItemActive = location.pathname === item.path;
                  return (
                    <Box key={idx}>
                      <Box
                        component={motion.div}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRouteNavigate(item.path)}
                        sx={{
                          p: 1.4,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: isItemActive
                            ? (isDark ? emeraldColor.dark.container : emeraldColor.light.container)
                            : "transparent",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                          <Typography sx={{ fontSize: "1.1rem" }}>{item.icon}</Typography>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "0.85rem",
                                fontWeight: isItemActive ? 850 : 750,
                                color: isItemActive
                                  ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer)
                                  : (isDark ? "#ffffff" : "#09090b"),
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.74rem",
                                color: isItemActive
                                  ? (isDark ? alpha(emeraldColor.dark.text, 0.85) : alpha(emeraldColor.light.onContainer, 0.8))
                                  : (isDark ? "#8b8b8b" : "#64748b"),
                              }}
                            >
                              {item.mobileSub}
                            </Typography>
                          </Box>
                        </Box>
                        <ArrowForwardRoundedIcon
                          sx={{
                            fontSize: 16,
                            color: isItemActive
                              ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer)
                              : (isDark ? "#8b8b8b" : "#64748b"),
                          }}
                        />
                      </Box>
                      {idx < EXPLORE_ITEMS.length - 1 && (
                        <Divider sx={{ borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)" }} />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Collapse>
          </Box>

          {/* COMMUNITY Direct Link */}
          <ListItem
            button
            component={motion.div}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRouteNavigate('/community')}
            sx={{
              px: 2,
              py: 1.1,
              borderRadius: "14px",
              mb: 1.2,
              backgroundColor: location.pathname === '/community'
                ? (isDark ? emeraldColor.dark.container : emeraldColor.light.container)
                : (isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.035)"),
              border: `1px solid ${
                location.pathname === '/community'
                  ? alpha(emeraldColor.accent, 0.5)
                  : isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)"
              }`,
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: location.pathname === '/community'
                  ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer)
                  : "#fff",
              }}
            >
              <PeopleOutlineRoundedIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="Community"
              primaryTypographyProps={{
                fontSize: '0.92rem',
                fontWeight: location.pathname === '/community' ? 850 : 750,
                color: location.pathname === '/community'
                  ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer)
                  : "inherit",
              }}
            />
          </ListItem>

          {/* 3. ABOUT Expanding Section with Icon */}
          <Box sx={{ mb: 1.5 }}>
            <Box
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1.1,
                borderRadius: "14px",
                backgroundColor: isAboutActive
                  ? (isDark ? emeraldColor.dark.container : emeraldColor.light.container)
                  : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"),
                border: isAboutActive ? `1px solid ${alpha(emeraldColor.accent, 0.5)}` : "1px solid transparent",
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <InfoOutlinedIcon sx={{ fontSize: 20, color: isAboutActive ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer) : (isDark ? "#ffffff" : "#09090b") }} />
                <Typography sx={{ color: isAboutActive ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer) : (isDark ? "#ffffff" : "#09090b"), fontWeight: 800, fontSize: "0.92rem" }}>
                  About
                </Typography>
              </Stack>
              <Typography sx={{ color: isAboutActive ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer) : (isDark ? blueColor.accent : "#004785"), fontWeight: 800, fontSize: "1.2rem", lineHeight: 1 }}>
                {mobileAboutOpen ? "−" : "+"}
              </Typography>
            </Box>

            <Collapse in={mobileAboutOpen} timeout="auto">
              <Box
                sx={{
                  mt: 0.8,
                  borderRadius: "18px",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                  overflow: "hidden",
                }}
              >
                {ABOUT_ITEMS.map((item, idx) => {
                  const isItemActive = location.pathname === item.path;
                  return (
                    <Box key={idx}>
                      <Box
                        component={motion.div}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRouteNavigate(item.path)}
                        sx={{
                          p: 1.4,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: isItemActive
                            ? (isDark ? emeraldColor.dark.container : emeraldColor.light.container)
                            : "transparent",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                          <Typography sx={{ fontSize: "1.1rem" }}>{item.icon}</Typography>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "0.85rem",
                                fontWeight: isItemActive ? 850 : 750,
                                color: isItemActive
                                  ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer)
                                  : (isDark ? "#ffffff" : "#09090b"),
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.74rem",
                                color: isItemActive
                                  ? (isDark ? alpha(emeraldColor.dark.text, 0.85) : alpha(emeraldColor.light.onContainer, 0.8))
                                  : (isDark ? "#8b8b8b" : "#64748b"),
                              }}
                            >
                              {item.mobileSub}
                            </Typography>
                          </Box>
                        </Box>
                        <ArrowForwardRoundedIcon
                          sx={{
                            fontSize: 16,
                            color: isItemActive
                              ? (isDark ? emeraldColor.dark.text : emeraldColor.light.onContainer)
                              : (isDark ? "#8b8b8b" : "#64748b"),
                          }}
                        />
                      </Box>
                      {idx < ABOUT_ITEMS.length - 1 && (
                        <Divider sx={{ borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)" }} />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Collapse>
          </Box>

          {/* DOWNLOAD APP Button */}
          <Button
            size="small"
            fullWidth
            variant="contained"
            startIcon={<DownloadRoundedIcon sx={{ fontSize: 17 }} />}
            onClick={() => handleRouteNavigate('/bm-install')}
            sx={{
              mb: 1.5,
              color: '#203362',
              borderRadius: "14px",
              py: 1.2,
              textTransform: 'none',
              fontWeight: 800,
              backgroundColor: '#d3e7ff',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#203362',
                color: '#d3e7ff',
              },
            }}
          >
            Download App
          </Button>

          <Divider sx={{ my: 1.5, borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />

          {/* Account Section / SIGN IN */}
          {user ? (
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={liquidSpring}
              elevation={0}
              sx={{ background: 'transparent' }}
            >
              <Box
                component={motion.div}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setBottomNavOpen(false);
                  navigate('/profile');
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: "18px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0)" : "rgba(0, 0, 0, 0.03)",
                }}
              >
                <Avatar
                  src={userPhoto}
                  alt={userDisplayName}
                  sx={{ width: 44, height: 44 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={800} noWrap sx={{ color: isDark ? "#fff" : "#09090b" }}>
                    {userDisplayName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? "#bababa" : "#64748b" }} noWrap display="block">
                    {user.email}
                  </Typography>
                </Box>
                <ChevronRightIcon sx={{ color: isDark ? "#cbcbcb" : "#94a3b8", backgroundColor: 'rgba(255, 255, 255, 0.11)', p: 0.2, borderRadius: 4, boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)', fontSize: 32 }} />
              </Box>

              <Button
                size="small"
                fullWidth
                variant="contained"
                startIcon={<Logout sx={{ fontSize: 17 }} />}
                onClick={handleLogout}
                sx={{
                  mt: 1.2,
                  color: '#ef4444',
                  borderRadius: "14px",
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 700,
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  boxShadow: 'inset 0 1px 1px rgba(255, 0, 0, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.16)',
                  },
                }}
              >
                Logout
              </Button>
            </Paper>
          ) : (
            <Box>
              <Stack direction="row" spacing={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setBottomNavOpen(false);
                    navigate('/login');
                  }}
                  startIcon={<LoginIcon />}
                  sx={{
                    color: isDark ? '#fff' : '#09090b',
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    borderRadius: "14px",
                    fontWeight: 700,
                    textTransform: 'none',
                    py: 1,
                  }}
                >
                  SIGN IN
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setBottomNavOpen(false);
                    navigate('/signup');
                  }}
                  startIcon={<PersonAddIcon />}
                  sx={{
                    backgroundColor: isDark ? "#ffffff" : "#09090b",
                    color: isDark ? "#09090b" : "#ffffff",
                    borderRadius: "14px",
                    fontWeight: 800,
                    textTransform: 'none',
                    py: 1,
                  }}
                >
                  Sign Up
                </Button>
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 2, borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />

          {/* Bottom Terms & Privacy Row */}
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ pt: 0.5 }}
          >
            <MuiLink
              component="button"
              onClick={() => handleRouteNavigate('/terms')}
              underline="hover"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                color: location.pathname === '/terms'
                  ? (isDark ? emeraldColor.accent : emeraldColor.light.onContainer)
                  : (isDark ? "#8b8b8b" : "#64748b"),
                fontSize: "0.78rem",
                fontWeight: location.pathname === '/terms' ? 800 : 600,
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { color: isDark ? "#ffffff" : "#09090b" },
              }}
            >
              <GavelOutlinedIcon sx={{ fontSize: 14 }} />
              Terms of Service
            </MuiLink>

            <Typography sx={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", fontSize: "0.78rem" }}>
              •
            </Typography>

            <MuiLink
              component="button"
              onClick={() => handleRouteNavigate('/privacy')}
              underline="hover"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                color: location.pathname === '/privacy'
                  ? (isDark ? emeraldColor.accent : emeraldColor.light.onContainer)
                  : (isDark ? "#8b8b8b" : "#64748b"),
                fontSize: "0.78rem",
                fontWeight: location.pathname === '/privacy' ? 800 : 600,
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { color: isDark ? "#ffffff" : "#09090b" },
              }}
            >
              <SecurityOutlinedIcon sx={{ fontSize: 14 }} />
              Privacy Policy
            </MuiLink>
          </Stack>
        </Box>
      </SwipeableDrawer>

      {/* Notifications Hub */}
      <Dialog
        fullScreen
        open={notifDialogOpen && !!user}
        onClose={handleCloseNotifDialog}
        TransitionComponent={DialogSlideTransition}
        transitionDuration={280}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? "rgba(0, 0, 0, 0.49)" : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            color: isDark ? "#f8fafc" : "#09090b",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          transition={bounceSpring}
          sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 4 },
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="h6" fontWeight={850} sx={{ color: isDark ? "#fff" : "#09090b" }}>
                My Notifications
              </Typography>
              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} new`}
                  size="small"
                  sx={{
                    backgroundColor: emeraldColor.dark.container,
                    color: emeraldColor.dark.text,
                    fontWeight: 750,
                    fontSize: "0.72rem",
                  }}
                />
              )}
            </Stack>
            <IconButton
              component={motion.button}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCloseNotifDialog}
              sx={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                color: isDark ? "#fff" : "#09090b",
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          <DialogContent sx={{ p: isMobile ? 0 : 1, display: "flex", flex: 1, overflow: "hidden" }}>
            {/* Left Notification List Panel with Dynamic Content-Aware Scroll Mask */}
            <Box
              ref={leftScrollRef}
              onScroll={handleLeftScroll}
              sx={{
                width: { xs: "100%", md: "430px" },
                height: "100%",
                backgroundColor: isMobile
                  ? "transparent"
                  : isDark
                  ? "rgba(255, 255, 255, 0.035)"
                  : "rgba(0, 0, 0, 0.025)",
                backdropFilter: isMobile ? "none" : "blur(20px)",
                WebkitBackdropFilter: isMobile ? "none" : "blur(20px)",
                overflowY: "auto",
                borderRadius: { xs: 0, md: "24px" },
                boxShadow: isMobile
                  ? "none"
                  : isDark
                  ? "inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 12px 32px rgba(0, 0, 0, 0.4)"
                  : "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 8px 24px rgba(0, 0, 0, 0.04)",
                p: { xs: 2, md: 2.5 },
                maskImage: leftMaskImage,
                WebkitMaskImage: leftMaskImage,
                transition: "mask-image 0.25s ease, -webkit-mask-image 0.25s ease",
                "&::-webkit-scrollbar": { width: "5px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)",
                  borderRadius: "999px",
                },
              }}
            >
              <AnimatePresence>
                {filterSenderId && (
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={bounceSpring}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      mb: 2,
                      borderRadius: "16px",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonOutlineIcon sx={{ color: blueColor.accent, fontSize: 18 }} />
                      <Typography variant="body2" sx={{ fontWeight: 650, color: isDark ? "#ffffff" : "#09090b" }}>
                        Filtered by sender
                      </Typography>
                    </Stack>
                    <Button
                      size="small"
                      onClick={() => setFilterSenderId(null)}
                      startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        color: isDark ? "#a1a1aa" : "#64748b",
                        textTransform: "none",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        borderRadius: "10px",
                        px: 1.2,
                        "&:hover": {
                          backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                          color: isDark ? "#ffffff" : "#09090b",
                        },
                      }}
                    >
                      Clear
                    </Button>
                  </Box>
                )}
              </AnimatePresence>

              {loadingNotifs ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
                  <CircularProgress size={30} sx={{ color: blueColor.accent }} />
                </Box>
              ) : displayedGroups.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 10 }}>
                  <Typography variant="body2" sx={{ color: isDark ? "#71717a" : "#94a3b8" }}>
                    {filterSenderId ? "No notifications from this sender." : "No notifications for you yet."}
                  </Typography>
                </Box>
              ) : (
                <motion.div
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Stack spacing={1.5}>
                    <AnimatePresence mode="popLayout">
                      {displayedGroups.map((group) => {
                        const isSelected = selectedGroup?.groupId === group.groupId;
                        const isExpandedMobile = expandedMobileGroupId === group.groupId;
                        const sender = getSenderDetails(group.senderId, group.pic, group.title);
                        const itemCount = group.items.length;
                        const latestNotif = group.items[0];

                        return (
                          <Box
                            component={motion.div}
                            layout
                            variants={cardItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            key={group.groupId}
                            onClick={() => handleSelectGroup(group)}
                            sx={{
                              p: 2,
                              borderRadius: isMobile ? 2: 4,
                              backgroundColor: isMobile
                                ? isExpandedMobile
                                  ? isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"
                                  : group.hasUnseen
                                  ? isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"
                                  : isDark ? "rgba(255, 255, 255, 0.02)" : "#f8fafc"
                                : isSelected
                                ? isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)"
                                : group.hasUnseen
                                ? isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"
                                : isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                              boxShadow: isSelected
                                ? isDark
                                  ? 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)'
                                  : 'inset 0 1px 1px rgba(255, 255, 255, 0.8)'
                                : isDark
                                ? 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)'
                                : "none",
                              cursor: "pointer",
                              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Badge
                                badgeContent={itemCount > 1 ? itemCount : 0}
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                sx={{
                                  '& .MuiBadge-badge': {
                                    backgroundColor: emeraldColor.dark.container,
                                    color: emeraldColor.dark.text,
                                    fontWeight: 800,
                                    fontSize: '0.68rem',
                                    height: 18,
                                    minWidth: 18,
                                    borderRadius: "999px",
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                  },
                                }}
                              >
                                <Avatar
                                  src={sender.photo}
                                  alt={sender.name}
                                  sx={{ width: 44, height: 44, borderRadius: 4 }}
                                />
                              </Badge>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography variant="subtitle2" fontWeight={750} noWrap sx={{ color: isDark ? "#fff" : "#09090b" }}>
                                    {sender.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: isDark ? "#71717a" : "#94a3b8", fontSize: "0.72rem" }}>
                                    {formatTimeOnly(group.timestamp)}
                                  </Typography>
                                </Stack>

                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: group.hasUnseen ? (isDark ? "#f1f5f9" : "#09090b") : (isDark ? "#8b8b8b" : "#64748b"),
                                    fontWeight: group.hasUnseen ? 650 : 400,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {latestNotif.content || latestNotif.title || "No message"}
                                </Typography>
                              </Box>
                              {group.hasUnseen && (
                                <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: emeraldColor.accent }} />
                              )}
                            </Stack>

                            {isMobile && (
                              <AnimatePresence>
                                {isExpandedMobile && (
                                  <Box
                                    component={motion.div}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={bounceSpring}
                                    sx={{ mt: 2, pt: 2, borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`, overflow: "hidden" }}
                                  >
                                    <Stack spacing={1.2}>
                                      {group.items.map((item, idx) => (
                                        <Paper
                                          component={motion.div}
                                          initial={{ opacity: 0, y: 6 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: idx * 0.03 }}
                                          key={item.id || idx}
                                          elevation={0}
                                          sx={{
                                            p: 1.5,
                                            borderRadius: 1.5,
                                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                          }}
                                        >
                                          <FormattedMessageContent content={item.content} isMobile />
                                          <Typography variant="caption" sx={{ color: isDark ? "#71717a" : "#94a3b8", fontSize: "0.7rem", ml: 1 }}>
                                            {formatTimeOnly(item.timestamp)}
                                          </Typography>
                                        </Paper>
                                      ))}
                                    </Stack>
                                  </Box>
                                )}
                              </AnimatePresence>
                            )}
                          </Box>
                        );
                      })}
                    </AnimatePresence>
                  </Stack>
                </motion.div>
              )}
            </Box>

            {/* Right Details View with Dynamic Content-Aware Scroll Mask */}
            {!isMobile && (
              <Box 
                ref={rightScrollRef}
                onScroll={handleRightScroll}
                sx={{ 
                  flex: 1, 
                  height: "100%", 
                  overflowY: "auto", 
                  p: { md: 3, lg: 4 },
                  maskImage: rightMaskImage,
                  WebkitMaskImage: rightMaskImage,
                  transition: "mask-image 0.25s ease, -webkit-mask-image 0.25s ease",
                  "&::-webkit-scrollbar": { width: "5px" },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)",
                    borderRadius: "999px",
                  },
                }}
              >
                <AnimatePresence mode="wait">
                  {selectedGroup ? (
                    (() => {
                      const sender = getSenderDetails(selectedGroup.senderId, selectedGroup.pic, selectedGroup.title);
                      return (
                        <Box
                          component={motion.div}
                          key={selectedGroup.groupId}
                          initial={{ opacity: 0, scale: 0.97, y: 12 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97, y: -10 }}
                          transition={bounceSpring}
                          sx={{ maxWidth: 780, mx: "auto" }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar
                                src={sender.photo}
                                alt={sender.name}
                                sx={{ width: 56, height: 56 }}
                              />
                              <Box>
                                <Typography variant="h6" fontWeight={850} sx={{ color: isDark ? "#fff" : "#09090b" }}>
                                  {sender.name}
                                </Typography>
                                {sender.email && (
                                  <Typography variant="caption" sx={{ color: isDark ? "#bbbbbb" : "#64748b" }}>
                                    {sender.email}
                                  </Typography>
                                )}
                              </Box>
                            </Stack>
                          </Stack>

                          <Divider sx={{ my: 2, borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />

                          <Stack spacing={1.5} sx={{ mb: 3 }}>
                            {selectedGroup.items.map((item, idx) => (
                              <Paper
                                key={item.id || idx}
                                elevation={0}
                                sx={{
                                  p: 2.2,
                                  borderRadius: 2,
                                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
                                }}
                              >
                                <FormattedMessageContent content={item.content || item.title} />
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.2 }}>
                                  <Typography variant="caption" sx={{ color: isDark ? "#71717a" : "#94a3b8", fontSize: "0.72rem" }}>
                                    {formatTimestamp(item.timestamp)}
                                  </Typography>
                                  {item.seen ? (
                                    <Chip
                                      icon={<MarkEmailReadOutlinedIcon style={{ fontSize: 12 }} />}
                                      label="Read"
                                      size="small"
                                      sx={{ height: 20, fontSize: "0.68rem" }}
                                    />
                                  ) : (
                                    <Chip
                                      icon={<MarkEmailUnreadOutlinedIcon style={{ fontSize: 12 }} />}
                                      label="New"
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: "0.68rem",
                                        backgroundColor: emeraldColor.dark.container,
                                        color: emeraldColor.dark.text,
                                        fontWeight: 750,
                                      }}
                                    />
                                  )}
                                </Stack>
                              </Paper>
                            ))}
                          </Stack>
                        </Box>
                      );
                    })()
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isDark ? "#71717a" : "#94a3b8",
                      }}
                    >
                      <Typography variant="body2">Select a notification to view details</Typography>
                    </Box>
                  )}
                </AnimatePresence>
              </Box>
            )}
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default Navbar;