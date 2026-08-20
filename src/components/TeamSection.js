import { Box, Typography, Grid, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useCustomTheme } from "../context/ThemeContext";

import Jayendrachoudhary_pic from "../assets/team/1.jpeg";
import mohitsharma_pic from "../assets/team/2.jpg";
import sahilsuman_pic from "../assets/team/3.jpg";

const team = [
  {
    name: "Jayendra Choudhary",
    role: "Full Stack Developer",
    image: Jayendrachoudhary_pic,
  },
  {
    name: "Mohit Sharma",
    role: "Backend Developer",
    image: mohitsharma_pic,
  },
  {
    name: "Sahil Suman",
    role: "Frontend Developer",
    image: sahilsuman_pic,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.6 },
  },
};

const TeamSection = () => {
  const { isDark } = useCustomTheme();

  return (
    <Box
      id="team"
      sx={{
        py: { xs: 8, md: 14 },
        px: 2,
        backgroundColor: isDark ? "#000000" : "#f8fafc",
        color: isDark ? "#fff" : "#0f172a",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          fontWeight={800}
          textAlign="center"
          mb={6}
          sx={{
            color: isDark ? "#fff" : "#0f172a",
            letterSpacing: "-0.5px",
          }}
        >
          Meet the Team
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {team.map((member, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={4}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 150 }}
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  height: "440px",
                  maxWidth: "340px",
                  margin: "0 auto",
                  backgroundImage: `url(${member.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: isDark
                    ? "0 20px 40px rgba(0, 0, 0, 0.6)"
                    : "0 20px 40px rgba(0, 0, 0, 0.12)",
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "16px",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    p: 2.5,
                    borderRadius: 3,
                    backdropFilter: "blur(16px)",
                    background: isDark ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.85)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"}`,
                    color: isDark ? "#fff" : "#0f172a",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight={700} sx={{ color: isDark ? "#fff" : "#0f172a" }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? "#38bdf8" : "#0284c7", fontWeight: 600, mt: 0.5 }}>
                    {member.role}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;
