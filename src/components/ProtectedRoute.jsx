import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdmin } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isAdmin()) {
    // Rediriger vers la page de connexion avec l'URL actuelle comme état
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 