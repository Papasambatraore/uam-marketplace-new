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
          © {currentYear} UAM Marketplace. Tous droits réservés.
          <br />
          Ce site est protégé par les lois sur le droit d'auteur et la propriété intellectuelle.
          <br />
          Toute reproduction ou copie non autorisée est strictement interdite.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 