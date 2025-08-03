import PropertyDetailsForm from 'components/forms/PropertyDetailsForm';
import PropertyPriceForm from 'components/forms/PropertyPriceForm';
import PropertyLocationForm from 'components/forms/PropertyLocationForm';
import PropertyDetailsTableForm from 'components/forms/PropertyDetailsTableForm';
import PropertyTimelineForm from 'components/forms/PropertyTimelineForm';
import PropertyCalculatorForm from 'components/forms/PropertyCalculatorForm';
import PropertyContactForm from 'components/forms/PropertyContactForm';
import PropertyPhotosForm from 'components/forms/PropertyPhotosForm';
import BuySharesModal from 'components/BuySharesModal';
import LogoutConfirmationModal from 'components/LogoutConfirmationModal';

/**
 * Configuration des modales avec leurs composants et logiques métier
 */
export const MODAL_CONFIG = {
  'property-details': {
    component: PropertyDetailsForm,
    title: 'Property Details',
    updateEndpoint: 'updateProperty',
    successMessage: 'Property details updated successfully',
    errorMessage: 'Error updating property details',
    // Champs à nettoyer avant envoi
    cleanFields: ['updatedAt', 'createdAt', 'propertyId', 'PK', 'SK'],
    // Validation spécifique
    validate: (data) => {
      const required = ['title', 'propertyType', 'surface', 'bedrooms', 'bathrooms', 'yearBuilt',  'description'];
      const missing = required.filter(field => !data[field] || data[field] === '');
      return missing.length === 0 ? null : `Missing required fields: ${missing.join(', ')}`;
    }
  },

  'property-details-table': {
    component: PropertyDetailsTableForm,
    title: 'Property Details Table',
    updateEndpoint: 'updatePropertyTable',
    successMessage: 'Property table details updated successfully',
    errorMessage: 'Error updating property table details',
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: (data) => {
        // Validation côté client
        if (data.brutYield && data.netYield && parseFloat(data.brutYield) < parseFloat(data.netYield)) {
          return 'Brut yield cannot be less than net yield';
        }
        if (data.pricePerSquareFoot && parseFloat(data.pricePerSquareFoot) <= 0) {
          return 'Price per square foot must be greater than 0';
        }
        if (!data.country || !data.city) {
          return 'Country and city are required';
        }
        return null;
      }
  },

  'property-price': {
    component: PropertyPriceForm,
    title: 'Property Price Configuration',
    updateEndpoint: 'updatePropertyPrice',
    successMessage: 'Property price updated successfully',
    errorMessage: 'Error updating property price',
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: (data) => {
      if (!data.propertyPrice || data.propertyPrice <= 0) {
        return 'Property price must be greater than 0';
      }
     
      if (!data.currency) {
        return 'Currency is required';
      }
      if (data.yearlyInvestmentReturn !== undefined && data.yearlyInvestmentReturn < 0) {
        return 'Yearly investment return must be positive';
      }
      if (data.fundingDate && data.closingDate && new Date(data.fundingDate) > new Date(data.closingDate)) {
        return 'Funding date cannot be after closing date';
      }
      return null;
    }
  },

  'property-location': {
    component: PropertyLocationForm,
    title: 'Property Location Configuration',
    updateEndpoint: 'updatePropertyLocation',
    successMessage: 'Property location updated successfully',
    errorMessage: 'Error updating property location',
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: (data) => {
      if (!data.country || !data.city) {
        return 'Country and city are required';
      }
      // Validation des coordonnées si fournies
      if (data.latitude !== undefined && data.latitude !== null) {
        const latitude = parseFloat(data.latitude);
        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
          return 'Latitude must be between -90 and 90';
        }
      }
      if (data.longitude !== undefined && data.longitude !== null) {
        const longitude = parseFloat(data.longitude);
        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
          return 'Longitude must be between -180 and 180';
        }
      }
      return null;
    }
  },

  'property-contact': {
    component: PropertyContactForm,
    title: 'Property Contact Configuration',
    updateEndpoint: 'updateProperty',
    successMessage: 'Property contact updated successfully',
    errorMessage: 'Error updating property contact',
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: (data) => {
      if (!data.contactEmail && !data.contactPhone) {
        return 'At least one contact method is required';
      }
      return null;
    }
  },

  'property-images': {
    component: PropertyPhotosForm,
    title: 'Property Images Configuration',
    skipApiCall: true, // ✅ Pas d'appel API - l'upload S3 dans le composant suffit
    successMessage: 'Property images updated successfully',
    errorMessage: 'Error updating property images',
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: (data) => {
      return null;
    }
  },

  'property-timeline': {
    component: PropertyTimelineForm,
    title: 'Funding Timeline Configuration',
    updateEndpoint: 'updatePropertyTimeline',
    successMessage: 'Property timeline updated successfully',
    errorMessage: 'Error updating property timeline',
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: (data) => {
      if (!data.timelineData || data.timelineData.length === 0) {
        return 'Timeline data is required';
      }
      return null;
    }
  },

  'property-calculator': {
    component: PropertyCalculatorForm,
    title: 'Investment Calculator Configuration',
    updateEndpoint: 'updatePropertyCalculator',
    successMessage: 'Property calculator updated successfully',
    errorMessage: 'Error updating property calculator',
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: (data) => {
      if (!data.calculatorConfig) {
        return 'Calculator configuration is required';
      }
      return null;
    }
  },

  'buy-shares': {
    component: BuySharesModal,
    title: 'Buy Shares Property',
    updateEndpoint: 'buyPropertyShares',
    successMessage: 'Shares purchased successfully',
    errorMessage: 'Error purchasing shares',
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: (data) => {
      // Vérifier soit investment soit blocks
      if (!data.investment && !data.blocks) {
        return 'Investment amount or blocks are required';
      }
      if (data.investment && data.investment <= 0) {
        return 'Investment amount must be greater than 0';
      }
      if (data.blocks && data.blocks <= 0) {
        return 'Number of blocks must be greater than 0';
      }
      return null;
    },
    // Configuration spéciale pour les modales avec état interne
    isSpecialModal: true
  },

  'logout-confirmation': {
    component: LogoutConfirmationModal,
    title: 'Logout Confirmation',
    // Modal spéciale sans endpoint d'API
    isSpecialModal: true,
    isConfirmationModal: true
  }
};

/**
 * Obtenir la configuration d'une modale
 * @param {string} modalType - Type de la modale
 * @returns {Object} Configuration de la modale
 */
export const getModalConfig = (modalType) => {
  return MODAL_CONFIG[modalType] || {
    component: null,
    title: 'Modal',
    updateEndpoint: 'updateProperty',
    successMessage: 'Updated successfully',
    errorMessage: 'Update failed',
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: () => null
  };
};