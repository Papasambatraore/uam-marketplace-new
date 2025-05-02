import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useNavigate } from 'react-router-dom';

const Input = styled('input')({
  display: 'none',
});

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    department: '',
    avatar: null,
    avatarUrl: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        avatar: user.avatar || null,
        avatarUrl: user.avatarUrl || null,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        avatar: file,
        avatarUrl
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      const userData = {
        ...formData,
        id: Date.now(),
        avatarUrl: formData.avatarUrl
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: '#1976d2', 
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', sm: '2rem' },
          mb: 3
        }}>
          Mon Profil
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={formData.avatarUrl}
                  sx={{ 
                    width: { xs: 100, sm: 120 }, 
                    height: { xs: 100, sm: 120 },
                    fontSize: { xs: '2.5rem', sm: '3rem' }
                  }}
                >
                  {formData.name.charAt(0).toUpperCase()}
                </Avatar>
                <label htmlFor="icon-button-file">
                  <Input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: { xs: 0, sm: 8 },
                      right: { xs: 0, sm: 8 },
                      backgroundColor: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Département"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ 
                  height: { xs: 40, sm: 48 },
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Enregistrer les modifications'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile; 