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
        readBy: doc.data().readBy || [], // fallback
      }))
      .filter((notif) => {
        return !notif.uid || notif.uid === user.uid;
      });

    setNotifications(data);
    setLoading(false);
  });

  return () => unsubscribe();
}, [user?.uid]);

  const handleLogout = () => {
    handleMenuClose();
  };

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
        backgroundColor: "#ffffffb3",
        boxShadow: scrolled
          ? "0 4px 20px rgba(0,0,0,0.1)"
          : "none",
        transition: "all 0.3s ease",
        py: 1,
        px: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        BunkMate
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
      color: "#000",
      px: 2,
      '&:hover': { backgroundColor: '#f0f0f0' },
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

              <NotificationsIcon />
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
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      border: "1px solid rgba(0,0,0,0.05)",
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
      borderRadius: 1,
      transition: '0.2s',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    }}
  >
    <ListItemIcon>
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
      borderRadius: 1,
      transition: '0.2s',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    }}
  >
    <ListItemIcon>
      <GavelOutlinedIcon fontSize="small" />
    </ListItemIcon>
    Terms
  </MenuItem>

  <MenuItem
    onClick={() => {
      handleMenuClose();
      handleLogout();
    }}
    sx={{
      px: 2,
      py: 1.2,
      borderRadius: 2,
      transition: '0.2s',
        backgroundColor: '#ff002617',
      '&:hover': {
        backgroundColor: '#ffebee',
      },
    }}
  >
    <ListItemIcon>
      <Logout fontSize="small" color="error" />
    </ListItemIcon>
    <Typography color="error">Logout</Typography>
  </MenuItem>
</Menu>

            </>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/signup')}>Signup</Button>
            </Stack>
          )}
        </Stack>
      )}

      {isMobile && (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => setNotifDrawerOpen(true)}>
            <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={() => setMobileDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        
        {!user && 
          <Stack direction="row" spacing={1}>
              <Button onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/signup')}>Signup</Button>
          </Stack>
        }
        </Stack>
      )}

<SwipeableDrawer
  anchor="left"
  open={mobileDrawerOpen}
  onClose={() => setMobileDrawerOpen(false)}
  onOpen={() => setMobileDrawerOpen(true)}
  ModalProps={{
    BackdropProps: {
      sx: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        backdropFilter: "blur(2px)",
      },
    },
  }}
  sx={{
    "& .MuiDrawer-paper": {
      width: isMobile ? "100%" : 320,
      background: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(14px)",
      borderTopRightRadius: isMobile ? 0 : 16,
      borderBottomRightRadius: isMobile ? 0 : 16,
      boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.25)",
      transition: "all 0.4s ease-in-out",
    },
  }}
