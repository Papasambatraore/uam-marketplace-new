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
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EditIcon from '@mui/icons-material/Edit';
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
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (!isLoggedIn || !currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);

    // Charger les annonces de l'utilisateur
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
      // Filtrer les annonces pour enlever celle à supprimer
      const updatedAds = ads.filter(ad => ad.id !== selectedAd.id);
      setAds(updatedAds);
      
      // Mettre à jour le localStorage
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Bonjour {user?.surname} {user?.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<LockIcon />}
          onClick={() => navigate('/change-password')}
        >
          Changer le mot de passe
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mon tableau de bord
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          {user && `Bienvenue ${user.surname} ${user.name}`}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/create-ad')}
          sx={{ mb: 3 }}
        >
          Publier une nouvelle annonce
        </Button>
      </Paper>

      {ads.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Vous n'avez pas encore publié d'annonces
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/create-ad')}
            sx={{ mt: 2 }}
          >
            Publier votre première annonce
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {ads.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={ad.image || 'https://via.placeholder.com/300x200'}
                  alt={ad.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
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
                      }}
                    />
                    <Chip
                      label={`${ad.price} FCFA`}
                      color="primary"
                      variant="outlined"
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
                    sx={{ flexGrow: 1 }}
                  >
                    Contacter
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDeleteClick(ad)}
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