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
  Link,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { sendPasswordResetEmail } from '../services/emailService';

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
  const location = useLocation();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSnackbarMessage('');

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        setSnackbarMessage('Email ou mot de passe incorrect');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('Une erreur est survenue');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetStatus(null);

    try {
      const result = await sendPasswordResetEmail(resetEmail);
      setResetStatus(result);
      if (result.success) {
        setShowResetForm(false);
      }
    } catch (error) {
      setResetStatus({ success: false, message: 'Erreur lors de la réinitialisation' });
    } finally {
      setLoading(false);
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

        {!showResetForm ? (
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
            {snackbarMessage && (
              <Alert severity={snackbarSeverity} sx={{ mt: 2 }}>
                {snackbarMessage}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Se connecter'}
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
                  onClick={() => setShowResetForm(true)}
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
        ) : (
          <Box component="form" onSubmit={handleResetPassword} sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Réinitialisation du mot de passe
            </Typography>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              margin="normal"
              required
            />
            {resetStatus && (
              <Alert severity={resetStatus.success ? "success" : "error"} sx={{ mt: 2 }}>
                {resetStatus.message}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Envoyer le mot de passe'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => setShowResetForm(false)}
                sx={{ color: 'primary.main' }}
              >
                Retour à la connexion
              </Link>
            </Box>
          </Box>
        )}
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