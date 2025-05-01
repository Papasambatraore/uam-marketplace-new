import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

function SearchResults() {
  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5">
          Résultats de recherche
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1">
            Page des résultats de recherche en construction
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
}

export default SearchResults; 