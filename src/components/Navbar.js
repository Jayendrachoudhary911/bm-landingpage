import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from "@mui/icons-material/Close";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query, where, doc, getDoc, writeBatch } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth"; 
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// Spring transitions
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
      staggerChildren: 0.045,
      delayChildren: 0.02,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: bounceSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -8,
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
                color: "#38bdf8",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                wordBreak: "break-all",
                "&:hover": { color: "#60a5fa" },
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

const Navbar = ({ user }) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const [authAnchorEl, setAuthAnchorEl] = useState(null);
  const [notifDialogOpen, setNotifDialogOpen] = useState(false);
  const [bottomNavOpen, setBottomNavOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [senderProfiles, setSenderProfiles] = useState({});
  const [currentUserDbData, setCurrentUserDbData] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filterSenderId, setFilterSenderId] = useState(null);
  const [expandedMobileGroupId, setExpandedMobileGroupId] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isAuthMenuOpen = Boolean(authAnchorEl);
  const handleAuthMenuOpen = (e) => setAuthAnchorEl(e.currentTarget);
  const handleAuthMenuClose = () => setAuthAnchorEl(null);

  const handleCloseNotifDialog = () => {
    setNotifDialogOpen(false);
    setFilterSenderId(null);
    setExpandedMobileGroupId(null);
  };

  // Live listener for logged-in user's Firestore profile doc
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

  // ScrollSpy and Scroll-depth listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          // Toggle scroll state when threshold passed
          setIsScrolled(scrollY > 20);

          if (location.pathname !== '/') {
            setActiveSection(location.pathname === '/about' ? 'about-page' : '');
            ticking = false;
            return;
          }

          const sections = [
            { id: 'hero', name: 'home' },
            { id: 'about', name: 'about' },
            { id: 'features', name: 'features' },
            { id: 'faq', name: 'faq' },
            { id: 'contact', name: 'contact' },
          ];

          const scrollPosition = scrollY + 200;
          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i].id);
            if (el && scrollPosition >= el.offsetTop) {
              setActiveSection(sections[i].name);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Firestore Notifications Listener
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

  // Group notifications within a 10-minute time range
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

  const handleNavClick = (sectionId, path) => {
    setBottomNavOpen(false);
    if (path && path.startsWith('/about')) {
      navigate('/about');
      return;
    }

    if (location.pathname !== '/') {
      navigate('/' + (sectionId ? `#${sectionId}` : ''));
      return;
    }

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { label: 'Home', section: 'home', icon: <HomeOutlinedIcon /> },
    { label: 'About', section: 'about', icon: <InfoOutlinedIcon /> },
    { label: 'Features', section: 'features', icon: <ExtensionOutlinedIcon /> },
    { label: 'FAQ', section: 'faq', icon: <HelpOutlineIcon /> },
    { label: 'Contact', section: 'contact', icon: <MailOutlineIcon /> },
  ];

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

  return (
    <>
      {/* Floating Glass Navbar */}
      <Box
        component={motion.header}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={bounceSpring}
        sx={{
          position: "fixed",
          top: { xs: 12, md: 18 },
          left: 0,
          right: 0,
          mx: "auto",
          width: { xs: "94%", md: "96%" },
          maxWidth: "1350px",
          zIndex: 1000,
          borderRadius: "999px",
          backgroundColor: "transparent",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          border: "1px solid transparent",
          boxShadow: "none",
          py: { xs: 0.8, md: 1 },
          px: { xs: 2, sm: 3 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transform: "translateZ(0)",
          transition: "background-color 0.3s ease, border 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease",
        }}
      >
        {/* Brand Logo */}
        <Box
          component={motion.div}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => handleNavClick('home')}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            userSelect: 'none',
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: "#ffffff",
              letterSpacing: '-0.5px',
              fontSize: { xs: '1.05rem', sm: '1.2rem' },
            }}
          >
            BunkMates
          </Typography>
        </Box>

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{
              backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0)",
              backdropFilter: isScrolled ? "blur(10px)" : "none",
              boxShadow: isScrolled ? "inset 0 1px 1px rgba(255, 255, 255, 0.11), inset 0 -1px 1px rgba(255, 255, 255, 0.07), 0 1px 0px rgba(0,0,0,0.1)" : "none",
              p: 0.5,
              borderRadius: "999px",
              transition: "background-color 0.3s ease, border 0.3s ease",
            }}
          >
            <LayoutGroup id="desktopNav">
              {navLinks.map(({ label, section }) => {
                const isActive = activeSection === section;
                return (
                  <Box
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={label}
                    onClick={() => handleNavClick(section)}
                    sx={{
                      position: "relative",
                      px: 2,
                      py: 0.6,
                      borderRadius: "999px",
                      cursor: "pointer",
                      userSelect: "none",
                      zIndex: 1,
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 999,
                          background: "linear-gradient(135deg, rgba(245, 245, 245, 0.28), rgba(106, 106, 106, 0.28))",
                          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                          zIndex: -1,
                        }}
                        transition={bounceSpring}
                      />
                    )}
                    <Typography
                      variant="body2"
                      fontWeight={isActive ? 700 : 500}
                      sx={{
                        color: isActive ? "#ffffff" : "#8b8b8b",
                        fontSize: "0.9rem",
                        transition: "color 0.2s ease",
                        "&:hover": { color: "#ffffff" },
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                );
              })}
            </LayoutGroup>
          </Stack>
        )}

        {/* Right Header Action Items */}
        <Stack direction="row" spacing={1.2} alignItems="center">
          {user && (
            <Tooltip title="Notifications" arrow>
              <IconButton
                component={motion.button}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setNotifDialogOpen(true);
                  if (groupedNotifications.length > 0 && !selectedGroup) {
                    setSelectedGroup(groupedNotifications[0]);
                  }
                }}
                sx={{
                  color: "#f8fafc",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(16px)",
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                  width: { xs: 36, md: 38 },
                  height: { xs: 36, md: 38 },
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.16)" },
                }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon sx={{ fontSize: { xs: 18, md: 19 } }} />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* User Profile Avatar Trigger */}
          {user ? (
            <IconButton
              component={motion.button}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={isMobile ? () => setBottomNavOpen(true) : handleAuthMenuOpen}
              sx={{ p: 0.3 }}
            >
              <Avatar
                src={userPhoto}
                alt={userDisplayName}
                sx={{
                  width: { xs: 36, md: 36 },
                  height: { xs: 36, md: 36 },
                  border: '2px solid #383838',
                  boxShadow: 'none',
                }}
              />
            </IconButton>
          ) : (
            <Button
              component={motion.button}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              variant="contained"
              size="small"
              onClick={isMobile ? () => setBottomNavOpen(true) : handleAuthMenuOpen}
              endIcon={
                !isMobile && (
                  <motion.span
                    animate={{ rotate: isAuthMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <KeyboardArrowDownIcon />
                  </motion.span>
                )
              }
              sx={{
                background: "linear-gradient(135deg, #ffffff31, #ffffff3c)",
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                color: "#fff",
                px: { xs: 1.6, md: 2 },
                py: 0.6,
                borderRadius: "999px",
                backdropFilter: "blur(10px)",
                fontWeight: 600,
                textTransform: "none",
                fontSize: { xs: "0.82rem", md: "0.875rem" },
                "&:hover": {
                  background: "linear-gradient(135deg, #ffffff5c, #ffffff50)",
                },
              }}
            >
              Menu
            </Button>
          )}
        </Stack>

        {/* Desktop Dropdown Menu */}
        {!isMobile && (
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
              initial: { opacity: 0, scale: 0.9, y: -10 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.9, y: -10 },
              transition: bounceSpring,
              sx: {
                p: 1,
                borderRadius: 2,
                minWidth: 230,
                background: "rgba(0, 0, 0, 0.28)",
                backdropFilter: "blur(24px)",
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), inset 0 -1px 1px rgba(255, 255, 255, 0.07), 0 1px 0px rgba(0,0,0,0.1)',
                color: "#f8fafc",
              },
            }}
          >
            {user ? (
              <>
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ color: "#fff" }} noWrap>
                    {userDisplayName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }} noWrap display="block">
                    {user.email}
                  </Typography>
                </Box>
                <Divider sx={{ my: 0.8, borderColor: "rgba(255,255,255,0.08)" }} />
                <MenuItem
                  component={motion.li}
                  whileHover={{ x: 0 }}
                  onClick={() => {
                    handleAuthMenuClose();
                    navigate('/profile');
                  }}
                  sx={{ px: 2, py: 1.2, borderRadius: 2, "&:hover": { boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)', background: "rgba(255,255,255,0.08)" } }}
                >
                  <ListItemIcon sx={{ color: "#38bdf8" }}>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  Profile Details
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  component={motion.li}
                  whileHover={{ x: 0 }}
                  onClick={() => {
                    handleAuthMenuClose();
                    navigate('/login');
                  }}
                  sx={{ px: 2, py: 1.2, borderRadius: 2, "&:hover": { boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)', background: "rgba(255,255,255,0.08)" } }}
                >
                  <ListItemIcon sx={{ color: "#ffffff" }}>
                    <LoginIcon fontSize="small" />
                  </ListItemIcon>
                  Log In
                </MenuItem>
                <MenuItem
                  component={motion.li}
                  whileHover={{ x: 0 }}
                  onClick={() => {
                    handleAuthMenuClose();
                    navigate('/signup');
                  }}
                  sx={{ px: 2, py: 1.2, borderRadius: 2, "&:hover": { boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)', background: "rgba(255,255,255,0.08)" } }}
                >
                  <ListItemIcon sx={{ color: "#ffffff" }}>
                    <PersonAddIcon fontSize="small" />
                  </ListItemIcon>
                  Sign Up
                </MenuItem>
              </>
            )}

            <Divider sx={{ my: 0.8, borderColor: "rgba(255,255,255,0.08)" }} />

            <MenuItem
              component={motion.li}
              whileHover={{ x: 0 }}
              onClick={() => {
                handleAuthMenuClose();
                navigate('/terms');
              }}
              sx={{ px: 2, py: 1.2, borderRadius: 2, "&:hover": { boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)', background: "rgba(255,255,255,0.08)" } }}
            >
              <ListItemIcon sx={{ color: "#94a3b8" }}>
                <GavelOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Terms of Service
            </MenuItem>

            <MenuItem
              component={motion.li}
              whileHover={{ x: 0 }}
              onClick={() => {
                handleAuthMenuClose();
                navigate('/privacy');
              }}
              sx={{ px: 2, py: 1.2, borderRadius: 2, "&:hover": { boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)', background: "rgba(255,255,255,0.08)" } }}
            >
              <ListItemIcon sx={{ color: "#94a3b8" }}>
                <SecurityOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Privacy Policy
            </MenuItem>

            <MenuItem
              component={motion.li}
              whileHover={{ x: 0 }}
              onClick={() => {
                handleAuthMenuClose();
                navigate('/community-guidelines');
              }}
              sx={{ px: 2, py: 1.2, borderRadius: 2, "&:hover": { boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)', background: "rgba(255,255,255,0.08)" } }}
            >
              <ListItemIcon sx={{ color: "#94a3b8" }}>
                <PolicyOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Community Guidelines
            </MenuItem>

            {user && (
              <>
                <Divider sx={{ my: 0.8, borderColor: 'rgba(255,255,255,0.08)' }} />
                <MenuItem
                  component={motion.li}
                  whileHover={{ x: 0 }}
                  onClick={handleLogout}
                  sx={{
                    px: 2,
                    py: 1.2,
                    borderRadius: 2,
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    background: "rgba(239, 68, 68, 0.08)",
                    "&:hover": { backgroundColor: 'rgba(239, 68, 68, 0.18)' },
                  }}
                >
                  <ListItemIcon sx={{ color: "#ef4444" }}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <Typography color="#ef4444" fontWeight={600}>Logout</Typography>
                </MenuItem>
              </>
            )}
          </Menu>
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
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(10px)",
            },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "36px",
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(28px)",
            borderBottom: "none",
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
            p: 3,
            pb: 5,
            m: 2,
            maxHeight: "90vh",
            overflowY: "auto",
            color: "#f8fafc",
          },
        }}
      >
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          {/* Handle */}
<Box
  sx={{
    width: 36,
    height: 4,
    borderRadius: 10,
    bgcolor: "rgba(255, 255, 255, 0.25)",
    mx: "auto",
    mt: 0,
    mb: 2,
    cursor: "grab",
  }}
/>

          {/* 1. App Navigation Section */}
          <Typography variant="caption" sx={{ color: '#8b8b8b', fontWeight: 700, px: 1, letterSpacing: 0.8, textTransform: 'uppercase' }}>
            Navigation
          </Typography>

          <List sx={{ width: '100%', py: 1 }}>
            {navLinks.map(({ label, section, icon }, idx) => {
              const isActive = activeSection === section;
              return (
                <ListItem
                  button
                  component={motion.div}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + idx * 0.03, ...liquidSpring }}
                  whileTap={{ scale: 0.96 }}
                  key={label}
                  onClick={() => handleNavClick(section)}
                  sx={{
                    px: 2,
                    py: 1.2,
                    borderRadius: 3,
                    mb: 0.8,
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    boxShadow: `${isActive ? 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)' : 'none'}`,
                    color: isActive ? '#ffffff' : '#8b8b8b',
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#ffffff' : '#8b8b8b', minWidth: 40 }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  />
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* 2. Account & Profile Section */}
          <Typography variant="caption" sx={{ color: '#8b8b8b', fontWeight: 700, px: 1, letterSpacing: 0.8, textTransform: 'uppercase', mb: 1 }}>
            Account & Profile
          </Typography>

          {user ? (
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={liquidSpring}
              elevation={0}
              sx={{
                background: 'rgba(0, 0, 0, 0)',
                mb: 2,
              }}
            >
              {/* Profile Link Header Card */}
              <Box
                component={motion.div}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setBottomNavOpen(false);
                  navigate('/profile');
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 2.5,
                  background: 'rgba(255, 255, 255, 0)',
                  transition: 'background 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Avatar
                  src={userPhoto}
                  alt={userDisplayName}
                  sx={{
                    width: 48,
                    height: 48,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={800} noWrap sx={{ color: '#fff' }}>
                    {userDisplayName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#aeaeae' }} noWrap display="block">
                    {user.email}
                  </Typography>
                </Box>
                <ChevronRightIcon sx={{ color: '#ffffffa2', backgroundColor: '#f1f1f111', boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)', p: 0.7, borderRadius: '50%', fontSize: 42 }} />
              </Box>

              {/* Dedicated Logout Button */}
              <Button
                size="small"
                fullWidth
                variant="contained"
                color="error"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{
                  mt: 1.2,
                  color: '#ef4444',
                  borderRadius: 2.5,
                  py: 0.8,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: 'inset 0 1px 1px rgba(225, 118, 118, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                  background: 'rgba(239, 68, 68, 0.06)',
                  '&:hover': {
                    borderColor: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.15)',
                  },
                }}
              >
                Logout
              </Button>
            </Paper>
          ) : (
            <Box sx={{ mb: 2 }}>
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
                    color: '#fff',
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Log In
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
                    background: 'linear-gradient(135deg, #ffffff, #c8c8c8)',
                    boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    color: '#000000',
                    borderRadius: 3,
                    fontWeight: 700,
                    textTransform: 'none',
                  }}
                >
                  Sign Up
                </Button>
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.06)' }} />

          {/* 3. Legal & Guidelines Section */}
          <Typography variant="caption" sx={{ color: '#8b8b8b', fontWeight: 700, px: 1, letterSpacing: 0.8, textTransform: 'uppercase' }}>
            Legal & Guidelines
          </Typography>

<Stack 
  direction="row" 
  spacing={1} 
  sx={{ 
    mt: 1.2, 
    flexWrap: 'wrap', 
    gap: 0.6
  }}
>
  {[
    {
      label: 'Terms',
      icon: <GavelOutlinedIcon sx={{ height: '5px !important' }} />,
      path: '/terms',
    },
    {
      label: 'Privacy',
      icon: <SecurityOutlinedIcon sx={{ height: '5px !important' }} />,
      path: '/privacy',
    },
    {
      label: 'Guidelines',
      icon: <PolicyOutlinedIcon sx={{ height: '5px !important' }} />,
      path: '/community-guidelines',
    },
  ].map(({ label, icon, path }) => (
    <Chip
      key={label}
      component={motion.div}
      whileHover={{ 
        scale: 1.04, 
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      icon={React.cloneElement(icon, {
        sx: { 
          color: '#8b8b8b !important',
          transition: 'transform 0.2s ease',
        }
      })}
      label={label}
      clickable
      onClick={() => {
        setBottomNavOpen(false);
        navigate(path);
      }}
      sx={{
        py: 2.4,
        px: 0.5,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(12px)',
        color: '#cbd5e1',
        fontWeight: 600,
        fontSize: '0.85rem',
        letterSpacing: '0.2px',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        '& .MuiChip-label': {
          px: 1,
        },
        '&:hover': {
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(255, 255, 255, 0.2)',
        },
      }}
    />
  ))}
</Stack>
        </Box>
      </SwipeableDrawer>

      {/* Full-Page Grouped Notification Hub */}
<Dialog
        fullScreen
        open={notifDialogOpen && !!user}
        onClose={handleCloseNotifDialog}
        TransitionComponent={DialogSlideTransition}
        transitionDuration={280}
        PaperProps={{
          sx: {
            background: "rgba(0, 0, 0, 0.27)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            color: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              borderRadius: "999px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.35)",
            },
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.25) transparent",
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
          {/* Top Header */}
          <Box
            sx={{
              px: { xs: 2, md: 4 },
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              zIndex: 10,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography sx={{ color: "#ffffff" }}>🔔</Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: "#fff" }}>
                My Notifications
              </Typography>
              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} new`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                    color: "#ffffff",
                    fontWeight: 600,
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
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                color: "#fff",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.18)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Master-Detail Content */}
          <DialogContent sx={{ p: 0, display: "flex", flex: 1, overflow: "hidden" }}>
            {/* Left Notification List Panel with Linear Gradient Scroll Mask */}
            <Box
              sx={{
                width: { xs: "100%", md: "430px" },
                borderRight: { xs: "none", md: "1px solid rgba(255, 255, 255, 0.08)" },
                height: "100%",
                overflowY: "auto",
                p: { xs: 2, md: 3 },
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)",
                maskImage: "linear-gradient(to bottom, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)",
                "&::-webkit-scrollbar": {
                  width: "5px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
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
                      borderRadius: 2.5,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                      overflow: "hidden",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonOutlineIcon sx={{ color: "#ffffff", fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: "#ffffff", fontWeight: 600 }}>
                        Filtered by sender
                      </Typography>
                    </Stack>
                    <Button
                      size="small"
                      onClick={() => setFilterSenderId(null)}
                      startIcon={<ArrowBackIcon />}
                      sx={{ color: "#8b8b8b", textTransform: "none", fontSize: "0.8rem",
                      "&:hover" : {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                      } 
                    }}
                    >
                      Clear
                    </Button>
                  </Box>
                )}
              </AnimatePresence>

              {loadingNotifs ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
                  <CircularProgress size={32} sx={{ color: "#38bdf8" }} />
                </Box>
              ) : displayedGroups.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 10 }}>
                  <Typography variant="body1" sx={{ color: "#64748b" }}>
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
                              borderRadius: 1.5,
                              backgroundColor:
                                isMobile
                                  ? isExpandedMobile
                                    ? "rgba(255, 255, 255, 0.09)"
                                    : group.hasUnseen
                                    ? "rgba(255, 255, 255, 0.08)"
                                    : "rgba(255, 255, 255, 0.03)"
                                  : isSelected
                                  ? "rgba(255, 255, 255, 0.1)"
                                  : group.hasUnseen
                                  ? "rgba(255, 255, 255, 0.08)"
                                  : "rgba(255, 255, 255, 0)",
                              boxShadow: isSelected && !isMobile ? 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)' : isMobile ? "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)" : "none",
                              cursor: "pointer",
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
<Badge
  badgeContent={itemCount > 1 ? itemCount : 0}
  overlap="circular"
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  sx={{
    '& .MuiBadge-badge': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: '0.7rem',
      height: 20,
      minWidth: 20,
      px: 0.6,
      borderRadius: '999px',
      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
    },
  }}
>
                                <Avatar
                                  src={sender.photo}
                                  alt={sender.name}
                                  sx={{ width: 44, height: 44, border: "0px solid rgba(56, 189, 248, 0.4)" }}
                                />
                              </Badge>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ color: "#fff" }}>
                                    {sender.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "#6b6b6b", fontSize: "0.72rem" }}>
                                    {formatTimeOnly(group.timestamp)}
                                  </Typography>
                                </Stack>

                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: group.hasUnseen ? "#f1f5f9" : "#8b8b8b",
                                    fontWeight: group.hasUnseen ? 600 : 400,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {latestNotif.content || latestNotif.title || "No message"}
                                </Typography>
                                {itemCount > 1 && (
                                  <Chip
                                    label={`${itemCount} messages (10m bundle)`}
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: "0.68rem",
                                      mt: 0.5,
                                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                                      color: "#ffffff",
                                    }}
                                  />
                                )}
                              </Box>
                              {group.hasUnseen && (
                                <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#6abcff" }} />
                              )}
                            </Stack>

                            {/* Mobile Inline Expansion */}
                            {isMobile && (
                              <AnimatePresence>
                                {isExpandedMobile && (
                                  <Box
                                    component={motion.div}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={bounceSpring}
                                    sx={{ mt: 2, pt: 2, borderTop: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}
                                  >
                                    <Typography variant="caption" sx={{ color: "#8b8b8b", fontWeight: 700, mb: 1, display: "block" }}>
                                      Messages from this 10-minute batch:
                                    </Typography>
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
                                            borderRadius: 0.8,
                                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                          }}
                                        >
                                          <FormattedMessageContent content={item.content} isMobile />
                                          <Typography variant="caption" sx={{ color: "#8b8b8b", fontSize: "0.7rem" }}>
                                            {formatTimeOnly(item.timestamp)}
                                          </Typography>
                                        </Paper>
                                      ))}
                                    </Stack>

                                    {group.senderId && (
                                      <Button
                                        fullWidth
                                        size="small"
                                        variant="contained"
                                        startIcon={<ForumOutlinedIcon />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFilterSenderId(group.senderId);
                                        }}
                                        sx={{
                                          mt: 2,
                                          display: selectedGroup.type == 'contact' ? "none" : "flex",
                                          flexDirecton: 'row',
                                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                                          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                                          color: "#ffffff",
                                          textTransform: "none",
                                          borderRadius: 2,
                                        }}
                                      >
                                        Show all messages from {sender.name}
                                      </Button>
                                    )}
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

            {/* Right Panel: Detailed Conversation Stream with Linear Gradient Scroll Mask */}
            {!isMobile && (
              <Box 
                sx={{ 
                  flex: 1, 
                  height: "100%", 
                  overflowY: "auto", 
                  p: { md: 3, lg: 4 },
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)",
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)",
                  "&::-webkit-scrollbar": {
                    width: "5px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
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
                          initial={{ opacity: 0, scale: 0.96, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96, y: -12 }}
                          transition={bounceSpring}
                          sx={{
                            maxWidth: 780,
                            mx: "auto",
                            p: 3.5,
                            borderRadius: 4,
                            backgroundColor: "rgba(255, 255, 255, 0)",
                            transform: "translateZ(0)",
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2.5 }}>
                            <Stack direction="row" spacing={2.5} alignItems="center">
                              <Avatar
                                src={sender.photo}
                                alt={sender.name}
                                sx={{
                                  width: 62,
                                  height: 62,
                                }}
                              />
                              <Box>
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", spacing: 3, width: 300 }}>
                                  <Typography variant="h6" fontWeight={800} sx={{ color: "#fff" }}>
                                    {sender.name}
                                  </Typography>
                                  <Chip
                                    icon={<ChatBubbleOutlineIcon style={{ fontSize: 12 }} />}
                                    label={selectedGroup.type}
                                    size="small"
                                    sx={{
                                      height: 22,
                                      px: 1,
                                      fontSize: "0.75rem",
                                      textTransform: "uppercase",
                                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                                      color: "#ffffff",
                                      ml: 2,
                                    }}
                                  />
                                </Box>

                                {sender.email && (
                                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.3 }}>
                                    <EmailOutlinedIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
                                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                      {sender.email}
                                    </Typography>
                                  </Stack>
                                )}
                              </Box>
                            </Stack>

                            <Tooltip title="Close conversation view" arrow>
                              <IconButton
                                component={motion.button}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedGroup(null)}
                                sx={{
                                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                                  color: "#94a3b8",
                                  "&:hover": { color: "#fff", backgroundColor: "rgba(255, 255, 255, 0.1)" },
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>

                          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />

                          <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#bfbfbf", mb: 1.5 }}>
                            Grouped Messages in this 10-Minute Batch ({selectedGroup.items.length})
                          </Typography>

                          <Stack spacing={1.5} sx={{ mb: 3 }}>
                            {selectedGroup.items.map((item, idx) => (
                              <Paper
                                component={motion.div}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04, duration: 0.2 }}
                                key={item.id || idx}
                                elevation={0}
                                sx={{
                                  p: 2.2,
                                  borderRadius: 1.5,
                                  backgroundColor: "rgba(255, 255, 255, 0.09)",
                                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                                }}
                              >
                                <FormattedMessageContent content={item.content || item.title} />
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                                  <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.72rem" }}>
                                    {formatTimestamp(item.timestamp)}
                                  </Typography>
                                  {item.seen ? (
                                    <Chip
                                      icon={<MarkEmailReadOutlinedIcon style={{ fontSize: 12 }} />}
                                      label="Read"
                                      size="small"
                                      sx={{ height: 18, fontSize: "0.65rem", backgroundColor: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
                                    />
                                  ) : (
                                    <Chip
                                      icon={<MarkEmailUnreadOutlinedIcon style={{ fontSize: 12 }} />}
                                      label="New"
                                      size="small"
                                      sx={{ height: 18, fontSize: "0.65rem", backgroundColor: "rgba(56, 189, 248, 0.2)", color: "#38bdf8" }}
                                    />
                                  )}
                                </Stack>
                              </Paper>
                            ))}
                          </Stack>

                          {activeSenderAllMessages.length > selectedGroup.items.length && (
                            <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px dashed rgba(255,255,255,0.12)" }}>
                              <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#8b8b8b", mb: 1.5 }}>
                                All Historical Messages from {sender.name} ({activeSenderAllMessages.length})
                              </Typography>
                              <Stack 
                                spacing={1} 
                                sx={{ 
                                  maxHeight: 220, 
                                  overflowY: "auto", 
                                  pr: 0.5,
                                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14px, black calc(100% - 14px), transparent 100%)",
                                  maskImage: "linear-gradient(to bottom, transparent 0%, black 14px, black calc(100% - 14px), transparent 100%)",
                                }}
                              >
                                {activeSenderAllMessages.map((histItem) => (
                                  <Paper
                                    key={histItem.id}
                                    elevation={0}
                                    sx={{
                                      p: 1.5,
                                      borderRadius: 1.5,
                                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                                      border: "1px solid rgba(255, 255, 255, 0.05)",
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
                                      {histItem.content}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.68rem", display: "block", mt: 0.4 }}>
                                      {formatTimestamp(histItem.timestamp)}
                                    </Typography>
                                  </Paper>
                                ))}
                              </Stack>
                            </Box>
                          )}

                          <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 2 }}>
                            {selectedGroup.senderId && (
                              <Button
                                component={motion.button}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                variant="contained"
                                onClick={() => setFilterSenderId(selectedGroup.senderId)}
                                startIcon={<PersonOutlineIcon />}
                                sx={{
                                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                                  color: "#ffffff",
                                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                                  borderRadius: 2.5,
                                  textTransform: "none",
                                  "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                  },
                                }}
                              >
                                Filter notifications list by {sender.name}
                              </Button>
                            )}
                          </Box>
                        </Box>
                      );
                    })()
                  ) : (
                    <Box
                      component={motion.div}
                      key="no-selection"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8b8b8b",
                      }}
                    >
                      <Typography variant="body1">Select a notification bundle to view conversation details</Typography>
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