import apiClient from '../../config/axiosConfig';
import API_ENDPOINTS from '../../config/endpoints';

/**
 * Service pour la gestion des paiements
 */
class PaymentService {
  /**
   * Initier un paiement
   * @param {Object} paymentData - Données de paiement
   * @returns {Promise<Object>} Réponse du paiement
   */
  async initiatePayment(paymentData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.INVESTMENTS.PAYMENT, paymentData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to initiate payment');
    }
  }

  /**
   * Confirmer un paiement
   * @param {string} paymentId - ID du paiement
   * @param {Object} confirmationData - Données de confirmation
   * @returns {Promise<Object>} Confirmation du paiement
   */
  async confirmPayment(paymentId, confirmationData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.INVESTMENTS.PAYMENT_CONFIRM, {
        paymentId,
        ...confirmationData
      });
      return response.data;
    } catch (error) {
      throw new Error('Payment confirmation failed');
    }
  }

  /**
   * Vérifier le statut d'un paiement
   * @param {string} paymentId - ID du paiement
   * @returns {Promise<Object>} Statut du paiement
   */
  async getPaymentStatus(paymentId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.INVESTMENTS.PAYMENT_STATUS(paymentId));
      return response.data;
    } catch (error) {
      throw new Error('Failed to get payment status');
    }
  }

  /**
   * Simuler un paiement (pour le développement)
   * @param {Object} paymentData - Données de paiement
   * @returns {Promise<Object>} Simulation de paiement
   */
  async simulatePayment(paymentData) {
    try {
      // Simulation d'un paiement réussi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = {
        success: true,
        data: {
          paymentId: `PAY-${Date.now()}`,
          status: 'CONFIRMED',
          amount: paymentData.amount,
          currency: paymentData.currency || 'EUR',
          method: 'BANK_TRANSFER',
          timestamp: new Date().toISOString(),
          transactionId: `TXN-${Date.now()}`,
          reference: `REF-${Date.now()}`,
        },
        message: 'Payment successful'
      };
      
      return mockResponse;
    } catch (error) {
      throw new Error('Payment simulation failed');
    }
  }

  /**
   * Valider les données de paiement
   * @param {Object} paymentData - Données de paiement
   * @returns {boolean} Validité des données
   */
  validatePaymentData(paymentData) {
    const requiredFields = ['amount', 'propertyId', 'blocks'];
    const missingFields = requiredFields.filter(field => !paymentData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    if (paymentData.amount <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }
    
    if (paymentData.blocks <= 0) {
      throw new Error('Number of blocks must be greater than 0');
    }
    
    return true;
  }

  /**
   * Formater les données de paiement pour l'API
   * @param {Object} paymentData - Données brutes
   * @returns {Object} Données formatées
   */
  formatPaymentData(paymentData) {
    return {
      amount: parseFloat(paymentData.amount),
      currency: paymentData.currency || 'EUR',
      propertyId: paymentData.propertyId,
      blocks: parseInt(paymentData.blocks),
      ownershipPercentage: parseFloat(paymentData.ownershipPercentage),
      estimatedReturnYear: parseFloat(paymentData.estimatedReturnYear),
      estimatedReturnQuarter: parseFloat(paymentData.estimatedReturnQuarter),
      paymentMethod: paymentData.paymentMethod || 'BANK_TRANSFER',
      userId: paymentData.userId,
      timestamp: new Date().toISOString(),
    };
  }
}

export default new PaymentService(); 