import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
  useTheme,
  Tooltip,
  Link,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const AboutSectionTeam = () => {
  const theme = useTheme();
  const [form, setForm] = useState({
  name: '',
  email: '',
  message: '',
});
const [submitted, setSubmitted] = useState(false);

const formValid =
  form.name.trim() !== '' &&
  /\S+@\S+\.\S+/.test(form.email) &&
  form.message.trim() !== '';


  return (
    <Box
      id="about"
      sx={{
        py: { xs: 8, md: 10 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            align="center"
            sx={{
              mb: 3,
              color: '#000',
            }}
          >
            About Us
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ maxWidth: 720, mx: 'auto', fontSize: '1.05rem', mb: 6 }}
          >
            We are a passionate team of developers and travelers, building BunkMates to make
            group trips fun, collaborative, and stress-free. Our mission is to bring people
            together and simplify planning so that all you need to focus on is enjoying the journey.
          </Typography>
        </motion.div>

        {/* Connect With Us Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            align="center"
            sx={{ mb: 2 }}
          >
            Connect With Us
          </Typography>

          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Tooltip title="Email Us">
              <IconButton
                component={Link}
                href="mailto:hello@bunkmates.app"
                target="_blank"
                rel="noopener"
                sx={{
                  color: theme.palette.text.primary,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.2)', color: theme.palette.primary.main },
                }}
              >
                <EmailOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="LinkedIn">
              <IconButton
                component={Link}
                href="https://www.linkedin.com/company/bunkmates"
                target="_blank"
                rel="noopener"
                sx={{
                  color: theme.palette.text.primary,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.2)', color: '#0077B5' },
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Twitter">
              <IconButton
                component={Link}
                href="https://twitter.com/bunkmatesapp"
                target="_blank"
                rel="noopener"
                sx={{
                  color: theme.palette.text.primary,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.2)', color: '#1DA1F2' },
                }}
              >
                <TwitterIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </motion.div> */}


        {/* <motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.5 }}
  viewport={{ once: true }}
>
  <Typography
    variant="h5"
    fontWeight={600}
    align="center"
    sx={{ mt: 6, mb: 2 }}
  >
    Contact Us
  </Typography>

  <Box
    component="form"
    onSubmit={(e) => {
      e.preventDefault();
      if (formValid) {
        // Replace with your email handling logic
        console.log(form);
        setSubmitted(true);
      }
    }}
    sx={{
      maxWidth: 500,
      mx: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <TextField
      label="Name"
      variant="outlined"
      fullWidth
      required
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      error={submitted && form.name.trim() === ''}
      helperText={submitted && form.name.trim() === '' ? 'Name is required' : ''}
    />

    <TextField
      label="Email"
      variant="outlined"
      fullWidth
      required
      type="email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      error={submitted && !/\S+@\S+\.\S+/.test(form.email)}
      helperText={
        submitted && !/\S+@\S+\.\S+/.test(form.email)
          ? 'Enter a valid email'
          : ''
      }
    />

    <TextField
      label="Message"
      variant="outlined"
      fullWidth
      required
      multiline
      rows={4}
      value={form.message}
      onChange={(e) => setForm({ ...form, message: e.target.value })}
      error={submitted && form.message.trim() === ''}
      helperText={submitted && form.message.trim() === '' ? 'Message is required' : ''}
    />

    <Button
      variant="contained"
      type="submit"
      sx={{
        mt: 1,
        borderRadius: '12px',
        py: 1.3,
        fontWeight: 600,
        textTransform: 'none',
        backgroundColor: "#000",
        border: "1.2px solid #00000000",
        boxShadow: 'none',
        color: "#fff",
        transition: "ease-in-out 0.2s",
            '&:hover': {
                backgroundColor: "#fff",
                color: "#000",
                border: "1.2px solid #000000",
                boxShadow: 'none',
            },
      }}
    >
      Send Message
    </Button>

    {formValid && submitted && (
      <Alert severity="success" sx={{ mt: 2 }}>
        Your message has been sent!
      </Alert>
    )}
  </Box>
</motion.div> */}

      </Container>
    </Box>
  );
};

export default AboutSectionTeam;
