import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Fade,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Google } from '@mui/icons-material';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const provider = new GoogleAuthProvider();

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f3f3f3, #e8e8e8)',
        p: 2
      }}
    >
      <Fade in timeout={500}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 380,
            borderRadius: 4,
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 3
            }}
          >
            Welcome Back
          </Typography>

          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 3,
              borderRadius: 2,
              py: 1.3,
              background: 'linear-gradient(90deg, #000, #333)',
              '&:hover': { background: 'linear-gradient(90deg, #222, #000)' }
            }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<Google />}
            sx={{
              borderRadius: 2,
              py: 1.3,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#ccc',
              color: '#555',
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: '#f7f7f7',
              },
            }}
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>

          <Typography
            variant="body2"
            sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}
          >
            Don’t have an account?{' '}
            <Button variant="text" size="small" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginPage;
