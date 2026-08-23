import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  alpha,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import LockPersonRoundedIcon from "@mui/icons-material/LockPersonRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import BalanceRoundedIcon from "@mui/icons-material/BalanceRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import { useCustomTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const M3_EXPRESSIVE_PALETTE = {
  purple: {
    accent: "#c8b6ff",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(75, 36, 140, 0.55) 0%, #09090b 75%)",
    light: { bg: "#EBDCFF", text: "#25005A", container: "#F6EEFF", onContainer: "#6940A5", badgeBg: "#D4BFF2" },
    dark: { bg: "#e2d1ff", text: "#44236f", container: "#ecdeff", onContainer: "#a473ff", badgeBg: "#422271" },
  },
  emerald: {
    accent: "#8cefcb",
    light: { bg: "#A6F5BA", text: "#00210E", container: "#DBFCE3", onContainer: "#006D37" },
    dark: { bg: "#b6ffd7", text: "#21542e", container: "#e4fff0", onContainer: "#17c14d" },
  },
  orange: {
    accent: "#ffd6b4",
    light: { bg: "#FFDBCA", text: "#341000", container: "#FFECE2", onContainer: "#984013" },
    dark: { bg: "#ffdac5", text: "#703e26", container: "#ffeae2", onContainer: "#fb712c" },
  },
  blue: {
    accent: "#88b7f0",
    light: { bg: "#D7E3FF", text: "#001B3F", container: "#EEF2FF", onContainer: "#004785" },
    dark: { bg: "#d3e7ff", text: "#203362", container: "#e2f0ff", onContainer: "#457ed8" },
  },
};

const communityPillars = [
  {
    icon: Diversity3RoundedIcon,
    title: "Respect & Inclusivity",
    desc: "Treat co-travelers and hosts with dignity. Harassment, hateful rhetoric, discrimination, or abusive conduct are strictly prohibited across all spaces.",
    palette: M3_EXPRESSIVE_PALETTE.purple,
  },
  {
    icon: HandshakeRoundedIcon,
    title: "Honest Collaboration",
    desc: "Maintain integrity in shared itineraries, split settlements, and joint bookings. Transparency preserves team camaraderie and trust.",
    palette: M3_EXPRESSIVE_PALETTE.emerald,
  },
  {
    icon: ReportRoundedIcon,
    title: "Safety & Environmental Care",
    desc: "Never log unsafe trails, hazard markers, or unlawful activities. Respect local cultures, protected nature reserves, and Leave No Trace tenets.",
    palette: M3_EXPRESSIVE_PALETTE.orange,
  },
  {
    icon: LockPersonRoundedIcon,
    title: "Consent & Privacy Boundaries",
    desc: "Do not upload sensitive personal identification or candid squad photos to shared community areas without explicit approval.",
    palette: M3_EXPRESSIVE_PALETTE.blue,
  },
];

const formalArticleCards = [
  {
    tag: "ARTICLE 01",
    icon: VerifiedUserRoundedIcon,
    title: "Core Standards",
    summary: "Fundamental expectations for every verified account holder participating in or organizing a squad trip.",
    palette: M3_EXPRESSIVE_PALETTE.purple,
    clauses: [
      {
        heading: "Civil Communication",
        text: "Direct messaging, squad channels, and joint threads must remain constructive and free from intimidation.",
      },
      {
        heading: "Expense Transparency",
        text: "Members logging shared receipts or transport splits must submit accurate monetary figures and valid bills.",
      },
    ],
  },
  {
    tag: "ARTICLE 02",
    icon: BlockRoundedIcon,
    title: "Prohibited Actions",
    summary: "High-severity infractions resulting in immediate enforcement action, suspension, or blacklisting.",
    palette: M3_EXPRESSIVE_PALETTE.orange,
    clauses: [
      {
        heading: "Hate Speech & Harassment",
        text: "Targeting individuals based on race, origin, sexual orientation, disability, gender, or religious beliefs.",
      },
      {
        heading: "Fraud & Impersonation",
        text: "Posing as guides, personnel, or creating fictitious member accounts for financial solicitation.",
      },
    ],
  },
  {
    tag: "ARTICLE 03",
    icon: BalanceRoundedIcon,
    title: "Enforcement Matrix",
    summary: "How our safety systems and human moderation panels review flagged reports and apply penalties.",
    palette: M3_EXPRESSIVE_PALETTE.emerald,
    clauses: [
      {
        heading: "Incident Reporting",
        text: "Members can flag suspicious activity or irregular expense logs directly using the reporting menu.",
      },
      {
        heading: "Tiered Penalties",
        text: "Responses range from formal warnings and shadow restrictions to permanent account bans.",
      },
    ],
  },
];

export default function CommunityGuidelinesPage() {
  const { isDark } = useCustomTheme();
  const navigate = useNavigate();

  const purpleTheme = M3_EXPRESSIVE_PALETTE.purple;

  const colors = {
    background: isDark ? "#000000" : "#f1f3f5",
    surface: isDark ? "#0d0e12" : "#ffffff",
    surfaceInner: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
    surfaceHighlight: isDark ? "rgba(200, 182, 255, 0.07)" : "rgba(105, 64, 165, 0.04)",
    text: isDark ? "#ffffff" : "#09090b",
    secondaryText: isDark ? "#a1a1aa" : "#64748b",
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: { xs: 12, sm: 14, md: 16 },
          pb: { xs: 8, md: 12 },
          px: { xs: 1.5, sm: 2.5, md: 3 },
        }}
      >
        <Container maxWidth="lg">
          {/* Header Badge & Title */}
          <Box
            sx={{
              maxWidth: 820,
              mx: "auto",
              textAlign: "center",
              mb: { xs: 5, md: 7 },
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.8,
                px: 1.6,
                py: 0.65,
                mb: 2.5,
                borderRadius: "999px",
                backgroundColor: isDark ? alpha(purpleTheme.accent, 0.12) : purpleTheme.light.container,
                boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 1px 0px rgba(0,0,0,0.01)",
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: purpleTheme.accent }} />
              <Typography
                sx={{
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: isDark ? purpleTheme.accent : purpleTheme.light.onContainer,
                }}
              >
                STANDARDS & INTEGRITY
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.2rem", sm: "3rem", md: "3.6rem" },
                lineHeight: 1.1,
                fontWeight: 850,
                letterSpacing: { xs: "-0.035em", md: "-0.05em" },
                color: "#e2d1ff",
                mb: 2,
              }}
            >
              Community guidelines for{" "}
              <Box
                component="span"
                sx={{
                  color: isDark ? "#8b76a8" : purpleTheme.light.onContainer,
                }}
              >
                every adventure.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 680,
                mx: "auto",
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                lineHeight: 1.7,
                color: colors.secondaryText,
              }}
            >
              BunkMates is dedicated to cultivating an atmosphere of safety, fair participation, and mutual respect. These institutional standards apply to every trip squad, split ledger, and joint collaboration space.
            </Typography>
          </Box>

          {/* 4 Core Pillars Strip */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
              gap: 2,
              mb: 3.5,
            }}
          >
            {communityPillars.map((item, idx) => {
              const Icon = item.icon;
              const cardColor = isDark ? item.palette.dark : item.palette.light;

              return (
                <Box
                  key={idx}
                  sx={{
                    p: 2.5,
                    borderRadius: "22px",
                    backgroundColor: cardColor.container,
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 180,
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: isDark ? alpha(item.palette.accent, 0.2) : "#ffffff",
                      color: isDark ? cardColor.text : cardColor.onContainer,
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ fontSize: 22 }} />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        color: isDark ? cardColor.text : cardColor.onContainer,
                        fontWeight: 800,
                        fontSize: "0.95rem",
                        letterSpacing: "-0.02em",
                        mb: 0.6,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: isDark ? alpha(cardColor.text, 0.85) : alpha(cardColor.onContainer, 0.85),
                        fontSize: "0.8rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* 3 Articles Rendered as Structured Cards Above */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 2.5,
              mb: 3.5,
            }}
          >
            {formalArticleCards.map((article, aIdx) => {
              const ArticleIcon = article.icon;
              const cardColor = isDark ? article.palette.dark : article.palette.light;

              return (
                <Box
                  key={aIdx}
                  sx={{
                    p: { xs: 2.8, sm: 3.2 },
                    borderRadius: "26px",
                    backgroundColor: colors.surface,
                    boxShadow: isDark
                      ? "inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 12px 30px rgba(0, 0, 0, 0.4)"
                      : "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 8px 24px rgba(0, 0, 0, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                      <Chip
                        label={article.tag}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: "0.7rem",
                          fontWeight: 850,
                          letterSpacing: "0.06em",
                          borderRadius: "8px",
                          backgroundColor: cardColor.container,
                          color: isDark ? cardColor.text : cardColor.onContainer,
                        }}
                      />
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: isDark ? alpha(article.palette.accent, 0.16) : cardColor.container,
                          color: isDark ? article.palette.accent : cardColor.onContainer,
                        }}
                      >
                        <ArticleIcon sx={{ fontSize: 19 }} />
                      </Box>
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 850,
                        fontSize: "1.18rem",
                        letterSpacing: "-0.03em",
                        color: colors.text,
                        mb: 0.8,
                      }}
                    >
                      {article.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        color: colors.secondaryText,
                        lineHeight: 1.55,
                        mb: 2,
                      }}
                    >
                      {article.summary}
                    </Typography>

                    <Stack spacing={1.2}>
                      {article.clauses.map((clause, cIdx) => (
                        <Box
                          key={cIdx}
                          sx={{
                            p: 1.5,
                            borderRadius: "16px",
                            backgroundColor: colors.surfaceHighlight,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.82rem",
                              fontWeight: 750,
                              color: isDark ? article.palette.accent : cardColor.onContainer,
                              mb: 0.2,
                            }}
                          >
                            {clause.heading}
                          </Typography>
                          <Typography sx={{ fontSize: "0.76rem", color: colors.secondaryText, lineHeight: 1.5 }}>
                            {clause.text}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Governance & Reporting Footer Card */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              boxSizing: "border-box",
              width: "100%",
              p: { xs: 3, sm: 4.5, md: 5 },
              borderRadius: { xs: "32px", sm: "34px", md: "36px" },
              backgroundColor: colors.surface,
              boxShadow: isDark
                ? "inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 16px 40px rgba(0, 0, 0, 0.45)"
                : "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 12px 32px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Ambient Radial Accent */}
            <Box
              sx={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: purpleTheme.ambientGradient,
                filter: "blur(40px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.1fr) minmax(0, 0.9fr)" },
                  gap: { xs: 4, md: 6 },
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "15px",
                      mb: 2,
                      backgroundColor: isDark ? alpha(purpleTheme.accent, 0.16) : purpleTheme.light.container,
                      color: isDark ? purpleTheme.accent : purpleTheme.light.onContainer,
                      boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)",
                    }}
                  >
                    <GavelRoundedIcon sx={{ fontSize: 26 }} />
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 850,
                      letterSpacing: "-0.03em",
                      color: colors.text,
                      fontSize: { xs: "1.3rem", sm: "1.55rem" },
                      mb: 1.2,
                    }}
                  >
                    Framework & Governance
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      lineHeight: 1.7,
                      color: colors.secondaryText,
                    }}
                  >
                    Participation across BunkMates implies acceptance of these community standards. Failure to uphold these provisions compromises squad integrity and may trigger immediate restriction of joint trip privileges.
                  </Typography>
                </Box>

                {/* Grievance Action Box */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: "20px",
                    backgroundColor: colors.surfaceInner,
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Typography sx={{ fontSize: "0.88rem", fontWeight: 800, color: colors.text, mb: 0.4 }}>
                    Need to file an official grievance?
                  </Typography>
                  <Typography sx={{ fontSize: "0.78rem", color: colors.secondaryText, lineHeight: 1.55, mb: 1.8 }}>
                    Our Trust & Safety Committee evaluates flagged accounts, harassment disputes, and fraudulent expense logs within 24 hours.
                  </Typography>
                  <Button
                    onClick={() => navigate("/contact")}
                    startIcon={<EmailRoundedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      py: 0.7,
                      px: 2.2,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 750,
                      fontSize: "0.82rem",
                      backgroundColor: isDark ? purpleTheme.dark.bg : purpleTheme.light.bg,
                      color: isDark ? purpleTheme.dark.text : purpleTheme.light.text,
                      "&:hover": {
                        backgroundColor: purpleTheme.accent,
                        color: "#25005A",
                      },
                    }}
                  >
                    Contact Trust & Safety Desk
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 3 }} />

              {/* Bottom Assurance Footer */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                }}
              >
                <Typography variant="caption" sx={{ color: colors.secondaryText, fontSize: "0.78rem" }}>
                  Governing Policy Edition: August 2026 · Standard Operating Framework for Squad Interactions.
                </Typography>

                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Button
                    onClick={() => navigate("/bm-install")}
                    startIcon={<DownloadRoundedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      px: 2,
                      py: 0.6,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 750,
                      fontSize: "0.8rem",
                      backgroundColor: colors.surfaceInner,
                      color: colors.text,
                      boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)",
                      "&:hover": {
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    Install App
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}