>
  <Box sx={{ px: 2.5, pt: 2, pb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              📂 Menu
            </Typography>
            <IconButton
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                backgroundColor: "#f0f0f0",
                borderRadius: 2,
                transition: "0.3s",
                '&:hover': {
                  backgroundColor: "#e0e0e0",
                  transform: "rotate(90deg)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

    <Divider sx={{ mb: 2 }} />

<Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
    <List>
      {navLinks.map(({label, icon, path}) => (
        <ListItem
          button
        onClick={() => {
          navigate(path);
          setMobileDrawerOpen(false);
        }}
          key={label}
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
            <ListItemIcon>{icon}</ListItemIcon>
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

    <Divider sx={{ my: 2 }} />

  {user && (
    <>
      <Box
      sx={{
        px: 2.5,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        borderRadius: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
      }}
      onClick={() => {
        setMobileDrawerOpen(false);
        navigate('/profile');
      }}
    >
      <Avatar src={user.photoURL || ''} alt={user.displayName} />
      <Box>
        <Typography variant="body1" fontWeight={600}>
          {user.displayName || "Anonymous"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user.email}
        </Typography>
      </Box>
      </Box>

      <List>
        <ListItem
          button
          onClick={() => navigate('/terms')}
          sx={{
            borderRadius: 2,
            px: 2,
            '&:hover': { backgroundColor: "rgba(0, 0, 0, 0.05)" },
          }}
        >
          <ListItemIcon><GavelOutlinedIcon /></ListItemIcon>
          <ListItemText primary="Terms" />
        </ListItem>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            px: 2,
            '&:hover': { backgroundColor: "rgba(255, 0, 0, 0.05)" },
          }}
        >
          <ListItemIcon><Logout color="error" /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </>
    )}

    {!user && (
      <Stack spacing={1.5} mt={3}>
        <Button variant="outlined" fullWidth onClick={() => navigate('/login')}>
          Login
        </Button>
        <Button variant="contained" fullWidth onClick={() => navigate('/signup')}>
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
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              backdropFilter: "blur(2px)",
            },
          },
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : 540,
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(12px)",
            borderTopLeftRadius: isMobile ? 0 : 16,
            borderBottomLeftRadius: isMobile ? 0 : 16,
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            transition: "all 0.4s ease-in-out",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              🔔 Notifications
            </Typography>
            <IconButton
              onClick={() => setNotifDrawerOpen(false)}
              sx={{
                backgroundColor: "#f0f0f0",
                borderRadius: 2,
                transition: "0.3s",
                '&:hover': {
                  backgroundColor: "#e0e0e0",
                  transform: "rotate(90deg)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress size={24} />
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
                    onClick={() => handleOpenDialog(notif)}
                    alignItems="flex-start"
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: notif.read ? "#fdfdfd00" : "#ffffffff",
                      boxShadow: notif.read ? "none" :"0 2px 6px rgba(0,0,0,0.05)",
                      transition: "0.3s",
                      '&:hover': {
                        backgroundColor: "#f0f0f0",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Badge
  color="error"
  variant="dot"
  invisible={
    notif.uid
      ? notif.read
      : notif.readBy?.includes(user.uid) // Check if user has read this global notif
  }
  overlap="circular"
>

                        <NotificationsActiveIcon fontSize="small" color="black" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box>
                          <Typography fontWeight={600} fontSize="1rem" color="text.primary">
                            {notif.title}
                          </Typography>
                          <Typography
  fontSize="0.875rem"
  color="text.secondary"
  sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
>
  {notif.content?.length > 60
    ? notif.content.slice(0, 57) + "..."
    : notif.content}
</Typography>

                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.disabled">
                          {new Date(notif.timestamp?.toDate?.() || notif.timestamp).toLocaleString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" mt={4} textAlign="center">
              No notifications yet.
            </Typography>
          )}
        </Box>
      </SwipeableDrawer>

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
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              backdropFilter: "blur(2px)",
            },
          },
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : 560,
            height: "70vh",
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(12px)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: "none",
            border: "1px solid rgba(255,255,255,0.3)",
            transition: "all 0.4s ease-in-out",
            padding: 3,
            pt: 0,
            mx: "auto"
          },
        }}
      >
        <Box
  sx={{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    mt: 2,
    mb: 3,
  }}
>
  <Box
    sx={{
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: 'grey.400',
      opacity: 0.6,
    }}
  />
</Box>

        <Typography variant="h4" sx={{ whiteSpace: 'pre-wrap', mb: 1, fontWeight: "bolder" }}>
          {selectedNotif?.title}
        </Typography>
          <Typography variant="caption" color="text.secondary" mt={0} mb={3}>
            {selectedNotif?.timestamp && new Date(selectedNotif.timestamp.toDate?.() || selectedNotif.timestamp).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
            {selectedNotif?.content}
          </Typography>
          
        <Box
        sx={{
          position: "fixed",
          bottom: 10,
          left: 0,
          px: 2,
          width: "100%"
        }}
        >
          <Button
            fullWidth
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              handleDeleteNotification(selectedNotif.id);
              handleCloseDialog();
            }}
            color="error"
            variant="outlined"
            sx={{
              fontWeight: 600,
              borderRadius: 12,
              borderColor: '#ff000067',
                backgroundColor: '#ff00000f',
              color: 'error.main',
              px: 2,
              py: 1,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'error.main',
                color: '#fff',
                borderColor: 'error.main',
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
