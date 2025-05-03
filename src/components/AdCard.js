import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Avatar,
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

const getCategoryColor = (category) => {
  switch (category) {
    case 'chiens':
      return 'primary.light';
    case 'lapins':
      return 'pink.light';
    case 'volailles':
      return 'success.light';
    case 'moutons':
      return 'purple.light';
    case 'reptiles':
      return 'orange.light';
    case 'autres':
      return 'brown.light';
    default:
      return 'grey.light';
  }
};

const AdCard = ({ ad }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleCardClick = () => {
    navigate(`/annonce/${ad.id}`);
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    const phoneNumber = ad.whatsapp.replace(/\D/g, '');
    const message = `Bonjour, je suis intéressé par votre ${ad.category} "${ad.title}"\n\n` +
                   `Prix: ${ad.price} FCFA\n` +
                   `Race: ${ad.race || 'Non spécifiée'}\n` +
                   `Localisation: ${ad.department}\n\n` +
                   `Est-ce que cette annonce est toujours disponible ?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StyledCard onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
      <StyledCardMedia>
        {!imageLoaded && !imageError && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        )}
        {ad.images && ad.images.length > 0 ? (
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
        ) : (
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
            <Typography variant="h6" color="text.secondary">
              Aucune image
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            sx={{
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'background.paper',
              },
            }}
          >
            <FavoriteIcon color={isFavorite ? 'error' : 'action'} />
          </IconButton>
        </Box>
      </StyledCardMedia>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h2" noWrap>
            {ad.title}
          </Typography>
          <Typography variant="h6" color="primary">
            {ad.price} FCFA
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip
            label={ad.category}
            size="small"
            sx={{
              bgcolor: getCategoryColor(ad.category),
              color: 'white',
            }}
          />
          {ad.race && (
            <Chip
              label={ad.race}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {ad.department}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={ad.authorAvatar}
              sx={{ width: 24, height: 24, mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {ad.author}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<WhatsAppIcon />}
            onClick={handleWhatsAppClick}
            sx={{ minWidth: 'auto' }}
          >
            Contacter
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default AdCard; 