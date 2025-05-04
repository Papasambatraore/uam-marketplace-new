import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[900],
        color: 'white'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © {currentYear} Keur Djourgui. Tous droits réservés.
          <br />
          Développé par Samba : 774907982
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 