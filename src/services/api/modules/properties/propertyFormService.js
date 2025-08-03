import { createOrUpdateProperty } from './propertyService';

/**
 * Service pour gérer les formulaires de propriété
 */
class PropertyFormService {
  constructor() {
    this.currentPropertyId = null;
    this.formData = {};
    this.completedSteps = new Set();
  }

  /**
   * Sauvegarder une étape (création ou mise à jour)
   * @param {number} stepIndex - Index de l'étape
   * @param {Object} stepData - Données de l'étape
   * @returns {Promise<Object>} Réponse de l'API
   */
  async saveStep(stepIndex, stepData) {
    try {
      // Vérifier si les données ont changé
      const existingData = this.formData[stepIndex] || {};
      const hasChanged = this.hasDataChanged(existingData, stepData);
      
      if (!hasChanged) {
        return {
          data: {
            success: true,
            message: 'No changes detected',
            isNewProperty: false,
            propertyId: this.currentPropertyId
          }
        };
      }
      
      // Mapper l'index de l'étape vers le nom de l'étape
      const stepMapping = {
        0: 'basic',
        1: 'location', 
        2: 'details',
        3: 'pricing',
        4: 'photos',
        5: 'timeline',
        6: 'calculator',
        7: 'contact'
      };

      const step = stepMapping[stepIndex];
      if (!step) {
        throw new Error(`Étape inconnue: ${stepIndex}`);
      }

      // Sauvegarder les données localement
      this.formData[stepIndex] = stepData;
      this.completedSteps.add(stepIndex);
      this.saveToLocalStorage();

      // Appeler l'API
      const response = await createOrUpdateProperty({
        step,
        data: stepData,
        propertyId: this.currentPropertyId
      });

      // Si c'est une nouvelle propriété, sauvegarder l'ID
      if (response.data.isNewProperty) {
        this.currentPropertyId = response.data.propertyId;
        this.saveToLocalStorage();
        } else {
        }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Vérifier si les données ont changé
   * @param {Object} oldData - Anciennes données
   * @param {Object} newData - Nouvelles données
   * @returns {boolean} True si les données ont changé
   */
  hasDataChanged(oldData, newData) {
    // Comparer les clés importantes
    const keysToCompare = Object.keys(newData);
    
    for (const key of keysToCompare) {
      const oldValue = oldData[key];
      const newValue = newData[key];
      
      // Ignorer les champs vides dans la comparaison
      if (newValue === '' || newValue === null || newValue === undefined) {
        continue;
      }
      
      if (oldValue !== newValue) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Sauvegarder les données localement
   */
  saveToLocalStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('addPropertyFormData', JSON.stringify(this.formData));
      localStorage.setItem('addPropertyCompletedSteps', JSON.stringify([...this.completedSteps]));
      if (this.currentPropertyId) {
        localStorage.setItem('currentPropertyId', this.currentPropertyId);
      }
      }
  }

  /**
   * Charger les données sauvegardées
   */
  loadSavedData() {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('addPropertyFormData');
      const savedCompletedSteps = localStorage.getItem('addPropertyCompletedSteps');
      const savedPropertyId = localStorage.getItem('currentPropertyId');
      
      if (savedData) {
        try {
          this.formData = JSON.parse(savedData);
        } catch (error) {
          }
      }
      
      if (savedCompletedSteps) {
        try {
          this.completedSteps = new Set(JSON.parse(savedCompletedSteps));
        } catch (error) {
          }
      }
      
      if (savedPropertyId) {
        this.currentPropertyId = savedPropertyId;
      }
      
      }
  }

  /**
   * Effacer toutes les données sauvegardées
   */
  clearSavedData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('addPropertyFormData');
      localStorage.removeItem('addPropertyCompletedSteps');
      localStorage.removeItem('currentPropertyId');
      
      this.formData = {};
      this.completedSteps = new Set();
      this.currentPropertyId = null;
      
      }
  }

  /**
   * Vérifier si une étape est complétée
   * @param {number} stepIndex - Index de l'étape
   * @returns {boolean} True si l'étape est complétée
   */
  isStepCompleted(stepIndex) {
    return this.completedSteps.has(stepIndex);
  }

  /**
   * Récupérer les données d'une étape
   * @param {number} stepIndex - Index de l'étape
   * @returns {Object} Données de l'étape
   */
  getStepData(stepIndex) {
    return this.formData[stepIndex] || {};
  }

  /**
   * Récupérer l'ID de la propriété actuelle
   * @returns {string|null} ID de la propriété
   */
  getCurrentPropertyId() {
    return this.currentPropertyId;
  }

  /**
   * Vérifier si une propriété est en cours de création
   * @returns {boolean} True si une propriété est en cours
   */
  hasActiveProperty() {
    return this.currentPropertyId !== null;
  }

  /**
   * Récupérer le statut de la propriété actuelle
   * @returns {string} Statut de la propriété
   */
  getPropertyStatus() {
    // Cette méthode pourrait être étendue pour récupérer le statut depuis l'API
    if (!this.currentPropertyId) {
      return 'NONE';
    }
    
    // Logique simple basée sur les étapes complétées
    const totalSteps = 8; // basic, location, details, pricing, photos, timeline, calculator, contact
    const completedCount = this.completedSteps.size;
    
    if (completedCount === 0) {
      return 'DRAFT';
    } else if (completedCount < totalSteps) {
      return 'IN_PROGRESS';
    } else {
      return 'COMPLETED';
    }
  }
}

const propertyFormService = new PropertyFormService();