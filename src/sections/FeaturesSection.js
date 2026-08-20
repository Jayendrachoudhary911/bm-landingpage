import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Avatar,
  ButtonBase,
} from "@mui/material";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";

import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useCustomTheme } from "../context/ThemeContext";

const FALLBACK_BUNKMATE_FEATURES = [
  {
    id: "trip-hub",
    tag: "Dashboard",
    title: "Live Trip Dashboard",
    description:
      "Keep an eye on your trip, weather, updates and upcoming stops from one shared space.",
    color: "#60a5fa",
    category: "Planning",
    previewType: "dashboard",
  },
  {
    id: "squad-invites",
    tag: "Squads",
    title: "Invite Your BunkMates",
    description:
      "Bring everyone into the trip quickly with simple invites and QR-based joining.",
    color: "#f59e0b",
    category: "Social",
    previewType: "qr-squad",
  },
  {
    id: "contri-split",
    tag: "Expenses",
    title: "Split Expenses Together",
    description:
      "Track shared spending, contributions and balances without the usual confusion.",
    color: "#34d399",
    category: "Finance",
    previewType: "expenses",
  },
  {
    id: "squad-chat",
    tag: "Chat",
    title: "Your Trip Has Its Own Chat",
    description:
      "Messages, updates, media and location sharing stay connected to the trip.",
    color: "#fb923c",
    category: "Social",
    previewType: "chat",
  },
  {
    id: "itinerary-vault",
    tag: "Offline",
    title: "Keep Important Things Offline",
    description:
      "Access your plans, documents and important trip information when the network disappears.",
    color: "#a3a3a3",
    category: "Offline",
    previewType: "timeline",
  },
];

const FALLBACK_UPCOMING = [
  "AI itinerary generation from shared links and photos",
  "Offline maps with custom places and trail pins",
  "Faster UPI and squad settlement support",
  "Interactive trip scrapbook and memory reels",
  "Collaborative packing lists",
  "Flight and train status updates",
];

const CATEGORIES = ["All", "Planning", "Finance", "Social", "Offline"];

