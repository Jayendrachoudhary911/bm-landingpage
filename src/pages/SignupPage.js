import React, { useState } from "react";
import { Box, Typography, Container, TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert("Signup failed: " + err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" fontWeight={600} textAlign="center" mb={4}>
          Join BunkMates 🌍
        </Typography>
        <Stack spacing={3}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" size="large" fullWidth onClick={handleSignup}>
            Sign Up
          </Button>
          <Button variant="text" onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
