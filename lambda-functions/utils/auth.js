const { CognitoJwtVerifier } = require("aws-jwt-verify");
const { AWS_CONFIG } = require('../config/aws-config');
// Configuration du vérificateur JWT

const verifier = CognitoJwtVerifier.create({
  userPoolId: AWS_CONFIG.USER_POOL_ID,
  tokenUse: "access",
  clientId: AWS_CONFIG.CLIENT_ID,
});


/**
 * Vérifier un token JWT AWS Cognito
 * @param {string} token - Token JWT à vérifier
 * @returns {Object|null} Données utilisateur ou null si invalide
 */
const verifyToken = async (token) => {
  try {
    const payload = await verifier.verify(token);
    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
      firstName: payload.given_name || payload.firstName,
      lastName: payload.family_name || payload.lastName,
      groups: payload['cognito:groups'] || [],
    };
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return null;
  }
};

/**
 * Extraire les informations utilisateur du token sans vérification
 * @param {string} token - Token JWT
 * @returns {Object|null} Données utilisateur ou null
 */
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
      firstName: payload.given_name || payload.firstName,
      lastName: payload.family_name || payload.lastName,
      groups: payload['cognito:groups'] || [],
    };
  } catch (error) {
    console.error('Erreur de décodage du token:', error);
    return null;
  }
};



/**
 * Middleware d'authentification centralisé
 * @param {Object} event - Event Lambda
 * @returns {Object} { user, token } ou null si échec
 */
const authenticateUser = async (event) => {
  try {
      

    // Récupérer le token depuis les headers (comme get-properties)
    const token = event.token
      || event.headers?.Authorization?.replace('Bearer ', '')
      || event.headers?.authorization?.replace('Bearer ', '');


    if (!token) {
      return null;
    }

    // Vérifier le token
    const user = await verifyToken(token);


    return user ? { user, token } : null;

  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error);
    return null;
  }
};

/**
 * Middleware d'authentification avec gestion d'erreur
 * @param {Object} event - Event Lambda
 * @returns {Object} { success: boolean, user?: Object, error?: Object }
 */
const requireAuth = async (event) => {
  const authResult = await authenticateUser(event);

  if (!authResult) {
    return {
      success: false,
      error: {
        statusCode: 401,
        message: "Token d'authentification requis ou invalide"
      }
    };
  }

  return {
    success: true,
    user: authResult.user,
    token: authResult.token
  };
};

module.exports = {
  authenticateUser,
  requireAuth,
  verifyToken,
  decodeToken
};






