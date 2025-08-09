import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <Box
      component={motion.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.9, ease: "easeOut" },
        },
      }}
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #E0F7FA, #E3F2FD)",
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
        px: 3,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        sx={{
          background: "linear-gradient(to right, #000, #555)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Get to Know BunkMates
      </Typography>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9 }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          maxWidth={700}
          mx="auto"
          mb={4}
        >
          Discover our mission, team, and the passion driving us to make travel smarter, together.
        </Typography>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Button
            variant="contained"
            href="#contact"
            size="large"
            sx={{
              borderRadius: "30px",
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#000",
              boxShadow: "none",
              '&:hover': {
                backgroundColor: "#fff",
                color: "#000",
              boxShadow: "none",
              },
            }}
          >
            Contact Us
          </Button>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default AboutHero;
