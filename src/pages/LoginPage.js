import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Google, ArrowBack, LockOutlined } from '@mui/icons-material';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../context/ThemeContext';

const provider = new GoogleAuthProvider();
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();
  const { gradients } = useCustomTheme();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message.replace('Firebase: ', ''));
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message.replace('Firebase: ', ''));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: gradients.headerDark,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Animated Ambient Glowing Orbs */}
      <MotionBox
        animate={{
          x: [-20, 20, -20],
          y: [-15, 15, -15],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.25), transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <MotionBox
        animate={{
          x: [20, -20, 20],
          y: [15, -15, 15],
        }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(129, 140, 248, 0.2), transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Top action bar: Back button */}
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '1160px',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{
            color: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            px: 2.5,
            py: 0.8,
            borderRadius: '999px',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateX(-2px)',
            },
          }}
        >
          Back to Home
        </Button>
      </Box>

      {/* Login Card */}
      <MotionPaper
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: shake ? [-8, 8, -8, 8, 0] : 0,
        }}
        transition={{ duration: 0.5 }}
        elevation={16}
        sx={{
          p: { xs: 3.5, sm: 5 },
          width: '100%',
          maxWidth: 440,
          borderRadius: 5,
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.92))',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.15)',
          mt: { xs: 6, sm: 2 },
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box textAlign="center" mb={3.5}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)',
              mb: 2,
            }}
          >
            <LockOutlined sx={{ fontSize: 28 }} />
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
            gutterBottom
            sx={{
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#94a3b8',
              fontSize: '0.95rem',
            }}
          >
            Sign in to continue planning and exploring with your friends.
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Email Address"
            fullWidth
            variant="outlined"
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#38bdf8' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3.5,
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                },
                '&:hover fieldset': { borderColor: '#38bdf8' },
                '&.Mui-focused fieldset': { borderColor: '#0284c7' },
              },
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: '#38bdf8' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#94a3b8' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3.5,
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                mt: 1.5,
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                },
                '&:hover fieldset': { borderColor: '#38bdf8' },
                '&.Mui-focused fieldset': { borderColor: '#0284c7' },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              mt: 3.5,
              borderRadius: '999px',
              py: 1.4,
              fontWeight: 700,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
              color: '#ffffff',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #60a5fa, #1d4ed8)',
                boxShadow: '0 12px 30px rgba(37, 99, 235, 0.5)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Log In"}
          </Button>
        </form>

        <Divider
          sx={{
            my: 3,
            borderColor: 'rgba(255,255,255,0.1)',
            color: '#64748b',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          OR
        </Divider>

        <Button
          variant="outlined"
          fullWidth
          size="large"
          disabled={googleLoading}
          startIcon={googleLoading ? <CircularProgress size={18} /> : <Google />}
          sx={{
            borderRadius: '999px',
            py: 1.3,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            borderColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255,255,255,0.12)',
              borderColor: '#38bdf8',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(56, 189, 248, 0.2)',
            },
          }}
          onClick={handleGoogleLogin}
        >
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </Button>

        <Typography
          variant="body2"
          sx={{
            mt: 3.5,
            textAlign: 'center',
            color: '#94a3b8',
          }}
        >
          Don’t have an account?{' '}
          <Button
            variant="text"
            size="small"
            sx={{
              color: '#38bdf8',
              fontWeight: 800,
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' },
            }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Typography>
      </MotionPaper>
    </Box>
  );
};

export default LoginPage;
