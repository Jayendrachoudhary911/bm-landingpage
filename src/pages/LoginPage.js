import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Paper sx={{ p: 4, width: 300 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <TextField label="Email" fullWidth margin="normal" onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;