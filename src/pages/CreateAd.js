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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      const ads = JSON.parse(localStorage.getItem('ads') || '[]');
      const newAd = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString(),
      };
      localStorage.setItem('ads', JSON.stringify([...ads, newAd]));
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
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    multiple
                    onChange={handleImageChange}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    fullWidth
                    sx={{ 
                      height: { xs: 40, sm: 48 },
                      fontSize: { xs: '0.8rem', sm: '1rem' }
                    }}
                  >
                    Ajouter des photos
                  </Button>
                </label>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.images.map((image, index) => (
                  <Chip
                    key={index}
                    label={image.name}
                    onDelete={() => {
                      setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }));
                    }}
                    sx={{ 
                      maxWidth: { xs: '100%', sm: '200px' },
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }
                    }}
                  />
                ))}
              </Box>
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