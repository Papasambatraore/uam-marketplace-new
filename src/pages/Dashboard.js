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
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [userStats, setUserStats] = useState({
    totalAds: 0,
    activeAds: 0,
    totalViews: 0,
    favoriteAds: 0
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
    // Vérifier si l'utilisateur est connecté
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
  }, [navigate, enqueueSnackbar]);

  const loadData = useCallback(() => {
    try {
      const storedAds = JSON.parse(localStorage.getItem('ads') || '[]');
      setAds(storedAds);

      // Calculer les statistiques utilisateur
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user) {
        const userAds = storedAds.filter(ad => ad.author === user.name);
        const stats = {
          totalAds: userAds.length,
          activeAds: userAds.filter(ad => ad.isActive).length,
          totalViews: userAds.reduce((sum, ad) => sum + (ad.views || 0), 0),
          favoriteAds: userAds.filter(ad => ad.favorites?.includes(user.id)).length
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
    // Simuler un chargement pour une meilleure expérience utilisateur
    setTimeout(() => {
      setLoadingDetails(false);
    }, 500);
  };

  const handleEdit = (ad) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.name !== ad.author) {
      enqueueSnackbar('Vous n\'êtes pas autorisé à modifier cette annonce', { variant: 'error' });
      return;
    }
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
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.name !== ad.author) {
      enqueueSnackbar('Vous n\'êtes pas autorisé à supprimer cette annonce', { variant: 'error' });
      return;
    }
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
        Tableau de bord
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Statistiques générales
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Nombre total d'annonces : {ads.length}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mt: 1 }}>
                Annonces par catégorie :
              </Typography>
              {Object.entries(
                ads.reduce((acc, ad) => {
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
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    Annonces favorites : {userStats.favoriteAds}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Mes annonces
            </Typography>
            <TableContainer sx={{ 
              maxHeight: { xs: '400px', sm: '500px', md: '600px' },
              overflowX: 'auto'
            }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Titre</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Catégorie</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Prix</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Localisation</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ads
                    .filter(ad => ad.author === JSON.parse(localStorage.getItem('user'))?.name)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>{ad.title}</TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>{ad.category}</TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>{ad.price} FCFA</TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>{ad.department}, {ad.country}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
                            <IconButton 
                              onClick={() => handleViewAd(ad)} 
                              color="primary"
                              size="small"
                              sx={{ p: { xs: 0.5, sm: 1 } }}
                            >
                              <VisibilityIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleEdit(ad)} 
                              color="primary"
                              size="small"
                              sx={{ p: { xs: 0.5, sm: 1 } }}
                            >
                              <EditIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDelete(ad)} 
                              color="error"
                              size="small"
                              sx={{ p: { xs: 0.5, sm: 1 } }}
                            >
                              <DeleteIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={ads.filter(ad => ad.author === JSON.parse(localStorage.getItem('user'))?.name).length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
              sx={{
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                }
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)' }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          {dialogType === 'view' ? 'Détails de l\'annonce' : 
           dialogType === 'edit' ? 'Modifier l\'annonce' : 
           'Supprimer l\'annonce'}
        </DialogTitle>
        <DialogContent>
          {loadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : dialogType === 'view' && selectedAd ? (
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              <Grid container spacing={{ xs: 1, sm: 3 }}>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                    {selectedAd.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={selectedAd.category} 
                      color="primary" 
                      size="small"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                    />
                    <Chip 
                      label={`${selectedAd.price} FCFA`} 
                      color="secondary"
                      size="small"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {selectedAd.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                    Localisation
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {selectedAd.department}, {selectedAd.country}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                    Contact
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    WhatsApp: {selectedAd.whatsapp}
                  </Typography>
                </Grid>
                {selectedAd.race && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      Race
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {selectedAd.race}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider sx={{ my: { xs: 1, sm: 2 } }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                      {selectedAd.author?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        {selectedAd.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                        Publié le {new Date(selectedAd.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : dialogType === 'edit' ? (
            <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Titre"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  size="small"
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
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Prix (FCFA)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
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
            <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Êtes-vous sûr de vouloir supprimer cette annonce ?
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 } }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            size="small"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
          >
            {dialogType === 'view' ? 'Fermer' : 'Annuler'}
          </Button>
          {dialogType === 'edit' ? (
            <Button 
              onClick={handleSave} 
              variant="contained" 
              color="primary"
              size="small"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
            >
              Enregistrer
            </Button>
          ) : dialogType === 'delete' ? (
            <Button 
              onClick={handleDeleteConfirm} 
              variant="contained" 
              color="error"
              size="small"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
            >
              Supprimer
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default Dashboard; 