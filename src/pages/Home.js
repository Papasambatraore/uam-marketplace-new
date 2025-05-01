import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import BookIcon from '@mui/icons-material/Book';
import ComputerIcon from '@mui/icons-material/Computer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SpaIcon from '@mui/icons-material/Spa';
import WatchIcon from '@mui/icons-material/Watch';
import BuildIcon from '@mui/icons-material/Build';
import { useNavigate } from 'react-router-dom';

const categories = [
  { 
    name: 'Livres', 
    icon: <BookIcon sx={{ fontSize: 40 }} />, 
    value: 'livres', 
    color: '#2196f3',
    description: 'Manuels, romans, cours'
  },
  { 
    name: 'Informatique', 
    icon: <ComputerIcon sx={{ fontSize: 40 }} />, 
    value: 'informatique', 
    color: '#4caf50',
    description: 'Ordinateurs, accessoires'
  },
  { 
    name: 'Vêtements', 
    icon: <ShoppingBagIcon sx={{ fontSize: 40 }} />, 
    value: 'vetements', 
    color: '#f44336',
    description: 'Mode, style, tendance'
  },
  { 
    name: 'Beauté', 
    icon: <SpaIcon sx={{ fontSize: 40 }} />, 
    value: 'beaute', 
    color: '#e91e63',
    description: 'Cosmétiques, soins'
  },
  { 
    name: 'Accessoires', 
    icon: <WatchIcon sx={{ fontSize: 40 }} />, 
    value: 'accessoires', 
    color: '#9c27b0',
    description: 'Bijoux, montres, sacs'
  },
  { 
    name: 'Services', 
    icon: <BuildIcon sx={{ fontSize: 40 }} />, 
    value: 'services', 
    color: '#ff9800',
    description: 'Cours, réparations'
  },
];

const Home = () => {
  const [ads, setAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Chargement des annonces depuis le localStorage
    const storedAds = JSON.parse(localStorage.getItem('ads') || '[]');
    setAds(storedAds);
  }, []);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || ad.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          UAM e-commerce
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          La place de marché des étudiants de l'UAM
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un produit/service"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={2} key={category.value}>
              <Button
                fullWidth
                variant={selectedCategory === category.value ? "contained" : "outlined"}
                sx={{
                  height: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: selectedCategory === category.value ? category.color : 'transparent',
                  color: selectedCategory === category.value ? 'white' : category.color,
                  borderColor: category.color,
                  '&:hover': {
                    backgroundColor: category.color,
                    color: 'white',
                    borderColor: category.color,
                  },
                }}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.value ? null : category.value
                )}
              >
                <Box sx={{ mb: 1 }}>
                  {category.icon}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {category.name}
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: selectedCategory === category.value ? 0.9 : 0.7,
                  fontSize: '0.7rem'
                }}>
                  {category.description}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold' }}>
        {filteredAds.length === 0 ? 'Aucune annonce trouvée' : 'Dernières annonces'}
      </Typography>

      <Grid container spacing={3}>
        {filteredAds.map((ad) => (
          <Grid item xs={12} sm={6} md={4} key={ad.id}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 6,
              },
            }}>
              <CardMedia
                component="img"
                height="200"
                image="https://via.placeholder.com/300x200"
                alt={ad.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {ad.title}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {ad.price} FCFA
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<LocationOnIcon />}
                    label={ad.department}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    icon={<CategoryIcon />}
                    label={categories.find(c => c.value === ad.category)?.name}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<WhatsAppIcon />}
                  fullWidth
                  href={`https://wa.me/${ad.whatsapp}`}
                  target="_blank"
                  sx={{ mt: 'auto' }}
                >
                  Contacter sur WhatsApp
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 