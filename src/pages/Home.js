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
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AdCard from '../components/AdCard';
import { regions } from '../data/regions';
import { getAds } from '../services/firebaseService';

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
  const [filters, setFilters] = useState({
    race: '',
    prixMin: '',
    prixMax: '',
    // Filtres spécifiques aux chiens
    taille: '',
    // Filtres spécifiques aux volailles
    typeVolailles: '',
    // Filtres spécifiques aux moutons
    ageMouton: '',
    // Filtres spécifiques aux lapins
    raceLapin: '',
    // Filtres spécifiques aux reptiles
    typeReptile: '',
  });
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const ads = await getAds();
        console.log('Annonces récupérées de GitHub:', ads);
        
        // Vérification et nettoyage des données
        const cleanedAds = ads.map(ad => {
          console.log('Traitement de l\'annonce:', ad);
          return {
            ...ad,
            id: ad.id || Math.random().toString(36).substr(2, 9),
            images: Array.isArray(ad.images) ? ad.images : [],
            price: ad.price || '0',
            category: ad.category || 'Non spécifié',
            department: ad.department || 'Non spécifié',
            country: ad.country || 'Non spécifié',
            whatsapp: ad.whatsapp || '',
            author: ad.author || 'Anonyme',
            date: ad.date || new Date().toISOString(),
            views: ad.views || 0,
            status: 'active',
            isActive: true,
            userId: ad.userId || 'anonymous'
          };
        });
        
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

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const user = JSON.parse(localStorage.getItem('user'));
    setIsAdmin(user?.role === 'admin');
  }, []);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || ad.category === category;
    const matchesDepartment = !department || ad.department === department;
    const matchesRace = !filters.race || ad.race?.toLowerCase().includes(filters.race.toLowerCase());
    const matchesPrixMin = !filters.prixMin || Number(ad.price) >= Number(filters.prixMin);
    const matchesPrixMax = !filters.prixMax || Number(ad.price) <= Number(filters.prixMax);
    
    // Filtres spécifiques par catégorie
    let matchesSpecificFilters = true;
    if (category === 'chiens' && filters.taille) {
      matchesSpecificFilters = ad.taille === filters.taille;
    } else if (category === 'volailles' && filters.typeVolailles) {
      matchesSpecificFilters = ad.typeVolailles === filters.typeVolailles;
    } else if (category === 'moutons' && filters.ageMouton) {
      matchesSpecificFilters = ad.ageMouton === filters.ageMouton;
    } else if (category === 'lapins' && filters.raceLapin) {
      matchesSpecificFilters = ad.raceLapin === filters.raceLapin;
    } else if (category === 'reptiles' && filters.typeReptile) {
      matchesSpecificFilters = ad.typeReptile === filters.typeReptile;
    }

    return matchesSearch && matchesCategory && matchesDepartment && 
           matchesRace && matchesPrixMin && matchesPrixMax && matchesSpecificFilters;
  });

  const handleCreateAd = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/create-ad');
    } else {
      navigate('/login', { state: { from: '/create-ad' } });
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCategory(categories[newValue].value);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderSpecificFilters = () => {
    switch (category) {
      case 'chiens':
        return (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Taille</InputLabel>
              <Select
                value={filters.taille}
                onChange={(e) => handleFilterChange('taille', e.target.value)}
                label="Taille"
              >
                <MenuItem value="">Toutes les tailles</MenuItem>
                <MenuItem value="petit">Petit</MenuItem>
                <MenuItem value="moyen">Moyen</MenuItem>
                <MenuItem value="grand">Grand</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        );
      case 'volailles':
        return (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type de volaille</InputLabel>
              <Select
                value={filters.typeVolailles}
                onChange={(e) => handleFilterChange('typeVolailles', e.target.value)}
                label="Type de volaille"
              >
                <MenuItem value="">Tous les types</MenuItem>
                <MenuItem value="poule">Poule</MenuItem>
                <MenuItem value="dinde">Dinde</MenuItem>
                <MenuItem value="canard">Canard</MenuItem>
                <MenuItem value="oie">Oie</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        );
      case 'moutons':
        return (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Âge</InputLabel>
              <Select
                value={filters.ageMouton}
                onChange={(e) => handleFilterChange('ageMouton', e.target.value)}
                label="Âge"
              >
                <MenuItem value="">Tous les âges</MenuItem>
                <MenuItem value="agneau">Agneau</MenuItem>
                <MenuItem value="adulte">Adulte</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        );
      case 'lapins':
        return (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Race</InputLabel>
              <Select
                value={filters.raceLapin}
                onChange={(e) => handleFilterChange('raceLapin', e.target.value)}
                label="Race"
              >
                <MenuItem value="">Toutes les races</MenuItem>
                <MenuItem value="nain">Nain</MenuItem>
                <MenuItem value="bélier">Bélier</MenuItem>
                <MenuItem value="géant">Géant</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        );
      case 'reptiles':
        return (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type de reptile</InputLabel>
              <Select
                value={filters.typeReptile}
                onChange={(e) => handleFilterChange('typeReptile', e.target.value)}
                label="Type de reptile"
              >
                <MenuItem value="">Tous les types</MenuItem>
                <MenuItem value="serpent">Serpent</MenuItem>
                <MenuItem value="lézard">Lézard</MenuItem>
                <MenuItem value="tortue">Tortue</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        );
      default:
        return null;
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Marché des Animaux
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Panel Admin
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Pays</InputLabel>
            <Select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedRegion('');
              }}
              label="Pays"
            >
              {regions.map((country) => (
                <MenuItem key={country.country} value={country.country}>
                  {country.country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Région</InputLabel>
            <Select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              label="Région"
              disabled={!selectedCountry}
            >
              {selectedCountry && regions
                .find(c => c.country === selectedCountry)
                ?.regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

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
              onClick={() => navigate('/login', { state: { from: '/create-ad' } })}
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
              <InputLabel>Localisation</InputLabel>
              <Select
                value={department}
                label="Localisation"
                onChange={(e) => setDepartment(e.target.value)}
              >
                <MenuItem value="">Toutes les localisations</MenuItem>
                {regions.map((country) => (
                  <MenuItem key={country.country} value={country.country}>
                    {country.country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Race"
              variant="outlined"
              value={filters.race}
              onChange={(e) => handleFilterChange('race', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Prix minimum (FCFA)"
              variant="outlined"
              value={filters.prixMin}
              onChange={(e) => handleFilterChange('prixMin', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Prix maximum (FCFA)"
              variant="outlined"
              value={filters.prixMax}
              onChange={(e) => handleFilterChange('prixMax', e.target.value)}
            />
          </Grid>
          {renderSpecificFilters()}
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