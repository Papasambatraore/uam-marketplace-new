import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';

const categories = [
  { value: 'livres', label: 'Livres' },
  { value: 'informatique', label: 'Informatique' },
  { value: 'vetements', label: 'Vêtements' },
  { value: 'beaute', label: 'Beauté' },
  { value: 'accessoires', label: 'Accessoires' },
  { value: 'services', label: 'Services' },
];

const CreateAd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    whatsapp: '',
    image: null,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/register');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation des champs requis
    if (!formData.title || !formData.description || !formData.price || 
        !formData.category || !formData.whatsapp) {
      setSnackbarMessage('Veuillez remplir tous les champs obligatoires');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Création de l'annonce
    const newAd = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      whatsapp: formData.whatsapp,
      status: 'active',
      date: new Date().toISOString().split('T')[0],
      userId: JSON.parse(localStorage.getItem('user')).id,
    };

    // Récupération des annonces existantes
    const existingAds = JSON.parse(localStorage.getItem('ads') || '[]');
    
    // Ajout de la nouvelle annonce
    const updatedAds = [...existingAds, newAd];
    
    // Sauvegarde dans le localStorage
    localStorage.setItem('ads', JSON.stringify(updatedAds));

    // Réinitialisation du formulaire
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      whatsapp: '',
      image: null,
    });

    // Affichage du message de succès
    setSnackbarMessage('Annonce publiée avec succès !');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);

    // Redirection vers le tableau de bord après 2 secondes
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Déposer une annonce
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Ajouter une photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {formData.image && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {formData.image.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Titre de l'annonce"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Prix (FCFA)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Catégorie"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Numéro WhatsApp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="221XXXXXXXXX"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Publier l'annonce
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
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

export default CreateAd; 