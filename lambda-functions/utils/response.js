/**
 * Réponses HTTP standardisées
 */

const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  };
  
  /**
   * Réponse de succès
   * @param {number} statusCode - Code de statut HTTP
   * @param {any} data - Données à retourner
   * @returns {Object} Réponse Lambda
   */
  const success = (statusCode = 200, data = null) => ({
    statusCode,
    body: JSON.stringify(data),
    headers: CORS_HEADERS
  });
  
  /**
   * Réponse d'erreur
   * @param {number} statusCode - Code de statut HTTP
   * @param {string} message - Message d'erreur
   * @param {any} details - Détails supplémentaires
   * @returns {Object} Réponse Lambda
   */
  const error = (statusCode, message, details = null) => ({
    statusCode,
    body: JSON.stringify({
      error: message,
      ...(details && { details })
    }),
    headers: CORS_HEADERS
  });
  
  /**
   * Réponses prédéfinies
   */
  const responses = {
    unauthorized: () => error(401, "Token d'authentification requis ou invalide"),
    notFound: (resource = "Ressource") => error(404, `${resource} non trouvée`),
    badRequest: (message = "Données invalides") => error(400, message),
    serverError: (details = null) => error(500, "Erreur interne du serveur", details)
  };
  
  module.exports = {
    success,
    error,
    responses,
    CORS_HEADERS
  };