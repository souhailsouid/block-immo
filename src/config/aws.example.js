export const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_mNgps2u4O",
  client_id: "19j4bu74qppk83kf3sfhui24hq",
  redirect_uri: "http://localhost:3000", // à adapter pour le dev/local
  response_type: "code",
  scope: "phone openid email",
};

export const amplifyConfig = {
  Auth: {
    Cognito: {
      region: 'eu-west-3',
      userPoolClientId: '19j4bu74qppk83kf3sfhui24hq', 
      userPoolId: 'eu-west-3_mNgps2u4O',
      mandatorySignIn: true,
    }
  }
};

// Configuration de l'API
export const apiConfig = {
  baseURL: 'https://752uv9np1l.execute-api.eu-west-3.amazonaws.com/dev',
  endpoints: {
    properties: '/properties',
    userProfile: '/user/profile',
    userProfileCognito: '/user/profile/cognito',
    verifyRoles: '/auth/verify-roles'
  }
}; 