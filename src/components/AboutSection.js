import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Rating,
  TextField,
  Button,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../context/ThemeContext";

const AboutReviewsSection = () => {
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const { isDark } = useCustomTheme();
  const { user } = useAuth();

  const colors = {
    background: isDark ? "#000000" : "#ffffff",
    surface: isDark ? "#0d0d0d" : "#f7f7f7",
    surfaceStrong: isDark ? "#141414" : "#ffffff",
    text: isDark ? "#ffffff" : "#111111",
    secondaryText: isDark ? "#a3a3a3" : "#737373",
    border: isDark
      ? "rgba(255, 255, 255, 0.09)"
      : "rgba(0, 0, 0, 0.08)",
    subtleBorder: isDark
      ? "rgba(255, 255, 255, 0.06)"
      : "rgba(0, 0, 0, 0.05)",
  };

  useEffect(() => {
    const q = query(
      collection(db, "reviews", "userReviews"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(data);
    });

    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!rating || !reviewText.trim()) return alert("Please add rating & review text");

    try {
      await addDoc(collection(db, "reviews", "userReviews"), {
        userId: user?.uid,
        userName: user?.displayName || "Anonymous",
        userPhotoURL:
          user?.photoURL ||
          "https://ui-avatars.com/api/?name=User&background=ccc",
        rating,
        text: reviewText.trim(),
        createdAt: serverTimestamp(),
      });
      setRating(0);
      setReviewText("");
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {/* Trigger Card */}
      <Box
        onClick={() => setOpen(true)}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 2.5,
          borderRadius: "20px",
          backgroundColor: colors.surfaceStrong,
          border: `1px solid ${colors.border}`,
          cursor: "pointer",
          transition: "border-color 0.2s ease, transform 0.2s ease",
          display: "flex",
          alignItems: "center",
          "&:hover": {
            borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surface,
              border: `1px solid ${colors.subtleBorder}`,
              color: colors.text,
              flexShrink: 0,
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 750, color: colors.text, fontSize: "0.95rem" }}>
              Community Reviews
            </Typography>
            <Typography sx={{ color: colors.secondaryText, fontSize: "0.78rem" }}>
              Tap to explore squad stories and feedback.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Reviews Bottom Drawer */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: colors.background,
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
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
              About & Reviews
            </Typography>
            <IconButton
              onClick={() => setOpen(false)}
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

          <Typography sx={{ color: colors.secondaryText, fontSize: "0.9rem", lineHeight: 1.7 }}>
            BunkMates connects travel crews to organize stops, split group bills fairly, and stay synced wherever the adventure takes them.
          </Typography>

          <Divider sx={{ my: 2.5, borderColor: colors.border }} />

          {/* User Reviews List */}
          <Typography sx={{ fontWeight: 750, mb: 1.5, fontSize: "0.95rem" }}>
            User Reviews
          </Typography>

          <Box sx={{ maxHeight: "38vh", overflowY: "auto", pr: 0.5, mb: 2, display: "flex", flexDirection: "column" }}>
            {reviews.length > 0 ? (
              <Stack spacing={1.5}>
                {reviews.map((rev) => (
                  <Box
                    key={rev.id}
                    sx={{
                      p: 2,
                      borderRadius: "18px",
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.subtleBorder}`,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <Avatar src={rev.userPhotoURL} alt={rev.userName} sx={{ width: 32, height: 32 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.86rem", color: colors.text }}>
                          {rev.userName}
                        </Typography>
                        <Rating value={rev.rating} size="small" readOnly sx={{ fontSize: "0.85rem" }} />
                      </Box>
                    </Stack>
                    <Typography sx={{ color: colors.secondaryText, fontSize: "0.85rem", lineHeight: 1.6 }}>
                      {rev.text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography sx={{ color: colors.secondaryText, fontSize: "0.86rem", py: 2 }}>
                No reviews yet. Share your experience below!
              </Typography>
            )}
          </Box>

          {/* Add Review Form */}
          <Box sx={{ pt: 1, borderTop: `1px solid ${colors.border}`, display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontWeight: 750, fontSize: "0.88rem", mb: 1 }}>
              Add a Review
            </Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="medium"
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: "16px",
                  backgroundColor: colors.surface,
                  color: colors.text,
                  "& fieldset": { border: `1px solid ${colors.border}` },
                },
              }}
              sx={{ my: 1.5 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{
                borderRadius: "14px",
                py: 1.2,
                fontWeight: 750,
                textTransform: "none",
                fontSize: "0.92rem",
                backgroundColor: colors.text,
                color: colors.background,
                "&:hover": {
                  backgroundColor: isDark ? "#e8e8e8" : "#242424",
                },
              }}
            >
              Submit Review
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AboutReviewsSection;