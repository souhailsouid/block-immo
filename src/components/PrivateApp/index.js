/* eslint-disable no-undef */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { ProtectedRoute } from 'components/RouteProtection';
import MDBox from 'components/MDBox';
import { CircularProgress } from '@mui/material';

// Écran de chargement principal de l'application
const AppLoadingScreen = () => (
  <MDBox
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    flexDirection="column"
    gap={3}
    bgColor="grey-100"
  >
    <MDBox
      component="img"
      src="/src/assets/images/logos/logo-light.png"
      alt="Block Immo"
      width="120px"
      mb={2}
    />
    <CircularProgress color="primary" size={50} />
    <MDBox color="text" fontSize="1rem" fontWeight="medium">
      Loading...
    </MDBox>
  </MDBox>
);

// Wrapper pour l'application privée complète
const PrivateApp = ({ children }) => {
  const { isAuthenticated, loading, authCheckComplete, error } = useAuth();
  const location = useLocation();

  // Affichage du loading pendant la vérification initiale
  if (loading || !authCheckComplete) {
    return <AppLoadingScreen />;
  }

  // Gestion des erreurs critiques d'authentification (seulement les vraies erreurs)
  if (error && !isAuthenticated && authCheckComplete) {
    console.error('Critical authentication error:', error);
    
    // Rediriger vers la page de connexion avec le message d'erreur
    return (
      <Navigate 
        to="/authentication/sign-in/illustration" 
        state={{ 
          from: location, 
          error: 'Session expired. Please reconnect.' 
        }} 
        replace 
      />
    );
  }

  // Si non authentifié ET que la vérification est complète
  if (!isAuthenticated && authCheckComplete) {
    console.log('User not authenticated, redirecting to login');
    return (
      <Navigate 
        to="/authentication/sign-in/illustration" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Utilisateur authentifié - afficher le contenu directement
  return <>{children}</>;
};

export default PrivateApp; 