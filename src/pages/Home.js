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
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  Slider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000000],
    sortBy: 'date',
    race: '',
  });

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsAdmin(user?.role === 'admin');
  }, []);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || ad.category === category;
    const matchesDepartment = !department || ad.department === department;
    const matchesPrice = Number(ad.price) >= filters.priceRange[0] && 
                        Number(ad.price) <= filters.priceRange[1];
    const matchesRace = !filters.race || 
                       ad.race?.toLowerCase().includes(filters.race.toLowerCase());

    return matchesSearch && matchesCategory && matchesDepartment && 
           matchesPrice && matchesRace;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc':
        return Number(a.price) - Number(b.price);
      case 'price_desc':
        return Number(b.price) - Number(a.price);
      case 'date':
      default:
        return new Date(b.date) - new Date(a.date);
    }
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

  const handlePriceRangeChange = (event, newValue) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newValue
    }));
  };

  const FiltersDrawer = () => (
    <Drawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : 300,
          p: 3,
          borderRadius: isMobile ? '16px 16px 0 0' : 0
        }
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Filtres</Typography>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Prix (FCFA)</Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000000}
          step={5000}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <TextField
            size="small"
            label="Min"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceRangeChange(e, [Number(e.target.value), filters.priceRange[1]])}
            type="number"
          />
          <TextField
            size="small"
            label="Max"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceRangeChange(e, [filters.priceRange[0], Number(e.target.value)])}
            type="number"
          />
        </Box>
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Trier par</InputLabel>
        <Select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          label="Trier par"
        >
          <MenuItem value="date">Plus récent</MenuItem>
          <MenuItem value="price_asc">Prix croissant</MenuItem>
          <MenuItem value="price_desc">Prix décroissant</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Race"
        variant="outlined"
        value={filters.race}
        onChange={(e) => setFilters(prev => ({ ...prev, race: e.target.value }))}
        sx={{ mb: 3 }}
      />
    </Drawer>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
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
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={6} sm={3} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{ height: '100%' }}
            >
              Filtres
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateAd}
              sx={{ height: '100%' }}
            >
              Publier
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Catégories"
          sx={{
            bgcolor: 'background.paper',
            '& .MuiTab-root': {
              minWidth: isMobile ? 'auto' : 120,
              py: 2,
            }
          }}
        >
          {categories.map((cat) => (
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
                }
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredAds.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Aucune annonce ne correspond à vos critères
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredAds.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.id}>
              <AdCard ad={ad} />
            </Grid>
          ))}
        </Grid>
      )}

      <FiltersDrawer />
    </Container>
  );
};

export default Home; 