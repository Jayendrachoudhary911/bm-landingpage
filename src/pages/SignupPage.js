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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Google,
  Person,
  ArrowBack,
  LockOutlined,
  BadgeOutlined,
} from '@mui/icons-material';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../context/ThemeContext';

const provider = new GoogleAuthProvider();
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const SignupPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [googleUsername, setGoogleUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleDialogOpen, setGoogleDialogOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();
  const { gradients } = useCustomTheme();

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#94a3b8' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: 2, label: 'Good', color: '#f59e0b' };
    return { score: 3, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(password);

  const saveUserToFirestore = async (user, customUsername, customName) => {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      bio: '',
      email: user.email,
      friends: [],
      mobile: '',
      name: customName || user.displayName || '',
      nicknames: {},
      photoURL: user.photoURL || '',
      type: 'Regular',
      username: customUsername.toLowerCase().trim(),
    });
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill out all required fields.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (password !== confirmPass) {
      setErrorMsg('Passwords do not match.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(userCred.user, { displayName: name.trim() });
      await saveUserToFirestore(userCred.user, username, name);
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

  const handleGoogleSignup = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        navigate('/');
        return;
      }
      setGoogleUser(user);
      setGoogleUsername(user.email.split('@')[0]);
      setGoogleDialogOpen(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message.replace('Firebase: ', ''));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleUsernameSave = async () => {
    if (!googleUsername.trim()) {
      alert('Please choose a username.');
      return;
    }
    try {
      await updateProfile(googleUser, { displayName: googleUser.displayName || googleUsername });
      await saveUserToFirestore(googleUser, googleUsername, googleUser.displayName);
      setGoogleDialogOpen(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    }
  };

  return (
    <>
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
          py: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Glowing Orbs */}
        <MotionBox
          animate={{
            x: [20, -20, 20],
            y: [-15, 15, -15],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          sx={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.25), transparent 70%)",
            filter: "blur(65px)",
            pointerEvents: "none",
          }}
        />

        {/* Top action bar: Back */}
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

        {/* Signup Card */}
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
            maxWidth: 460,
            borderRadius: 5,
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.92))',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.15)',
            mt: { xs: 8, sm: 4 },
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Box textAlign="center" mb={3}>
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
              <Person sx={{ fontSize: 30 }} />
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
              Create Account
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#94a3b8',
                fontSize: '0.95rem',
              }}
            >
              Join BunkMates and plan trips seamlessly with your friends.
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSignup}>
            <TextField
              label="Full Name"
              fullWidth
              variant="outlined"
              margin="dense"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#38bdf8' }} />
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
              label="Username"
              fullWidth
              variant="outlined"
              margin="dense"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlined sx={{ color: '#38bdf8' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3.5,
                  color: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  mt: 1,
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                  },
                  '&:hover fieldset': { borderColor: '#38bdf8' },
                  '&.Mui-focused fieldset': { borderColor: '#0284c7' },
                },
              }}
            />

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
                  mt: 1,
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
                  mt: 1,
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                  },
                  '&:hover fieldset': { borderColor: '#38bdf8' },
                  '&.Mui-focused fieldset': { borderColor: '#0284c7' },
                },
              }}
            />

            {/* Password Strength Meter */}
            {password && (
              <Box sx={{ mt: 1, px: 0.5 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Password Strength:
                  </Typography>
                  <Typography variant="caption" fontWeight={700} sx={{ color: strength.color }}>
                    {strength.label}
                  </Typography>
                </Box>
                <Box display="flex" gap={0.6}>
                  {[1, 2, 3].map((step) => (
                    <Box
                      key={step}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: step <= strength.score ? strength.color : 'rgba(255,255,255,0.1)',
                        transition: 'background-color 0.3s ease',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              margin="dense"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#94a3b8' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                mt: 3,
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
              {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
            </Button>
          </form>

          <Divider
            sx={{
              my: 2.5,
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
            onClick={handleGoogleSignup}
          >
            {googleLoading ? "Connecting..." : "Sign Up with Google"}
          </Button>

          <Typography
            variant="body2"
            sx={{
              mt: 3,
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            Already have an account?{' '}
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
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
          </Typography>
        </MotionPaper>
      </Box>

      {/* Google Username Completion Dialog */}
      <Dialog
        open={googleDialogOpen}
        onClose={() => setGoogleDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(15, 23, 42, 0.98)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#fff',
            borderRadius: 4,
            p: 2,
            minWidth: { xs: 300, sm: 380 },
            backdropFilter: 'blur(24px)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, color: '#fff' }}>
          Complete Your Profile
        </DialogTitle>
        <DialogContent>
          {googleUser && (
            <Box textAlign="center" mb={2}>
              <Avatar
                src={googleUser.photoURL}
                sx={{
                  width: 72,
                  height: 72,
                  mx: 'auto',
                  mb: 1.5,
                  border: '3px solid #38bdf8',
                  boxShadow: '0 0 15px rgba(56,189,248,0.4)',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                {googleUser.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: 13 }}>
                {googleUser.email}
              </Typography>
            </Box>
          )}
          <TextField
            label="Choose a Username"
            fullWidth
            variant="outlined"
            margin="normal"
            value={googleUsername}
            onChange={(e) => setGoogleUsername(e.target.value)}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            InputProps={{
              sx: {
                borderRadius: 3,
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: '#38bdf8' },
                '&.Mui-focused fieldset': { borderColor: '#0284c7' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button
            onClick={() => setGoogleDialogOpen(false)}
            sx={{
              color: '#94a3b8',
              borderRadius: '999px',
              textTransform: 'none',
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleGoogleUsernameSave}
            sx={{
              background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
              color: '#fff',
              textTransform: 'none',
              borderRadius: '999px',
              px: 4,
              fontWeight: 700,
            }}
          >
            Save & Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignupPage;