const BunkMateFeatureMockup = ({ type, isDark, colors }) => {
  const basePreview = {
    width: "100%",
    minHeight: 210,
    borderRadius: "20px",
    backgroundColor: colors.surface,
    border: `1px solid ${colors.subtleBorder}`,
    overflow: "hidden",
    position: "relative",
  };

  if (type === "dashboard") {
    return (
      <Box
        sx={{
          ...basePreview,
          p: 1.75,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={0.8} alignItems="center">
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                backgroundColor: colors.surfaceStrong,
                border: `1px solid ${colors.border}`,
              }}
            >
              <CloudQueueRoundedIcon
                sx={{
                  fontSize: 17,
                  color: colors.text,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color: colors.secondaryText,
                  lineHeight: 1,
                }}
              >
                Current weather
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.78rem",
                  color: colors.text,
                  fontWeight: 700,
                  mt: 0.3,
                }}
              >
                30°C · Light rain
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: "999px",
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.68rem",
                color: colors.text,
                fontWeight: 700,
              }}
            >
              AQI 44
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            p: 1.6,
            borderRadius: "16px",
            backgroundColor: colors.surfaceStrong,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.68rem",
              color: colors.secondaryText,
              mb: 0.5,
            }}
          >
            ACTIVE TRIP
          </Typography>

          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 750,
              color: colors.text,
              mb: 0.5,
            }}
          >
            Jaipur → Pokhara
          </Typography>

          <Typography
            sx={{
              fontSize: "0.72rem",
              color: colors.secondaryText,
            }}
          >
            Next stop · Border checkpoint
          </Typography>
        </Box>
      </Box>
    );
  }

  if (type === "qr-squad") {
    return (
      <Box
        sx={{
          ...basePreview,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 1.5,
          p: 2,
        }}
      >
        <Box
          sx={{
            width: 82,
            height: 82,
            borderRadius: "20px",
            backgroundColor: "#ffffff",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          }}
        >
          <QrCode2RoundedIcon
            sx={{
              fontSize: 62,
              color: "#111111",
            }}
          />
        </Box>

        <Stack
          direction="row"
          spacing={-0.5}
          alignItems="center"
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: "0.7rem",
              bgcolor: "#ef4444",
              border: `2px solid ${colors.surface}`,
            }}
          >
            J
          </Avatar>

          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: "0.7rem",
              bgcolor: "#f59e0b",
              border: `2px solid ${colors.surface}`,
            }}
          >
            S
          </Avatar>

          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: "0.7rem",
              bgcolor: "#22c55e",
              border: `2px solid ${colors.surface}`,
            }}
          >
            A
          </Avatar>

          <Box
            sx={{
              ml: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 750,
                color: colors.text,
              }}
            >
              +4 BunkMates
            </Typography>
          </Box>
        </Stack>
      </Box>
    );
  }

  if (type === "expenses") {
    return (
      <Box
        sx={{
          ...basePreview,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "14px",
            display: "grid",
            placeItems: "center",
            mb: 1.25,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.05)",
          }}
        >
          <PaidRoundedIcon
            sx={{
              fontSize: 22,
              color: colors.text,
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: "0.68rem",
            color: colors.secondaryText,
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          TRIP EXPENSES
        </Typography>

        <Typography
          sx={{
            fontSize: "2rem",
            fontWeight: 800,
            color: colors.text,
            letterSpacing: "-0.05em",
            my: 0.4,
          }}
        >
          ₹14,800
        </Typography>

        <Typography
          sx={{
            fontSize: "0.75rem",
            color: colors.secondaryText,
          }}
        >
          ₹3,700 per person
        </Typography>
      </Box>
    );
  }

  if (type === "chat") {
    return (
      <Box
        sx={{
          ...basePreview,
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Box
          sx={{
            alignSelf: "flex-start",
            maxWidth: "82%",
            px: 1.4,
            py: 1,
            borderRadius: "14px 14px 14px 5px",
            backgroundColor: colors.surfaceStrong,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.74rem",
              color: colors.text,
            }}
          >
            Campsite reached. Dropping the location 📍
          </Typography>
        </Box>

        <Box
          sx={{
            alignSelf: "flex-end",
            maxWidth: "82%",
            px: 1.4,
            py: 1,
            borderRadius: "14px 14px 5px 14px",
            backgroundColor: colors.text,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.74rem",
              color: colors.background,
              fontWeight: 600,
            }}
          >
            10 minutes away. Fuel stop done! 🚙
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        ...basePreview,
        p: 1.75,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 1.2,
      }}
    >
      {[
        "Hotel reservation",
        "Trek permits",
        "Offline trail maps",
      ].map((item, index) => (
        <Box
          key={item}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.2,
            py: 1,
            borderRadius: "13px",
            backgroundColor:
              index === 2
                ? isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)"
                : colors.surfaceStrong,
            border: `1px solid ${colors.border}`,
          }}
        >
          {index === 2 ? (
            <LocationOnRoundedIcon
              sx={{
                fontSize: 17,
                color: colors.text,
              }}
            />
          ) : (
            <CheckCircleRoundedIcon
              sx={{
                fontSize: 17,
                color: colors.text,
              }}
            />
          )}

          <Typography
            sx={{
              fontSize: "0.74rem",
              color: colors.text,
              fontWeight: 600,
            }}
          >
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const FeatureCard = ({ feature, index, isDark, colors }) => {
  return (
    <Box
      component={motion.div}
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-50px",
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
      }}
      sx={{
        width: {
          xs: "100%",
          sm: "calc(50% - 8px)",
          lg: "calc(33.333% - 11px)",
        },
        display: "flex",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          p: {
            xs: 2,
            sm: 2.5,
          },
          borderRadius: "28px",
          backgroundColor: colors.surfaceStrong,
          border: `1px solid ${colors.border}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 2.5,
          transition:
            "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          boxShadow: isDark
            ? "0 16px 40px rgba(0,0,0,0.2)"
            : "0 12px 30px rgba(0,0,0,0.035)",

          "&:hover": {
            borderColor: isDark
              ? "rgba(255,255,255,0.16)"
              : "rgba(0,0,0,0.12)",
            boxShadow: isDark
              ? "0 24px 50px rgba(0,0,0,0.28)"
              : "0 18px 40px rgba(0,0,0,0.07)",
          },
        }}
      >
        <Box>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.1,
              py: 0.5,
              borderRadius: "999px",
              mb: 1.5,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)",
              border: `1px solid ${colors.border}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.68rem",
                textTransform: "uppercase",
                fontWeight: 750,
                letterSpacing: "0.06em",
                color: colors.secondaryText,
              }}
            >
              {feature.tag || feature.category || "Feature"}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: {
                xs: "1.12rem",
                md: "1.22rem",
              },
              lineHeight: 1.2,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: colors.text,
              mb: 1,
            }}
          >
            {feature.title}
          </Typography>

          <Typography
            sx={{
              fontSize: "0.88rem",
              lineHeight: 1.7,
              color: colors.secondaryText,
            }}
          >
            {feature.description}
          </Typography>
        </Box>

        <BunkMateFeatureMockup
          type={feature.previewType || "dashboard"}
          isDark={isDark}
          colors={colors}
        />
      </Paper>
    </Box>
  );
};

