import { apiRequest } from 'utils/apiUtils';
import { API_CONFIG } from 'config/api';

/**
 * Service pour gérer les opérations de profil utilisateur
 */
export const profileService = {
    /**
     * Met à jour le profil utilisateur dans DynamoDB
     * @param {Object} profileData - Les données du profil
     * @returns {Promise<Object>} La réponse de l'API
     */
    async updateUserProfile(profileData) {
        try {

            const response = await apiRequest({
                endpoint: API_CONFIG.ENDPOINTS.USER_PROFILE,
                method: 'PUT',
                data: profileData
            });

            return {
                success: true,
                data: response,
                message: 'User profile updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error during update user profile',
                data: null
            };
        }
    },

    /**
     * Get user profile from DynamoDB
     * @returns {Promise<Object>} User profile
     */
    async getUserProfile() {
        try {
            const response = await apiRequest({
                endpoint: API_CONFIG.ENDPOINTS.USER_PROFILE,
                method: 'GET'
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Vérifie les rôles utilisateur
     * @returns {Promise<Object>} Les rôles et permissions
     */
    async verifyUserRoles() {
        try {

            const response = await apiRequest({
                endpoint: API_CONFIG.ENDPOINTS.VERIFY_ROLES,
                method: 'GET'
            });

            return response;
        } catch (error) {
            throw error;
        }
    }
};

/**
 * Hook pour utiliser le service de profil
 * @returns {Object} Les fonctions du service de profil
 */
export const useProfileService = () => {
    return profileService;
}; 