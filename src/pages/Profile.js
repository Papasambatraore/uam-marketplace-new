import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Avatar,
  TextField,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
  },
}));

const Profile = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setFormData({
      name: currentUser.name || '',
      surname: currentUser.surname || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mettre à jour les informations de l'utilisateur
    const updatedUser = {
      ...user,
      ...formData
    };

    // Mettre à jour le localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Mettre à jour la liste des utilisateurs
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => 
      u.email === user.email ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setSnackbarMessage('Profil mis à jour avec succès');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              fontSize: '3rem',
              bgcolor: theme.palette.primary.main,
              mb: 2,
            }}
          >
            {user.surname?.[0]}{user.name?.[0]}
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            Mon Profil
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nom"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Prénom"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Numéro de téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                >
                  Retour au tableau de bord
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Enregistrer les modifications
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 