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
        background: 'radial-gradient(circle at top left, #111 0%, #000 80%)',
        color: '#fff',
        p: 2,
      }}
    >
      <Fade in timeout={500}>
        <Paper
          elevation={10}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 4,
            background: 'rgba(20, 20, 20, 0.00)',
            backdropFilter: 'blur(10px)',
            border: '0px solid rgba(255,255,255,0.08)',
            boxShadow: 'none',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 4,
              color: '#fafafa',
              letterSpacing: '0.5px',
            }}
          >
            Welcome Back 👋
          </Typography>

          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: '#aaa' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#888' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                color: '#fff',
                input: { color: '#fff' },
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#666' },
                '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
              },
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#aaa' } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#888' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                color: '#fff',
                input: { color: '#fff' },
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#666' },
                '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 4,
              borderRadius: 2,
              py: 1.3,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #00bcd4, #0097a7)',
              boxShadow: '0 0 10px rgba(0, 188, 212, 0.4)',
              '&:hover': {
                background: 'linear-gradient(90deg, #0097a7, #00acc1)',
                boxShadow: '0 0 20px rgba(0, 188, 212, 0.6)',
              },
            }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)', color: '#666' }}>
            OR
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<Google sx={{ color: '#fff' }} />}
            sx={{
              borderRadius: 2,
              py: 1.3,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.3)',
                boxShadow: '0 0 10px rgba(255,255,255,0.15)',
              },
            }}
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>

          <Typography
            variant="body2"
            sx={{
              mt: 3,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Don’t have an account?{' '}
            <Button
              variant="text"
              size="small"
              sx={{
                color: '#00bcd4',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginPage;
