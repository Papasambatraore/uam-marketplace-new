import React, { useState } from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const EditAd = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    whatsapp: '',
    image: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5">
          Modifier l'annonce
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1">
            Page de modification d'annonce en construction
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
}

export default EditAd; 