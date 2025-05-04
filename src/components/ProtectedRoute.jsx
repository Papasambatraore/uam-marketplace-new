import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Rediriger vers la page de connexion avec l'URL actuelle comme état
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    // Rediriger vers la page d'accueil si l'utilisateur n'est pas admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 