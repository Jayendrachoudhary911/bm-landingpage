import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
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
  Slide,
  ListItemIcon,
  Badge,
  useScrollTrigger,
  Fade,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query, updateDoc, deleteDoc, doc, arrayUnion } from "firebase/firestore";

// 👇 NEW IMPORTS FOR FIREBASE AUTHENTICATION
import { getAuth, signOut } from "firebase/auth"; 
// 👆

import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const Navbar = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const scrolled = useScrollTrigger({ threshold: 10 });

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAtHero, setIsAtHero] = useState(true);
  const [selectedNotifGroup, setSelectedNotifGroup] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMarkAsRead = async (notif) => {
    try {
      const notifRef = doc(db, "notifications", notif.id);

      if (notif.uid) {
        // User-specific notification
        await updateDoc(notifRef, {
          read: true,
        });
      } else {
        // Global notification → add user.uid to readBy array
        await updateDoc(notifRef, {
          readBy: arrayUnion(user.uid),
        });
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector("#hero");
      if (!heroSection) return;

      const heroBottom = heroSection.getBoundingClientRect().bottom;
      setIsAtHero(heroBottom > 80); // adjust 80 for sensitivity
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenDialog = async (notif) => {
    if (!notif.read) {
      await handleMarkAsRead(notif);
    }
    setSelectedNotif(notif);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedNotif(null);
  };

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          readBy: doc.data().readBy || [],
        }))
        .filter((notif) => !notif.uid || notif.uid === user.uid);

      // ✅ Group by senderId
      const grouped = Object.values(
        data.reduce((acc, notif) => {
          const key = notif.senderId || notif.id;
          if (!acc[key]) {
            acc[key] = { ...notif, groupedMessages: [notif] };
          } else {
            acc[key].groupedMessages.push(notif);
          }
          return acc;
        }, {})
      );

      setNotifications(grouped);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);


  // 👇 UPDATED LOGOUT FUNCTION
  const handleLogout = async () => {
    handleMenuClose();
    try {
      const auth = getAuth();
      await signOut(auth);
      // Optional: Navigate to the home page or login page after successful logout
      navigate('/'); 
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Failed to log out. Please try again.");
    }
  };
  // 👆

  const isNotificationRead = (notif) =>
    notif.uid ? notif.read : notif.readBy?.includes(user.uid);


  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeOutlinedIcon /> },
    { label: 'Features', path: '#features', icon: <ExtensionOutlinedIcon /> },
    { label: 'FAQ', path: '#faq', icon: <HelpOutlineOutlinedIcon /> },
    { label: 'About Us', path: '/about', icon: <InfoOutlinedIcon /> },
    // { label: 'Download', path: '/bm-install', icon: <InfoOutlinedIcon /> },
  ];


  return (
    <Box
      sx={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "1200px",
        zIndex: 1000,
        borderRadius: "999px",
        backdropFilter: "blur(10px)",
        backgroundColor: isAtHero
          ? "transparent"
          : "rgba(0, 0, 0, 0.85)",
        boxShadow: isAtHero
          ? "none"
          : "0 8px 20px rgba(0,0,0,0.25)",
        border: isAtHero ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
        transition: "all 0.4s ease-in-out",
        py: 1,
        px: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >

      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ cursor: 'pointer', color: "#fff" }}
        onClick={() => navigate('/')}
      >
        BunkMates
      </Typography>

      {!isMobile && (
        <Stack direction="row" spacing={3} alignItems="center">
          {navLinks.map(({ label, path }) => (
            <Button
              key={label}
              href={path}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '20px',
                color: "#ffffffff",
                px: 2,
                '&:hover': { backgroundColor: '#000000ff' },
              }}
            >
              {label}
            </Button>
          ))}

        </Stack>
      )}


      {!isMobile && (
        <Stack direction="row" spacing={3} alignItems="center">
          <IconButton onClick={() => setNotifDrawerOpen(true)}>
            <Badge
              badgeContent={notifications.filter(n => !isNotificationRead(n)).length}
              color="error"
              invisible={notifications.filter(n => !isNotificationRead(n)).length === 0}
            >

              <NotificationsIcon sx={{ color: "#fff" }} />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <Avatar src={user.photoURL || ''} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1,
                    px: 1,
                    borderRadius: 4,
                    minWidth: 180,
                    background: "rgba(20, 20, 20, 0.55)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "none",
                    border: "1px solid rgba(255,255,255,0.1)",
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate('/profile');
                  }}
                  sx={{
                    px: 2,
                    py: 1.2,
                    borderRadius: 1.5,
                    color: "#e0e0e0",
                    transition: '0.2s',
                    '&:hover': {
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#909090ff" }}>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate('/terms');
                  }}
                  sx={{
                    px: 2,
                    py: 1.2,
                    borderRadius: 1.5,
                    color: "#e0e0e0",
                    transition: '0.2s',
                    '&:hover': {
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#909090ff" }}>
                    <GavelOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  Terms
                </MenuItem>

                {/* LOGOUT MENU ITEM (Desktop) */}
                <MenuItem
                  onClick={handleLogout} // Calls the updated function
                  sx={{
                    px: 2,
                    py: 1.2,
                    borderRadius: 2,
                    transition: '0.2s',
                    backgroundColor: 'rgba(255, 0, 38, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 38, 0.2)',
                      boxShadow: '0 0 10px rgba(255,0,0,0.3)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#ff5252" }}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <Typography color="#ff5252">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.3)",
                  '&:hover': { borderColor: "#90caf9", background: "rgba(144,202,249,0.1)" },
                }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(45deg, #42a5f5, #478ed1)",
                  color: "#fff",
                  '&:hover': { background: "linear-gradient(45deg, #64b5f6, #4fc3f7)" },
                }}
                onClick={() => navigate('/signup')}
              >
                Signup
              </Button>
            </Stack>
          )}

        </Stack>
      )}

      {isMobile && (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => setNotifDrawerOpen(true)}>
            <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
              <NotificationsIcon sx={{ color: "#fff" }} />
            </Badge>
          </IconButton>
          <IconButton onClick={() => setMobileDrawerOpen(true)}>
            <MenuIcon sx={{ color: "#fff" }} />
          </IconButton>

          {!user &&
            <Stack direction="row" spacing={1}>
              <Button onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/signup')}>Signup</Button>
            </Stack>
          }
        </Stack>
      )}

      {/* Mobile Drawer (Menu) */}
      <SwipeableDrawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onOpen={() => setMobileDrawerOpen(true)}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
            },
          },
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : 320,
            background: "rgba(20, 20, 20, 0.85)",
            backdropFilter: "blur(14px)",
            borderTopRightRadius: isMobile ? 0 : 16,
            borderBottomRightRadius: isMobile ? 0 : 16,
            boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#e0e0e0",
            transition: "all 0.4s ease-in-out",
          },
        }}
      >
        <Box sx={{ px: 2.5, pt: 2, pb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
            <Typography variant="h6" fontWeight={700} color="#fff">
              📂 Menu
            </Typography>
            <IconButton
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                borderRadius: 2,
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.18)",
                  transform: "rotate(90deg)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <List>
              {navLinks.map(({ label, icon, path }) => (
                <ListItem
                  button
                  key={label}
                  onClick={() => {
                    navigate(path);
                    setMobileDrawerOpen(false);
                  }}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    color: "#e0e0e0",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      color: "#fff",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#909090ff", minWidth: 36 }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

            {user && (
              <>
                <Box
                  sx={{
                    px: 2.5,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    cursor: "pointer",
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    navigate("/profile");
                  }}
                >
                  <Avatar
                    src={user.photoURL || ""}
                    alt={user.displayName}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight={600} color="#fff">
                      {user.displayName || "Anonymous"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "gray" }}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <List>
                  <ListItem
                    button
                    onClick={() => navigate("https://bunk-mates.vercel.app/terms")}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      color: "#e0e0e0",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        color: "#fff",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#909090ff", minWidth: 36 }}>
                      <GavelOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Terms" />
                  </ListItem>
                  {/* LOGOUT LIST ITEM (Mobile) */}
                  <ListItem
                    button
                    onClick={() => {
                      setMobileDrawerOpen(false); // Close drawer before logging out
                      handleLogout();
                    }}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        boxShadow: "0 0 8px rgba(255,0,0,0.2)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#ef5350", minWidth: 36 }}>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText
                      primary="Logout"
                      primaryTypographyProps={{ color: "#ef5350" }}
                    />
                  </ListItem>
                </List>
              </>
            )}

            {!user && (
              <Stack spacing={1.5} mt={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.3)",
                    "&:hover": {
                      borderColor: "#90caf9",
                      backgroundColor: "rgba(144,202,249,0.1)",
                    },
                  }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background: "linear-gradient(45deg, #42a5f5, #478ed1)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(45deg, #64b5f6, #4fc3f7)",
                    },
                  }}
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </SwipeableDrawer>



      <SwipeableDrawer
        anchor="right"
        open={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        onOpen={() => setNotifDrawerOpen(true)}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
            },
          },
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : 540,
            background: "rgba(18, 18, 18, 0.9)",
            backdropFilter: "blur(14px)",
            borderTopLeftRadius: isMobile ? 0 : 16,
            borderBottomLeftRadius: isMobile ? 0 : 16,
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#e0e0e0",
            transition: "all 0.4s ease-in-out",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight={700} color="#fff">
              🔔 Notifications
            </Typography>
            <IconButton
              onClick={() => setNotifDrawerOpen(false)}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                borderRadius: 2,
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.18)",
                  transform: "rotate(90deg)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress size={24} color="info" />
            </Box>
          ) : notifications.length > 0 ? (
            <List sx={{ display: "flex", flexDirection: "column", gap: 1.5, pr: 1 }}>
              {notifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <ListItem
                    onClick={() => {
                      // Close any open menus/drawers first
                      handleMenuClose?.();

                      // If the notification contains grouped messages (array of multiple items)
                      if (notif.groupedMessages && notif.groupedMessages.length > 1) {
                        setSelectedNotif(notif);              // main grouped notification (header)
                        setSelectedNotifGroup(notif.groupedMessages); // store the group messages
                      } else {
                        setSelectedNotif(notif);              // single notification mode
                        setSelectedNotifGroup(null);          // clear group
                      }

                      // Finally, open the bottom drawer
                      setDialogOpen(true);
                    }}

                    alignItems="flex-start"
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: isNotificationRead(notif)
                        ? "rgba(255,255,255,0.00)"
                        : "rgba(255,255,255,0.08)",
                      boxShadow: isNotificationRead(notif)
                        ? "none"
                        : "0 2px 8px rgba(255,255,255,0.08)",
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.12)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {notif.type === "chat" && notif.senderPhotoURL ? (
                        <Avatar
                          src={notif.senderPhotoURL}
                          alt={notif.senderName || "User"}
                          sx={{ width: 36, height: 36 }}
                        />
                      ) : (
                        <Badge
                          color="error"
                          variant="dot"
                          invisible={isNotificationRead(notif)}
                          overlap="circular"
                        >
                          <NotificationsActiveIcon sx={{ color: "#909090" }} fontSize="small" />
                        </Badge>
                      )}
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Box>
                          <Typography fontWeight={600} fontSize="1rem" color="#fff">
                            {notif.type === "chat"
                              ? notif.title || "New Message"
                              : notif.title}
                          </Typography>
                          <Typography
                            fontSize="0.875rem"
                            sx={{
                              color: "rgba(200,200,200,0.7)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {notif.groupedMessages?.length > 1
                              ? `${notif.groupedMessages.length} new messages`
                              : notif.content?.slice(0, 60) || ""}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {new Date(
                            notif.timestamp?.toDate?.() || notif.timestamp
                          ).toLocaleString()}
                        </Typography>
                      }
                    />

                  </ListItem>
                </motion.div>
              ))}
            </List>
          ) : (
            <Typography
              variant="body2"
              color="rgba(255,255,255,0.6)"
              mt={4}
              textAlign="center"
            >
              No notifications yet.
            </Typography>
          )}
        </Box>
      </SwipeableDrawer>

      {/* Notification Details Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Fade}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(3px)",
            },
          },
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : 560,
            height: "70vh",
            background: "rgba(18, 18, 18, 0.9)",
            backdropFilter: "blur(12px)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: "0px 8px 32px rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            transition: "all 0.4s ease-in-out",
            padding: 3,
            pt: 0,
            mx: "auto",
            color: "#e0e0e0",
          },
        }}
      >
        {/* Drawer Handle */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          />
        </Box>

        {/* Header */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#fff",
            mb: 1,
          }}
        >
          {selectedNotif?.type === "chat"
            ? selectedNotif?.senderName || "Messages"
            : selectedNotif?.title}
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: "rgba(255,255,255,0.5)", mb: 2 }}
        >
          {selectedNotif?.timestamp &&
            new Date(
              selectedNotif.timestamp.toDate?.() || selectedNotif.timestamp
            ).toLocaleString()}
        </Typography>

        {/* Body Section */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            maxHeight: "55vh",
            pr: 1,
          }}
        >
          {selectedNotifGroup ? (
            <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {selectedNotifGroup.map((msg, i) => (
                <Paper
                  key={msg.id || i}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Typography fontWeight={600} color="#fff">
                    {msg.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      mt: 0.5,
                      display: "block",
                    }}
                  >
                    {new Date(
                      msg.timestamp?.toDate?.() || msg.timestamp
                    ).toLocaleString()}
                  </Typography>
                </Paper>
              ))}
            </List>
          ) : (
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-wrap", color: "#e0e0e0" }}
            >
              {selectedNotif?.content}
            </Typography>
          )}
        </Box>

        {/* Footer - Delete Button */}
        <Box
          sx={{
            position: "fixed",
            bottom: 10,
            left: 0,
            px: 2,
            width: "100%",
          }}
        >
          <Button
            fullWidth
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              if (selectedNotifGroup) {
                selectedNotifGroup.forEach((msg) =>
                  handleDeleteNotification(msg.id)
                );
              } else {
                handleDeleteNotification(selectedNotif.id);
              }
              handleCloseDialog();
            }}
            color="error"
            variant="outlined"
            sx={{
              fontWeight: 600,
              borderRadius: 12,
              borderColor: "rgba(255,0,0,0.4)",
              backgroundColor: "rgba(255,0,0,0.1)",
              color: "#ff6b6b",
              px: 2,
              py: 1,
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#ff1744",
                color: "#fff",
                borderColor: "#ff1744",
                boxShadow: "0 0 10px rgba(255,0,0,0.3)",
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </SwipeableDrawer>


    </Box>
  );
};

export default Navbar;