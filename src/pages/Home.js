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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AdCard from '../components/AdCard';
import { regions } from '../data/regions';

const categories = [
  { name: 'Chiens', value: 'chiens', icon: '🐕', color: '#2196f3' },
  { name: 'Lapins', value: 'lapins', icon: '🐰', color: '#e91e63' },
  { name: 'Volailles', value: 'volailles', icon: '🐔', color: '#4caf50' },
  { name: 'Moutons', value: 'moutons', icon: '🐑', color: '#9c27b0' },
  { name: 'Reptiles', value: 'reptiles', icon: '🦎', color: '#ff9800' },
  { name: 'Autres', value: 'autres', icon: '🐾', color: '#795548' },
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAds = () => {
      try {
        const storedAds = JSON.parse(localStorage.getItem('ads') || '[]');
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
        
        const sortedAds = cleanedAds.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsAdmin(user?.role === 'admin');
  }, []);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || ad.category === category;
    const matchesDepartment = !department || ad.department === department;

    return matchesSearch && matchesCategory && matchesDepartment;
  });

  const handleCreateAd = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/publier-annonce');
    } else {
      navigate('/login', { state: { from: '/publier-annonce' } });
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCategory(categories[newValue].value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher une annonce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Département</InputLabel>
              <Select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                label="Département"
              >
                <MenuItem value="">Tous les départements</MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region.code} value={region.code}>
                    {region.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateAd}
            >
              Publier une annonce
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Catégories"
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
            />
          ))}
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredAds.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.id}>
              <AdCard ad={ad} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home; 