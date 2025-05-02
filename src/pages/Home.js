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
  Button,
  Paper,
  InputAdornment,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import AdCard from '../components/AdCard';

const categories = [
  { name: 'Livres', value: 'livres', icon: '📚', color: '#2196f3' },
  { name: 'Informatique', value: 'informatique', icon: '💻', color: '#4caf50' },
  { name: 'Vêtements', value: 'vetements', icon: '👕', color: '#f44336' },
  { name: 'Beauté', value: 'beaute', icon: '💄', color: '#e91e63' },
  { name: 'Accessoires', value: 'accessoires', icon: '👜', color: '#9c27b0' },
  { name: 'Services', value: 'services', icon: '🔧', color: '#ff9800' },
  { name: 'Alimentation & Boisson', value: 'alimentation', icon: '🍽️', color: '#795548' },
];

const Home = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

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
          author: ad.author || 'Anonyme',
          date: ad.date || new Date().toISOString(),
        }));
        
        // Tri par date (les plus récentes en premier)
        const sortedAds = cleanedAds.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        console.log('Annonces nettoyées et triées:', sortedAds);
        setAds(sortedAds);
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
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || ad.category === category;
    const matchesDepartment = !department || ad.department === department;
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  const handleCreateAd = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/creer-annonce');
    } else {
      navigate('/connexion', { state: { from: '/creer-annonce' } });
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCategory(categories[newValue].value);
  };

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
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ 
            color: 'primary.main',
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}>
            Annonces récentes
          </Typography>
          {localStorage.getItem('user') ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateAd}
              startIcon={<AddIcon />}
              sx={{ 
                minWidth: 200,
                height: { xs: 40, sm: 48 },
                fontSize: { xs: '0.8rem', sm: '1rem' }
              }}
            >
              Créer une annonce
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/connexion', { state: { from: '/creer-annonce' } })}
              startIcon={<AddIcon />}
              sx={{ 
                minWidth: 200,
                height: { xs: 40, sm: 48 },
                fontSize: { xs: '0.8rem', sm: '1rem' }
              }}
            >
              Se connecter pour créer une annonce
            </Button>
          )}
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Rechercher (titre, description, auteur)"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
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
      </Paper>

      <Paper elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minWidth: 120,
              fontSize: { xs: '0.8rem', sm: '1rem' },
            },
          }}
        >
          {categories.map((cat, index) => (
            <Tab
              key={cat.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Box>
              }
              sx={{
                color: cat.color,
                '&.Mui-selected': {
                  color: cat.color,
                  fontWeight: 'bold',
                },
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {filteredAds.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Aucune annonce ne correspond à vos critères
          </Typography>
        </Paper>
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