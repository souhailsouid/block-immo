// Script pour décoder le token JWT
const token = 'eyJraWQiOiJXZUV3Z2FoNm8xbXF3dytMYlwvajh4K3Q2cUhtWVB2TktlaFlpOGVMOFZUTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MTA5MjAzZS05MGUxLTcwYWEtNTFkMS05ZjE3NWJiOTNkYmIiLCJjb2duaXRvOmdyb3VwcyI6WyJwcm9mZXNzaW9uYWwiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTMuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0zX21OZ3BzMnU0TyIsImNvZ25pdG86dXNlcm5hbWUiOiJzb3VoYWlsc291aWRwcm9AZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6InNvdWhhaWwiLCJvcmlnaW5fanRpIjoiMGIwN2FmMjctYzVmYS00Y2NlLWExNGUtYzg0MGNmOWU2YjNmIiwiY29nbml0bzpyb2xlcyI6WyJhcm46YXdzOmlhbTo6OTU2NjMzMzAyMjQ5OnJvbGVcL3Byb2Zlc3Npb25hbC11c2VyLXJvbGUiXSwiYXVkIjoiMTlqNGJ1NzRxcHBrODNrZjNzZmh1aTI0aHEiLCJldmVudF9pZCI6ImQ2MjIxZWIyLWY0MWItNDY3ZC04YmJhLTEzYWU1NTUxYjVhNyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzUzNzA2NzEwLCJleHAiOjE3NTM4OTg4MDMsImlhdCI6MTc1Mzg5NTIwMywiZmFtaWx5X25hbWUiOiJzb3VpZCIsImp0aSI6IjlmYzIyZGMxLWE4NjYtNGM0MS05ZjA4LTFiODQwODE0NDdmMSIsImVtYWlsIjoic291aGFpbHNvdWlkcHJvQGdtYWlsLmNvbSJ9.d8mnOZdSlgE210X8T-_rThevof300OYxoqm4s3gmw83UKPwdkta6envO5X4oOSWtCPFXJQyr9OHf8OkOoGlkjyt8NWta-rUNvTnEqud0MJpLNh_KTU2QXv4IguYGCs9uyeEYkw8mtk3q9qdzhVIfOo1OH6C75ssfuEGGQdXcMCKPdJcJmgyZrOxJ0m2Pe4RZvxeDuRcTDEvHMtSMBZWmQtiEaMX4zjB80jHj7l8sZBKdu5qx9WQCxjFKwt53OTcdj72xqw7OrSyrJbgcR7hIbb-nzm9-tz5bvFguN6Q317psI_JdIEkLIg_X6er0q9pz8LEpYZpOyBhZa7ZBMAItUg';

function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ Token invalide: pas assez de parties');
      return null;
    }
    
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    console.log('🔍 === DÉCODAGE DU TOKEN ===');
    console.log('\n📋 Header:', JSON.stringify(header, null, 2));
    console.log('\n📋 Payload:', JSON.stringify(payload, null, 2));
    
    // Vérifier le type de token
    if (payload.token_use) {
      console.log(`\n🎯 Type de token: ${payload.token_use}`);
    }
    
    // Vérifier les groupes
    if (payload['cognito:groups']) {
      console.log(`\n👥 Groupes: ${payload['cognito:groups'].join(', ')}`);
    }
    
    // Vérifier l'expiration
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      console.log(`\n⏰ Expiration: ${expDate.toISOString()}`);
      console.log(`⏰ Maintenant: ${new Date().toISOString()}`);
      console.log(`⏰ Expiré: ${expDate < new Date() ? 'OUI' : 'NON'}`);
    }
    
    return { header, payload };
    
  } catch (error) {
    console.error('❌ Erreur lors du décodage:', error.message);
    return null;
  }
}

// Décoder le token
decodeJWT(token); 
 