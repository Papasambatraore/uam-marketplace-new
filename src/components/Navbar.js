import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PetsIcon from '@mui/icons-material/Pets';
import { styled } from '@mui/material/styles';
import { logout, isAdmin } from '../services/authService';
import { useSnackbar } from 'notistack';

const SUPPORT_PHONE = '+221774907982';

const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.light,
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userData = JSON.parse(localStorage.getItem('user') || 'null');
      setIsLoggedIn(loggedIn);
      setUser(userData);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  const handleLogout = () => {
    logout();
    enqueueSnackbar('Déconnexion réussie', { variant: 'success' });
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    { text: 'Rechercher', icon: <DashboardIcon />, path: '/search' },
    ...(isLoggedIn
      ? [
          { text: 'Publier', icon: <AddIcon />, path: '/create-ad' },
          { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
        ]
      : [{ text: "S'inscrire", icon: <PersonAddIcon />, path: '/register' }]),
  ];

  if (isAdmin()) {
    menuItems.unshift({ text: 'Panel Admin', icon: <DashboardIcon />, path: '/admin' });
  }

  const renderMenuItems = () => (
    <>
      {menuItems.map((item) => (
        <Button
          key={item.text}
          color="inherit"
          component={RouterLink}
          to={item.path}
          startIcon={item.icon}
          sx={{
            mx: 1,
            py: 1,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          {item.text}
        </Button>
      ))}
      {isLoggedIn ? (
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            mx: 1,
            py: 1,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          Déconnexion
        </Button>
      ) : (
        <Button
          color="inherit"
          component={RouterLink}
          to="/login"
          startIcon={<AccountCircleIcon />}
          sx={{
            mx: 1,
            py: 1,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          Connexion
        </Button>
      )}
      <Button
        color="inherit"
        startIcon={<WhatsAppIcon />}
        href={`https://wa.me/${SUPPORT_PHONE}`}
        target="_blank"
        sx={{
          mx: 1,
          py: 1,
          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
          backgroundColor: '#25D366',
          color: 'white',
          borderRadius: '20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          '&:hover': {
            backgroundColor: '#128C7E',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          },
          transition: 'all 0.3s ease',
          display: { xs: 'none', sm: 'flex' },
        }}
      >
        Support
      </Button>
    </>
  );

  return (
    <AppBar position="sticky" elevation={1} sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        px: { xs: 1, sm: 2, md: 3 },
        minHeight: { xs: 56, sm: 64 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PetsIcon sx={{ 
            fontSize: { xs: 24, sm: 28, md: 32 },
            color: 'white' 
          }} />
          <Typography
            variant="h6"
            component={StyledLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
              letterSpacing: 1,
              fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.5rem' },
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              display: { xs: isSmallMobile ? 'none' : 'block', sm: 'block' }
            }}
          >
            Keur Diourgui
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderMenuItems()}
            </Box>
          ) : (
            <>
              <IconButton
                color="inherit"
                component="a"
                href={`https://wa.me/${SUPPORT_PHONE}`}
                target="_blank"
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  backgroundColor: '#25D366',
                  '&:hover': {
                    backgroundColor: '#128C7E',
                  },
                }}
              >
                <WhatsAppIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleMobileMenuToggle}
                sx={{ p: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 300,
            backgroundColor: '#1976d2',
            color: 'white',
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {isLoggedIn ? (
            <>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {user?.surname?.[0]}{user?.name?.[0]}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user?.surname} {user?.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.8,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <AccountCircleIcon sx={{ fontSize: 40 }} />
              <Typography variant="subtitle1">Invité</Typography>
            </Box>
          )}
        </Box>

        <List sx={{ py: 0 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              button
              component={RouterLink}
              to={item.path}
              onClick={handleMobileMenuToggle}
              sx={{
                py: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 1 }} />
          {isLoggedIn ? (
            <ListItem
              button
              onClick={() => {
                handleLogout();
                handleMobileMenuToggle();
              }}
              sx={{
                py: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItem>
          ) : (
            <ListItem
              button
              component={RouterLink}
              to="/login"
              onClick={handleMobileMenuToggle}
              sx={{
                py: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Connexion" />
            </ListItem>
          )}
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 1 }} />
          <ListItem
            button
            component="a"
            href={`https://wa.me/${SUPPORT_PHONE}`}
            target="_blank"
            onClick={handleMobileMenuToggle}
            sx={{
              py: 2,
              backgroundColor: '#25D366',
              color: 'white',
              '&:hover': {
                backgroundColor: '#128C7E',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <WhatsAppIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Support WhatsApp" 
              primaryTypographyProps={{
                sx: { 
                  color: 'white',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 