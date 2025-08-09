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
} from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import Cropper from "react-easy-crop";
import Navbar from '../components/Navbar';

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
  const [cropDrawerOpen, setCropDrawerOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userSnap = await getDoc(doc(db, "users", authUser.uid));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserDoc(userData);
          setEditForm({ ...userData, photoURL: authUser.photoURL || userData.photoURL || "" });
        }
        const [issuesSnap, feedbackSnap, reportSnap] = await Promise.all([
          getDocs(query(collection(db, "issues"), where("uid", "==", authUser.uid))),
          getDocs(query(collection(db, "feedback"), where("uid", "==", authUser.uid))),
          getDocs(query(collection(db, "reports"), where("uid", "==", authUser.uid))),
        ]);
        setContributions({
          issues: issuesSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          feedbacks: feedbackSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          reports: reportSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        });
        setLoading(false);
      }
    });
    return () => unsub();
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
      <Typography align="center">Login to view your profile</Typography>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        px: 2,
      }}
    >
        <Navbar user={user} />
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid item xs={12} sm={4} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.7)",
                boxShadow: "none",
                maxWidth: 410
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
                  border: "3px solid #e5e7eb",
                }}
              />
              <Typography variant="h6" fontWeight={600} align="center">
                {user.displayName || "No Name"}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                @{userDoc.username || "username"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, textAlign: "center", fontSize: 14, color: "#555" }}
              >
                {userDoc.bio || "Add something cool about yourself!"}
              </Typography>

              <Grid container spacing={1} mt={2} display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"} my={4}>
                {[
                  { label: "Issues", value: contributions.issues.length },
                  { label: "Feedbacks", value: contributions.feedbacks.length },
                  { label: "Reports", value: contributions.reports.length },
                ].map((stat) => (
                  <Grid item xs={4} key={stat.label} textAlign="center"  sx={{ backgroundColor: "#f1f1f1b6", p: 1.3, borderRadius: 3 }}>
                    <Typography fontWeight={700}>{stat.value}</Typography>
                    <Typography variant="caption" color="text.secondary">
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
                  border: "1.2px solid #000",
                  fontWeight: 600,
                  color: "#000"
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
                p: 2,
                mb: 2,
                borderRadius: 3,
                backdropFilter: "blur(8px)",
                background: "rgba(255, 255, 255, 0.8)", 
                maxWidth: 610,
                boxShadow: "none"
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Issues" />
                <Tab label="Feedbacks" />
                <Tab label="Reports" />
              </Tabs>
            </Paper>

            <Fade in timeout={500}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backdropFilter: "blur(6px)",
                  background: "rgba(255, 255, 255, 0.85)",
                  maxWidth: 610,
                  boxShadow: "none"
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {["Your Issues", "Given Feedbacks", "Your Reports"][activeTab]}
                </Typography>
                {[contributions.issues, contributions.feedbacks, contributions.reports][
                  activeTab
                ]?.length === 0 ? (
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 3 }}
                  >
                    No items yet.
                  </Typography>
                ) : (
                  <Box>
                    {[contributions.issues, contributions.feedbacks, contributions.reports][
                      activeTab
                    ].map((item) => (
                      <Paper
                        key={item.id}
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: 2,
                          background: "#ffffffff",
                          border: "1.2px solid #cacacaff",
                          boxShadow: "none"
                        }}
                      >
                        <Typography fontWeight={600}>
                          {item.message || "Untitled"}
                        </Typography>
                        <Typography fontSize={14} color="text.secondary">
                          {item.description?.slice(0, 100) || ""}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Paper>
            </Fade>
          </Grid>
        </Grid>

              {/* Edit Drawer */}
        <Drawer
          anchor="bottom"
          open={editOpen}
          onClose={() => setEditOpen(false)}
          fullWidth
          PaperProps={{
            sx: {
              background: "#ffffff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxWidth: 410,
              mx: "auto"
            },
          }}
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
      background: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(14px)",
      boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.25)",
      transition: "all 0.4s ease-in-out",
    },
  }}
        >
          <Box
            sx={{
              height: "80vh",
              p: 4,
              color: "#161616",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 900, letterSpacing: 0.2 }}
            >
              Edit Profile
            </Typography>
            <Box
              sx={{
                background: "#000",
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
                  border: "3px solid #fff",
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
                border: "1.5px solid #000000ff",
                color: "#000000ff",
                px: 2,
                ":hover": { background: "#04040415" },
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
              sx={{ my: 1, borderRadius: 3 }}
            />
            <TextField
              label="Username"
              fullWidth
              value={editForm.username || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, username: e.target.value })
              }
              margin="dense"
              sx={{ my: 1, borderRadius: 3 }}
            />
            <TextField
              label="Mobile"
              fullWidth
              value={editForm.mobile || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, mobile: e.target.value })
              }
              margin="dense"
              sx={{ my: 1, borderRadius: 3 }}
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
              sx={{ my: 1, borderRadius: 3 }}
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
                  color: "#333",
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
                  background: "#000000ff",
                  color: "#fff",
                  borderRadius: 999,
                  px: 4,
                  textTransform: "none",
                  fontWeight: 700,
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
                background: "#fff",
                width: 410,
                mx: "auto"
              },
            }}
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
      background: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(14px)",
      boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.25)",
      transition: "all 0.4s ease-in-out",
    },
  }}
          >
            <Box sx={{ minHeight: "55vh", p: 3, color: "#161616" }}>
              <Typography
                variant="h6"
                mb={2}
                fontWeight={800}
                textAlign="center"
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
                    background: "#000000ff",
                    color: "#fff",
                    borderRadius: 999,
                    px: 4,
                    fontWeight: 600,
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