const FeaturesSection = () => {
  const { isDark } = useCustomTheme();

  const [features, setFeatures] = useState(
    FALLBACK_BUNKMATE_FEATURES
  );

  const [upcoming, setUpcoming] = useState(
    FALLBACK_UPCOMING
  );

  const [selectedCategory, setSelectedCategory] =
    useState("All");

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
    const docRef = doc(db, "landing_page", "home");

    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          setFeatures(FALLBACK_BUNKMATE_FEATURES);
          setUpcoming(FALLBACK_UPCOMING);
          return;
        }

        const data = snap.data();

        if (
          Array.isArray(data?.features) &&
          data.features.length
        ) {
          const arr = data.features.map((it, idx) => ({
            id: it.id ?? `feat-${idx}`,
            tag:
              it.tag ??
              it.category ??
              "Feature",
            title:
              it.title ??
              it.name ??
              "BunkMates Tool",
            description:
              it.description ??
              it.content ??
              "",
            color:
              it.color ??
              "#ffffff",
            category:
              it.category ??
              (idx % 3 === 0
                ? "Planning"
                : idx % 3 === 1
                  ? "Finance"
                  : "Social"),
            previewType:
              it.previewType ??
              (idx % 5 === 0
                ? "dashboard"
                : idx % 5 === 1
                  ? "qr-squad"
                  : idx % 5 === 2
                    ? "expenses"
                    : idx % 5 === 3
                      ? "chat"
                      : "timeline"),
          }));

          setFeatures(arr);
        } else {
          setFeatures(FALLBACK_BUNKMATE_FEATURES);
        }

        if (
          Array.isArray(data?.upcoming_features) &&
          data.upcoming_features.length > 0
        ) {
          setUpcoming(data.upcoming_features);
        } else {
          setUpcoming(FALLBACK_UPCOMING);
        }
      },
      (err) => {
        console.error(
          "Error listening to features:",
          err
        );

        setFeatures(FALLBACK_BUNKMATE_FEATURES);
        setUpcoming(FALLBACK_UPCOMING);
      }
    );

    return () => unsub();
  }, []);

  const filteredFeatures =
    selectedCategory === "All"
      ? features
      : features.filter(
          (feature) =>
            feature.category === selectedCategory
        );

  return (
    <Box
      id="features"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: {
          xs: 10,
          sm: 12,
          md: 16,
        },
        backgroundColor: colors.background,
        color: colors.text,
        transition:
          "background-color 0.35s ease, color 0.35s ease",
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
          <motion.div
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
                gap: 0.75,
                px: 1.4,
                py: 0.7,
                mb: 2.5,
                borderRadius: "999px",
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.035)"
                  : "rgba(0,0,0,0.025)",
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
                  fontSize: "0.75rem",
                  fontWeight: 750,
                  letterSpacing: "0.02em",
                  color: colors.secondaryText,
                }}
              >
                BUILT FOR THE WHOLE TRIP
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
                color: colors.text,
                mb: 2.5,
              }}
            >
              Everything your trip needs.
              <br />
              <Box
                component="span"
                sx={{
                  color: colors.secondaryText,
                }}
              >
                All in one place.
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
              Plan together, manage expenses, stay connected
              and keep the important parts of your journey
              within reach.
            </Typography>
          </motion.div>

          {/* Categories */}
          <LayoutGroup id="featuresCategoryNav">
            <Box
              sx={{
                display: "inline-flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 0.5,
                mt: 4,
                p: 0.55,
                maxWidth: "100%",
                borderRadius: "18px",
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                boxShadow: isDark
                  ? "none"
                  : "0 8px 25px rgba(0,0,0,0.035)",
              }}
            >
              {CATEGORIES.map((category) => {
                const active =
                  selectedCategory === category;

                return (
                  <ButtonBase
                    key={category}
                    component={motion.button}
                    onClick={() =>
                      setSelectedCategory(category)
                    }
                    whileTap={{
                      scale: 0.97,
                    }}
                    sx={{
                      position: "relative",
                      borderRadius: "13px",
                      px: {
                        xs: 1.4,
                        sm: 1.8,
                      },
                      py: 0.9,
                      overflow: "hidden",
                    }}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeFeatureCategory"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 13,
                          backgroundColor: colors.text,
                        }}
                      />
                    )}

                    <Typography
                      sx={{
                        position: "relative",
                        zIndex: 1,
                        fontSize: "0.82rem",
                        fontWeight: active ? 750 : 600,
                        color: active
                          ? colors.background
                          : colors.secondaryText,
                      }}
                    >
                      {category}
                    </Typography>
                  </ButtonBase>
                );
              })}
            </Box>
          </LayoutGroup>
        </Box>

        {/* Feature Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: {
                  xs: 2,
                  md: 2.25,
                },
              }}
            >
              {filteredFeatures.map(
                (feature, index) => (
                  <FeatureCard
                    key={
                      feature.id ||
                      feature.title ||
                      index
                    }
                    feature={feature}
                    index={index}
                    isDark={isDark}
                    colors={colors}
                  />
                )
              )}
            </Box>
          </motion.div>
        </AnimatePresence>

        {/* Roadmap */}
        <Box
          component={motion.div}
          initial={{
            opacity: 0,
            y: 24,
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
          }}
          sx={{
            mt: {
              xs: 8,
              md: 12,
            },
            p: {
              xs: 2.5,
              sm: 4,
              md: 5,
            },
            borderRadius: {
              xs: "28px",
              md: "32px",
            },
            backgroundColor: colors.surfaceStrong,
            border: `1px solid ${colors.border}`,
            boxShadow: isDark
              ? "0 20px 60px rgba(0,0,0,0.2)"
              : "0 18px 45px rgba(0,0,0,0.04)",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            spacing={{
              xs: 4,
              md: 6,
            }}
          >
            <Box
              sx={{
                maxWidth: 470,
              }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "15px",
                  mb: 2,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(0,0,0,0.045)",
                  color: colors.text,
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
                  color: colors.text,
                  mb: 1.25,
                }}
              >
                Still packing more into BunkMates.
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  color: colors.secondaryText,
                }}
              >
                BunkMates keeps evolving with new ways to
                plan, coordinate and experience trips
                together.
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {upcoming.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: 12,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.35,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 1.4,
                      py: 1.15,
                      borderRadius: "15px",
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.subtleBorder}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 25,
                        height: 25,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "9px",
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "#ffffff",
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                    >
                      <CheckRoundedIcon
                        sx={{
                          fontSize: 15,
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.86rem",
                        fontWeight: 550,
                        color: colors.text,
                      }}
                    >
                      {item}
                    </Typography>

                    <ArrowForwardRoundedIcon
                      sx={{
                        ml: "auto",
                        fontSize: 17,
                        color: colors.secondaryText,
                        opacity: 0.55,
                      }}
                    />
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;