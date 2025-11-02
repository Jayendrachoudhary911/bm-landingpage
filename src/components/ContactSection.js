import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Collapse,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { db, auth } from "../firebase";
import { motion } from "framer-motion";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const MotionBox = motion(Box);

const ContactSection = () => {
  const theme = useTheme();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [shakingFields, setShakingFields] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setShakingFields((prev) => prev.filter((f) => f !== e.target.name));
    setStatus("");
  };

  const isValid =
    form.name.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.message.trim().length > 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      setStatus("❌ Please fill all fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const uid = auth?.currentUser?.uid || "anonymous";

      await addDoc(collection(db, "Contactus"), {
        name: form.name,
        email: form.email,
        message: form.message,
        subject: `Contact from ${form.name}`,
        timestamp: serverTimestamp(),
        uid: uid,
      });

      await emailjs.send(
        "service_y1409lk",
        "template_2ap83c9",
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        "-gCY06CnBGzAFg-Af"
      );

      const notifRef = doc(collection(db, "notifications"));
      await setDoc(notifRef, {
        title: "📩 We've received your message!",
        content: `Hi ${form.name},\n\nWe've received your message and are thrilled to assist you.`,
        timestamp: serverTimestamp(),
        uid: uid,
        read: false,
        type: "contact",
      });

      setStatus("✅ Thank you! Your message has been sent.");
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error:", err);
      setStatus("❌ Failed to send. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const inputVariants = {
    shake: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } },
    normal: {},
  };

  return (
    <Box
      id="contact"
      sx={{
        position: "relative",
        py: 12,
        px: { xs: 2, sm: 6 },
        backgroundColor: "#000",
        color: "#fff",
        overflow: "hidden",
        width: "100%",
        maxWidth: "1600px",
      }}
    >
      {/* Ripple Gradient Background */}
      <Box
        sx={{
          background: "#474747ff",
          zIndex: 0,
        }}
      />

      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{
          position: "relative",
          zIndex: 2,
          background: isMobile ? "linear-gradient(130deg, #00460cb4, #000, #000)" : "url(/assets/bm_contact.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          borderRadius: 8,
          p: 4,
          maxWidth: "1200px",
          mx: "auto"
        }}
      >
        {/* Left Side — Image */}
        <Grid item xs={12} md={6}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            sx={{
              display: isMobile ? "none" : "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
              width: "480px",
              maxWidth: 480,
              backgroundColor: "transparent",
              p: isMobile ? 0 : 4
            }}
          >
            <Box
              sx={{
                borderRadius: 4,
                boxShadow: "none",
                opacity: 1,
              }}
            />
          </Box>
        </Grid>

        {/* Right Side — Form */}
        <Grid item xs={12} md={6}>
          <Stack
            spacing={4}
            sx={{ 
              p: { xs: 3, sm: 5 },
              my: "auto",
              borderRadius: 4,
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              textAlign="center"
              sx={{
                color: "#ffffff",
              }}
            >
              Connect With Us!
            </Typography>

            <Typography
              variant="body1"
              textAlign="center"
              sx={{
                color: "rgba(255,255,255,0.75)",
                maxWidth: 450,
                mx: "auto",
              }}
            >
              Got a question or feedback? Drop your message below — we’d love to
              hear from you.
            </Typography>

            <Stack spacing={2} component="form" onSubmit={handleSubmit}>
              {["name", "email", "message"].map((field) => (
                <MotionBox
                  key={field}
                  variants={inputVariants}
                  animate={shakingFields.includes(field) ? "shake" : "normal"}
                >
                  <TextField
                    name={field}
                    label={
                      field === "name"
                        ? "Your Name"
                        : field === "email"
                        ? "Your Email"
                        : "Your Message"
                    }
                    fullWidth
                    multiline={field === "message"}
                    rows={field === "message" ? 4 : 1}
                    value={form[field]}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#bbb" } }}
                    InputProps={{
                      style: {
                        color: "#fff",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: 12,
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                        "&:hover fieldset": { borderColor: "#00c6ff" },
                        "&.Mui-focused fieldset": { borderColor: "#0072ff" },
                      },
                    }}
                  />
                </MotionBox>
              ))}

              <Box textAlign="right">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!isValid || loading}
                  sx={{
                    backgroundColor: "#fff",
                    color: "#000000ff",
                    px: 5,
                    py: 1.4,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#363636ff",
                      color: "#fff",
                      transform: "translateY(-2px)",
                      boxShadow: 'none'
                    },
                  }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </Box>
            </Stack>

            <Collapse in={submitted}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
                sx={{
                  textAlign: "center",
                  mt: 3,
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(0,255,150,0.1)",
                  border: "1px solid rgba(0,255,150,0.3)",
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 40, color: "#00ff9d" }}
                />
                <Typography variant="h6" sx={{ color: "#00ff9d", mt: 1 }}>
                  Message Sent!
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Thank you for reaching out. We’ll get back to you soon.
                </Typography>
              </MotionBox>
            </Collapse>

            {status && !submitted && (
              <Alert
                severity={status.includes("Thank") ? "success" : "error"}
                sx={{
                  mt: 1,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  backdropFilter: "blur(8px)",
                }}
              >
                {status}
              </Alert>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactSection;
