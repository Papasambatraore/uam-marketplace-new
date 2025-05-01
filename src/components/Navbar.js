import React, { useState } from 'react';
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
  Menu,
  MenuItem,
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

const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {item.text}
        </Button>
      ))}
      <Button
        color="inherit"
        startIcon={<WhatsAppIcon />}
        href="https://wa.me/2210000000000"
        target="_blank"
        sx={{
          mx: 1,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        Support
      </Button>
    </>
  );

  const renderDrawer = () => (
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
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        {isLoggedIn ? (
          <>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user?.prenom} {user?.nom}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {user?.email}
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountCircleIcon sx={{ fontSize: 40 }} />
            <Typography variant="subtitle1">Invité</Typography>
          </Box>
        )}
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List sx={{ py: 0 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            component={item.path ? RouterLink : 'button'}
            to={item.path}
            onClick={() => {
              if (item.onClick) item.onClick();
              setDrawerOpen(false);
            }}
            sx={{
              py: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{ sx: { fontWeight: 500 } }}
            />
          </ListItem>
        ))}
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
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
          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
            <WhatsAppIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Support"
            primaryTypographyProps={{ sx: { fontWeight: 500 } }}
          />
        </ListItem>
        {isLoggedIn && (
          <>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
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
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Déconnexion"
                primaryTypographyProps={{ sx: { fontWeight: 500 } }}
              />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          UAM e-commerce
        </Typography>

        {isMobile ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isLoggedIn && (
                <IconButton
                  color="inherit"
                  onClick={handleMenuClick}
                  sx={{ p: 0 }}
                >
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                    {user?.prenom?.[0]}{user?.nom?.[0]}
                  </Avatar>
                </IconButton>
              )}
              <IconButton
                color="inherit"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            {renderDrawer()}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                },
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Mon profil" />
              </MenuItem>
              <MenuItem onClick={() => {
                handleLogout();
                handleMenuClose();
              }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Déconnexion" />
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderMenuItems()}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 