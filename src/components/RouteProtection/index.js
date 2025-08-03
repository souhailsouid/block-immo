
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';

const RouteProtection = ({ children, requireAuth = false, redirectTo = '/authentication/sign-in/illustration' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Si en cours de chargement, afficher un loader
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Si l'authentification est requise mais l'utilisateur n'est pas connecté
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si l'utilisateur est connecté mais essaie d'accéder aux pages d'auth
  if (isAuthenticated && location.pathname.startsWith('/authentication/')) {
    return <Navigate to="/dashboards/market-place" replace />;
  }

  // Sinon, afficher le contenu
  return children;
};

export default RouteProtection; 