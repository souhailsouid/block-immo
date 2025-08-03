import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkUserGroups, getStoredUserRole, hasRole, hasPermission } from 'utils/cognitoUtils';
import { useAuth } from 'hooks/useAuth';

// Définition des rôles disponibles
export const ROLES = {
  ADMIN: 'ADMIN',
  PROFESSIONAL: 'PROFESSIONAL',
  INVESTOR: 'INVESTOR'
};

// Configuration des rôles avec leurs permissions
export const ROLE_CONFIG = {
  [ROLES.ADMIN]: {
    label: 'Administrator',
    color: 'error',
    permissions: ['all'], // Admin a toutes les permissions
    canAccessRealEstate: true,
    canEditProperties: true,
    canAddProperties: true,
    canDeleteProperties: true,
    canManageUsers: true
  },
  [ROLES.PROFESSIONAL]: {
    label: 'Professional',
    color: 'warning',
    permissions: [
      'view_properties',
      'edit_properties',
      'add_properties',
      'delete_properties',
      'view_users',
      'edit_users',
      'view_real_estate'
    ],
    canAccessRealEstate: true,
    canEditProperties: true,
    canAddProperties: true,
    canDeleteProperties: true,
    canManageUsers: false
  },
  [ROLES.INVESTOR]: {
    label: 'Investor',
    color: 'info',
    permissions: [
      'view_properties',
      'buy_shares'
    ],
    canAccessRealEstate: false,
    canEditProperties: false,
    canAddProperties: false,
    canDeleteProperties: false,
    canManageUsers: false
  }
};

// Création du contexte
const RoleContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Provider du contexte
export const RoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(ROLES.INVESTOR);
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fonction pour vérifier les rôles côté client (rapide)
  const checkUserRoleClient = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = await checkUserGroups();
      if (userData.isAuthenticated) {
        setUserRole(userData.primaryRole);
        setUserGroups(userData.groups);
      } else {
        // Si non authentifié, utiliser INVESTOR par défaut
        setUserRole('INVESTOR');
        setUserGroups([]);
      }
    } catch (error) {
      setError(error.message);
      
      // En cas d'erreur, utiliser INVESTOR par défaut
      setUserRole('INVESTOR');
      setUserGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour vérifier les rôles côté serveur (sécurisée)
  const checkUserRoleServer = async () => {
    const userData = await checkUserGroups();
    return userData;
  };

  // Fonction pour forcer la mise à jour du rôle
  const forceUpdateRole = async () => {
    await checkUserRoleClient();
  };

  // Vérifier les rôles au chargement
  useEffect(() => {
    checkUserRoleClient();
  }, []);

  // Écouter les changements d'authentification et forcer la mise à jour des rôles
  useEffect(() => {
    if (isAuthenticated && user) {
      // Délai court pour laisser le temps à AWS Cognito de se synchroniser
      const timer = setTimeout(() => {
        checkUserRoleClient();
      }, 500);
      
      return () => window.clearTimeout(timer);
    } else if (!isAuthenticated) {
      // Si déconnecté, réinitialiser les rôles
      setUserRole(ROLES.INVESTOR);
      setUserGroups([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Écouter l'événement de changement d'authentification
  useEffect(() => {
    const handleAuthStateChanged = () => {
      if (isAuthenticated && user) {
        // Forcer la mise à jour des rôles quand l'authentification change
        setTimeout(() => {
          checkUserRoleClient();
        }, 200);
      }
    };

    window.addEventListener('authStateChanged', handleAuthStateChanged);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
    };
  }, [isAuthenticated, user]);

  // Fonction pour vérifier les permissions
  const hasUserPermission = (permission) => {
    return hasPermission(permission);
  };

  // Fonction pour vérifier si l'utilisateur peut accéder à une section
  const canAccessSection = (section) => {
    const roleConfig = ROLE_CONFIG[userRole];
    if (!roleConfig) return false;

    switch (section) {
      case 'real-estate':
        return roleConfig.canAccessRealEstate;
      case 'properties':
        return true; // Tous les rôles peuvent voir les propriétés
      case 'users':
        return roleConfig.canManageUsers;
      default:
        return true;
    }
  };

  // Fonction pour vérifier si l'utilisateur peut effectuer une action
  const canPerformAction = (action) => {
    const roleConfig = ROLE_CONFIG[userRole];
    if (!roleConfig) return false;

    switch (action) {
      case 'edit_properties':
        return roleConfig.canEditProperties;
      case 'add_properties':
        return roleConfig.canAddProperties;
      case 'delete_properties':
        return roleConfig.canDeleteProperties;
      case 'manage_users':
        return roleConfig.canManageUsers;
      default:
        return hasUserPermission(action);
    }
  };

  const value = {
    userRole,
    userGroups,
    isLoading,
    error,
    ROLE_CONFIG,
    hasUserPermission,
    canAccessSection,
    canPerformAction,
    checkUserRoleClient,
    checkUserRoleServer,
    forceUpdateRole,
    isAdmin: userRole === ROLES.ADMIN,
    isProfessional: userRole === ROLES.PROFESSIONAL,
    isInvestor: userRole === ROLES.INVESTOR
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}; 