import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from 'context/RoleContext';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Material-UI components
import { CircularProgress } from '@mui/material';

const RoleProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null, 
  requiredSection = null,
  fallbackPath = '/dashboards/market-place',
  showUnauthorizedMessage = true 
}) => {
  const { 
    userRole, 
    hasPermission, 
    canAccess, 
    getDefaultDashboard, 
    loading 
  } = useRole();

  // Affichage du loading
  if (loading) {
    return (
      <MDBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <MDTypography variant="body2" color="text.secondary">
          Loading user permissions...
        </MDTypography>
      </MDBox>
    );
  }

  // Vérification du rôle requis
  if (requiredRole && userRole !== requiredRole) {
    if (showUnauthorizedMessage) {
      return (
        <MDBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
          gap={3}
          p={4}
        >
          <MDTypography variant="h4" color="error" fontWeight="bold">
            ⚠️ Access Denied
          </MDTypography>
          
          <MDTypography variant="body1" color="text.secondary" textAlign="center" maxWidth={400}>
            You don&apos;t have the required role to access this page. 
            Required role: <strong>{requiredRole}</strong>
          </MDTypography>
          
          <MDButton
            variant="contained"
            color="info"
            onClick={() => window.history.back()}
            sx={{ mt: 2 }}
          >
            Go Back
          </MDButton>
        </MDBox>
      );
    }
    
    return <Navigate to={fallbackPath} replace />;
  }

  // Vérification de la permission requise
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (showUnauthorizedMessage) {
      return (
        <MDBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
          gap={3}
          p={4}
        >
          <MDTypography variant="h4" color="error" fontWeight="bold">
            🔒 Permission Required
          </MDTypography>
          
          <MDTypography variant="body1" color="text.secondary" textAlign="center" maxWidth={400}>
            You don&apos;t have the required permission to access this page. 
            Required permission: <strong>{requiredPermission}</strong>
          </MDTypography>
          
          <MDButton
            variant="contained"
            color="info"
            onClick={() => window.history.back()}
            sx={{ mt: 2 }}
          >
            Go Back
          </MDButton>
        </MDBox>
      );
    }
    
    return <Navigate to={fallbackPath} replace />;
  }

  // Vérification de la section requise
  if (requiredSection && !canAccess(requiredSection)) {
    if (showUnauthorizedMessage) {
      return (
        <MDBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
          gap={3}
          p={4}
        >
          <MDTypography variant="h4" color="error" fontWeight="bold">
            🚫 Section Access Denied
          </MDTypography>
          
          <MDTypography variant="body1" color="text.secondary" textAlign="center" maxWidth={400}>
            You don&apos;t have access to this section. 
            Required section: <strong>{requiredSection}</strong>
          </MDTypography>
          
          <MDButton
            variant="contained"
            color="info"
            onClick={() => window.history.back()}
            sx={{ mt: 2 }}
          >
            Go Back
          </MDButton>
        </MDBox>
      );
    }
    
    return <Navigate to={fallbackPath} replace />;
  }

  // Si toutes les vérifications passent, afficher le contenu
  return children;
};

export default RoleProtectedRoute; 