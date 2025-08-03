import { fetchAuthSession } from '@aws-amplify/auth';
import { jwtDecode } from 'jwt-decode';

/**
 * Vérifie les groupes Cognito de l'utilisateur connecté
 * @returns {Promise<Object>} Informations sur les rôles de l'utilisateur
 */
export const checkUserGroups = async () => {
  try {
    const { tokens } = await fetchAuthSession();

    if (!tokens?.idToken) {
      return {
        isAuthenticated: false,
        groups: [],
        roles: {
          isAdmin: false,
          isProfessional: false,
          isInvestor: false
        }
      };
    }

    const idToken = tokens.idToken.toString();
    const decoded = jwtDecode(idToken);

    const groups = decoded["cognito:groups"] || [];
    
    // Vérifier les rôles
    const isAdmin = groups.includes("admin");
    const isProfessional = groups.includes("professional");
    const isInvestor = groups.includes("investor");

    const roles = {
      isAdmin,
      isProfessional,
      isInvestor
    };

    // Déterminer le rôle principal
    let primaryRole = 'INVESTOR'; // Rôle par défaut
    if (isAdmin) {
      primaryRole = 'ADMIN';
    } else if (isProfessional) {
      primaryRole = 'PROFESSIONAL';
    }

    // Stocker dans localStorage pour un accès rapide
    localStorage.setItem('userRole', primaryRole);
    localStorage.setItem('userGroups', JSON.stringify(groups));

    return {
      isAuthenticated: true,
      groups,
      roles,
      primaryRole,
      userId: decoded.sub,
      email: decoded.email
    };

  } catch (error) {
    return {
      isAuthenticated: false,
      groups: [],
      roles: {
        isAdmin: false,
        isProfessional: false,
        isInvestor: false
      },
      error: error.message
    };
  }
};

/**
 * Récupère le rôle principal de l'utilisateur depuis localStorage
 * @returns {string} Le rôle principal (ADMIN, PROFESSIONAL, INVESTOR)
 */
export const getStoredUserRole = () => {
  return localStorage.getItem('userRole') || 'INVESTOR';
};

/**
 * Récupère les groupes de l'utilisateur depuis localStorage
 * @returns {Array} Les groupes Cognito
 */
export const getStoredUserGroups = () => {
  try {
    const groups = localStorage.getItem('userGroups');
    return groups ? JSON.parse(groups) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 * @param {string} role - Le rôle à vérifier (ADMIN, PROFESSIONAL, INVESTOR)
 * @returns {boolean} True si l'utilisateur a ce rôle
 */
export const hasRole = (role) => {
  const userRole = getStoredUserRole();
  return userRole === role;
};

/**
 * Vérifie si l'utilisateur a une permission spécifique
 * @param {string} permission - La permission à vérifier
 * @returns {boolean} True si l'utilisateur a cette permission
 */
export const hasPermission = (permission) => {
  const userRole = getStoredUserRole();
  
  // Définir les permissions par rôle
  const rolePermissions = {
    ADMIN: ['all'], // Admin a toutes les permissions
    PROFESSIONAL: [
      'view_properties',
      'edit_properties',
      'add_properties',
      'delete_properties',
      'view_users',
      'edit_users',
      'view_real_estate'
    ],
    INVESTOR: [
      'view_properties',
      'buy_shares'
    ]
  };

  const permissions = rolePermissions[userRole] || [];
  return permissions.includes('all') || permissions.includes(permission);
}; 