import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import { isAdmin } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [ads, setAds] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'edit' or 'delete'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    department: '',
    country: '',
    whatsapp: '',
    race: '',
  });

  const loadData = useCallback(() => {
    try {
      // Charger les annonces
      const storedAds = JSON.parse(localStorage.getItem('ads') || '[]');
      setAds(storedAds);

      // Charger les utilisateurs
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(storedUsers);
    } catch (error) {
      enqueueSnackbar('Erreur lors du chargement des données', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    if (!isAdmin()) {
      enqueueSnackbar('Accès non autorisé', { variant: 'error' });
      navigate('/');
      return;
    }

    // Charger les données
    loadData();
  }, [enqueueSnackbar, loadData, navigate]);

  const handleEdit = (ad) => {
    setSelectedAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description,
      price: ad.price,
      category: ad.category,
      department: ad.department,
      country: ad.country,
      whatsapp: ad.whatsapp,
      race: ad.race,
    });
    setDialogType('edit');
    setOpenDialog(true);
  };

  const handleDelete = (ad) => {
    setSelectedAd(ad);
    setDialogType('delete');
    setOpenDialog(true);
  };

  const handleSave = () => {
    try {
      const updatedAds = ads.map(ad => 
        ad.id === selectedAd.id ? { ...ad, ...formData } : ad
      );
      localStorage.setItem('ads', JSON.stringify(updatedAds));
      setAds(updatedAds);
      enqueueSnackbar('Annonce mise à jour avec succès', { variant: 'success' });
      setOpenDialog(false);
    } catch (error) {
      enqueueSnackbar('Erreur lors de la mise à jour', { variant: 'error' });
    }
  };

  const handleDeleteConfirm = () => {
    try {
      const updatedAds = ads.filter(ad => ad.id !== selectedAd.id);
      localStorage.setItem('ads', JSON.stringify(updatedAds));
      setAds(updatedAds);
      enqueueSnackbar('Annonce supprimée avec succès', { variant: 'success' });
      setOpenDialog(false);
    } catch (error) {
      enqueueSnackbar('Erreur lors de la suppression', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel Administrateur
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistiques
        </Typography>
              <Typography variant="body1">
                Nombre total d'annonces : {ads.length}
        </Typography>
              <Typography variant="body1">
                Nombre total d'utilisateurs : {users.length}
        </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Gestion des annonces
          </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Titre</TableCell>
                    <TableCell>Catégorie</TableCell>
                    <TableCell>Prix</TableCell>
                    <TableCell>Localisation</TableCell>
                    <TableCell>Auteur</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>{ad.title}</TableCell>
                      <TableCell>{ad.category}</TableCell>
                      <TableCell>{ad.price} FCFA</TableCell>
                      <TableCell>{ad.department}, {ad.country}</TableCell>
                      <TableCell>{ad.author}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(ad)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(ad)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'edit' ? 'Modifier l\'annonce' : 'Supprimer l\'annonce'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'edit' ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Titre"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Prix (FCFA)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Catégorie"
                  >
                    <MenuItem value="chiens">Chiens</MenuItem>
                    <MenuItem value="lapins">Lapins</MenuItem>
                    <MenuItem value="volailles">Volailles</MenuItem>
                    <MenuItem value="moutons">Moutons</MenuItem>
                    <MenuItem value="reptiles">Reptiles</MenuItem>
                    <MenuItem value="autres">Autres</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          ) : (
            <Typography>
              Êtes-vous sûr de vouloir supprimer cette annonce : "{selectedAd?.title}" ?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            onClick={dialogType === 'edit' ? handleSave : handleDeleteConfirm}
            color={dialogType === 'edit' ? 'primary' : 'error'}
            variant="contained"
          >
            {dialogType === 'edit' ? 'Enregistrer' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 