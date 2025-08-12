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

  // Save user to Firestore in your structure
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

  // Google signup with details fetch
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        navigate('/');
        return;
      }

      // Store Google user in state for username prompt
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
              maxWidth: 420,
              borderRadius: 4,
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255,255,255,0.85)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 3 }}>
              Create an Account
            </Typography>

            <TextField
              label="Full Name"
              fullWidth
              variant="outlined"
              margin="normal"
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
              }}
            />

            <TextField
              label="Username"
              fullWidth
              variant="outlined"
              margin="normal"
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
              }}
            />

            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
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
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              margin="normal"
              onChange={(e) => setConfirmPass(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3, borderRadius: 2, py: 1.3, background: 'linear-gradient(90deg, #000, #333)', '&:hover': { background: 'linear-gradient(90deg, #222, #000)' } }}
              onClick={handleSignup}
            >
              Sign Up
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
                '&:hover': { backgroundColor: '#f7f7f7' },
              }}
              onClick={handleGoogleSignup}
            >
              Sign Up with Google
            </Button>
          </Paper>
        </Fade>
      </Box>

      {/* Google Username Dialog */}
<Dialog
  open={googleDialogOpen}
  onClose={() => setGoogleDialogOpen(false)}
  PaperProps={{
    sx: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      border: 'none ',
      boxShadow: "none",
      color: '#000000ff',
      borderRadius: 3,
      p: 2,
      minWidth: 350,
    },
  }}
  BackdropProps={{
    sx: {
      backdropFilter: 'blur(6px)',
      backgroundColor: 'rgba(255, 255, 255, 0.76)',
    },
  }}
>
  <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
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
            border: '2px solid rgba(255, 255, 255, 0.07)',
            boxShadow: 'none',
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {googleUser.displayName}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#00000099', fontSize: 13 }}
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
      sx={{
        input: { color: '#000', borderRadius: 4 },
        label: { color: '#000000b3', borderRadius: 4 },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 4
          },
          '&:hover fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.6)', borderRadius: 4
          },
        },
      }}
    />
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
    <Button
      onClick={() => setGoogleDialogOpen(false)}
      fullWidth
      sx={{
        color: '#000000ff',
        border: '1px solid rgba(0, 0, 0, 0.3)',
        textTransform: 'none',
        borderRadius: 8,
      }}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      fullWidth
      onClick={handleGoogleUsernameSave}
      sx={{
        bgcolor: '#000',
        color: '#fff',
        textTransform: 'none',
        borderRadius: 8,
        px: 3,
        '&:hover': { bgcolor: '#222' },
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
