import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Skeleton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    cursor: 'pointer',
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
});

const AdCard = ({ ad }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleCardClick = () => {
    navigate(`/annonce/${ad.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <Box sx={{ position: 'relative' }}>
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            animation="wave"
          />
        )}
        <StyledCardMedia
          image={ad.images && ad.images.length > 0 ? ad.images[0] : 'https://via.placeholder.com/300x200?text=Image+non+disponible'}
          title={ad.title}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
            setImageLoaded(true);
          }}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {ad.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {ad.description.length > 100
            ? `${ad.description.substring(0, 100)}...`
            : ad.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            {ad.price.toLocaleString()} FCFA
          </Typography>
          <Chip
            label={ad.category}
            size="small"
            sx={{
              backgroundColor: '#f5f5f5',
              color: 'text.primary',
            }}
          />
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default AdCard; 