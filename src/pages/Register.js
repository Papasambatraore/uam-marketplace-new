import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.surname) newErrors.surname = 'Le prénom est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Le numéro de téléphone est requis';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.some(user => user.email === formData.email);
      
      if (userExists) {
        setSnackbar({
          open: true,
          message: 'Un utilisateur avec cet email existe déjà',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      // Créer un nouvel utilisateur
      const newUser = {
        id: Date.now(),
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        createdAt: new Date().toISOString(),
        isVerified: true
      };

      // Sauvegarder l'utilisateur
      localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
      
      // Connecter l'utilisateur automatiquement
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(newUser));

      setSnackbar({
        open: true,
        message: 'Inscription réussie ! Bienvenue sur UAM Marketplace.',
        severity: 'success'
      });

      // Rediriger vers le tableau de bord après 2 secondes
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setSnackbar({
        open: true,
        message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5">
          Inscription
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Nom"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="surname"
                label="Prénom"
                variant="outlined"
                fullWidth
                value={formData.surname}
                onChange={handleChange}
                error={!!errors.surname}
                helperText={errors.surname}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phoneNumber"
                label="Numéro de téléphone"
                variant="outlined"
                fullWidth
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Mot de passe"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                label="Confirmer le mot de passe"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
          </Grid>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'S\'inscrire'}
          </SubmitButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Déjà un compte ? Connectez-vous
              </Link>
            </Grid>
          </Grid>
        </StyledForm>
      </StyledPaper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Register; 