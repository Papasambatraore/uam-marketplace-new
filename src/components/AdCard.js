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
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleCardClick = () => {
    navigate(`/annonce/${ad.id}`);
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    window.open(`https://wa.me/${ad.whatsapp}`, '_blank');
  };

  return (
    <StyledCard onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
      <StyledCardMedia
        image={ad.images[0]}
        title={ad.title}
        onLoad={() => setIsLoading(false)}
      >
        {isLoading && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        )}
          <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1,
          }}
        >
          <Chip
            label={ad.category}
            size="small"
            sx={{
              backgroundColor: getCategoryColor(ad.category),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
          <Chip
            label={`${ad.department}, ${ad.country}`}
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
            }}
          />
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