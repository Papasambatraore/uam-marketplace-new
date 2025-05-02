import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import AdCard from '../components/AdCard';

const Home = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    const fetchAds = () => {
      try {
        const storedAds = JSON.parse(localStorage.getItem('ads') || '[]');
        console.log('Annonces récupérées:', storedAds);
        
        // Vérification et nettoyage des données
        const cleanedAds = storedAds.map(ad => ({
          ...ad,
          images: Array.isArray(ad.images) ? ad.images : [],
          price: ad.price || '0',
          category: ad.category || 'Non spécifié',
          department: ad.department || 'Non spécifié',
          whatsapp: ad.whatsapp || '',
        }));
        
        console.log('Annonces nettoyées:', cleanedAds);
        setAds(cleanedAds);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
        setError('Erreur lors du chargement des annonces');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || ad.category === category;
    const matchesDepartment = !department || ad.department === department;
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Annonces récentes
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Rechercher"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={category}
                label="Catégorie"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">Toutes</MenuItem>
                <MenuItem value="livres">Livres</MenuItem>
                <MenuItem value="informatique">Informatique</MenuItem>
                <MenuItem value="vetements">Vêtements</MenuItem>
                <MenuItem value="beaute">Beauté</MenuItem>
                <MenuItem value="accessoires">Accessoires</MenuItem>
                <MenuItem value="services">Services</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Département</InputLabel>
              <Select
                value={department}
                label="Département"
                onChange={(e) => setDepartment(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Droit">Droit</MenuItem>
                <MenuItem value="Économie">Économie</MenuItem>
                <MenuItem value="Gestion">Gestion</MenuItem>
                <MenuItem value="Lettres">Lettres</MenuItem>
                <MenuItem value="Sciences">Sciences</MenuItem>
                <MenuItem value="Sciences de l'éducation">Sciences de l'éducation</MenuItem>
                <MenuItem value="Sciences de la santé">Sciences de la santé</MenuItem>
                <MenuItem value="Sciences sociales">Sciences sociales</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {filteredAds.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          Aucune annonce ne correspond à vos critères
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredAds.map((ad) => (
            <Grid item key={ad.id} xs={12} sm={6} md={4}>
              <AdCard ad={ad} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home; 