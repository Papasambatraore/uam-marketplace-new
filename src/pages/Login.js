import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Link,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { login } from '../services/authService';
import { useSnackbar } from 'notistack';

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
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      enqueueSnackbar('Connexion réussie !', { variant: 'success' });

      // Rediriger vers la page précédente ou la page d'accueil
        const from = location.state?.from?.pathname || '/';
        navigate(from);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" gutterBottom>
          Connexion
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
            margin="normal"
              required
              fullWidth
            id="email"
            label="Adresse email"
              name="email"
            autoComplete="email"
            autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
            margin="normal"
              required
              fullWidth
            name="password"
              label="Mot de passe"
              type="password"
            id="password"
            autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Se connecter'}
            </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password" variant="body2">
                  Mot de passe oublié ?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Pas encore de compte ? S'inscrire"}
              </Link>
            </Grid>
          </Grid>
          </Box>
      </StyledPaper>
    </Container>
  );
};

export default Login; 