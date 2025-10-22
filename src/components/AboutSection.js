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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { db } from "../firebase"; // adjust path to your firebase config
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; // your auth context hook

const AboutSection = () => {
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const { user } = useAuth(); // should return { uid, displayName, photoURL }

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
    if (!rating || !reviewText.trim()) return alert("Please add rating & text");

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
    <>
      {/* ABOUT SUMMARY */}
      <Box
        onClick={() => setOpen(true)}
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "#f5f5f5",
          cursor: "pointer",
          "&:hover": { bgcolor: "#ececec" },
        }}
      >
        <Typography variant="h6" fontWeight="600">
          About
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tap to know more about us and read user reviews.
        </Typography>
      </Box>

      {/* DRAWER */}
      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            height: "100vh",
            p: 3,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#fff",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="600">
              About BunkMates
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography sx={{ mt: 2, color: "#333" }}>
            BunkMates is your ultimate travel companion — plan trips, manage
            budgets, chat with your group, track your checklist, and much more.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* REVIEWS SECTION */}
          <Typography variant="h6" gutterBottom>
            User Reviews
          </Typography>

          <Box
            sx={{
              maxHeight: "45vh",
              overflowY: "auto",
              mb: 2,
              pr: 1,
            }}
          >
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <Box
                  key={rev.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                    bgcolor: "#fafafa",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Avatar src={rev.userPhotoURL} alt={rev.userName} />
                  <Box>
                    <Typography fontWeight="600">{rev.userName}</Typography>
                    <Rating value={rev.rating} size="small" readOnly />
                    <Typography variant="body2">{rev.text}</Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {rev.createdAt?.toDate
                        ? rev.createdAt.toDate().toLocaleString()
                        : ""}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">
                No reviews yet. Be the first to write one!
              </Typography>
            )}
          </Box>

          {/* ADD REVIEW */}
          <Box sx={{ mt: "auto" }}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Add a Review
            </Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              sx={{ my: 1 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AboutSection;
