import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  ImageList,
  ImageListItem,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getAds, updateAd } from '../services/githubService';

const AdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAd = async () => {
      try {
        console.log('Recherche de l\'annonce avec l\'ID:', id);
        const ads = await getAds();
        console.log('Annonces disponibles:', ads);
        
        const foundAd = ads.find(ad => ad.id === id);
        console.log('Annonce trouvée:', foundAd);
        
        if (!foundAd) {
          throw new Error('Annonce non trouvée');
        }

        // Mise à jour du compteur de vues
        const updatedAd = {
          ...foundAd,
          views: (foundAd.views || 0) + 1
        };
        
        await updateAd(updatedAd);
        setAd(updatedAd);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'annonce:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  const handleWhatsAppClick = () => {
    const phoneNumber = ad.whatsapp.replace(/\D/g, '');
    const message = `Bonjour, je suis intéressé par votre annonce "${ad.title}"\n\n` +
                   `Prix: ${ad.price} FCFA\n` +
                   `Catégorie: ${ad.category}\n` +
                   `Localisation: ${ad.department}\n` +
                   `Description: ${ad.description}\n\n` +
                   `Est-ce que cette annonce est toujours disponible ?\n` +
                   `Si oui, pouvez-vous me donner plus de détails ?\n` +
                   `Merci d'avance.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Retour à l'accueil
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Retour
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ImageList cols={1} rowHeight={300}>
              {ad.images && ad.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={image}
                    alt={ad.title}
                    className="ad-image"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                {ad.title}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                {ad.price} FCFA
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={ad.category}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={ad.department}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body1" paragraph>
                {ad.description}
              </Typography>
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsAppClick}
                sx={{
                  bgcolor: '#25D366',
                  '&:hover': {
                    bgcolor: '#128C7E',
                  },
                }}
              >
                Contacter via WhatsApp
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdDetail; 