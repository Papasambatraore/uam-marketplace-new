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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { uploadImage } from '../services/imageService';
import { useSnackbar } from 'notistack';
import { regions } from '../data/regions';
import { addAd } from '../services/githubService';

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en octets
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB en octets

const CreateAd = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    department: '',
    country: '',
    whatsapp: '',
    images: [],
    race: '',
    imagePreviews: [],
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [whatsappError, setWhatsappError] = useState('');

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user');
    if (!user) {
      enqueueSnackbar('Veuillez vous connecter pour publier une annonce', { 
        variant: 'info',
        autoHideDuration: 3000
      });
      navigate('/login', { 
        state: { 
          from: '/create-ad',
          message: 'Veuillez vous connecter pour publier une annonce'
        } 
      });
    }
  }, [navigate, enqueueSnackbar]);

  const validateWhatsApp = (number) => {
    if (!number || number.trim() === '') {
      setWhatsappError('Le numéro WhatsApp est requis');
      return false;
    }
    setWhatsappError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'whatsapp') {
      validateWhatsApp(value);
    }
  };

  const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`L'image ${file.name} dépasse la taille maximale de 5MB`);
    }
    return true;
  };

  const validateTotalSize = (files) => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      throw new Error('La taille totale des images ne doit pas dépasser 20MB');
    }
    return true;
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      try {
        setLoading(true);
        setError('');

        // Validation de la taille des fichiers
        files.forEach(validateFileSize);
        validateTotalSize(files);

        // Prévisualisation des images
        const previews = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({
          ...prev,
          imagePreviews: [...(prev.imagePreviews || []), ...previews]
        }));

        const uploadedImages = await Promise.all(
          files.map(file => uploadImage(file))
        );
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedImages]
        }));

        enqueueSnackbar('Images téléchargées avec succès', { variant: 'success' });
      } catch (error) {
        setError(error.message);
        enqueueSnackbar(error.message, { variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const handlePreviewImage = (image) => {
    setPreviewImage(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.department || !formData.whatsapp) {
      setError('Veuillez remplir tous les champs obligatoires marqués d\'un astérisque (*)');
      return;
    }

    if (!validateWhatsApp(formData.whatsapp)) {
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
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const newAd = {
        ...formData,
        id: Date.now().toString(),
        userId: user.id || user._id,
        author: user.name || user.username,
        authorAvatar: user.avatar,
        date: new Date().toISOString(),
        status: 'active',
        views: 0,
        favorites: [],
        country: formData.country || 'Non spécifié',
        department: formData.department || 'Non spécifié',
        category: formData.category || 'Non spécifié',
        price: formData.price || '0',
        whatsapp: formData.whatsapp,
        images: formData.images,
        imagePreviews: formData.imagePreviews,
        description: formData.description,
        title: formData.title,
        race: formData.race || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      console.log('Nouvelle annonce à sauvegarder:', newAd);
      await addAd(newAd);
      console.log('Annonce sauvegardée avec succès');

      enqueueSnackbar('Votre annonce a été publiée avec succès !', {
        variant: 'success'
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      setError(error.message || 'Une erreur est survenue lors de la publication de votre annonce. Veuillez réessayer.');
      enqueueSnackbar(error.message || 'Erreur lors de la publication de l\'annonce', { variant: 'error' });
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
              <FormControl fullWidth required error={error && !formData.country}>
                <InputLabel>Pays</InputLabel>
                <Select
                  name="country"
                  value={formData.country}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      country: e.target.value,
                      department: ''
                    }));
                  }}
                  label="Pays"
                >
                  {regions.map((country) => (
                    <MenuItem key={country.country} value={country.country}>
                      {country.country}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Choisissez votre pays</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={error && !formData.department}>
                <InputLabel>Région</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  label="Région"
                  disabled={!formData.country}
                >
                  {formData.country && regions
                    .find(c => c.country === formData.country)
                    ?.regions.map((region) => (
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
                helperText="Entrez votre numéro WhatsApp"
                error={!!whatsappError}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Photos de l'animal
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Taille maximale par image : 5MB
                  <br />
                  Taille totale maximale : 20MB
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
                {formData.imagePreviews?.map((preview, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      loading="lazy"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handlePreviewImage(preview)}
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
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                      }}
                      onClick={() => handlePreviewImage(preview)}
                    >
                      <ZoomInIcon />
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

      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prévisualisation de l'image</DialogTitle>
        <DialogContent>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewImage(null)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateAd; 