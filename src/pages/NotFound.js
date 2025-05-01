import React from 'react';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5">
          404 - Page non trouvée
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" align="center">
            La page que vous recherchez n'existe pas.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 3 }}
          >
            Retour à l'accueil
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
}

export default NotFound; 