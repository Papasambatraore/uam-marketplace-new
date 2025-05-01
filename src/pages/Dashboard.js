import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (!isLoggedIn || !currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    const allAds = JSON.parse(localStorage.getItem('ads') || '[]');
    const userAds = allAds.filter(ad => ad.userId === currentUser.id);
    setAds(userAds);
  }, [navigate]);

  const handleDeleteClick = (ad) => {
    setSelectedAd(ad);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAd) {
      const updatedAds = ads.filter(ad => ad.id !== selectedAd.id);
      setAds(updatedAds);
      
      const allAds = JSON.parse(localStorage.getItem('ads') || '[]');
      const updatedAllAds = allAds.filter(ad => ad.id !== selectedAd.id);
      localStorage.setItem('ads', JSON.stringify(updatedAllAds));

      setOpenDeleteDialog(false);
      setSelectedAd(null);
      
      setSnackbarMessage('Annonce supprimée avec succès');
      setOpenSnackbar(true);
    }
  };

  const handleWhatsAppClick = (whatsapp) => {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
  };

  const getCategoryColor = (category) => {
    const colors = {
      livres: '#4caf50',
      informatique: '#2196f3',
      vetements: '#f44336',
      beaute: '#e91e63',
      accessoires: '#9c27b0',
      services: '#ff9800',
    };
    return colors[category] || '#607d8b';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Bonjour {user?.surname} {user?.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<LockIcon />}
          onClick={() => navigate('/change-password')}
          sx={{
            backgroundColor: 'white',
            color: '#2196F3',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Changer le mot de passe
        </Button>
      </Box>

      <Paper elevation={3} sx={{ 
        p: 4, 
        mb: 4,
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Mon tableau de bord
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.9 }}>
          {user && `Bienvenue ${user.surname} ${user.name}`}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create-ad')}
          sx={{ 
            mb: 3,
            backgroundColor: 'white',
            color: '#FE6B8B',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Publier une nouvelle annonce
        </Button>
      </Paper>

      {ads.length === 0 ? (
        <Paper elevation={3} sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
          color: 'white',
          boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Vous n'avez pas encore publié d'annonces
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/create-ad')}
            sx={{ 
              mt: 2,
              backgroundColor: 'white',
              color: '#4CAF50',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Publier votre première annonce
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {ads.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={ad.image || 'https://via.placeholder.com/300x200'}
                  alt={ad.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {ad.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {ad.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={ad.category}
                      sx={{
                        backgroundColor: getCategoryColor(ad.category),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                    <Chip
                      label={`${ad.price} FCFA`}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Publié le: {ad.date}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<WhatsAppIcon />}
                    onClick={() => handleWhatsAppClick(ad.whatsapp)}
                    sx={{ 
                      flexGrow: 1,
                      backgroundColor: '#25D366',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#128C7E',
                      },
                    }}
                  >
                    Contacter
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDeleteClick(ad)}
                    sx={{ 
                      backgroundColor: '#f44336',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#d32f2f',
                      },
                    }}
                  >
                    Supprimer
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette annonce ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard; 