import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* À propos */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              À propos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              UAM Commerce est la marketplace officielle de l'Université Amadou Mahtar Mbow,
              permettant aux étudiants, clubs et personnels de vendre, acheter et échanger
              des biens et services.
            </Typography>
          </Grid>

          {/* Liens rapides */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Liens rapides
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Accueil
            </Link>
            <Link href="/categories" color="inherit" display="block" sx={{ mb: 1 }}>
              Catégories
            </Link>
            <Link href="/create-ad" color="inherit" display="block" sx={{ mb: 1 }}>
              Vendre
            </Link>
            <Link href="/search" color="inherit" display="block" sx={{ mb: 1 }}>
              Rechercher
            </Link>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Université Amadou Mahtar Mbow
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Dakar, Sénégal
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Email: contact@uam-commerce.com
            </Typography>
          </Grid>

          {/* Réseaux sociaux */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Suivez-nous
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} UAM Commerce. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 