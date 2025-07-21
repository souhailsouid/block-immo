export const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-3.amazonaws.com/YOUR_USER_POOL_ID",
  client_id: "YOUR_CLIENT_ID",
  redirect_uri: "YOUR_REDIRECT_URI", // à adapter pour le dev/local
  response_type: "code",
  scope: "phone openid email",
};

export const amplifyConfig = {
  Auth: {
    Cognito: {
    region: 'YOUR_AWS_REGION',
    userPoolClientId: 'YOUR_CLIENT_ID', 
    userPoolId: 'YOUR_USER_POOL_ID',
    mandatorySignIn: true,
    }
  }
} 