import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Tabs,
  Tab,
  Drawer,
  TextField,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  where,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import Cropper from "react-easy-crop";
import Navbar from '../components/Navbar';
import { useTheme } from '@mui/material/styles';

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AVATAR_SIZE = 108;

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

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const [userDoc, setUserDoc] = useState({});
  const [contributions, setContributions] = useState({
    issues: [],
    feedbacks: [],
    reports: [],
  });
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [cropDrawerOpen, setCropDrawerOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [userType, setUserType] = useState("");
  const [friendsUIDs, setFriendsUIDs] = useState([]);
  const [friendsInfo, setFriendsInfo] = useState([]);
  const [trips, setTrips] = useState([]);
  const [issues, setIssues] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [reports, setReports] = useState([]);

  // Auth state and real-time user doc fetch
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser) {
        // Real-time user doc fetch
        const userRef = doc(db, "users", authUser.uid);
        const unsubUserDoc = onSnapshot(userRef, async (userSnap) => {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserDoc(userData);
            setEditForm({ ...userData, photoURL: authUser.photoURL || userData.photoURL || "" });

            // Real-time contributions
            const issuesQ = query(collection(db, "issues"), where("uid", "==", authUser.uid));
            const feedbackQ = query(collection(db, "feedback"), where("uid", "==", authUser.uid));
            const reportsQ = query(collection(db, "reports"), where("uid", "==", authUser.uid));
            const unsubIssues = onSnapshot(issuesQ, (snap) =>
              setContributions((state) => ({
                ...state,
                issues: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
              }))
            );
            const unsubFeedback = onSnapshot(feedbackQ, (snap) =>
              setContributions((state) => ({
                ...state,
                feedbacks: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
              }))
            );
            const unsubReports = onSnapshot(reportsQ, (snap) =>
              setContributions((state) => ({
                ...state,
                reports: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
              }))
            );

            setFriendsUIDs(userData.friends || []);
            setTrips(userData.trips || []);
            setLoading(false);

            return () => {
              unsubIssues();
              unsubFeedback();
              unsubReports();
            };
          }
        });
        return () => {
          unsubUserDoc();
        };
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // Real-time friend info listeners
  useEffect(() => {
    let unsubList = [];
    setFriendsInfo([]);
    if (friendsUIDs.length === 0) return;

    friendsUIDs.forEach((uid) => {
      const unsubFriend = onSnapshot(doc(db, "users", uid), (snap) => {
        if (snap.exists()) {
          const { name, username, photoURL } = snap.data();
          setFriendsInfo((prevInfo) => {
            const filtered = prevInfo.filter(f => f.uid !== uid);
            return [...filtered, { uid, name, username, photoURL }];
          });
        }
      });
      unsubList.push(unsubFriend);
    });

    return () => {
      unsubList.forEach((unsub) => unsub());
    };
  }, [friendsUIDs]);

  useEffect(() => {
    const fetchUserTypeAndMeta = async () => {
      const auth = getAuth();
      const currUser = auth.currentUser;
      if (!currUser) return;
      const userSnap = await getDoc(doc(db, "users", currUser.uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserType(data.type || "Regular");
        if (["Dev Beta", "Beta"].includes(data.type)) {
          const issuesSnap = await getDoc(doc(db, "meta", "issues"));
          const feedbackSnap = await getDoc(doc(db, "meta", "feedback"));
          const reportsSnap = await getDoc(doc(db, "meta", "reports"));
          setIssues(issuesSnap.data()?.items || []);
          setFeedback(feedbackSnap.data()?.items || []);
          setReports(reportsSnap.data()?.items || []);
        }
      }
    };
    fetchUserTypeAndMeta();
  }, []);

  const handleEditSubmit = async () => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, editForm);
    setUserDoc(editForm);
    setEditOpen(false);
  };

  if (loading)
    return (
      <Box sx={{ mt: 14, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  if (!user)
    return (
      <Typography align="center" color="#fff">Login to view your profile</Typography>
    );

  // Tab options by user type
  const isBetaDev = ["Dev Beta", "Beta"].includes(userType);
  const tabs = isBetaDev
    ? ["Issues", "Feedbacks", "Reports", "Friends"]
    : ["Friends", "Trips"];
  const tabContents = isBetaDev
    ? [contributions.issues, contributions.feedbacks, contributions.reports, friendsInfo]
    : [friendsInfo, trips];

  return (
    <Box sx={{ minHeight: "100vh", py: 6, px: 2, background: "#000", color: "#fff" }}>
      <Navbar user={user} />
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid item xs={12} sm={4} md={3} sx={{ mx: isMobile ? "auto" : "0" }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                // Dark theme glass effect
                backdropFilter: "blur(10px)",
                background: "rgba(30, 30, 30, 0.0)", // Darker translucent background
                boxShadow: "none",
                color: "#fff",
                maxWidth: 410,
              }}
            >
              <Avatar
                src={userDoc.photoURL}
                alt={user.displayName || ""}
                sx={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  mx: "auto",
                  mb: 2,
                  border: "3px solid #4a4a4a", // Light border for visibility
                }}
              />
              <Typography variant="h6" fontWeight={600} align="center" color="white">
                {user.displayName || "No Name"}
              </Typography>
              <Typography variant="body2" color="#9a9a9aff" align="center">
                @{userDoc.username || "username"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, textAlign: "center", fontSize: 14, color: "#9a9a9a" }}
              >
                {userDoc.bio || "Add something cool about yourself!"}
              </Typography>
              {/* Stats Section */}
              <Grid
                container
                spacing={1}
                mt={2}
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                my={4}
              >
                {(isBetaDev
                  ? [
                      { label: "Issues", value: contributions.issues.length },
                      { label: "Feedbacks", value: contributions.feedbacks.length },
                      { label: "Reports", value: contributions.reports.length },
                      { label: "Friends", value: friendsInfo.length },
                    ]
                  : [
                      { label: "Friends", value: friendsInfo.length },
                      { label: "Trips", value: trips.length },
                    ]
                ).map((stat) => (
                  <Grid
                    item
                    xs={isBetaDev ? 3 : 6}
                    key={stat.label}
                    textAlign="center"
                    sx={{
                      backgroundColor: "rgba(70, 70, 70, 0.5)", // Darker stat background
                      p: 1.3,
                      borderRadius: 3,
                      width: 120
                    }}
                  >
                    <Typography fontWeight={700} color="#fff">{stat.value}</Typography>
                    <Typography variant="caption" color="#9a9a9a">
                      {stat.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Button
                fullWidth
                onClick={() => setEditOpen(true)}
                variant="outlined"
                sx={{
                  mt: 3,
                  borderRadius: 999,
                  textTransform: "none",
                  border: "1.2px solid #ffffff", // Light border
                  fontWeight: 600,
                  color: "#ffffff", // Light text
                  "&:hover": {
                    borderColor: "#bbbbbb",
                    backgroundColor: "rgba(255, 255, 255, 0.08)"
                  }
                }}
              >
                Edit Profile
              </Button>
            </Paper>
          </Grid>
          {/* Main Content */}
          <Grid item xs={12} sm={8} md={9}>
            <Paper
              elevation={3}
              sx={{
                mb: 2,
                // Dark theme glass effect for tabs
                backdropFilter: "blur(8px)",
                background: "rgba(30, 30, 30, 0.8)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                maxWidth: 610,
                overflowX: "auto",
                maxWidth: 380,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                textColor="inherit"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: theme.palette.primary.main, // Use primary color for indicator
                    height: "3px",
                    borderRadius: "3px",
                  },
                }}
                aria-label="Profile tabs"
                sx={{
                  minHeight: "48px",
                  "& .MuiTab-root": {
                    minHeight: "48px",
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    color: "#9a9a9a", // Light gray for inactive
                    transition: "all 0.3s ease",
                    px: 0
                  },
                  "& .MuiTab-root.Mui-selected": { color: "#fff"}, // White for active
                  "& .MuiTab-root:hover": {
                    color: "#fff",
                    backgroundColor: "rgba(255, 255, 255, 0.08)", // Light hover effect
                    borderRadius: "8px",
                  },
                }}
              >
                {tabs.map((label, idx) => (
                  <Tab label={label} key={label} id={`profile-tab-${idx}`}
                    aria-controls={`profile-tabpanel-${idx}`} />
                ))}
              </Tabs>
            </Paper>
            <Fade in timeout={500}>
              <Paper
                elevation={0}
                sx={{
                  p: 0,
                  borderRadius: 4,
                  // Dark theme glass effect for content area
                  backdropFilter: "blur(10px)",
                  background: "rgba(30, 30, 30, 0.9)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  maxWidth: 610,
                }}
              >
                {tabs.map((label, idx) => (
                  <TabPanel value={activeTab} index={idx} key={label} p={0}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#fff" }}>
                      {isBetaDev
                        ? ["Your Issues", "Given Feedbacks", "Your Reports", "Your Friends"][idx]
                        : ["Your Friends", "Your Trips"][idx]}
                    </Typography>
                    {tabContents[idx].length === 0 ? (
                      <Typography color="#9a9a9a"
                        sx={{ textAlign: "center", py: 4, fontSize: "0.95rem" }}>
                        No items yet.
                      </Typography>
                    ) : (isBetaDev && idx === 3) || (!isBetaDev && idx === 0) ? (
                      // FRIENDS TAB: Show detailed friend info list
                      <List sx={{ p: 0 }}>
                        {tabContents[idx]
                          .sort((a, b) => a.name?.localeCompare(b.name || '') || 0)
                          .map(friend => (
                            <ListItem key={friend.uid}>
                              <ListItemAvatar>
                                <Avatar
                                  src={friend.photoURL}
                                  alt={friend.name || friend.username}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={<Typography color="#fff">{friend.name || "No Name"}</Typography>}
                                secondary={<Typography color="#9a9a9a">@{friend.username || friend.uid}</Typography>}
                              />
                            </ListItem>
                          ))}
                      </List>
                    ) : (
                      <List>
                        {tabContents[idx].map((item, i) =>
                          isBetaDev ? (
                            // For Beta/Dev Beta issues/feedback/reports
                            <Paper key={item.id || i}
                              sx={{
                                p: 2, mb: 2, borderRadius: 3,
                                background: "rgba(50,50,50,0.95)", // Dark background for list items
                                border: "1px solid rgba(255,255,255,0.08)"
                              }}>
                              <Typography fontWeight={600} color="#fff">{item.message || "Untitled"}</Typography>
                              <Typography fontSize={14} color="#9a9a9a">
                                {item.description?.slice(0, 100) || ""}
                              </Typography>
                            </Paper>
                          ) : (
                            // Otherwise, trips list, legacy
                            <ListItem key={i}>
                              <ListItemText primary={<Typography color="#fff">{item}</Typography>} />
                            </ListItem>
                          )
                        )}
                      </List>
                    )}
                  </TabPanel>
                ))}
              </Paper>
            </Fade>
          </Grid>
        </Grid>
        {/* Edit Drawer */}
        <Drawer
          anchor="bottom"
          open={editOpen}
          onClose={() => setEditOpen(false)}
          PaperProps={{
            sx: {
              background: theme.palette.background.paper, // Use theme paper color
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxWidth: 410,
              mx: "auto"
            },
          }}
          ModalProps={{
            BackdropProps: {
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.4)", // Darker backdrop
                backdropFilter: "blur(2px)",
              },
            },
          }}
          sx={{
            "& .MuiDrawer-paper": {
              background: "rgba(30, 30, 30, 0.9)", // Darker translucent drawer
              backdropFilter: "blur(14px)",
              boxShadow: "0px -12px 32px rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.4s ease-in-out",
            },
          }}
        >
          <Box
            sx={{
              height: "80vh",
              p: 4,
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 900, letterSpacing: 0.2, color: "#fff" }}
            >
              Edit Profile
            </Typography>
            <Box
              sx={{
                background: theme.palette.primary.main,
                borderRadius: "50%",
                p: "2.5px",
                mb: 2,
              }}
            >
              <Avatar
                src={editForm.photoURL}
                sx={{
                  width: 88,
                  height: 88,
                  border: `3px solid ${theme.palette.background.paper}`, // Border with paper color
                }}
              />
            </Box>
            <Button
              variant="outlined"
              component="label"
              sx={{
                mb: 2,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                border: `1.5px solid ${"#fff"}`,
                color: "#fff",
                px: 2,
                ":hover": { background: "rgba(255, 255, 255, 0.08)", borderColor: "#fff" },
              }}
            >
              Upload Profile Picture
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
                      setCropDrawerOpen(true);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Button>
            <TextField
              label="Name"
              fullWidth
              value={editForm.name || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              margin="dense"
              sx={{ my: 1, borderRadius: 3, "& .MuiInputBase-root": { backgroundColor: "rgba(255, 255, 255, 0.05)" } }}
              InputLabelProps={{ style: { color: "#9a9a9a" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
            <TextField
              label="Username"
              fullWidth
              value={editForm.username || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, username: e.target.value })
              }
              margin="dense"
              sx={{ my: 1, borderRadius: 3, "& .MuiInputBase-root": { backgroundColor: "rgba(255, 255, 255, 0.05)" } }}
              InputLabelProps={{ style: { color: "#9a9a9a" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
            <TextField
              label="Mobile"
              fullWidth
              value={editForm.mobile || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, mobile: e.target.value })
              }
              margin="dense"
              sx={{ my: 1, borderRadius: 3, "& .MuiInputBase-root": { backgroundColor: "rgba(255, 255, 255, 0.05)" } }}
              InputLabelProps={{ style: { color: "#9a9a9a" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={3}
              value={editForm.bio || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, bio: e.target.value })
              }
              margin="dense"
              sx={{ my: 1, borderRadius: 3, "& .MuiInputBase-root": { backgroundColor: "rgba(255, 255, 255, 0.05)" } }}
              InputLabelProps={{ style: { color: "#9a9a9a" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
            <Box
              mt="auto"
              width="100%"
              display="flex"
              justifyContent="space-between"
              pt={2}
            >
              <Button
                onClick={() => setEditOpen(false)}
                sx={{
                  borderRadius: 999,
                  px: 4,
                  color: "#9a9a9a",
                  textTransform: "none",
                  background: "transparent",
                  boxShadow: "none",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                variant="contained"
                sx={{
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: 999,
                  px: 4,
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { background: theme.palette.primary.dark }
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
          {/* Image Cropper Drawer */}
          <Drawer
            anchor="bottom"
            open={cropDrawerOpen}
            onClose={() => setCropDrawerOpen(false)}
            PaperProps={{
              sx: {
                borderTopLeftRadius: 22,
                borderTopRightRadius: 22,
                background: theme.palette.background.paper,
                width: 410,
                mx: "auto"
              },
            }}
            ModalProps={{
              BackdropProps: {
                sx: {
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(2px)",
                },
              },
            }}
            sx={{
              "& .MuiDrawer-paper": {
                background: "rgba(30, 30, 30, 0.9)",
                backdropFilter: "blur(14px)",
                boxShadow: "0px -12px 32px rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.4s ease-in-out",
              },
            }}
          >
            <Box sx={{ minHeight: "55vh", p: 3, color: "#fff" }}>
              <Typography
                variant="h6"
                mb={2}
                fontWeight={800}
                textAlign="center"
                color={"#fff"}
              >
                Crop Profile Picture
              </Typography>
              {imagePreview && (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 350,
                    mx: "auto",
                    height: 270,
                    backgroundColor: theme.palette.grey[900] // Dark background for cropper
                  }}
                >
                  <Cropper
                    image={imagePreview}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, croppedPixels) =>
                      setCroppedAreaPixels(croppedPixels)
                    }
                  />
                </Box>
              )}
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  sx={{
                    background: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: 999,
                    px: 4,
                    fontWeight: 600,
                    "&:hover": { background: theme.palette.primary.dark }
                  }}
                  onClick={async () => {
                    const cropped = await getCroppedImg(
                      imagePreview,
                      croppedAreaPixels
                    );
                    setEditForm((prev) => ({
                      ...prev,
                      photoURL: cropped,
                    }));
                    setCropDrawerOpen(false);
                  }}
                >
                  Done
                </Button>
              </Box>
            </Box>
          </Drawer>
        </Drawer>
      </Container>
    </Box>
  );
};

export default ProfilePage;