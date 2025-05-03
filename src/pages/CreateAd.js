import React, { useState, useEffect } from 'react';
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
  Alert,
  FormHelperText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadImage } from '../services/imageService';

const regions = [
  'Dakar',
  'Thiès',
  'Diourbel',
  'Saint-Louis',
  'Tambacounda',
  'Kaolack',
  'Kolda',
  'Ziguinchor',
  'Louga',
  'Fatick',
  'Kaffrine',
  'Matam',
  'Kédougou',
  'Sédhiou'
];

const animalCategories = [
  { name: 'Chiens', value: 'chiens' },
  { name: 'Lapins', value: 'lapins' },
  { name: 'Volailles', value: 'volailles' },
  { name: 'Moutons', value: 'moutons' },
  { name: 'Reptiles', value: 'reptiles' },
  { name: 'Autres', value: 'autres' },
];

const Input = styled('input')({
  display: 'none',
});

const CreateAd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    department: '',
    whatsapp: '',
    images: [],
    race: '',
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login', { state: { from: '/publier-annonce' } });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      try {
        setLoading(true);
        setError('');
        const uploadedImages = await Promise.all(
          files.map(file => uploadImage(file))
        );
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedImages]
        }));
      } catch (error) {
        setError('Erreur lors du téléchargement des images');
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
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.department || !formData.whatsapp) {
      setError('Veuillez remplir tous les champs obligatoires marqués d\'un astérisque (*)');
      return;
    }

    if (formData.images.length === 0) {
      setError('Veuillez ajouter au moins une photo de l\'animal');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const user = JSON.parse(localStorage.getItem('user'));
      const newAd = {
        ...formData,
        id: Date.now().toString(),
        author: user.name,
        authorAvatar: user.avatar,
        date: new Date().toISOString(),
      };

      const existingAds = JSON.parse(localStorage.getItem('ads') || '[]');
      localStorage.setItem('ads', JSON.stringify([...existingAds, newAd]));

      setSnackbar({
        open: true,
        message: 'Votre annonce a été publiée avec succès !',
        severity: 'success'
      });

      setTimeout(() => {
        navigate('/mes-annonces');
      }, 2000);
    } catch (error) {
      setError('Une erreur est survenue lors de la publication de votre annonce. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Publier une annonce
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre de l'annonce *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                helperText="Donnez un titre clair et descriptif à votre annonce"
                error={error && !formData.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description *"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                helperText="Décrivez l'animal en détail (race, âge, comportement, etc.)"
                error={error && !formData.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Prix (FCFA) *"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                helperText="Indiquez le prix en FCFA"
                error={error && !formData.price}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={error && !formData.category}>
                <InputLabel>Catégorie *</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Catégorie *"
                >
                  {animalCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Choisissez la catégorie de l'animal</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Race"
                name="race"
                value={formData.race}
                onChange={handleChange}
                helperText="Indiquez la race de l'animal si connue"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={error && !formData.department}>
                <InputLabel>Localisation *</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  label="Localisation *"
                >
                  {regions.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Choisissez votre région</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro WhatsApp *"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                helperText="Format: 77XXXXXXXX"
                error={error && !formData.whatsapp}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Photos de l'animal
                </Typography>
                <label htmlFor="image-upload">
                  <Input
                    accept="image/*"
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={handleImageChange}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    disabled={loading}
                  >
                    Ajouter des photos
                  </Button>
                </label>
              </Box>
              {loading && <CircularProgress />}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <ImageList cols={3} rowHeight={164}>
                {formData.images.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      loading="lazy"
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
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