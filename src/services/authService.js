import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  fetchAuthSession,
  confirmSignUp,
  resendSignUpCode,
  confirmSignIn,
//   forgotPassword,
//   confirmForgotPassword,
  updatePassword
} from '@aws-amplify/auth';

class AuthService {
  /**
   * Connexion utilisateur
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Utilisateur connecté
   */
  async login(credentials) {
    try {
      const user = await signIn({ 
        username: credentials.email, 
        password: credentials.password 
      });
      
      // Récupérer la session pour obtenir le token
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();
      
      return {
        user,
        token,
        isAuthenticated: true
      };
    } catch (error) {
      // Si c'est un challenge, on le relance avec les données du challenge
      if (error.name === 'UserNotConfirmedException' || error.message.includes('PASSWORD_VERIFIER')) {
        // Ajouter les données du challenge à l'erreur
        error.challengeData = {
          USERNAME: credentials.email,
          ChallengeName: 'PASSWORD_VERIFIER',
          ChallengeResponses: { USERNAME: credentials.email },
          Session: error.session || null
        };
      }
      throw this.handleAuthError(error);
    }
  }

  /**
   * Inscription utilisateur
   * @param {Object} userData - Données utilisateur
   * @returns {Promise<Object>} Résultat de l'inscription
   */
  async register(userData) {
    try {
      const result = await signUp({
        username: userData.email,
        password: userData.password,
        options: {
          userAttributes: {
            email: userData.email,
            name: userData.name || userData.email,
          }
        }
      });
      
      return {
        success: true,
        userSub: result.userSub,
        message: 'Inscription réussie. Vérifiez votre email pour confirmer votre compte.'
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Confirmer l'inscription avec le code
   * @param {string} email - Email de l'utilisateur
   * @param {string} code - Code de confirmation
   * @returns {Promise<Object>} Résultat de la confirmation
   */
  async confirmRegistration(email, code) {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      
      return {
        success: true,
        message: 'Compte confirmé avec succès. Vous pouvez maintenant vous connecter.'
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Renvoyer le code de confirmation
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<Object>} Résultat
   */
  async resendConfirmationCode(email) {
    try {
      await resendSignUpCode({
        username: email
      });
      
      return {
        success: true,
        message: 'Code de confirmation renvoyé avec succès.'
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Déconnexion
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await signOut();
      return { success: true, message: 'Déconnexion réussie' };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Récupérer l'utilisateur actuel
   * @returns {Promise<Object|null>} Utilisateur connecté ou null
   */
  async getCurrentUser() {
    try {
      const user = await getCurrentUser();
      
      // Essayer de récupérer la session
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        
        return {
          user,
          token,
          isAuthenticated: true
        };
      } catch (sessionError) {
        // Si c'est une erreur d'Identity Pool, on retourne juste l'utilisateur
        if (sessionError.message.includes('Token is not from a supported provider')) {
          return {
            user,
            token: null,
            isAuthenticated: true
          };
        }
        
        // Pour les autres erreurs de session, on relance
        throw sessionError;
      }
    } catch (error) {
      // Si c'est une erreur d'Identity Pool, on nettoie la session
      if (error.message.includes('Token is not from a supported provider')) {
        try {
          await signOut();
        } catch (signOutError) {
          // Ignorer les erreurs de déconnexion
        }
      }
      
      // Pas d'utilisateur connecté
      return null;
    }
  }

  /**
   * Récupérer le token d'authentification
   * @returns {Promise<string|null>} Token ou null
   */
  async getAuthToken() {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    try {
      const user = await getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }

  /**
   * Compléter le challenge de mot de passe ou de vérification
   * @param {Object} challengeData - Données du challenge
   * @returns {Promise<Object>} Résultat
   */
  async completePasswordChallenge(challengeData) {
    try {
      let challengeResponse;
      
      // Déterminer le type de challenge et la réponse appropriée
      if (challengeData.verificationCode) {
        // Challenge de vérification par code email
        challengeResponse = challengeData.verificationCode;
      } else if (challengeData.password) {
        // Challenge de mot de passe
        challengeResponse = challengeData.password;
      } else {
        throw new Error('Challenge response missing');
      }
      
      // Pour PASSWORD_VERIFIER, nous devons utiliser confirmSignIn avec les bonnes données
      const result = await confirmSignIn({
        challengeResponse: challengeResponse
      });
      
      // Récupérer la session pour obtenir le token
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();
      
      return {
        user: result,
        token,
        isAuthenticated: true
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Gestion des erreurs d'authentification
   * @param {Error} error - Erreur Amplify
   * @returns {Error} Erreur formatée
   */
  handleAuthError(error) {
    let message = 'An error occurred';
    
    switch (error.name) {
      case 'UserNotFoundException':
        message = 'Email or password incorrect';
        break;
      case 'NotAuthorizedException':
        // Vérifier si c'est une erreur d'Identity Pool
        if (error.message.includes('Token is not from a supported provider')) {
          message = 'Session expired. Please sign in again.';
        } else {
          message = 'Email or password incorrect';
        }
        break;
      case 'UserNotConfirmedException':
        message = 'Please confirm your account via the email received';
        break;
      case 'UsernameExistsException':
        message = 'An account with this email already exists';
        break;
      case 'CodeMismatchException':
        message = 'Confirmation code incorrect';
        break;
      case 'ExpiredCodeException':
        message = 'Confirmation code expired';
        break;
      case 'LimitExceededException':
        message = 'Too many attempts. Please try again later';
        break;
      case 'InvalidPasswordException':
        message = 'Password does not meet security requirements';
        break;
      case 'InvalidParameterException':
        message = 'Invalid parameters';
        break;
      default:
        message = error.message || 'An error occurred';
    }
    
    // Créer une erreur avec le message formaté
    const formattedError = new Error(message);
    formattedError.originalError = error;
    formattedError.name = error.name;
    
    return formattedError;
  }
}

export default new AuthService(); 