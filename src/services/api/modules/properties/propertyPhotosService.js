// src/services/api/modules/properties/propertyPhotosService.js
import { apiRequestS3 } from 'utils/apiUtils';

export const propertyPhotosService = {
  /**
   * Get property photos
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Response with photos array
   */
  getPropertyPhotos: async (propertyId) => {
    try {
      const response = await apiRequestS3({
        endpoint: `/properties/${propertyId}/photos/signed?devMode=true`, // ✅ Endpoint avec URLs
        method: 'GET'
      });

      return {
        success: true,
        data: response.data || response,
        photos: response.data?.photos || response.photos || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get property photos'
      };
    }
  },

  /**
   * Delete a specific photo
   * @param {string} propertyId - Property ID  
   * @param {string} photoUrl - S3 URL of the photo to delete
   * @returns {Promise<Object>} Response with success/error
   */
  deletePropertyPhoto: async (propertyId, photoUrl) => {
    try {
      const response = await apiRequestS3({
        endpoint: `/properties/${propertyId}/photos`,
        method: 'DELETE',
        data: { photoUrl }
      });

      return {
        success: true,
        data: response.data || response,
        message: 'Photo deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete property photo'
      };
    }
  },

  /**
   * Update all property photos (bulk)
   * @param {string} propertyId - Property ID
   * @param {Array} photoUrls - Array of S3 URLs
   * @returns {Promise<Object>} Response with success/error
   */
  updateAllPropertyPhotos: async (propertyId, photoUrls) => {
    try {
      const response = await apiRequestS3({
        endpoint: `/properties/${propertyId}/photos`,
        method: 'PUT',
        data: { photos: photoUrls }
      });

      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update property photos'
      };
    }
  },

  /**
   * Update property photos with mixed approach (upload new + update existing)
   * @param {string} propertyId - Property ID
   * @param {Array} photos - Array of photo objects or files
   * @returns {Promise<Object>} Response with success/error
   */
  updatePropertyPhotos: async (propertyId, photos, photosToDelete = []) => {
    try {
      // ✅ SÉPARER LES PHOTOS EXISTANTES ET NOUVELLES
      const existingPhotos = [];
      const newFiles = [];

      photos.forEach(photo => {
        // Si c'est déjà une URL S3 (photo existante)
        if (typeof photo === 'string' && photo.startsWith('https://')) {
          existingPhotos.push(photo);
        }
        // Si c'est un objet avec une URL S3 (photo existante)
        else if (photo && typeof photo === 'object' && photo.url && photo.url.startsWith('https://')) {
          existingPhotos.push(photo.url);
        }
        // Si c'est un objet avec un fichier (nouvelle photo)
        else if (photo && typeof photo === 'object' && photo.file && photo.file instanceof File) { // eslint-disable-line no-undef
          newFiles.push(photo.file);
        }
        // Si c'est un blob URL (nouvelle photo temporaire)
        else if (typeof photo === 'string' && photo.startsWith('blob:')) {
          // Ignorer les URLs blob temporaires
        }
        else {
          // Ignorer les autres types
        }
      });

      // ✅ CRÉER LE FORM DATA POUR LA NOUVELLE ROUTE
      const formData = new FormData(); // eslint-disable-line no-undef
      
      // Photos existantes à conserver
      formData.append('existingPhotos', JSON.stringify(existingPhotos));
      // Photos à supprimer
      if (photosToDelete.length > 0) {
        const photosToDeleteUrls = photosToDelete.map(photo => photo.src || photo.url);
        formData.append('photosToDelete', JSON.stringify(photosToDeleteUrls));
      }
      
      // Nouvelles photos (support multiple)
      newFiles.forEach(file => {
        formData.append('files', file);
      });

      // ✅ APPELER LA NOUVELLE ROUTE PUT UNIFIÉE
      const response = await apiRequestS3({
        endpoint: `/properties/${propertyId}/photos/manage`,
        method: 'PUT',
        body: formData
      });

      return {
        success: true,
        data: response.data || response,
        message: `Successfully updated property photos`
      };
    } catch (error) {
      let errorMessage = 'Failed to update property photos';
      
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
   * Upload photo to S3
   * @param {File} file - Photo file
   * @param {string} propertyId - Property ID
   * @returns {Promise<string>} S3 URL
   */
  uploadPhotoToS3: async (file, propertyId) => {
    const formData = new FormData(); // eslint-disable-line no-undef
    formData.append('file', file);

    const response = await apiRequestS3({
      method: 'POST',
      endpoint: `/properties/${propertyId}/photos`,
      body: formData
    });

    // Extraire l'URL de la réponse du backend
    if (response && response.data && response.data.newPhotoUrl) {
      return response.data.newPhotoUrl;
    } else if (response && response.data && response.data.url) {
      return response.data.url;
    } else if (response && response.newPhotoUrl) {
      return response.newPhotoUrl;
    } else if (response && response.url) {
      return response.url;
    } else {
      throw new Error('No URL returned from server');
    }
  },
};
