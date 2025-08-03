import { apiRequest } from 'utils/apiUtils';
import { useState, useEffect } from 'react';

/**
 * Service pour la vérification sécurisée des rôles côté serveur
 * Utilise la Lambda verify-roles-secure pour éviter les attaques Man-in-the-Middle
 */

/**
 * Vérifie les rôles de l'utilisateur côté serveur
 * @returns {Promise<Object>} Données utilisateur avec rôles et permissions
 */
export const verifyUserRolesServer = async () => {
  try {
    const response = await apiRequest('/auth/verify-roles', {
      method: 'GET'
    });

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Hook pour utiliser la vérification des rôles côté serveur
 * @returns {Object} État de la vérification et données utilisateur
 */
export const useServerRoleVerification = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const verifyRoles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await verifyUserRolesServer();
      setUserData(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    userData,
    error,
    verifyRoles
  };
};

/**
 * Composant de protection basé sur la vérification serveur
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Contenu à protéger
 * @param {Array} props.allowedRoles - Rôles autorisés
 * @param {React.ReactNode} props.fallback - Contenu de fallback
 */
export const ServerRoleGuard = ({ children, allowedRoles, fallback = null }) => {
  const { loading, userData, error, verifyRoles } = useServerRoleVerification();
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    const checkRoles = async () => {
      try {
        await verifyRoles();
        setHasVerified(true);
      } catch (err) {
        setHasVerified(true); // On continue même en cas d'erreur
      }
    };

    checkRoles();
  }, []);

  if (loading || !hasVerified) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div>Vérification des permissions...</div>
      </div>
    );
  }

  if (error) {
    return fallback || <div>Erreur de vérification des permissions</div>;
  }

  if (!userData || !userData.user) {
    return fallback || <div>Utilisateur non trouvé</div>;
  }

  const userRole = userData.user.role;
  const hasPermission = allowedRoles.includes(userRole);

  if (!hasPermission) {
    return fallback || (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Accès refusé</h3>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <p>Rôle actuel: {userRole}</p>
        <p>Rôles autorisés: {allowedRoles.join(', ')}</p>
      </div>
    );
  }

  return children;
};

/**
 * Utilitaire pour vérifier rapidement les permissions
 * @param {string} requiredRole - Rôle requis
 * @returns {Promise<boolean>} True si l'utilisateur a le rôle requis
 */
export const checkUserRole = async (requiredRole) => {
  try {
    const data = await verifyUserRolesServer();
    return data?.user?.role === requiredRole;
  } catch (error) {
    return false;
  }
};

/**
 * Hook pour obtenir les données utilisateur avec vérification serveur
 * @returns {Object} Données utilisateur et état de chargement
 */
export const useUserDataWithServerVerification = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await verifyUserRolesServer();
        setUserData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return {
    userData,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      fetchUserData();
    }
  };
}; 