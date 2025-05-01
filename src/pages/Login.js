import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Récupérer les utilisateurs enregistrés
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Trouver l'utilisateur correspondant
    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      // Connexion réussie
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      
      setSnackbarMessage('Connexion réussie !');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Redirection vers le tableau de bord après 1 seconde
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload();
      }, 1000);
    } else {
      setSnackbarMessage('Email ou mot de passe incorrect');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <StyledPaper elevation={3}>
        <Typography 
          component="h1" 
          variant="h4" 
          gutterBottom 
          align="center"
          sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            [theme.breakpoints.down('sm')]: {
              fontSize: '1.75rem',
            },
          }}
        >
          Connexion
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary" 
          align="center" 
          sx={{ mb: 3 }}
        >
          Connectez-vous pour accéder à votre compte
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            autoComplete="email"
            autoFocus
          />
          <TextField
            required
            fullWidth
            label="Mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Se connecter
          </Button>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/register')}
                sx={{ 
                  textTransform: 'none',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '0.875rem',
                  },
                }}
              >
                Créer un compte
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/forgot-password')}
                sx={{ 
                  textTransform: 'none',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '0.875rem',
                  },
                }}
              >
                Mot de passe oublié ?
              </Button>
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

export default Login; 