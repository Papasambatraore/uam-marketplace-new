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
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
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

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  const menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    ...(isLoggedIn
      ? [
          { text: 'Publier une annonce', icon: <AddIcon />, path: '/create-ad' },
          { text: 'Mon tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
        ]
      : [{ text: "S'inscrire", icon: <PersonAddIcon />, path: '/register' }]),
  ];

  const renderMenuItems = () => (
    <>
      {menuItems.map((item) => (
        <Button
          key={item.text}
          color="inherit"
          component={item.path ? RouterLink : 'button'}
          to={item.path}
          onClick={item.onClick}
          startIcon={item.icon}
          sx={{
            mx: 1,
            py: 1,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
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
          }}
        >
          Connexion
        </Button>
      )}
      <Button
        color="inherit"
        startIcon={<WhatsAppIcon />}
        href="https://wa.me/2210000000000"
        target="_blank"
        sx={{
          mx: 1,
          py: 1,
          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        Support
      </Button>
    </>
  );

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        px: { xs: 1, sm: 2, md: 3 },
        minHeight: { xs: 56, sm: 64 }
      }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            letterSpacing: 1,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
          }}
        >
          UAM Marketplace
        </Typography>

        {!isMobile ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderMenuItems()}
          </Box>
        ) : (
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ p: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 300,
            backgroundColor: theme.palette.primary.main,
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
              onClick={() => setDrawerOpen(false)}
              sx={{
                py: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 1 }} />
          {isLoggedIn ? (
            <ListItem
              button
              onClick={() => {
                handleLogout();
                setDrawerOpen(false);
              }}
              sx={{
                py: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItem>
          ) : (
            <ListItem
              button
              component={RouterLink}
              to="/login"
              onClick={() => setDrawerOpen(false)}
              sx={{
                py: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Connexion" />
            </ListItem>
          )}
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 1 }} />
          <ListItem
            button
            component="a"
            href="https://wa.me/2210000000000"
            target="_blank"
            onClick={() => setDrawerOpen(false)}
            sx={{
              py: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}><WhatsAppIcon /></ListItemIcon>
            <ListItemText primary="Support" />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 