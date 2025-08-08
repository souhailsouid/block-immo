/* eslint-disable no-undef */
import { useState, useEffect, createContext, useContext } from 'react';
import authService from 'services/authService';

// Clés pour le cache sessionStorage
const CACHE_KEYS = {
  IS_LOADING: 'auth_loading',
  IS_AUTHENTICATED: 'auth_authenticated',
  USER_BASIC_INFO: 'auth_user_basic', // Infos non sensibles seulement
  LAST_CHECK: 'auth_last_check'
};

// Durée de validité du cache (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser l'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Utilitaires de cache
const setCacheItem = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({
      value,
      timestamp: Date.now()
    }));
  } catch (error) {
    // Ignorer les erreurs de sessionStorage (mode privé, etc.)
  }
};

const getCacheItem = (key) => {
  try {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    
    const { value, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(key);
      return null;
    }
    
    return value;
  } catch (error) {
    return null;
  }
};

const clearAuthCache = () => {
  Object.values(CACHE_KEYS).forEach(key => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      // Ignorer les erreurs
    }
  });
};

// Provider d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Pour forcer le re-render

  // Fonction pour forcer le re-render
  const triggerRerender = () => {
    setForceUpdate(prev => prev + 1);
  };

  // Initialiser depuis le cache pour éviter le flicker
  useEffect(() => {
    const cachedLoading = getCacheItem(CACHE_KEYS.IS_LOADING);
    const cachedAuth = getCacheItem(CACHE_KEYS.IS_AUTHENTICATED);
    const cachedUser = getCacheItem(CACHE_KEYS.USER_BASIC_INFO);
    
    if (cachedLoading !== null) {
      setLoading(cachedLoading);
    }
    if (cachedAuth !== null) {
      setIsAuthenticated(cachedAuth);
    }
    if (cachedUser !== null) {
      setUser(cachedUser);
    }
    
    // Vérifier immédiatement l'état réel
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      setCacheItem(CACHE_KEYS.IS_LOADING, true);
      
      const userData = await authService.getCurrentUser();
      
      if (userData && userData.isAuthenticated) {
        const userBasicInfo = {
          // Seulement les infos non sensibles
          username: userData.user?.username,
          email: userData.user?.email,
          given_name: userData.user?.given_name,
          family_name: userData.user?.family_name,
          // PAS de tokens ou de données sensibles
        };
        
        setUser(userData.user);
        setToken(userData.token);
        setIsAuthenticated(true);
        
        // Cache des infos non sensibles seulement
        setCacheItem(CACHE_KEYS.IS_AUTHENTICATED, true);
        setCacheItem(CACHE_KEYS.USER_BASIC_INFO, userBasicInfo);
        setCacheItem(CACHE_KEYS.LAST_CHECK, Date.now());
        
      } else {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        clearAuthCache();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      
      // Ne pas traiter comme une erreur si c'est juste après une connexion
      const lastCheck = getCacheItem(CACHE_KEYS.LAST_CHECK);
      const timeSinceLastCheck = lastCheck ? Date.now() - lastCheck : Infinity;
      
      if (timeSinceLastCheck < 5000) { // 5 secondes de grâce après la dernière vérification
         
        return; // Ne pas traiter l'erreur
      }
      
      setError(error);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      clearAuthCache();
      
      // Si erreur de session expirée, mais seulement si ce n'est pas récent
      if (error.message?.includes('400') || error.message?.includes('401')) {
        // Ne pas rediriger immédiatement, laisser les composants gérer
      }
    } finally {
      setLoading(false);
      setAuthCheckComplete(true);
      setCacheItem(CACHE_KEYS.IS_LOADING, false);
    }
  };

  // Connexion
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.login(credentials);
   
      const userBasicInfo = {
        username: result.user?.username,
        email: result.user?.email,
        given_name: result.user?.given_name,
        family_name: result.user?.family_name,
      };
      
      setUser(result.user);
      setToken(result.token);
      setIsAuthenticated(true);
      setAuthCheckComplete(true); // Marquer comme complété immédiatement
      
      // Mise à jour du cache
      setCacheItem(CACHE_KEYS.IS_AUTHENTICATED, true);
      setCacheItem(CACHE_KEYS.USER_BASIC_INFO, userBasicInfo);
      setCacheItem(CACHE_KEYS.LAST_CHECK, Date.now());
      setCacheItem(CACHE_KEYS.IS_LOADING, false);
      
      // Forcer la mise à jour des rôles après la connexion avec un délai plus long
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new window.Event('authStateChanged'));
        }
        // Forcer un re-render pour s'assurer que les composants se mettent à jour
        triggerRerender();
      }, 500); // Augmenter le délai pour laisser le temps à Cognito
      
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setError(null);
      setLoading(false);
      clearAuthCache();
      
      // Rediriger vers la page de connexion
      if (typeof window !== 'undefined') {
        window.location.href = '/authentication/sign-in/illustration';
      }
    }
  };

  // Récupérer le token actuel
  const getToken = async () => {
    if (token) {
      return token;
    }
    
    try {
      const currentToken = await authService.getAuthToken();
      setToken(currentToken);
      return currentToken;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      setError(error);
      return null;
    }
  };

  // Rafraîchir l'état d'authentification
  const refreshAuth = () => {
    clearAuthCache();
    checkAuthStatus();
  };

  // Vérifier si l'utilisateur est vraiment connecté (validation côté serveur)
  const validateAuth = async () => {
    try {
      // Appel à un endpoint protégé pour valider le token
      const currentToken = await getToken();
      return !!currentToken;
    } catch (error) {
      console.error('Validation d\'authentification échouée:', error);
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    authCheckComplete, // Nouveau: indique si la vérification initiale est terminée
    error,
    login,
    logout,
    getToken,
    refreshAuth,
    validateAuth,
    forceUpdate, // Pour déclencher un re-render si nécessaire
    triggerRerender,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 