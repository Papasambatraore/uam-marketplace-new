import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
} from '@mui/material';

const EditAd = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Modifier l'annonce
        </Typography>
        <Box sx={{ mt: 2 }}>
          {/* Contenu à implémenter */}
        </Box>
      </Paper>
    </Container>
  );
};

export default EditAd; 