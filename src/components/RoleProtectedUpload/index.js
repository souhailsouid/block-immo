import React from 'react';
import { Alert } from '@mui/material';
import { Lock } from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useRole } from 'context/RoleContext';

/**
 * Composant wrapper qui protège l'upload par les rôles
 * Affiche le composant d'upload seulement si l'utilisateur a les permissions
 */
const RoleProtectedUpload = ({ 
  children, 
  fallback = null,
  showMessage = true,
  requiredRoles = ['PROFESSIONAL', 'ADMIN']
}) => {
  const { userRole, loading } = useRole();

  // 🔄 Affichage pendant le chargement des rôles
  if (loading) {
    return (
      <MDBox>
        <Alert severity="info">
          Vérification des autorisations en cours...
        </Alert>
      </MDBox>
    );
  }

  // 🔐 Vérifier les permissions d'upload
  const canUpload = requiredRoles.includes(userRole);
  const isInvestor = userRole === 'INVESTOR';

  // Si l'utilisateur n'a pas les droits
  if (!canUpload) {
    // Afficher le message d'erreur personnalisé ou par défaut
    if (showMessage) {
      return (
        <MDBox>
          <Alert 
            severity="warning" 
            icon={<Lock />}
            sx={{ mb: 3 }}
          >
            <MDTypography variant="body2" fontWeight="medium">
              🔒 <strong>Accès restreint</strong>
            </MDTypography>
            <MDTypography variant="body2" sx={{ mt: 1 }}>
              {isInvestor 
                ? 'L\'upload de contenus est réservé aux professionnels et administrateurs. Les investisseurs peuvent consulter les propriétés existantes.'
                : 'Vous n\'avez pas les permissions nécessaires pour uploader du contenu.'
              }
            </MDTypography>
          </Alert>
          {fallback}
        </MDBox>
      );
    }
    
    // Afficher seulement le fallback
    return fallback || null;
  }

  // Si l'utilisateur a les droits, afficher le composant d'upload
  return children;
};

/**
 * Composant spécifique pour protéger l'upload de photos de propriétés
 */
export const PropertyUploadProtection = ({ children, fallback = null }) => {
  return (
    <RoleProtectedUpload 
      requiredRoles={['PROFESSIONAL', 'ADMIN']}
      fallback={fallback}
      showMessage={true}
    >
      {children}
    </RoleProtectedUpload>
  );
};

/**
 * Hook pour vérifier rapidement les permissions d'upload
 */
export const useUploadPermissions = () => {
  const { userRole, loading } = useRole();
  
  return {
    canUpload: userRole === 'PROFESSIONAL' || userRole === 'ADMIN',
    isInvestor: userRole === 'INVESTOR',
    isProfessional: userRole === 'PROFESSIONAL',
    isAdmin: userRole === 'ADMIN',
    loading
  };
};

export default RoleProtectedUpload; 