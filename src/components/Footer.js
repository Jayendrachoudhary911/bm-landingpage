import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import FacebookIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import CopyrightIcon from "@mui/icons-material/Copyright";

const navLinks = ["Home", "Features", "Pricing", "Blog", "FAQ", "About Us"];

const Footer = () => {
  return (
    <Box
      component={motion.footer}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      sx={{
        mt: 10,
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(12px)",
        px: { xs: 3, md: 12 },
        py: { xs: 6, md: 8 },
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
        borderRadius: "24px 24px 0 0",
        boxShadow: "none",
      }}
    >
      <Grid container spacing={6} justifyContent="space-between">
        {/* Branding */}
        <Grid item xs={12} md={3}>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            sx={{
              background: "linear-gradient(to right, #000, #444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BunkMates
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 280, lineHeight: 1.6 }}
          >
            Travel together, split smarter. All-in-one app for collaborative
            planning, budgeting & group communication.
          </Typography>
        </Grid>

        {/* Navigation Links */}
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Explore
          </Typography>
          <Stack spacing={1}>
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href="#"
                underline="none"
                color="text.primary"
                sx={{
                  fontSize: 14,
                  opacity: 0.85,
                  transition: "0.3s",
                  "&:hover": {
                    color: "primary.main",
                    transform: "translateX(4px)",
                  },
                }}
              >
                {link}
              </Link>
            ))}
          </Stack>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Contact
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EmailIcon fontSize="small" color="#000" />
              <Link
        href="mailto:jayendrachoudhary.am@gmail.com"
        underline="hover"
        color="text.primary"
        sx={{
          fontSize: 14,
          transition: "0.3s",
          '&:hover': {
            color: "primary.main",
            transform: "translateX(2px)",
          },
        }}
      >
        hello@bunkmates.app
      </Link>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOnIcon fontSize="small" color="#000" />
              <Typography variant="body2">Remote · India</Typography>
            </Stack>
          </Stack>
        </Grid>

        {/* Join Beta / Social */}
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            BunkMates Beta
          </Typography>
          <Stack direction="row" spacing={1}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                href="#"
                color="primary"
                variant="contained"
                sx={{
                  borderRadius: "30px",
                  textTransform: "none",
                  px: 3,
                  fontWeight: 500,
                  border: "1.2px solid #000",
                  backgroundColor: "#000",
                  color: "#fff",
                }}
              >
                Join Beta
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                href="#"
                color="primary"
                variant="contained"
                sx={{
                  borderRadius: "30px",
                  textTransform: "none",
                  px: 3,
                  fontWeight: 500,
                  border: "1.2px solid #000",
                  backgroundColor: "#000",
                  color: "#fff",
                }}
              >
                Join Our Community
              </Button>
            </motion.div>
          </Stack>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      {/* Bottom Row */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <CopyrightIcon fontSize="small" />
          <Typography variant="caption">
            {new Date().getFullYear()} BunkMates. All rights reserved.
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Built with ❤️ for modern travelers.
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
