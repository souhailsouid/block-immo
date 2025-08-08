const { AdminUpdateUserAttributesCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { cognitoClient } = require('../config/aws-config');

/**
 * Lambda pour mettre à jour les informations utilisateur dans Cognito
 * @param {Object} event - L'événement Lambda
 * @param {Object} event.body - Le corps de la requête
 * @param {string} event.body.userId - L'ID de l'utilisateur
 * @param {Object} event.body.userAttributes - Les attributs à mettre à jour
 * @returns {Object} La réponse de la Lambda
 */
exports.handler = async (event) => {
  try {
      

    // Vérifier que l'utilisateur est authentifié avec Cognito Authorizer
    if (!event.requestContext?.authorizer?.claims) {
      
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          success: false,
          message: 'Utilisateur non authentifié'
        })
      };
    }

    // API Gateway décodé déjà le JWT et nous donne les claims
    const userClaims = event.requestContext.authorizer.claims;
    const userId = userClaims.sub;
    const userEmail = userClaims.email;

    

    // Parser le corps de la requête
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (error) {
      console.error('❌ Erreur lors du parsing du body:', error);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          success: false,
          message: 'Format de requête invalide'
        })
      };
    }

    const { userAttributes } = requestBody;

    if (!userAttributes) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          success: false,
          message: 'Attributs utilisateur requis'
        })
      };
    }

    // Préparer les attributs pour Cognito
    const cognitoAttributes = [];

    // Mapper les attributs frontend vers Cognito
    if (userAttributes.firstName) {
      cognitoAttributes.push({
        Name: 'given_name',
        Value: userAttributes.firstName
      });
    }

    if (userAttributes.lastName) {
      cognitoAttributes.push({
        Name: 'family_name',
        Value: userAttributes.lastName
      });
    }

    if (userAttributes.email) {
      cognitoAttributes.push({
        Name: 'email',
        Value: userAttributes.email
      });
    }

    if (userAttributes.phone) {
      cognitoAttributes.push({
        Name: 'phone_number',
        Value: userAttributes.phone
      });
    }

    if (userAttributes.location) {
      cognitoAttributes.push({
        Name: 'custom:location',
        Value: userAttributes.location
      });
    }

    if (userAttributes.gender) {
      cognitoAttributes.push({
        Name: 'custom:gender',
        Value: userAttributes.gender
      });
    }

    if (userAttributes.birthDate) {
      cognitoAttributes.push({
        Name: 'birthdate',
        Value: userAttributes.birthDate
      });
    }

    if (userAttributes.languages) {
      cognitoAttributes.push({
        Name: 'custom:languages',
        Value: Array.isArray(userAttributes.languages) 
          ? userAttributes.languages.join(',') 
          : userAttributes.languages
      });
    }

    if (userAttributes.profilePicture) {
      cognitoAttributes.push({
        Name: 'picture',
        Value: userAttributes.profilePicture
      });
    }



    if (cognitoAttributes.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          success: false,
          message: 'No valid attributes to update'
        })
      };
    }

    // Mettre à jour les attributs dans Cognito
    const updateCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: userId,
      UserAttributes: cognitoAttributes
    });

    await cognitoClient.send(updateCommand);

    

    // Retourner la réponse
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: 'User profile updated successfully',
        data: {
          userId,
          updatedAttributes: cognitoAttributes.map(attr => attr.Name)
        }
      })
    };

  } catch (error) {
    console.error('❌ Error during update user profile:', error);

    let errorMessage = 'Error during update user profile';
    let statusCode = 500;

    // Gérer les erreurs Cognito spécifiques
    if (error.name === 'InvalidParameterException') {
      errorMessage = 'Invalid parameters';
      statusCode = 400;
    } else if (error.name === 'UserNotFoundException') {
      errorMessage = 'User not found';
      statusCode = 404;
    } else if (error.name === 'NotAuthorizedException') {
      errorMessage = 'Not authorized';
      statusCode = 403;
    } else if (error.name === 'TooManyRequestsException') {
      errorMessage = 'Too many requests, please try again later';
      statusCode = 429;
    }

    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
}; 