const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { CognitoIdentityProviderClient, AdminGetUserCommand, AdminListGroupsForUserCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {
  console.log("=== DÉBUT FONCTION verify-roles (SÉCURISÉE) ===");
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    // 1. Authentification sécurisée
    const auth = await requireAuth(event);
    if (!auth.success) {
      console.log("❌ Authentification échouée");
      return responses.unauthorized("Token d'authentification requis ou invalide");
    }

    const userId = auth.userId;
    const userEmail = auth.email;
    console.log("✅ Utilisateur authentifié:", userEmail);

    // 2. Vérification des groupes Cognito (PRIORITÉ)
    let cognitoGroups = [];
    let finalRole = 'INVESTOR'; // Par défaut
    let roleSource = 'Default';

    try {
      // Récupérer les groupes de l'utilisateur
      const listGroupsCommand = new AdminListGroupsForUserCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: userEmail
      });

      const groupsResult = await cognitoClient.send(listGroupsCommand);
      cognitoGroups = groupsResult.Groups?.map(group => group.GroupName) || [];

      console.log("👥 Groupes Cognito trouvés:", cognitoGroups);

      // Déterminer le rôle basé sur les groupes Cognito
      if (cognitoGroups.includes('admin')) {
        finalRole = 'ADMIN';
        roleSource = 'Cognito Groups (admin)';
      } else if (cognitoGroups.includes('professional')) {
        finalRole = 'PROFESSIONAL';
        roleSource = 'Cognito Groups (professional)';
      } else if (cognitoGroups.includes('investor')) {
        finalRole = 'INVESTOR';
        roleSource = 'Cognito Groups (investor)';
      } else {
        // Par défaut : INVESTOR
        finalRole = 'INVESTOR';
        roleSource = 'Default (no group)';
      }

    } catch (cognitoError) {
      console.log("⚠️  Erreur lors de la récupération des groupes Cognito:", cognitoError.message);
      // En cas d'erreur, on garde le rôle par défaut
      finalRole = 'INVESTOR';
      roleSource = 'Default (error)';
    }

    // 3. Récupération du profil utilisateur depuis DynamoDB (optionnel)
    let userProfile = {
      userId: userId,
      email: userEmail,
      firstname: userItem.firstName?.S,
      lastname: userItem.lastName?.S,
      gender: userItem.gender?.S,
      birthDate: userItem.birthDate?.S,
      phone: userItem.phone?.S,
      location: userItem.location?.S,
      languages: userItem.languages?.L?.map(lang => lang.S) || [],
      role: finalRole,
      roleSource: roleSource,
      cognitoGroups: cognitoGroups
    };

    try {
      const scanCommand = new ScanCommand({
        TableName: process.env.DYNAMODB_TABLE,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": { S: userEmail }
        }
      });

      const scanResult = await client.send(scanCommand);
      const items = scanResult.Items || [];

      if (items.length > 0) {
        const userItem = items[0];
        
        // Enrichir le profil avec les données DynamoDB
        userProfile = {
          ...userProfile,
          firstName: userItem.firstName?.S,
          lastName: userItem.lastName?.S,
          gender: userItem.gender?.S,
          birthDate: userItem.birthDate?.S,
          phone: userItem.phone?.S,
          location: userItem.location?.S,
          languages: userItem.languages?.L?.map(lang => lang.S) || [],
          avatar: userItem.avatar?.S,
          createdAt: userItem.createdAt?.S,
          updatedAt: userItem.updatedAt?.S
        };

        // Ajouter les données spécifiques au rôle
        if (finalRole === 'PROFESSIONAL') {
          userProfile.professional = {
            agencyName: userItem.agencyName?.S,
            agencyEmail: userItem.agencyEmail?.S,
            agencyPhone: userItem.agencyPhone?.S,
            agencyWebsite: userItem.agencyWebsite?.S,
            officeAddress: userItem.officeAddress?.S,
            officeCity: userItem.officeCity?.S,
            officeCountry: userItem.officeCountry?.S,
            officePostalCode: userItem.officePostalCode?.S,
            position: userItem.position?.S,
            specializations: userItem.specializations?.L?.map(spec => spec.S) || [],
            availabilityHours: userItem.availabilityHours?.S,
            responseTime: userItem.responseTime?.S,
            notes: userItem.notes?.S
          };
        }

        if (finalRole === 'INVESTOR') {
          userProfile.investor = {
            investmentPreferences: userItem.investmentPreferences?.L?.map(pref => pref.S) || [],
            budgetRange: userItem.budgetRange?.S,
            preferredLocations: userItem.preferredLocations?.L?.map(loc => loc.S) || []
          };
        }
      }

    } catch (dbError) {
      console.log("⚠️  Erreur lors de la récupération du profil DynamoDB:", dbError.message);
      // On continue avec le profil de base
    }

    // 4. Détermination des permissions (SÉCURISÉ)
    const permissions = {
      canReadProperties: true,
      canCreateProperties: finalRole === 'PROFESSIONAL' || finalRole === 'ADMIN',
      canUpdateProperties: finalRole === 'PROFESSIONAL' || finalRole === 'ADMIN',
      canDeleteProperties: finalRole === 'ADMIN',
      canManageUsers: finalRole === 'PROFESSIONAL' || finalRole === 'ADMIN',
      canAccessAdminPanel: finalRole === 'ADMIN',
      canUploadFiles: finalRole === 'PROFESSIONAL' || finalRole === 'ADMIN',
      canViewAnalytics: finalRole === 'PROFESSIONAL' || finalRole === 'ADMIN'
    };

    userProfile.permissions = permissions;

    console.log("✅ Vérification des rôles réussie");
    console.log(`🎯 Rôle final: ${finalRole} (source: ${roleSource})`);
    console.log(`🔐 Groupes Cognito: ${cognitoGroups.join(', ')}`);

    return success(200, {
      success: true,
      message: "Vérification des rôles réussie",
      data: {
        user: userProfile,
        security: {
          verifiedAt: new Date().toISOString(),
          verificationMethod: 'server-side-cognito-groups',
          tokenValid: true,
          roleSource: roleSource
        }
      }
    });

  } catch (error) {
    console.error("❌ Erreur lors de la vérification des rôles:", error);
    return responses.internalServerError("Erreur lors de la vérification des rôles");
  }
}; 