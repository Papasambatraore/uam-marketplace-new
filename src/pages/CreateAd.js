import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  ImageList,
  ImageListItem,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadImage } from '../services/imageService';

const categories = [
  { name: 'Livres', value: 'livres', color: '#2196f3' },
  { name: 'Informatique', value: 'informatique', color: '#4caf50' },
  { name: 'Vêtements', value: 'vetements', color: '#f44336' },
  { name: 'Beauté', value: 'beaute', color: '#e91e63' },
  { name: 'Accessoires', value: 'accessoires', color: '#9c27b0' },
  { name: 'Services', value: 'services', color: '#ff9800' },
];

const departments = [
  'Droit',
  'Économie',
  'Gestion',
  'Lettres',
  'Sciences',
  'Sciences de l\'éducation',
  'Sciences de la santé',
  'Sciences sociales',
];

const Input = styled('input')({
  display: 'none',
});

const CreateAd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    department: '',
    whatsapp: '',
    images: [],
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    console.log('=== Début du traitement des images ===');
    const files = Array.from(e.target.files);
    console.log('Fichiers sélectionnés:', files);

    if (files.length > 0) {
      try {
        setLoading(true);
        setError('');
        console.log('Début du téléchargement des images...');
        
        const uploadedImages = await Promise.all(
          files.map(async (file) => {
            console.log('Traitement du fichier:', file.name);
            try {
              // Vérification de la taille du fichier (max 5MB)
              if (file.size > 5 * 1024 * 1024) {
                throw new Error(`L'image ${file.name} est trop grande (max 5MB)`);
              }

              // Vérification du type de fichier
              if (!file.type.startsWith('image/')) {
                throw new Error(`Le fichier ${file.name} n'est pas une image`);
              }

              const imageUrl = await uploadImage(file);
              console.log('Image téléchargée avec succès:', imageUrl);
              return imageUrl;
            } catch (error) {
              console.error('Erreur lors du téléchargement:', error);
              throw error;
            }
          })
        );

        console.log('Toutes les images ont été téléchargées:', uploadedImages);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedImages]
        }));
      } catch (error) {
        console.error('Erreur détaillée:', error);
        setError(error.message || 'Erreur lors du téléchargement des images');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Simuler une requête API
      setTimeout(() => {
        const ads = JSON.parse(localStorage.getItem('ads') || '[]');
        const newAd = {
          id: Date.now(),
          ...formData,
          date: new Date().toISOString(),
          userId: JSON.parse(localStorage.getItem('user')).id
        };
        localStorage.setItem('ads', JSON.stringify([...ads, newAd]));
        setLoading(false);
        navigate('/');
      }, 1000);
    } catch (err) {
      setError('Erreur lors de la création de l\'annonce');
      console.error('Erreur lors de la création de l\'annonce:', err);
      setLoading(false);
    }
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
          Créer une nouvelle annonce
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre de l'annonce"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prix (FCFA)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro WhatsApp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                placeholder="Ex: 221774907982"
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Département</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="contained-button-file"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <label htmlFor="contained-button-file">
                  <Button
                    variant="contained"
                    component="span"
                    fullWidth
                    disabled={loading}
                    sx={{ 
                      height: { xs: 40, sm: 48 },
                      fontSize: { xs: '0.8rem', sm: '1rem' }
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Ajouter des photos'}
                  </Button>
                </label>
              </Box>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <ImageList sx={{ width: '100%', height: 200 }} cols={3} rowHeight={164}>
                {formData.images.map((imageUrl, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={imageUrl}
                      alt={`Preview ${index}`}
                      loading="lazy"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                      onLoad={(e) => {
                        e.target.style.opacity = 1;
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Image+non+chargée';
                      }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        color: 'white',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        },
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
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
                {loading ? <CircularProgress size={24} /> : 'Publier l\'annonce'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateAd; 