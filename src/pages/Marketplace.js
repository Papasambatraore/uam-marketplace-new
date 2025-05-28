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
  Pagination,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AdCard from '../components/AdCard'; // Assuming you have an AdCard component

// Dummy data for now
const dummyAds = [
  {
    id: 1,
    title: 'Livre de Calcul Différentiel',
    description: 'Livre en excellent état pour étudiants en première année.',
    price: '8000 FCFA',
    category: 'Livres & Cours',
    department: 'Génie Informatique',
    author: 'Alice Dupont',
    image: 'https://source.unsplash.com/random/300x200?textbook',
  },
  {
    id: 2,
    title: 'Calculatrice Graphique',
    description: 'Calculatrice TI-83 Plus, parfait état.',
    price: '12000 FCFA',
    category: 'Matériel Scolaire',
    department: 'Mathématiques',
    author: 'Bob Martin',
    image: 'https://source.unsplash.com/random/300x200?calculator',
  },
  {
    id: 3,
    title: 'Cours de Soutien Physique',
    description: 'Cours particuliers pour étudiants en L1/L2.',
    price: '15000 FCFA/heure',
    category: 'Services',
    department: 'Physique',
    author: 'Charlie Brown',
    image: 'https://source.unsplash.com/random/300x200?tutoring',
  },
  // Add more dummy data as needed
];

const Marketplace = () => {
  const [loading, setLoading] = useState(false); // Set to true when fetching data
  const [error, setError] = useState('');
  const [ads, setAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const adsPerPage = 12;

  // In a real application, you would fetch data here
  useEffect(() => {
    setLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setAds(dummyAds);
      setTotalPages(Math.ceil(dummyAds.length / adsPerPage));
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ad.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || ad.category === selectedCategory;
    const matchesDepartment = !selectedDepartment || ad.department === selectedDepartment;
    // Add more filter logic here as needed

    return matchesSearch && matchesCategory && matchesDepartment;
  });

  const displayedAds = filteredAds.slice((page - 1) * adsPerPage, page * adsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
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
      <Typography variant="h4" component="h1" gutterBottom>
        Marketplace UAM
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
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
                endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                label="Catégorie"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">Toutes les catégories</MenuItem>
                {/* Replace with dynamic categories later */}
                <MenuItem value="Livres & Cours">Livres & Cours</MenuItem>
                <MenuItem value="Matériel Scolaire">Matériel Scolaire</MenuItem>
                <MenuItem value="Services">Services</MenuItem>
                <MenuItem value="Autres">Autres</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
             <FormControl fullWidth>
              <InputLabel>Département</InputLabel>
              <Select
                value={selectedDepartment}
                label="Département"
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <MenuItem value="">Tous les départements</MenuItem>
                {/* Replace with dynamic departments later */}
                <MenuItem value="Génie Informatique">Génie Informatique</MenuItem>
                <MenuItem value="Mathématiques">Mathématiques</MenuItem>
                <MenuItem value="Physique">Physique</MenuItem>
                <MenuItem value="Biologie">Biologie</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Add more filter fields as needed */}
        </Grid>
      </Paper>

      {displayedAds.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Aucune annonce ne correspond à vos critères
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {displayedAds.map((ad) => (
            <Grid item key={ad.id} xs={12} sm={6} md={4}>
              <AdCard ad={ad} />
            </Grid>
          ))}
        </Grid>
      )}

      {filteredAds.length > adsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default Marketplace; 