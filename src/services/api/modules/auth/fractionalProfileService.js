// src/services/api/modules/auth/fractionalProfileService.js
import { apiRequest } from 'utils/apiUtils';

export const fractionalProfileService = {
  /**
   * Update fractional professional profile
   * @param {Object} profileData - Fractional profile data
   * @returns {Promise<Object>} Response with success/error
   */
  updateFractionalProfile: async (profileData) => {
    try {
      const response = await apiRequest({
        endpoint: '/user/fractional-profile',
        method: 'PUT',
        data: profileData
      });
      return {
        success: true,
        data: response.data,
        message: response.message || 'Fractional profile updated successfully'
      };
    } catch (error) {
      let errorMessage = 'Failed to update fractional profile';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Get fractional professional profile
   * @returns {Promise<Object>} Response with profile data
   */
  getFractionalProfile: async () => {
    try {
      const response = await apiRequest({
        endpoint: '/user/fractional-profile',
        method: 'GET'
      });

      return {
        success: true,
        data: response.data,
        profile: response.data
      };
    } catch (error) {
      let errorMessage = 'Failed to get fractional profile';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
};