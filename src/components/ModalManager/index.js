
import { useModal } from 'context/ModalContext';
import { useNotification } from 'context/NotificationContext';
import { useQueryClient } from '@tanstack/react-query';
import EditModal from 'components/EditModal';
import MDTypography from 'components/MDTypography';
import MDBox from 'components/MDBox';
import { getModalConfig } from 'config/modalConfig';
import { propertyServices } from 'services/api/modules/properties/propertyService';
import { updatePropertyPrice } from 'services/api/propertyPriceService';
import investmentService from 'services/api/modules/investments/investmentService';

const ModalManager = () => {
  const { modalState, closeModal } = useModal();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  /**
   * Nettoyer les données selon la configuration de la modale
   * @param {Object} data - Données brutes
   * @param {Array} cleanFields - Champs à nettoyer
   * @returns {Object} Données nettoyées
   */
  const cleanData = (data, cleanFields) => {
    const cleaned = { ...data };
    cleanFields.forEach(field => {
      delete cleaned[field];
    });
    return cleaned;
  };

  /**
   * Gérer la sauvegarde selon le type de modale
   * @param {Object} updatedData - Données à sauvegarder
   */
  const handleSave = async (updatedData) => {
    try {

      const modalType = modalState.type;
      const config = getModalConfig(modalType);
     
      const propertyId = modalState.data?.propertyId;
    
      // Validation du propertyId pour les modals qui en ont besoin
      if (!propertyId && modalType !== 'buy-shares' && !config.skipApiCall) {
         
        console.error('❌ PropertyId manquant dans modalState.data:', modalState.data);
        throw new Error('ID de propriété manquant');
      }

      // Validation spécifique à la modale (sauf pour les modales spéciales)
      if (!config.isSpecialModal) {
        const validationError = config.validate(updatedData);
      
        if (validationError) {
          throw new Error(validationError);
        }
      }

      let result = null;

      // Vérifier si on doit faire un appel API
      if (!config.skipApiCall && !config.isSpecialModal) {
        // Nettoyer les données
        const cleanUpdatedData = cleanData(updatedData, config.cleanFields);
       

        // Gérer les services externes
        let serviceMethod;
        if (config.updateEndpoint === 'updatePropertyPrice') {
          serviceMethod = updatePropertyPrice;
        } else if (config.updateEndpoint === 'buyPropertyShares') {
          serviceMethod = investmentService.buyShares;
        } else {
          serviceMethod = propertyServices[config.updateEndpoint];
        }

        if (!serviceMethod) {
          throw new Error(`Service method ${config.updateEndpoint} not found`);
        }

        result = await serviceMethod(propertyId, cleanUpdatedData);
       
      } else {
       
        result = updatedData; // Utiliser les données directement
      }

      // Mise à jour du cache React Query
      if (modalType !== 'buy-shares') {
        // Pour les achats de parts, on ne met pas à jour le cache de la propriété
        queryClient.setQueryData(['property', propertyId], result);
        queryClient.invalidateQueries(['property', propertyId]);
      }
      
      // Invalider la liste des propriétés
      queryClient.invalidateQueries(['properties']);

      // Fermer la modale
      closeModal();

      // Afficher la notification de succès
      setTimeout(() => {
        showNotification(
          config.successMessage, 
          `${modalState.data?.title || 'Property'} ${config.successMessage.toLowerCase()}`,
          'success',
          { duration: 3000, autoHide: true }
        );
      }, 100);

    } catch (error) {
      // console.error('❌ Erreur lors de la mise à jour:', error);

      // Fermer la modale même en cas d'erreur
      closeModal();

      // Afficher la notification d'erreur
      setTimeout(() => {
        const config = getModalConfig(modalState.type);
        showNotification(
          config.errorMessage,
          error.message,
          'error',
          { duration: 0, autoHide: false, persistent: true }
        );
      }, 100);
    }
  };

  /**
   * Obtenir le contenu de la modale selon sa configuration
   */
  const getModalContent = () => {
    const modalType = modalState.type;
    const config = getModalConfig(modalType);

    if (!config.component) {
      return (
        <MDBox>
          <MDTypography variant="body2" color="text">
            Modal not found: {modalType}
          </MDTypography>
        </MDBox>
      );
    }

    const ModalComponent = config.component;

    // Configuration spéciale pour les modales de confirmation (comme logout)
    if (config.isConfirmationModal) {
      return (
        <ModalComponent
          open={modalState.isOpen}
          onClose={closeModal}
        />
      );
    }

    // Configuration spéciale pour les modales avec état interne
    if (config.isSpecialModal) {
      return (
        <ModalComponent
          initialData={modalState.data}
          onSave={handleSave}
          isOpen={modalState.isOpen}
          onClose={closeModal}
        />
      );
    }
    // Configuration standard pour les formulaires
    return (
      <ModalComponent
        initialData={modalState.data}
        onSave={handleSave}
        onCancel={closeModal}
        propertyId={modalState.data.propertyId}
      />
    );
  };

  /**
   * Obtenir le titre de la modale selon sa configuration
   */
  const getModalTitle = () => {
    const config = getModalConfig(modalState.type);
    return config.title || 'Modal';
  };

  // Si c'est une modale de confirmation, on rend directement le contenu
  const config = getModalConfig(modalState.type);
  if (config.isConfirmationModal) {
    return getModalContent();
  }

  // Sinon, on utilise EditModal pour les autres types de modales
  return (
    <EditModal open={modalState.isOpen} onClose={closeModal} title={getModalTitle()}>
      {getModalContent()}
    </EditModal>
  );
};

export default ModalManager;
