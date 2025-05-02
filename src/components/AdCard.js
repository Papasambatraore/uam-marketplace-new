import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Skeleton,
  Chip,
  Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  position: 'relative',
  '& img': {
    transition: 'opacity 0.3s ease-in-out',
  },
});

const AdCard = ({ ad }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = ad.whatsapp.replace(/\D/g, '');
    const message = `Bonjour, je suis intéressé par votre annonce "${ad.title}"`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StyledCard>
      <StyledCardMedia>
        {!imageLoaded && !imageError && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        )}
        {ad.images && ad.images.length > 0 && (
          <img
            src={ad.images[0]}
            alt={ad.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        {imageError && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.200',
            }}
          >
            <Typography color="text.secondary">
              Image non disponible
            </Typography>
          </Box>
        )}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <FavoriteIcon color={isFavorite ? 'error' : 'action'} />
        </IconButton>
      </StyledCardMedia>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {ad.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {ad.description.length > 100
            ? `${ad.description.substring(0, 100)}...`
            : ad.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={ad.category}
            size="small"
            sx={{
              bgcolor: 'primary.light',
              color: 'white',
            }}
          />
          <Chip
            label={ad.department}
            size="small"
            sx={{
              bgcolor: 'secondary.light',
              color: 'white',
            }}
          />
        </Box>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          {ad.price} FCFA
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<WhatsAppIcon />}
          fullWidth
          onClick={handleWhatsAppClick}
          sx={{
            bgcolor: '#25D366',
            '&:hover': {
              bgcolor: '#128C7E',
            },
          }}
        >
          Contacter
        </Button>
      </CardContent>
    </StyledCard>
  );
};

export default AdCard; 