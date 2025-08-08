/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import MDBox from 'components/MDBox';
import { CircularProgress } from '@mui/material';

// Composant de loading avec un design cohérent
const AuthLoadingScreen = () => (
  <MDBox
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    flexDirection="column"
    gap={2}
  >
    <CircularProgress color="primary" size={40} />
    <MDBox color="text" fontSize="0.875rem">
      Authentication verification...
    </MDBox>
  </MDBox>
);

// Pages publiques qui ne nécessitent pas d'authentification
const PUBLIC_ROUTES = [
  '/authentication/sign-in/illustration',
  '/authentication/sign-up/illustration',
  '/authentication/reset-password',
  '/authentication/reset-password/confirm',
  '/authentication/email-verification'
];

const RouteProtection = ({ children, requireAuth = true, redirectTo = '/authentication/sign-in/illustration' }) => {
  const { isAuthenticated, loading, authCheckComplete, error, validateAuth } = useAuth();
  const [validationInProgress, setValidationInProgress] = useState(false);
  const [lastLoginTime, setLastLoginTime] = useState(null);
  const location = useLocation();
  
  const currentPath = location.pathname;
  const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);

  // Écouter les changements d'authentification pour noter l'heure de connexion
  useEffect(() => {
    if (isAuthenticated && authCheckComplete) {
      setLastLoginTime(Date.now());
    }
  }, [isAuthenticated, authCheckComplete]);

  // Validation côté serveur pour les routes sensibles avec période de grâce
  useEffect(() => {
    if (requireAuth && isAuthenticated && authCheckComplete && !error) {
      // Période de grâce de 3 secondes après connexion
      const timeSinceLogin = lastLoginTime ? Date.now() - lastLoginTime : Infinity;
      const gracePeriod = 3000; // 3 secondes
      
      if (timeSinceLogin < gracePeriod) {
          
        return;
      }

      const validateUserAuth = async () => {
        setValidationInProgress(true);
        try {
          const isValid = await validateAuth();
          if (!isValid) {
            console.warn('Authentication validation failed, redirecting to login');
            // Le logout sera géré par le AuthProvider
          }
        } catch (validationError) {
          console.error('Error during validation:', validationError);
        } finally {
          setValidationInProgress(false);
        }
      };

      // Valider seulement pour les routes critiques (administration, etc.)
      if (currentPath.includes('/admin') || currentPath.includes('/properties/add')) {
        validateUserAuth();
      }
    }
  }, [requireAuth, isAuthenticated, authCheckComplete, error, currentPath, validateAuth, lastLoginTime]);

  // Afficher le loading pendant la vérification initiale
  if (loading || !authCheckComplete || validationInProgress) {
    return <AuthLoadingScreen />;
  }

  // Gestion des erreurs d'authentification
  if (error && requireAuth) {
    console.error('Authentication error detected:', error);
    return <Navigate to={redirectTo} state={{ from: location, error: error.message }} replace />;
  }

  // Route publique - laisser passer
  if (!requireAuth || isPublicRoute) {
    return children;
  }

  // Route protégée - vérifier l'authentification
  if (requireAuth && !isAuthenticated) {
  
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Route protégée - utilisateur authentifié
  if (requireAuth && isAuthenticated) {
    // Si l'utilisateur est connecté mais essaie d'accéder à une page de connexion,
    // le rediriger vers le dashboard
    if (isPublicRoute) {
      return <Navigate to="/dashboards/market-place" replace />;
    }
    return children;
  }

  // Par défaut, autoriser l'accès
  return children;
};

// Composant wrapper pour les routes qui nécessitent une authentification
export const ProtectedRoute = ({ children, redirectTo }) => (
  <RouteProtection requireAuth={true} redirectTo={redirectTo}>
    {children}
  </RouteProtection>
);

// Composant wrapper pour les routes publiques (pas d'authentification requise)
export const PublicRoute = ({ children }) => (
  <RouteProtection requireAuth={false}>
    {children}
  </RouteProtection>
);

// Composant wrapper pour les routes d'authentification (redirection si déjà connecté)
export const AuthRoute = ({ children }) => {
  const { isAuthenticated, authCheckComplete } = useAuth();
  
  // Pour les pages d'auth, ne pas afficher de loading, laisser la page gérer elle-même
  // Seulement rediriger si l'utilisateur est déjà authentifié ET que la vérification est complète
  if (isAuthenticated && authCheckComplete) {
    
    return <Navigate to="/dashboards/market-place" replace />;
  }
  
  return children;
};

export default RouteProtection; 