import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  Pagination,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import { styled } from '@mui/material/styles';

const SearchBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(4),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const storedAds = JSON.parse(localStorage.getItem('ads') || '[]');
    setAds(storedAds);
  }, []);

  const categories = [
    { name: 'Livres', color: '#4caf50', icon: '📚' },
    { name: 'Informatique', color: '#2196f3', icon: '💻' },
    { name: 'Vêtements', color: '#f44336', icon: '👕' },
    { name: 'Beauté', color: '#e91e63', icon: '💄' },
    { name: 'Accessoires', color: '#9c27b0', icon: '👜' },
    { name: 'Services', color: '#ff9800', icon: '🔧' },
  ];

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || ad.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = isMobile ? 4 : 6;
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
  const paginatedAds = filteredAds.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <SearchBox>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un produit/service"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            mb: 3,
            backgroundColor: 'white',
            borderRadius: theme.shape.borderRadius,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#2196F3' }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}>
          {categories.map((category) => (
            <Chip
              key={category.name}
              label={category.name}
              icon={<span style={{ fontSize: '1.2rem' }}>{category.icon}</span>}
              onClick={() => setSelectedCategory(
                selectedCategory === category.name.toLowerCase() ? null : category.name.toLowerCase()
              )}
              sx={{
                backgroundColor: selectedCategory === category.name.toLowerCase() ? category.color : 'white',
                color: selectedCategory === category.name.toLowerCase() ? 'white' : category.color,
                borderColor: category.color,
                '&:hover': {
                  backgroundColor: category.color,
                  color: 'white',
                },
                transition: 'all 0.3s ease-in-out',
              }}
              variant={selectedCategory === category.name.toLowerCase() ? "filled" : "outlined"}
            />
          ))}
        </Box>
      </SearchBox>

      <Grid container spacing={3}>
        {paginatedAds.map((ad) => (
          <Grid item xs={12} sm={6} md={4} key={ad.id}>
            <StyledCard>
              <CardMedia
                component="img"
                height={isMobile ? 150 : 200}
                image={ad.image || "https://via.placeholder.com/300x200"}
                alt={ad.title}
                sx={{ 
                  objectFit: 'cover',
                  borderBottom: `4px solid ${categories.find(c => c.name.toLowerCase() === ad.category)?.color || '#2196F3'}`,
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  gutterBottom 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  {ad.title}
                </Typography>
                <Typography 
                  variant="h5" 
                  color="primary" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  }}
                >
                  {ad.price} FCFA
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mb: 2, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  <Chip
                    icon={<LocationOnIcon />}
                    label={ad.department}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                      },
                    }}
                  />
                  <Chip
                    icon={<CategoryIcon />}
                    label={categories.find(c => c.name.toLowerCase() === ad.category)?.name}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ 
                      backgroundColor: 'rgba(156, 39, 176, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(156, 39, 176, 0.2)',
                      },
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<WhatsAppIcon />}
                  fullWidth
                  href={`https://wa.me/${ad.whatsapp}`}
                  target="_blank"
                  sx={{ 
                    mt: 'auto',
                    backgroundColor: '#4CAF50',
                    '&:hover': {
                      backgroundColor: '#45a049',
                      transform: 'scale(1.02)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  Contacter sur WhatsApp
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4,
          '& .MuiPaginationItem-root': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
          },
        }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#2196F3',
                '&.Mui-selected': {
                  backgroundColor: '#2196F3',
                  color: 'white',
                },
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default Ads; 