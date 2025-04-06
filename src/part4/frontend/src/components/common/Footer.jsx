import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ textAlign: 'center', padding: '1rem 0', backgroundColor: '#f1f1f1' }}>
      <Container>
        <Typography variant="body2">
          © 2025 כל הזכויות שמורות למערכת ניהול המכולת
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
