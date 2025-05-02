import React, { useState, useEffect } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Vérifier le code de réinitialisation
      const resetData = JSON.parse(localStorage.getItem('resetCode') || '{}');
      
      if (!resetData.email || resetData.email !== email) {
        setError('Code de réinitialisation invalide');
        setLoading(false);
        return;
      }

      if (resetData.code !== parseInt(code)) {
        setError('Code incorrect');
        setLoading(false);
        return;
      }

      if (Date.now() > resetData.expiry) {
        setError('Le code a expiré');
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        setLoading(false);
        return;
      }

      // Mettre à jour le mot de passe
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => 
        user.email === email ? { ...user, password: newPassword } : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Supprimer le code de réinitialisation
      localStorage.removeItem('resetCode');

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" gutterBottom>
          Réinitialiser le mot de passe
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Entrez le code reçu par email et votre nouveau mot de passe
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            Mot de passe réinitialisé avec succès
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label="Code de réinitialisation"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputProps={{ maxLength: 6 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="Nouveau mot de passe"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Réinitialiser le mot de passe'}
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

export default ResetPassword; 