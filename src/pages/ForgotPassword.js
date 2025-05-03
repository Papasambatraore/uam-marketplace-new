import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { sendPasswordResetEmail } from '../services/emailService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Vérifier si l'email existe dans le localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email);

      if (!user) {
        setError('Aucun compte trouvé avec cet email');
        setLoading(false);
        return;
      }

      // Générer un code de réinitialisation
      const resetCode = Math.floor(100000 + Math.random() * 900000);
      const resetExpiry = Date.now() + 3600000; // 1 heure

      // Sauvegarder le code dans le localStorage
      localStorage.setItem('resetCode', JSON.stringify({
        email,
        code: resetCode,
        expiry: resetExpiry
      }));

      // Envoyer l'email avec le code
      const result = await sendPasswordResetEmail(
        email,
        user.name,
        user.surname,
        resetCode
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      setSuccess(true);
      navigate('/reset-password', { state: { email } });

    } catch (error) {
      setError('Une erreur est survenue lors de l\'envoi de l\'email. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" gutterBottom>
          Mot de passe oublié
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Entrez votre adresse email pour recevoir un code de réinitialisation
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            Un code de réinitialisation a été envoyé à votre email
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Envoyer le code'}
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
    </Container>
  );
};

export default ForgotPassword; 