import { fetchAuthSession } from '@aws-amplify/auth';
import {jwtDecode} from 'jwt-decode';
import { useState, useEffect } from 'react';

/**
 * Vérifier les rôles de l'utilisateur de manière sécurisée
 * @returns {Object} { isAdmin, isProfessional, isInvestor, userRole }
 */ 
export const verifyUserRoles = async () => {
  try {
    const { tokens } = await fetchAuthSession();
    
    if (!tokens?.idToken) {
      return {
        isAdmin: false,
        isProfessional: false,
        isInvestor: false,
        userRole: null,
        isAuthenticated: false
      };
    }

    const idToken = tokens.idToken.toString();
    const decoded = jwtDecode(idToken);

    // Vérifier les groupes Cognito
    const groups = decoded['cognito:groups'] || [];
    const roles = decoded['cognito:roles'] || [];
    const customRole = decoded['custom:role'];

    // Déterminer le rôle principal
    let userRole = 'INVESTOR'; // Par défaut

    if (groups.includes('admin') || customRole === 'ADMIN') {
      userRole = 'ADMIN';
    } else if (groups.includes('professional') || customRole === 'PROFESSIONAL') {
      userRole = 'PROFESSIONAL';
    } else if (groups.includes('investor') || customRole === 'INVESTOR') {
      userRole = 'INVESTOR';
    }

    const isAdmin = userRole === 'ADMIN';
    const isProfessional = userRole === 'PROFESSIONAL';
    const isInvestor = userRole === 'INVESTOR';

    return {
      isAdmin,
      isProfessional,
      isInvestor,
      userRole,
      isAuthenticated: true,
      groups,
      roles,
      customRole
    };

  } catch (error) {
    return {
      isAdmin: false,
      isProfessional: false,
      isInvestor: false,
      userRole: null,
      isAuthenticated: false,
      error: error.message
    };
  }
};

/**
 * Hook pour utiliser la vérification des rôles
 */
export const useRoleVerification = () => {
  const [roleInfo, setRoleInfo] = useState({
    isAdmin: false,
    isProfessional: false,
    isInvestor: false,
    userRole: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    const checkRoles = async () => {
      const roles = await verifyUserRoles();
      setRoleInfo({ ...roles, loading: false });
    };

    checkRoles();
  }, []);

  return roleInfo;
};

/**
 * Composant de protection par rôle
 */
export const RoleGuard = ({ children, allowedRoles, fallback = null }) => {
  const { userRole, loading } = useRoleVerification();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!allowedRoles.includes(userRole)) {
    return fallback;
  }

  return children;
}; 