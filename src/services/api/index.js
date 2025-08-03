// Point d'entrée principal des services API
import apiClient, { uploadClient } from './config/axiosConfig';
import API_ENDPOINTS from './config/endpoints';

// Import du service d'authentification principal
import AuthService from '../authService';

// Services principaux
import { getProperties } from './modules/properties/propertyService';
import InvestmentService from './modules/investments/investmentService';

// // Services utilitaires
// import UserService from './modules/users/userService';
// import KYCService from './modules/kyc/kycService';

// Export des services
export {
  // Configuration
  apiClient,
  uploadClient,
  API_ENDPOINTS,
  
  // Services principaux
  AuthService,
  getProperties,
  InvestmentService,
//   UserService,
//   KYCService,
};

// Export par défaut pour faciliter l'import
export default {
  auth: AuthService,
  getProperties,
  investments: InvestmentService,
//   users: UserService,
//   kyc: KYCService,
  apiClient,
  uploadClient,
  endpoints: API_ENDPOINTS,
}; 