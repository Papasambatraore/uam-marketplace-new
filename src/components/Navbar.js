import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 5px 15px 2px rgba(33, 203, 243, .4)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  margin: theme.spacing(0, 1),
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2px',
    background: 'white',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    handleClose();
    navigate('/login');
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          onClick={() => navigate('/')}
        >
          UAM Marketplace
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'rotate(90deg)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: 'white',
                },
              }}
            >
              <List>
                <ListItem button onClick={() => navigate('/')}>
                  <ListItemText primary="Accueil" />
                </ListItem>
                <ListItem button onClick={() => navigate('/ads')}>
                  <ListItemText primary="Annonces" />
                </ListItem>
                <ListItem 
                  component="a" 
                  href="https://wa.me/221774907982" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <PhoneIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Support: +221 77 490 79 82" />
                </ListItem>
                {user ? (
                  <>
                    <ListItem button onClick={() => navigate('/dashboard')}>
                      <ListItemText primary="Tableau de bord" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                      <ListItemText primary="Déconnexion" />
                    </ListItem>
                  </>
                ) : (
                  <>
                    <ListItem button onClick={() => navigate('/login')}>
                      <ListItemText primary="Connexion" />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/register')}>
                      <ListItemText primary="Inscription" />
                    </ListItem>
                  </>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StyledButton onClick={() => navigate('/')}>
              Accueil
            </StyledButton>
            <StyledButton onClick={() => navigate('/ads')}>
              Annonces
            </StyledButton>
            <StyledButton
              component="a"
              href="https://wa.me/221774907982"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<PhoneIcon />}
            >
              Support: +221 77 490 79 82
            </StyledButton>
            {user ? (
              <>
                <StyledButton onClick={() => navigate('/dashboard')}>
                  Tableau de bord
                </StyledButton>
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  sx={{
                    color: 'white',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'white',
                      color: '#2196F3',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {user.surname?.[0]}{user.name?.[0]}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: 'white',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    },
                  }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                    Mon Profil
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Déconnexion
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <StyledButton onClick={() => navigate('/login')}>
                  Connexion
                </StyledButton>
                <StyledButton
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    backgroundColor: 'white',
                    color: '#2196F3',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  Inscription
                </StyledButton>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar; 