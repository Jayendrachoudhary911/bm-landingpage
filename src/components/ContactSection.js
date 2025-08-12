import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Collapse,
} from "@mui/material";
import { db, auth } from "../firebase";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const MotionBox = motion(Box);

const ContactSection = ({ useFirebase = true }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [shakingFields, setShakingFields] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setShakingFields((prev) => prev.filter((f) => f !== e.target.name));
    setStatus("");
  };

  const isValid =
    form.name.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.message.trim().length > 10;

  const validateFields = () => {
    const invalidFields = [];
    if (!form.name.trim()) invalidFields.push("name");
    if (!/\S+@\S+\.\S+/.test(form.email)) invalidFields.push("email");
    if (form.message.trim().length <= 10) invalidFields.push("message");
    setShakingFields(invalidFields);
    return invalidFields.length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isValid) {
    setStatus("❌ Please fill all fields correctly.");
    return;
  }

  setLoading(true);

  try {
    const uid = auth?.currentUser?.uid || "anonymous";

    // 1. ✅ Save contact form to Firestore
    await addDoc(collection(db, "Contactus"), {
      name: form.name,
      email: form.email,
      message: form.message,
      subject: `Contact from ${form.name}`,
      timestamp: serverTimestamp(),
      uid: uid,
    });

    // 2. ✅ Send Email using EmailJS
    await emailjs.send(
      "service_y1409lk", // Your EmailJS service ID
      "template_2ap83c9", // Your EmailJS template ID
      {
        name: form.name,
        email: form.email,
        message: form.message,
      },
      "-gCY06CnBGzAFg-Af" // Your EmailJS public key
    );

    await emailjs.send(
      "service_y1409lk",
      "template_066x0zi", // A second template just for admin
      {
        name: form.name,
        email: form.email,
        message: form.message,
      },
      "-gCY06CnBGzAFg-Af"
    );

    // 3. ✅ Save notification in Firestore
    const notifRef = doc(collection(db, "notifications"));
    await setDoc(notifRef, {
      title: "📩 We've received your message!",
      admin_content: `${form.name} has submitted a message.`,
      content: `Hi ${form.name},

We've received your message and are thrilled to assist you. Here's a copy of your submission:

🧑‍💼 Name: ${form.name}  
📧 Email: ${form.email}  
📝 Message: ${form.message}

Our support team will reach out to you shortly if needed. Thank you for connecting with BunkMate!`,
      timestamp: serverTimestamp(),
      uid: uid,
      read: false,
      type: "contact",
    });

    // ✅ All successful
    setStatus("✅ Thank you! Your message has been sent and saved.");
    setForm({ name: "", email: "", message: "" });

  } catch (err) {
    console.error("Submission error:", err);
    setStatus("❌ Failed to send. Please try again later.");
  } finally {
    setLoading(false);
  }
};

  const inputVariants = {
    shake: {
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.4 },
    },
    normal: {},
  };

  return (
    <Box
      id="contact"
      sx={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(10px)",
        py: 10,
        px: 3,
        borderRadius: 4,
        boxShadow: "none",
      }}
    >
      <Stack
        spacing={4}
        maxWidth={600}
        mx="auto"
        px={3}
        py={6}
        sx={{
          background: "rgba(255, 255, 255, 0.7)",
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          boxShadow: "none",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{
            background: "linear-gradient(to right, #000, #444)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Connect With Us
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 450, mx: "auto" }}
        >
          Have a question or just want to say hi? Fill out the form below and
          we’ll get back to you.
        </Typography>

        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          <MotionBox
            variants={inputVariants}
            animate={shakingFields.includes("name") ? "shake" : "normal"}
          >
            <TextField
              name="name"
              label="Your Name"
              fullWidth
              value={form.name}
              onChange={handleChange}
              error={shakingFields.includes("name")}
              variant="outlined"
              sx={{ background: "#fff", borderRadius: 2 }}
            />
          </MotionBox>

          <MotionBox
            variants={inputVariants}
            animate={shakingFields.includes("email") ? "shake" : "normal"}
          >
            <TextField
              name="email"
              label="Your Email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              error={shakingFields.includes("email")}
              variant="outlined"
              sx={{ background: "#fff", borderRadius: 2 }}
            />
          </MotionBox>

          <MotionBox
            variants={inputVariants}
            animate={shakingFields.includes("message") ? "shake" : "normal"}
          >
            <TextField
              name="message"
              label="Your Message"
              fullWidth
              multiline
              rows={4}
              value={form.message}
              onChange={handleChange}
              error={shakingFields.includes("message")}
              variant="outlined"
              sx={{ background: "#fff", borderRadius: 2 }}
            />
          </MotionBox>

          <Box textAlign="right">
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isValid || loading}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                px: 4,
                py: 1.4,
                borderRadius: 2,
                fontWeight: 500,
                textTransform: "none",
                fontSize: "1rem",
                border: "1.2px solid #000",
                transition: "all 0.3s ease",
                '&:hover': {
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1.2px solid #000",
                },
              }}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </Box>
        </Stack>

        {/* ✅ Animated Success Feedback */}
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
              backgroundColor: "#e8f5e9",
              border: "1px solid #c8e6c9",
            }}
          >
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 40 }} />
            <Typography variant="h6" color="success.main" mt={1}>
              Message Sent!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thank you for reaching out. Our team will contact you shortly.
            </Typography>
          </MotionBox>
        </Collapse>

        {/* ❗️Inline error message */}
        {status && !submitted && (
          <Alert
            severity={status.includes("Thank") ? "success" : "error"}
            sx={{
              mt: 1,
              background: "rgba(255,255,255,0.5)",
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.1)",
              backdropFilter: "blur(6px)",
            }}
          >
            {status}
          </Alert>
        )}
      </Stack>

    </Box>
  );
};

export default ContactSection;
