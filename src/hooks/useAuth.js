import { useState, useEffect, createContext, useContext } from 'react';
import authService from 'services/authService';

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

// Provider d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      if (userData && userData.isAuthenticated) {
        setUser(userData.user);
        setToken(userData.token);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Connexion
  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await authService.login(credentials);
      setUser(result.user);
      setToken(result.token);
      setIsAuthenticated(true);
      
      // Forcer la mise à jour des rôles après la connexion
      setTimeout(() => {
        // Déclencher un événement personnalisé pour notifier les autres composants
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new window.Event('authStateChanged'));
        }
      }, 100);
      
      return result;
    } catch (error) {
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
      // Gérer l'erreur silencieusement
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);
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
      return null;
    }
  };

  // Rafraîchir l'état d'authentification
  const refreshAuth = () => {
    checkAuthStatus();
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    getToken,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 