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
import { useCustomTheme } from "../context/ThemeContext";

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
  const muiTheme = useTheme();
  const { isDark, gradients } = useCustomTheme();
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
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
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

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);
        const unsubUserDoc = onSnapshot(userRef, async (userSnap) => {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserDoc(userData);
            setEditForm({ ...userData, photoURL: authUser.photoURL || userData.photoURL || "" });

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
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "#000" : "#f8fafc" }}>
        <CircularProgress color="primary" />
      </Box>
    );

  if (!user)
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "#000" : "#f8fafc" }}>
        <Typography align="center" color={isDark ? "#fff" : "#0f172a"}>
          Please log in to view your profile.
        </Typography>
      </Box>
    );

  const isBetaDev = ["Dev Beta", "Beta"].includes(userType);
  const tabs = isBetaDev
    ? ["Issues", "Feedbacks", "Reports", "Friends"]
    : ["Friends", "Trips"];
  const tabContents = isBetaDev
    ? [contributions.issues, contributions.feedbacks, contributions.reports, friendsInfo]
    : [friendsInfo, trips];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 8,
        backgroundColor: isDark ? "#000000" : "#f8fafc",
        color: isDark ? "#fff" : "#0f172a",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Navbar user={user} />

      {/* Signature Header Gradient Backdrop */}
      <Box
        sx={{
          height: { xs: "260px", sm: "320px" },
          width: "100%",
          background: isDark ? gradients.headerDark : gradients.headerLight,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          position: "relative",
          boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.08)",
        }}
      />

      <Container maxWidth="lg" sx={{ mt: { xs: -12, sm: -14 }, position: "relative", zIndex: 10 }}>
        <Grid container spacing={4}>
          {/* Sidebar Card */}
          <Grid item xs={12} sm={4} md={3.5} sx={{ mx: isMobile ? "auto" : "0" }}>
            <Paper
              elevation={4}
              sx={{
                p: 3.5,
                borderRadius: 4,
                backdropFilter: "blur(20px)",
                background: isDark ? "rgba(15, 23, 42, 0.88)" : "rgba(255, 255, 255, 0.94)",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
                boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.6)" : "0 20px 40px rgba(0,0,0,0.06)",
                color: isDark ? "#fff" : "#0f172a",
                textAlign: "center",
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
                  border: "4px solid #38bdf8",
                  boxShadow: "0 8px 25px rgba(56, 189, 248, 0.3)",
                }}
              />
              <Typography variant="h5" fontWeight={700} sx={{ color: isDark ? "#fff" : "#0f172a" }}>
                {user.displayName || "No Name"}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? "#38bdf8" : "#0284c7", fontWeight: 600, mt: 0.5 }}>
                @{userDoc.username || "username"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1.5, fontSize: "0.9rem", color: isDark ? "#94a3b8" : "#64748b", lineHeight: 1.6 }}
              >
                {userDoc.bio || "No bio yet. Add something cool about yourself!"}
              </Typography>

              {/* Stats Section */}
              <Grid container spacing={1.5} my={3} justifyContent="center">
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
                  >
                    <Box
                      sx={{
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                        p: 1.5,
                        borderRadius: 3,
                        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"}`,
                      }}
                    >
                      <Typography fontWeight={800} sx={{ color: isDark ? "#fff" : "#0f172a", fontSize: "1.1rem" }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Button
                fullWidth
                onClick={() => setEditOpen(true)}
                variant="outlined"
                sx={{
                  borderRadius: "999px",
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)",
                  color: isDark ? "#ffffff" : "#0f172a",
                  "&:hover": {
                    borderColor: "#38bdf8",
                    backgroundColor: "rgba(56, 189, 248, 0.08)",
                  },
                }}
              >
                Edit Profile
              </Button>
            </Paper>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} sm={8} md={8.5}>
            <Paper
              elevation={2}
              sx={{
                mb: 2.5,
                borderRadius: 4,
                backdropFilter: "blur(16px)",
                background: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.9)",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                p: 0.8,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                textColor="inherit"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#38bdf8",
                    height: "3px",
                    borderRadius: "3px",
                  },
                }}
                aria-label="Profile tabs"
                sx={{
                  minHeight: "44px",
                  "& .MuiTab-root": {
                    minHeight: "44px",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    color: isDark ? "#94a3b8" : "#64748b",
                    borderRadius: "12px",
                    px: 3,
                    transition: "all 0.2s ease",
                  },
                  "& .MuiTab-root.Mui-selected": { color: isDark ? "#fff" : "#0284c7" },
                  "& .MuiTab-root:hover": {
                    color: isDark ? "#fff" : "#0284c7",
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                {tabs.map((label, idx) => (
                  <Tab label={label} key={label} id={`profile-tab-${idx}`} aria-controls={`profile-tabpanel-${idx}`} />
                ))}
              </Tabs>
            </Paper>

            <Fade in timeout={500}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  backdropFilter: "blur(16px)",
                  background: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.9)",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                  minHeight: "360px",
                }}
              >
                {tabs.map((label, idx) => (
                  <TabPanel value={activeTab} index={idx} key={label}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: isDark ? "#fff" : "#0f172a" }}>
                      {isBetaDev
                        ? ["Your Issues", "Given Feedbacks", "Your Reports", "Your Friends"][idx]
                        : ["Your Friends", "Your Trips"][idx]}
                    </Typography>

                    {tabContents[idx].length === 0 ? (
                      <Typography color={isDark ? "#94a3b8" : "#64748b"} sx={{ textAlign: "center", py: 6, fontSize: "0.95rem" }}>
                        No items found yet.
                      </Typography>
                    ) : (isBetaDev && idx === 3) || (!isBetaDev && idx === 0) ? (
                      <List sx={{ p: 0 }}>
                        {tabContents[idx]
                          .sort((a, b) => a.name?.localeCompare(b.name || '') || 0)
                          .map((friend) => (
                            <ListItem
                              key={friend.uid}
                              sx={{
                                p: 1.5,
                                borderRadius: 3,
                                mb: 1,
                                backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar src={friend.photoURL} alt={friend.name || friend.username} sx={{ border: "2px solid #38bdf8" }} />
                              </ListItemAvatar>
                              <ListItemText
                                primary={<Typography fontWeight={600} color={isDark ? "#fff" : "#0f172a"}>{friend.name || "No Name"}</Typography>}
                                secondary={<Typography variant="body2" color={isDark ? "#94a3b8" : "#64748b"}>@{friend.username || friend.uid}</Typography>}
                              />
                            </ListItem>
                          ))}
                      </List>
                    ) : (
                      <List>
                        {tabContents[idx].map((item, i) =>
                          isBetaDev ? (
                            <Paper
                              key={item.id || i}
                              sx={{
                                p: 2.5,
                                mb: 2,
                                borderRadius: 3,
                                background: isDark ? "rgba(255, 255, 255, 0.04)" : "#f8fafc",
                                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"}`,
                              }}
                            >
                              <Typography fontWeight={700} color={isDark ? "#fff" : "#0f172a"}>
                                {item.message || "Untitled"}
                              </Typography>
                              <Typography fontSize={14} color={isDark ? "#94a3b8" : "#64748b"} sx={{ mt: 0.5 }}>
                                {item.description?.slice(0, 100) || ""}
                              </Typography>
                            </Paper>
                          ) : (
                            <ListItem key={i} sx={{ borderRadius: 2, mb: 1, backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                              <ListItemText primary={<Typography color={isDark ? "#fff" : "#0f172a"}>{item}</Typography>} />
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

        {/* Edit Profile Drawer */}
        <Drawer
          anchor="bottom"
          open={editOpen}
          onClose={() => setEditOpen(false)}
          PaperProps={{
            sx: {
              background: isDark ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxWidth: 480,
              mx: "auto",
              color: isDark ? "#fff" : "#0f172a",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
            },
          }}
          ModalProps={{
            BackdropProps: {
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(4px)",
              },
            },
          }}
        >
          <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 800, color: isDark ? "#fff" : "#0f172a" }}>
              Edit Profile
            </Typography>

            <Avatar
              src={editForm.photoURL}
              sx={{
                width: 90,
                height: 90,
                mb: 2,
                border: "3px solid #38bdf8",
              }}
            />

            <Button
              variant="outlined"
              component="label"
              sx={{
                mb: 3,
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
                color: isDark ? "#fff" : "#0f172a",
                px: 3,
                "&:hover": { borderColor: "#38bdf8", backgroundColor: "rgba(56, 189, 248, 0.08)" },
              }}
            >
              Upload New Picture
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
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              margin="dense"
              InputLabelProps={{ style: { color: isDark ? "#94a3b8" : "#64748b" } }}
              InputProps={{ style: { color: isDark ? "#fff" : "#0f172a", borderRadius: 12 } }}
            />
            <TextField
              label="Username"
              fullWidth
              value={editForm.username || ""}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              margin="dense"
              InputLabelProps={{ style: { color: isDark ? "#94a3b8" : "#64748b" } }}
              InputProps={{ style: { color: isDark ? "#fff" : "#0f172a", borderRadius: 12 } }}
            />
            <TextField
              label="Mobile Number"
              fullWidth
              value={editForm.mobile || ""}
              onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
              margin="dense"
              InputLabelProps={{ style: { color: isDark ? "#94a3b8" : "#64748b" } }}
              InputProps={{ style: { color: isDark ? "#fff" : "#0f172a", borderRadius: 12 } }}
            />
            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={3}
              value={editForm.bio || ""}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              margin="dense"
              InputLabelProps={{ style: { color: isDark ? "#94a3b8" : "#64748b" } }}
              InputProps={{ style: { color: isDark ? "#fff" : "#0f172a", borderRadius: 12 } }}
            />

            <Box mt={3} width="100%" display="flex" justifyContent="space-between">
              <Button
                onClick={() => setEditOpen(false)}
                sx={{
                  borderRadius: "999px",
                  px: 3,
                  color: isDark ? "#94a3b8" : "#64748b",
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                  color: "#fff",
                  borderRadius: "999px",
                  px: 4,
                  fontWeight: 700,
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Drawer>

        {/* Image Cropper Drawer */}
        <Drawer
          anchor="bottom"
          open={cropDrawerOpen}
          onClose={() => setCropDrawerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              background: isDark ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)",
              width: "100%",
              maxWidth: 480,
              mx: "auto",
              color: isDark ? "#fff" : "#0f172a",
            },
          }}
        >
          <Box sx={{ minHeight: "55vh", p: 3 }}>
            <Typography variant="h6" mb={2} fontWeight={700} textAlign="center" color={isDark ? "#fff" : "#0f172a"}>
              Crop Profile Picture
            </Typography>
            {imagePreview && (
              <Box sx={{ position: "relative", width: "100%", maxWidth: 350, mx: "auto", height: 260, backgroundColor: "#000", borderRadius: 3, overflow: "hidden" }}>
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
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setCropDrawerOpen(false)} sx={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ background: "linear-gradient(135deg, #38bdf8, #2563eb)", color: "#fff", borderRadius: "999px", px: 4, fontWeight: 700 }}
                onClick={async () => {
                  const cropped = await getCroppedImg(imagePreview, croppedAreaPixels);
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
      </Container>
    </Box>
  );
};

export default ProfilePage;