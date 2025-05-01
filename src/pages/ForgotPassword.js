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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Récupérer les utilisateurs du localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Vérifier si l'email existe
    const user = users.find(u => u.email === email);
    
    if (!user) {
      setError('Aucun compte trouvé avec cet email');
      setSnackbarOpen(true);
      return;
    }

    // Générer un nouveau mot de passe temporaire
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Mettre à jour le mot de passe de l'utilisateur
    const updatedUsers = users.map(u => 
      u.email === email ? { ...u, password: tempPassword } : u
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Envoyer un email avec le nouveau mot de passe
    const emailContent = {
      to: email,
      subject: 'Récupération de mot de passe - UAM Marketplace',
      text: `Bonjour ${user.surname} ${user.name},\n\nVotre nouveau mot de passe temporaire est : ${tempPassword}\n\nVeuillez vous connecter avec ce mot de passe et le changer immédiatement pour des raisons de sécurité.\n\nCordialement,\nL'équipe UAM Marketplace`
    };

    // Envoyer l'email via le backend
    fetch('http://localhost:5000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        setSuccess(true);
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Erreur lors de l\'envoi de l\'email');
        setSnackbarOpen(true);
      }
    })
    .catch(err => {
      console.error('Erreur détaillée:', err);
      setError('Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.');
      setSnackbarOpen(true);
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" gutterBottom>
          Récupération de mot de passe
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
          Entrez votre adresse email pour recevoir un nouveau mot de passe temporaire
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Envoyer
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
          >
            Retour à la connexion
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
            ? 'Un email avec votre nouveau mot de passe a été envoyé'
            : error || 'Une erreur est survenue'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ForgotPassword; 