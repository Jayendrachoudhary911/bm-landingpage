import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box bgcolor="#eeeeee" py={4} mt={4}>
      <Container>
        <Typography variant="body2" textAlign="center">
          Made with ❤️ by BunkMates Team — <Link href="mailto:contact@bunkmates.app">contact@bunkmates.app</Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;