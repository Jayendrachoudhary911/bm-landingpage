import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, InputAdornment,
  IconButton, Fade, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Google, Person } from '@mui/icons-material';
import {
  createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const provider = new GoogleAuthProvider();

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
  const navigate = useNavigate();

  // Save user to Firestore
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
      username: customUsername
    });
  };

  // Email/Password signup
  const handleSignup = async () => {
    if (password !== confirmPass) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      await saveUserToFirestore(userCred.user, username, name);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  // Google signup
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        navigate('/');
        return;
      }
      setGoogleUser(user);
      setGoogleDialogOpen(true);
    } catch (err) {
      alert(err.message);
    }
  };

  // Save Google username
  const handleGoogleUsernameSave = async () => {
    if (!googleUsername.trim()) {
      alert('Username is required');
      return;
    }
    try {
      await updateProfile(googleUser, { displayName: googleUser.displayName || googleUsername });
      await saveUserToFirestore(googleUser, googleUsername, googleUser.displayName);
      setGoogleDialogOpen(false);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at top left, #111 0%, #000 80%)',
          p: 2,
          color: '#fff',
        }}
      >
        <Fade in timeout={500}>
          <Paper
            elevation={10}
            sx={{
              p: 4,
              width: '100%',
              maxWidth: 420,
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(20,20,20,0.00)',
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
                mb: 3,
                color: '#fafafa',
                letterSpacing: '0.5px',
              }}
            >
              Create an Account
            </Typography>

            {[
              { label: 'Full Name', icon: <Person sx={{ color: '#888' }} />, onChange: setName },
              { label: 'Username', icon: <Person sx={{ color: '#888' }} />, onChange: setUsername },
              { label: 'Email', icon: <Email sx={{ color: '#888' }} />, onChange: setEmail },
            ].map((field, i) => (
              <TextField
                key={i}
                label={field.label}
                fullWidth
                variant="outlined"
                margin="normal"
                onChange={(e) => field.onChange(e.target.value)}
                InputLabelProps={{ style: { color: '#aaa' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {field.icon}
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
            ))}

            {/* Password */}
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

            {/* Confirm Password */}
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              margin="normal"
              onChange={(e) => setConfirmPass(e.target.value)}
              InputLabelProps={{ style: { color: '#aaa' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#888' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                mt: 3,
                borderRadius: 2,
                py: 1.3,
                fontWeight: 600,
                background: 'linear-gradient(90deg, #00bcd4, #0097a7)',
                boxShadow: '0 0 10px rgba(0,188,212,0.4)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #0097a7, #00acc1)',
                  boxShadow: '0 0 20px rgba(0,188,212,0.6)',
                },
              }}
              onClick={handleSignup}
            >
              Sign Up
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
              onClick={handleGoogleSignup}
            >
              Sign Up with Google
            </Button>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 3,
                          textAlign: 'center',
                          color: 'rgba(255,255,255,0.7)',
                        }}
                      >
                        Already have an account?{' '}
                        <Button
                          variant="text"
                          size="small"
                          sx={{
                            color: '#00bcd4',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                          onClick={() => navigate('/login')}
                        >
                          Login
                        </Button>
                      </Typography>
          </Paper>
        </Fade>
      </Box>

      {/* Google Username Dialog */}
      <Dialog
        open={googleDialogOpen}
        onClose={() => setGoogleDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(20,20,20,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
            borderRadius: 3,
            p: 2,
            minWidth: 350,
            backdropFilter: 'blur(12px)',
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: '#fff' }}>
          Complete Your Profile
        </DialogTitle>
        <DialogContent>
          {googleUser && (
            <Box textAlign="center" mb={2}>
              <Avatar
                src={googleUser.photoURL}
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 1,
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 500, color: '#fff' }}>
                {googleUser.displayName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}
              >
                {googleUser.email}
              </Typography>
            </Box>
          )}
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(e) => setGoogleUsername(e.target.value)}
            InputLabelProps={{ style: { color: '#aaa' } }}
            InputProps={{
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
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button
            onClick={() => setGoogleDialogOpen(false)}
            fullWidth
            sx={{
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              textTransform: 'none',
              borderRadius: 8,
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleGoogleUsernameSave}
            sx={{
              bgcolor: '#00bcd4',
              color: '#000',
              textTransform: 'none',
              borderRadius: 8,
              px: 3,
              '&:hover': { bgcolor: '#00acc1' },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignupPage;
