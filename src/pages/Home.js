import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 0),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'pulse 4s infinite',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' },
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

const SupportSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4caf50 30%, #45a049 90%)',
  color: 'white',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  marginTop: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const categories = [
    { name: 'Livres', color: '#4caf50', icon: '📚' },
    { name: 'Informatique', color: '#2196f3', icon: '💻' },
    { name: 'Vêtements', color: '#f44336', icon: '👕' },
    { name: 'Beauté', color: '#e91e63', icon: '💄' },
    { name: 'Accessoires', color: '#9c27b0', icon: '👜' },
    { name: 'Services', color: '#ff9800', icon: '🔧' },
  ];

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                mb: { xs: 2, sm: 3 },
                animation: 'fadeIn 1s ease-in',
              }}
            >
              Bienvenue sur UAM Marketplace
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: { xs: 3, sm: 4 },
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                animation: 'fadeIn 1s ease-in 0.5s',
              }}
            >
              Découvrez, achetez et vendez des produits et services entre étudiants
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/ads')}
              sx={{
                backgroundColor: 'white',
                color: '#2196F3',
                fontSize: { xs: '1rem', sm: '1.25rem' },
                padding: { xs: '8px 16px', sm: '12px 24px' },
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease-in-out',
                animation: 'fadeIn 1s ease-in 1s',
              }}
            >
              Explorer les annonces
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Catégories populaires
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={category.name}>
              <StyledCard
                sx={{
                  animation: `fadeIn 0.5s ease-in ${index * 0.1}s`,
                }}
              >
                <CardContent sx={{ 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: { xs: 2, sm: 3 },
                }}>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontSize: { xs: '3rem', sm: '4rem' },
                      mb: 2,
                    }}
                  >
                    {category.icon}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    sx={{ 
                      mb: 2,
                      color: category.color,
                      fontWeight: 'bold',
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/ads?category=${category.name.toLowerCase()}`)}
                    sx={{
                      borderColor: category.color,
                      color: category.color,
                      '&:hover': {
                        backgroundColor: category.color,
                        color: 'white',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.3s ease-in-out',
                      mt: 'auto',
                    }}
                  >
                    Voir plus
                  </Button>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        <SupportSection
          component="a"
          href="https://wa.me/221774907982"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2,
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            Support
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 2,
              opacity: 0.9,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            Cliquez ici pour contacter notre équipe de support
          </Typography>
        </SupportSection>
      </Container>
    </Box>
  );
};

export default Home; 