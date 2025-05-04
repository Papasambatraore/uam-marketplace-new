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
  Chip,
  Avatar,
  Divider,
  TablePagination,
  Backdrop,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSnackbar } from 'notistack';

const Dashboard = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [userAds, setUserAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [userStats, setUserStats] = useState({
    totalAds: 0,
    activeAds: 0,
    totalViews: 0,
  });
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      enqueueSnackbar('Veuillez vous connecter pour accéder au tableau de bord', { 
        variant: 'info',
        autoHideDuration: 3000
      });
      navigate('/login', { 
        state: { 
          from: '/dashboard',
          message: 'Veuillez vous connecter pour accéder au tableau de bord'
        } 
      });
      return;
    }

    loadData();
  }, [navigate, enqueueSnackbar, localStorage.getItem('user')]);

  const loadData = useCallback(() => {
    try {
      const storedAds = JSON.parse(localStorage.getItem('ads') || '[]');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      if (user) {
        // Filtrer uniquement les annonces de l'utilisateur connecté
        const userAds = storedAds.filter(ad => ad.author === user.name);
        setUserAds(userAds);

        // Calculer les statistiques utilisateur
        const stats = {
          totalAds: userAds.length,
          activeAds: userAds.filter(ad => ad.isActive).length,
          totalViews: userAds.reduce((sum, ad) => sum + (ad.views || 0), 0),
        };
        setUserStats(stats);
      }
    } catch (error) {
      enqueueSnackbar('Erreur lors du chargement des données', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleViewAd = (ad) => {
    setLoadingDetails(true);
    setSelectedAd(ad);
    setDialogType('view');
    setOpenDialog(true);
    setTimeout(() => {
      setLoadingDetails(false);
    }, 500);
  };

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
      const storedAds = JSON.parse(localStorage.getItem('ads') || '[]');
      const updatedAds = storedAds.map(ad => 
        ad.id === selectedAd.id ? { ...ad, ...formData } : ad
      );
      localStorage.setItem('ads', JSON.stringify(updatedAds));
      setUserAds(updatedAds.filter(ad => ad.author === JSON.parse(localStorage.getItem('user')).name));
      enqueueSnackbar('Annonce mise à jour avec succès', { variant: 'success' });
      setOpenDialog(false);
    } catch (error) {
      enqueueSnackbar('Erreur lors de la mise à jour', { variant: 'error' });
    }
  };

  const handleDeleteConfirm = () => {
    try {
      const storedAds = JSON.parse(localStorage.getItem('ads') || '[]');
      const updatedAds = storedAds.filter(ad => ad.id !== selectedAd.id);
      localStorage.setItem('ads', JSON.stringify(updatedAds));
      setUserAds(updatedAds.filter(ad => ad.author === JSON.parse(localStorage.getItem('user')).name));
      enqueueSnackbar('Annonce supprimée avec succès', { variant: 'success' });
      setOpenDialog(false);
    } catch (error) {
      enqueueSnackbar('Erreur lors de la suppression', { variant: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
        Mon Tableau de bord
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Mes statistiques
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    Mes annonces : {userStats.totalAds}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    Annonces actives : {userStats.activeAds}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    Vues totales : {userStats.totalViews}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Annonces par catégorie
              </Typography>
              {Object.entries(
                userAds.reduce((acc, ad) => {
                  acc[ad.category] = (acc[ad.category] || 0) + 1;
                  return acc;
                }, {})
              ).map(([category, count]) => (
                <Typography key={category} variant="body2" sx={{ ml: 2, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                  {category}: {count} annonce(s)
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Mes annonces
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Titre</TableCell>
                      <TableCell>Catégorie</TableCell>
                      <TableCell>Prix</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Vues</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userAds
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((ad) => (
                        <TableRow key={ad.id}>
                          <TableCell>{ad.title}</TableCell>
                          <TableCell>{ad.category}</TableCell>
                          <TableCell>{ad.price} €</TableCell>
                          <TableCell>
                            <Chip
                              label={ad.isActive ? 'Active' : 'Inactive'}
                              color={ad.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{ad.views || 0}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleViewAd(ad)}
                              sx={{ mr: 1 }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(ad)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(ad)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={userAds.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog pour voir les détails d'une annonce */}
      <Dialog
        open={openDialog && dialogType === 'view'}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Détails de l'annonce</DialogTitle>
        <DialogContent>
          {loadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : selectedAd && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>{selectedAd.title}</Typography>
              <Typography variant="body1" paragraph>{selectedAd.description}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Prix: {selectedAd.price} €</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Catégorie: {selectedAd.category}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Département: {selectedAd.department}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Pays: {selectedAd.country}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">WhatsApp: {selectedAd.whatsapp}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Race: {selectedAd.race}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour modifier une annonce */}
      <Dialog
        open={openDialog && dialogType === 'edit'}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Modifier l'annonce</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
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
                  label="Prix"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                    value={formData.category}
                    label="Catégorie"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <MenuItem value="Vente">Vente</MenuItem>
                    <MenuItem value="Location">Location</MenuItem>
                    <MenuItem value="Échange">Échange</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Département"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pays"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="WhatsApp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Race"
                  value={formData.race}
                  onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={openDialog && dialogType === 'delete'}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 