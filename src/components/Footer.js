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
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Keur Diourgui. Tous droits réservés.
          </Typography>
          
          <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            <Typography variant="body2" color="text.secondary">
              Développé par Samba : 77490 79 82
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 