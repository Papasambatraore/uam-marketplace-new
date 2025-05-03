import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdDetails from './pages/AdDetails';
import CreateAd from './pages/CreateAd';
import EditAd from './pages/EditAd';
import MyAds from './pages/MyAds';
import Favorites from './pages/Favorites';
import SearchResults from './pages/SearchResults';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import AdDetail from './pages/AdDetail';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ads/:id" element={<AdDetails />} />
          <Route path="/create-ad" element={<CreateAd />} />
          <Route path="/publier-annonce" element={<CreateAd />} />
          <Route path="/edit-ad/:id" element={<EditAd />} />
          <Route path="/my-ads" element={<MyAds />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/annonce/:id" element={<AdDetail />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App; 