import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Collapse,
  CircularProgress,
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
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import { useCustomTheme } from "../context/ThemeContext";

const MotionBox = motion(Box);

const ContactSection = () => {
  const { isDark } = useCustomTheme();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [shakingFields, setShakingFields] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setShakingFields((prev) =>
      prev.filter((field) => field !== name)
    );

    setStatus("");

    if (submitted) {
      setSubmitted(false);
    }
  };

  const isValid =
    form.name.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.message.trim().length > 4;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      const invalid = [];

      if (!form.name.trim()) invalid.push("name");
      if (!/\S+@\S+\.\S+/.test(form.email)) invalid.push("email");
      if (form.message.trim().length <= 4) invalid.push("message");

      setShakingFields(invalid);
      setStatus("Please ensure all fields are filled out correctly.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const uid = auth?.currentUser?.uid || "anonymous";

      await addDoc(collection(db, "Contactus"), {
        name: form.name,
        email: form.email,
        message: form.message,
        subject: `Contact from ${form.name}`,
        timestamp: serverTimestamp(),
        uid,
      });

      try {
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
      } catch (error) {
        console.warn("EmailJS error (non-fatal):", error);
      }

      const notifRef = doc(collection(db, "notifications"));

      await setDoc(notifRef, {
        title: "📩 We've received your message!",
        content: `Hi ${form.name},\n\nWe've received your message and will get back to you soon.`,
        timestamp: serverTimestamp(),
        uid,
        read: false,
        type: "contact",
      });

      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact:", error);
      setStatus("❌ Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const inputVariants = {
    shake: {
      x: [-6, 6, -6, 6, 0],
      transition: {
        duration: 0.4,
      },
    },
    normal: {},
  };

  const supportHighlights = [
    {
      icon: AccessTimeRoundedIcon,
      title: "Quick responses",
      description: "We usually respond within 24 hours.",
    },
    {
      icon: SupportAgentRoundedIcon,
      title: "Built with the community",
      description: "Your feedback helps shape BunkMates.",
    },
  ];

  return (
    <Box
      id="contact"
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        py: {
          xs: 10,
          sm: 12,
          md: 16,
        },
        backgroundColor: colors.background,
        color: colors.text,
        transition: "background-color 0.35s ease, color 0.35s ease",
      }}
    >
      {/* Subtle Background Glows */}
      <Box
        sx={{
          position: "absolute",
          width: {
            xs: 300,
            md: 600,
          },
          height: {
            xs: 300,
            md: 600,
          },
          borderRadius: "50%",
          top: -280,
          right: -250,
          backgroundColor: isDark
            ? "rgba(255,255,255,0.018)"
            : "rgba(0,0,0,0.018)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: -140,
          bottom: -100,
          width: {
            xs: 280,
            md: 480,
          },
          height: {
            xs: 280,
            md: 480,
          },
          borderRadius: "50%",
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.02)"
            : "rgba(0, 0, 0, 0.02)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          px: {
            xs: 2.5,
            sm: 4,
            md: 5,
          },
        }}
      >
        {/* Section Header */}
        <Box
          sx={{
            maxWidth: 780,
            mx: "auto",
            textAlign: "center",
            mb: {
              xs: 6,
              md: 8,
            },
          }}
        >
          <MotionBox
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.8,
                px: 1.4,
                py: 0.75,
                mb: 3,
                borderRadius: "999px",
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.035)"
                  : "rgba(0, 0, 0, 0.025)",
              }}
            >
              <AutoAwesomeRoundedIcon
                sx={{
                  fontSize: 15,
                  color: colors.text,
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  color: colors.secondaryText,
                }}
              >
                GET IN TOUCH
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: {
                  xs: "2.5rem",
                  sm: "3.3rem",
                  md: "4rem",
                },
                lineHeight: 1.03,
                fontWeight: 850,
                letterSpacing: "-0.065em",
                color: '#ffc7a7',
                mb: 2.5,
              }}
            >
              Let's make BunkMates
              <br />
              <Box
                component="span"
                sx={{
                  color: '#795c4b',
                }}
              >
                even better.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 600,
                mx: "auto",
                fontSize: {
                  xs: "0.98rem",
                  md: "1.05rem",
                },
                lineHeight: 1.75,
                color: colors.secondaryText,
              }}
            >
              Have an idea, a question, or something you would love to see in
              BunkMates? Send us a message and help shape what comes next.
            </Typography>
          </MotionBox>
        </Box>

        {/* Main Contact Container */}
        <MotionBox
          initial={{
            opacity: 0,
            y: 28,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          sx={{
            p: {
              xs: 2.5,
              sm: 4,
              md: 5,
            },
            borderRadius: {
              xs: "28px",
              md: "32px",
            },
            backgroundColor: '#ffdbc5',
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
              },
              gap: {
                xs: 5,
                md: 6,
                lg: 8,
              },
            }}
          >
            {/* Left Information Side */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 4,
              }}
            >
              <Box>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "15px",
                    mb: 2.5,
                    backgroundColor: isDark
                      ? "#b1721412"
                      : "rgba(0,0,0,0.045)",
                    color: '#703e26',
                  }}
                >
                  <TravelExploreRoundedIcon sx={{ fontSize: 24 }} />
                </Box>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "1.5rem",
                      md: "1.8rem",
                    },
                    fontWeight: 800,
                    letterSpacing: "-0.045em",
                    color: '#703e26',
                    mb: 1.5,
                  }}
                >
                  Your next idea could shape the journey.
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    color: '#896657',
                  }}
                >
                  Whether it is feedback, a feature request, a partnership idea,
                  or simply a question—we would love to hear from you.
                </Typography>
              </Box>

              {/* Highlights */}
              <Stack spacing={1.5}>
                {supportHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Box
                      key={item.title}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.8,
                        borderRadius: "18px",
                        backgroundColor: '#ffece4',
                      }}
                    >
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          flexShrink: 0,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: "12px",
                          backgroundColor: isDark
                            ? "#b1721412"
                            : "#ffffff",
                          color: '#703e26',
                        }}
                      >
                        <Icon sx={{ fontSize: 20 }} />
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            color: '#703e26',
                            fontWeight: 750,
                            fontSize: "0.88rem",
                            mb: 0.2,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#896657',
                            fontSize: "0.78rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            {/* Right Form Side */}
            <Box
              sx={{
                p: {
                  xs: 0,
                  sm: 3.5,
                },
                borderRadius: "24px",
                backgroundColor: '#ffe0d300',
              }}
            >
              <Stack
                spacing={2} 
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
                {[
                  {
                    field: "name",
                    label: "Your name",
                    placeholder: "What should we call you?",
                    multiline: false,
                    rows: 1,
                  },
                  {
                    field: "email",
                    label: "Email address",
                    placeholder: "Where can we reach you?",
                    multiline: false,
                    rows: 1,
                  },
                  {
                    field: "message",
                    label: "Your message",
                    placeholder: "Tell us how we can help...",
                    multiline: true,
                    rows: 4,
                  },
                ].map((item) => (
                  <MotionBox
                    key={item.field}
                    variants={inputVariants}
                    animate={
                      shakingFields.includes(item.field) ? "shake" : "normal"
                    }
                  >
                    <TextField
                      name={item.field}
                      label={item.label}
                      placeholder={item.placeholder}
                      fullWidth
                      multiline={item.multiline}
                      rows={item.rows}
                      value={form[item.field]}
                      onChange={handleChange}
                      variant="outlined"
                      InputLabelProps={{
                        sx: {
                          color: '#896657',
                          "&.Mui-focused": {
                            color: '#703e26',
                            borderColor: '#703e26',
                          },
                        },
                      }}
                      InputProps={{
                        sx: {
                          color: '#703e26',
                          borderRadius: item.multiline ? "18px" : "14px",
                          backgroundColor: '#ffefe8',
                            borderColor: '#703e26',
                          "& fieldset": {
                            border: `1px solid #ffe0d3`,
                          },
                          "&:hover fieldset": {
                            borderColor: isDark
                              ? "#703e26"
                              : "rgba(0,0,0,0.15)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: '#703e26',
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: "0.9rem",
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: colors.secondaryText,
                          opacity: 1,
                        },
                      }}
                    />
                  </MotionBox>
                ))}

                {/* Submit button & disclaimer */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column-reverse",
                      sm: "row",
                    },
                    alignItems: {
                      xs: "stretch",
                      sm: "center",
                    },
                    justifyContent: "space-between",
                    gap: 1.5,
                    pt: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: colors.secondaryText,
                      fontSize: "0.72rem",
                      lineHeight: 1.5,
                    }}
                  >
                    We will use your details only to respond to your message.
                  </Typography>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    endIcon={
                      loading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SendRoundedIcon sx={{ fontSize: "16px !important" }} />
                      )
                    }
                    sx={{
                      flexShrink: 0,
                      minHeight: 46,
                      px: 3,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 750,
                      fontSize: "0.92rem",
                      backgroundColor: '#703e26',
                      color: '#ffc7a7',
                      "&:hover": {
                        backgroundColor: isDark ? "#ffc7a7" : "#242424",
                        boxShadow: "none",
                        color: '#703e26',
                      },
                      "&.Mui-disabled": {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.05)",
                        color: colors.secondaryText,
                        boxShadow: "none",
                      },
                    }}
                  >
                    {loading ? "Sending..." : "Send message"}
                  </Button>
                </Box>

                {/* Success alert */}
                <Collapse in={submitted}>
                  <Box
                    sx={{
                      mt: 1,
                      p: 2,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      backgroundColor: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "#ffffff",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "10px",
                        display: "grid",
                        placeItems: "center",
                        backgroundColor: isDark ? "#ffffff" : "#111111",
                        color: isDark ? "#000000" : "#ffffff",
                        flexShrink: 0,
                      }}
                    >
                      <CheckRoundedIcon sx={{ fontSize: 18 }} />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color: colors.text,
                          fontWeight: 750,
                          fontSize: "0.88rem",
                        }}
                      >
                        Message sent successfully!
                      </Typography>
                      <Typography
                        sx={{
                          color: colors.secondaryText,
                          fontSize: "0.78rem",
                          mt: 0.2,
                        }}
                      >
                        Thanks for reaching out. We will get back to you soon.
                      </Typography>
                    </Box>
                  </Box>
                </Collapse>

                {/* Error alert */}
                {status && !submitted && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 1,
                      borderRadius: "14px",
                      backgroundColor: isDark
                        ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(254, 242, 242, 0.9)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      color: isDark ? "#fca5a5" : "#b91c1c",
                    }}
                  >
                    {status}
                  </Alert>
                )}
              </Stack>
            </Box>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default ContactSection;