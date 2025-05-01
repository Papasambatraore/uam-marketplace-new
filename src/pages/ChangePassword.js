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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Vérifier si les mots de passe correspondent
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setSnackbarOpen(true);
      return;
    }

    // Vérifier la longueur du mot de passe
    if (formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setSnackbarOpen(true);
      return;
    }

    // Récupérer l'utilisateur actuel
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Vérifier si l'ancien mot de passe est correct
    if (currentUser.password !== formData.currentPassword) {
      setError('Mot de passe actuel incorrect');
      setSnackbarOpen(true);
      return;
    }

    // Mettre à jour le mot de passe
    const updatedUsers = users.map(user => 
      user.email === currentUser.email 
        ? { ...user, password: formData.newPassword }
        : user
    );

    // Mettre à jour le localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('user', JSON.stringify({
      ...currentUser,
      password: formData.newPassword
    }));

    setSuccess(true);
    setSnackbarOpen(true);
    
    // Rediriger vers le tableau de bord après 2 secondes
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" gutterBottom>
          Changer le mot de passe
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="Mot de passe actuel"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="Nouveau mot de passe"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            helperText="Le mot de passe doit contenir au moins 6 caractères"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmer le nouveau mot de passe"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Changer le mot de passe
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/dashboard')}
          >
            Retour au tableau de bord
          </Button>
        </Box>
      </StyledPaper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {success
            ? 'Mot de passe changé avec succès'
            : error || 'Une erreur est survenue'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChangePassword; 