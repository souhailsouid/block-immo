/* eslint-disable no-undef */
import axios from 'axios';
import { getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';

// Configuration de base
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://752uv9np1l.execute-api.eu-west-3.amazonaws.com/dev';
const API_TIMEOUT = 30000; // 30 secondes

// Instance Axios principale
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur de requête pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Vérifier si l'utilisateur est authentifié
      const user = await getCurrentUser();
      if (user) {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
           
    
        } else {
           
          console.warn('Utilisateur connecté mais pas de token disponible');
        }
      } 
    } catch (error) {
       
      console.error('Erreur lors de la récupération du token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Gestion des erreurs 401 (non autorisé)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
         
       
        // Tentative de refresh du token
        const session = await fetchAuthSession({ forceRefresh: true });
        const newToken = session.tokens?.accessToken?.toString();
        
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
           
         
          return apiClient(originalRequest);
        } else {
           
          console.error('Impossible de rafraîchir le token');
          // Rediriger vers la page de connexion
          window.location.href = '/authentication/sign-in/illustration';
        }
      } catch (refreshError) {
         
        console.error('Erreur lors du refresh du token:', refreshError);
        // Rediriger vers la page de connexion
        window.location.href = '/authentication/sign-in/illustration';
      }
    }

    // Gestion des erreurs réseau
    if (!error.response) {
      return Promise.reject({
        message: 'Erreur de connexion au serveur',
        type: 'NETWORK_ERROR'
      });
    }

    // Gestion des erreurs HTTP
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
         
        console.error('Erreur 400 - Bad Request:', data);
        break;
      case 403:
         
        console.error('Erreur 403 - Forbidden:', data);
        break;
      case 404:
         
        console.error('Erreur 404 - Not Found:', data);
        break;
      case 422:
         
        console.error('Erreur 422 - Validation Error:', data);
        break;
      case 500:
         
        console.error('Erreur 500 - Server Error:', data);
        break;
      default:
         
        console.error(`Erreur HTTP ${status}:`, data);
    }

    return Promise.reject({
      status,
      message: data?.message || 'Une erreur est survenue',
      data: data?.data || null,
      type: 'HTTP_ERROR'
    });
  }
);

// Configuration pour les uploads de fichiers
export const uploadClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 secondes pour les uploads
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Appliquer les mêmes intercepteurs à l'upload client
uploadClient.interceptors.request.use(apiClient.interceptors.request.handlers[0]);
uploadClient.interceptors.response.use(apiClient.interceptors.response.handlers[0]);

export default apiClient; 