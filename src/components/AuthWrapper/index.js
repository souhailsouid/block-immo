import React from 'react';
import { useAuth } from 'hooks/useAuth';

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Chargement...
      </div>
    );
  }

  return children;
};

export default AuthWrapper; 