/* eslint-disable no-undef */
import React from 'react';
import { useAuth } from 'hooks/useAuth';
import { useLocation } from 'react-router-dom';
import MDBox from 'components/MDBox';

const AuthDebug = () => {
  const { 
    isAuthenticated, 
    loading, 
    authCheckComplete, 
    error, 
    user, 
    forceUpdate 
  } = useAuth();
  const location = useLocation();

  // Afficher les états en console pour debugging
  React.useEffect(() => {
    console.log('🔍 Auth Debug:', {
      isAuthenticated,
      loading,
      authCheckComplete,
      error: error?.message || null,
      user: user ? 'Present' : 'Null',
      pathname: location.pathname,
      forceUpdate
    });
  }, [isAuthenticated, loading, authCheckComplete, error, user, location.pathname, forceUpdate]);

  // Affichage visuel en développement seulement
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <MDBox
      position="fixed"
      bottom="10px"
      right="10px"
      p={2}
      bgColor="white"
      border="1px solid #ddd"
      borderRadius="8px"
      fontSize="0.75rem"
      zIndex={9999}
      boxShadow="0 2px 8px rgba(0,0,0,0.15)"
      maxWidth="300px"
    >
      <MDBox fontWeight="bold" mb={1}>Auth Debug</MDBox>
      <MDBox>Authenticated: {isAuthenticated ? '✅' : '❌'}</MDBox>
      <MDBox>Loading: {loading ? '⏳' : '✅'}</MDBox>
      <MDBox>Check Complete: {authCheckComplete ? '✅' : '⏳'}</MDBox>
      <MDBox>Error: {error ? '❌' : '✅'}</MDBox>
      <MDBox>User: {user ? '✅' : '❌'}</MDBox>
      <MDBox>Route: {location.pathname}</MDBox>
      <MDBox>Update: #{forceUpdate}</MDBox>
    </MDBox>
  );
};

export default AuthDebug; 