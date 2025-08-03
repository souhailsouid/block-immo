import React, { useEffect, useState } from 'react';
import { useRole } from '../../context/RoleContext';

/**
 * Composant pour afficher/masquer les boutons d'action selon les rôles
 * Utilisé dans PropertyDetails pour masquer les icônes d'édition aux investisseurs
 */
const RoleBasedActionButtons = ({ 
  children, 
  requiredRole = 'PROFESSIONAL', 
  fallback = null,
  showForRoles = ['PROFESSIONAL', 'ADMIN']
}) => {
  const { userRole, loading, forceUpdateRole } = useRole();
  const [shouldShow, setShouldShow] = useState(false);

  // Forcer la mise à jour des rôles au montage du composant
  useEffect(() => {
    if (userRole && !loading) {
      const hasAccess = showForRoles.includes(userRole);
      setShouldShow(hasAccess);
    }
  }, [userRole, loading, showForRoles]);

  // Écouter les changements d'authentification
  useEffect(() => {
    const handleAuthStateChanged = () => {
      // Forcer la mise à jour des rôles
      setTimeout(() => {
        forceUpdateRole();
      }, 300);
    };

    window.addEventListener('authStateChanged', handleAuthStateChanged);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
    };
  }, [forceUpdateRole]);

  // Si en cours de chargement, afficher un placeholder ou rien
  if (loading) {
    return fallback || null;
  }

  // Si l'utilisateur n'est pas connecté, pas d'accès
  if (!userRole) {
    return fallback || null;
  }

  // Vérifier si l'utilisateur a le rôle requis
  const hasAccess = showForRoles.includes(userRole);

  // Si pas d'accès, afficher le fallback ou rien
  if (!hasAccess) {
    return fallback || null;
  }

  // Si accès autorisé, afficher les enfants
  return children;
};

/**
 * Composant spécifique pour les boutons d'édition de propriété
 * Masque les icônes d'édition aux investisseurs
 */
export const PropertyEditButtons = ({ children, fallback = null }) => {
  return (
    <RoleBasedActionButtons 
      showForRoles={['PROFESSIONAL', 'ADMIN']}
      fallback={fallback}
    >
      {children}
    </RoleBasedActionButtons>
  );
};

/**
 * Composant spécifique pour les boutons d'administration
 * Masque les icônes d'administration aux non-admins
 */
export const AdminButtons = ({ children, fallback = null }) => {
  return (
    <RoleBasedActionButtons 
      showForRoles={['ADMIN']}
      fallback={fallback}
    >
      {children}
    </RoleBasedActionButtons>
  );
};

/**
 * Composant pour les actions d'investisseur
 * Affiche seulement pour les investisseurs
 */
export const InvestorButtons = ({ children, fallback = null }) => {
  return (
    <RoleBasedActionButtons 
      showForRoles={['INVESTOR']}
      fallback={fallback}
    >
      {children}
    </RoleBasedActionButtons>
  );
};

/**
 * Hook pour vérifier rapidement les permissions d'action
 */
export const useActionPermissions = () => {
    const { userRole, loading } = useRole();
    const canEditProperties = !loading && userRole && ['PROFESSIONAL', 'ADMIN'].includes(userRole);
  const canDeleteProperties = !loading && userRole && ['ADMIN'].includes(userRole);
  const canAddProperties = !loading && userRole && ['PROFESSIONAL', 'ADMIN'].includes(userRole);
  const canBuyShares = !loading && userRole && ['INVESTOR'].includes(userRole);

  return {
    canEditProperties,
    canDeleteProperties,
    canAddProperties,
    canBuyShares,
    loading
  };
};

/**
 * Composant wrapper qui force la mise à jour des permissions
 * Utilisé pour résoudre le problème de synchronisation des rôles
 */
export const ForceUpdatePropertyEditButtons = ({ children, fallback = null }) => {
  const [updateKey, setUpdateKey] = useState(0);
  const { forceUpdateRole } = useRole();

  // Écouter les changements d'authentification
  useEffect(() => {
    const handleAuthStateChanged = () => {
      // Forcer la mise à jour des rôles et du composant
      setTimeout(() => {
        forceUpdateRole();
        setUpdateKey(prev => prev + 1);
      }, 300);
    };

    window.addEventListener('authStateChanged', handleAuthStateChanged);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
    };
  }, [forceUpdateRole]);

  return (
    <RoleBasedActionButtons 
      key={`force-update-${updateKey}`}
      showForRoles={['PROFESSIONAL', 'ADMIN']}
      fallback={fallback}
    >
      {children}
    </RoleBasedActionButtons>
  );
};

export default RoleBasedActionButtons; 