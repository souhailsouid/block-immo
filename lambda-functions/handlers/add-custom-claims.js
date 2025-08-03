const { CognitoIdentityProviderClient, AdminListGroupsForUserCommand } = require("@aws-sdk/client-cognito-identity-provider");

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {
  console.log("=== DÉBUT FONCTION add-custom-claims ===");
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    const email = event.request.userAttributes.email;
    console.log("📧 Email utilisateur:", email);

    // Par défaut : INVESTOR
    let role = 'INVESTOR';
    let roleSource = 'Default';

    try {
      // Vérifier si l'utilisateur est dans un groupe Cognito
      const listGroupsCommand = new AdminListGroupsForUserCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email
      });

      const groupsResult = await cognitoClient.send(listGroupsCommand);
      const cognitoGroups = groupsResult.Groups?.map(group => group.GroupName) || [];

      console.log("👥 Groupes Cognito trouvés:", cognitoGroups);

      // Déterminer le rôle basé sur les groupes Cognito
      if (cognitoGroups.includes('admin')) {
        role = 'ADMIN';
        roleSource = 'Cognito Groups (admin)';
      } else if (cognitoGroups.includes('professional')) {
        role = 'PROFESSIONAL';
        roleSource = 'Cognito Groups (professional)';
      } else if (cognitoGroups.includes('investor')) {
        role = 'INVESTOR';
        roleSource = 'Cognito Groups (investor)';
      } else {
        // Par défaut : INVESTOR
        role = 'INVESTOR';
        roleSource = 'Default (no group)';
      }

    } catch (cognitoError) {
      console.log("⚠️  Erreur lors de la récupération des groupes Cognito:", cognitoError.message);
      // En cas d'erreur, on garde le rôle par défaut
      role = 'INVESTOR';
      roleSource = 'Default (error)';
    }

    console.log(`🎯 Rôle attribué: ${role} (source: ${roleSource})`);

    // Ajouter le custom claim au token
    event.response = {
      claimsOverrideDetails: {
        claimsToAddOrOverride: {
          "custom:role": role,
          "custom:roleSource": roleSource
        }
      }
    };

    console.log("✅ Custom claims ajoutés avec succès");
    return event;

  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des custom claims:", error);
    
    // En cas d'erreur, on attribue le rôle par défaut
    event.response = {
      claimsOverrideDetails: {
        claimsToAddOrOverride: {
          "custom:role": "INVESTOR",
          "custom:roleSource": "Default (error)"
        }
      }
    };

    return event;
  }
}; 