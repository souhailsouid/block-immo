import { apiRequest, apiRequestWithoutAuth } from 'utils/apiUtils';

/**
 * Service d'authentification pour interagir avec les Lambdas backend
 */

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} signUpData - Données d'inscription
 * @returns {Promise<Object>} Résultat de l'inscription
 */
export const signUp = async (signUpData) => {
  try {
    console.log('📝 Inscription utilisateur:', signUpData.email);
    
    const response = await apiRequestWithoutAuth('/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify(signUpData)
    });

    console.log('✅ Inscription réussie');
    return response;
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription:', error);
    
    // Traduction des erreurs
    const errorMessage = error.message.includes('already exists') 
      ? 'Un utilisateur avec cet email existe déjà'
      : error.message.includes('InvalidParameterException')
      ? 'Données d\'inscription invalides'
      : 'Erreur lors de l\'inscription';
    
    throw new Error(errorMessage);
  }
};

/**
 * Connexion d'un utilisateur
 * @param {Object} signInData - Données de connexion
 * @returns {Promise<Object>} Résultat de la connexion
 */
export const signIn = async (signInData) => {
  try {
   
    
    const response = await apiRequestWithoutAuth('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify(signInData)
    });

    return response;
  } catch (error) {
 
    console.error('❌ Erreur lors de la connexion:', error);
    
    // Traduction des erreurs
    const errorMessage = error.message.includes('NotAuthorizedException')
      ? 'Email ou mot de passe incorrect'
      : error.message.includes('UserNotFoundException')
      ? 'Utilisateur non trouvé'
      : error.message.includes('UserNotConfirmedException')
      ? 'Compte non confirmé. Vérifiez votre email'
      : 'Erreur lors de la connexion';
    
    throw new Error(errorMessage);
  }
};

/**
 * Récupérer le profil utilisateur (authentifié)
 * @returns {Promise<Object>} Profil utilisateur
 */
export const getUserProfile = async () => {
  try {
    console.log('👤 Récupération du profil utilisateur...');
    
    const response = await apiRequest('/user/profile');
    
    console.log('✅ Profil récupéré');
    return response;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du profil:', error);
    
    const errorMessage = error.message.includes('Unauthorized')
      ? 'Session expirée. Veuillez vous reconnecter'
      : 'Erreur lors de la récupération du profil';
    
    throw new Error(errorMessage);
  }
};

/**
 * Mettre à jour le profil utilisateur (authentifié)
 * @param {Object} profileData - Données du profil à mettre à jour
 * @returns {Promise<Object>} Profil mis à jour
 */
export const updateUserProfile = async (profileData) => {
  try {
    console.log('🔄 Mise à jour du profil utilisateur...');
    
    const response = await apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    
    console.log('✅ Profil mis à jour');
    return response;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du profil:', error);
    
    const errorMessage = error.message.includes('Unauthorized')
      ? 'Session expirée. Veuillez vous reconnecter'
      : 'Erreur lors de la mise à jour du profil';
    
    throw new Error(errorMessage);
  }
}; 