import { Box, Typography, Avatar, Grid, useTheme } from "@mui/material";
import { motion } from "framer-motion";

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
  // Add more members here
];

// Framer Motion variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.6 },
  },
};

const TeamSection = () => {
  const theme = useTheme();

  return (
    <Box
      id="team"
      sx={{
        py: 10,
        px: 2,
        background: "linear-gradient(to right, #f8f9fa, #ffffff)",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        mb={6}
        sx={{
          background: "linear-gradient(to right, #000, #444)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
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
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 150 }}
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                height: "450px",
                width: 330,
                backgroundImage: `url(${member.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 12px 28px rgba(0, 0, 0, 0.1)",
              }}
            >
             <Box
        sx={{
          position: "relative",
          top: "77%",
          width: "90%",
          mx: "auto",
          px: 3,
          py: 2,
          borderRadius: 3,
          backdropFilter: "blur(12px)",
          background: "rgba(0, 0, 0, 0.29)",
          color: "#fff",
          textAlign: "center",
        }}
        >
              <Typography variant="h6" fontWeight={600}>
                {member.name}
              </Typography>
              <Typography variant="body2" color="#ccc" mt={0.5}>
                {member.role}
              </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TeamSection;
