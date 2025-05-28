import React from 'react';
import {
  Box, 
  Container,
  Typography, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';

const categories = [
  { title: 'Livres & Cours', icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: '#1B4D3E' },
  { title: 'Matériel Scolaire', icon: <CategoryIcon sx={{ fontSize: 40 }} />, color: '#2E7D32' },
  { title: 'Services', icon: <GroupsIcon sx={{ fontSize: 40 }} />, color: '#FFA000' },
  { title: 'Autres', icon: <PersonIcon sx={{ fontSize: 40 }} />, color: '#F57C00' },
];

const featuredItems = [
  {
    id: 1,
    title: 'Introduction à la Programmation',
    price: '5000 FCFA',
    image: 'https://source.unsplash.com/random/300x200?book',
    category: 'Livres & Cours'
  },
  {
    id: 2,
    title: 'Calculatrice Scientifique',
    price: '15000 FCFA',
    image: 'https://source.unsplash.com/random/300x200?calculator',
    category: 'Matériel Scolaire'
  },
  {
    id: 3,
    title: 'Cours Particuliers Maths',
    price: '10000 FCFA/heure',
    image: 'https://source.unsplash.com/random/300x200?education',
    category: 'Services'
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    navigate(`/annonce/${id}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                UAM Commerce
              </Typography>
              <Typography variant="h5" gutterBottom>
                La marketplace de l'Université Amadou Mahtar Mbow
              </Typography>
              <Typography variant="body1" paragraph>
                Achetez, vendez et échangez avec la communauté UAM
        </Typography>
          <Button
            variant="contained"
            color="secondary"
                size="large"
                sx={{ mt: 2 }}
          >
                Commencer
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
              <Paper 
                elevation={3} 
              sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper',
                  borderRadius: 2
                }}
              >
            <TextField
              fullWidth
                  placeholder="Que recherchez-vous ?"
              variant="outlined"
              InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                  </InputAdornment>
                ),
              }}
            />
              </Paper>
          </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Catégories
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={6} sm={3} key={category.title}>
              <Card 
          sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              >
                <Box sx={{ color: category.color, mb: 1 }}>
                  {category.icon}
                </Box>
                <Typography variant="h6" align="center">
                  {category.title}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Items Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Articles en Vedette
          </Typography>
        <Grid container spacing={3}>
          {featuredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out'
                  },
                  cursor: 'pointer',
                }}
                onClick={() => handleItemClick(item.id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {item.category}
                  </Typography>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {item.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
    </Container>
    </Box>
  );
};

export default Home; 