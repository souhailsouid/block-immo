const { DynamoDBClient, GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {


  try {
    // 1. Authentification
    const auth = await requireAuth(event);
    if (!auth.success) return responses.unauthorized();

    const userId = auth.user.userId;
    


    // 2. Récupération du profil utilisateur
    const getCommand = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `USER#${userId}` },
        SK: { S: "PROFILE" }
      }
    });

    const { Item } = await client.send(getCommand);
    
    if (!Item) {
      
      
      // Créer un profil de base avec les données du token
      const now = new Date().toISOString();
      const basicProfile = {
        PK: { S: `USER#${userId}` },
        SK: { S: "PROFILE" },
        userId: { S: userId },
        email: { S: auth.user.username }, // Utiliser username comme email
        firstName: { S: "" }, // Vide pour l'instant
        lastName: { S: "" }, // Vide pour l'instant
        role: { S: "INVESTOR" }, // Rôle par défaut
        createdAt: { S: now },
        updatedAt: { S: now }
      };
      
      const putCommand = new PutItemCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Item: basicProfile
      });
      
      await client.send(putCommand);
      
      // Retourner le profil créé
      return success(200, {
        success: true,
        data: {
          userId: userId,
          email: auth.user.username, // Utiliser username comme email
          firstName: "", // Vide pour l'instant
          lastName: "", // Vide pour l'instant
          role: "INVESTOR",
          gender: null,
          birthDate: null,
          phone: null,
          location: null,
          languages: [],
          avatar: null,
          createdAt: now,
          updatedAt: now
        }
      });
    }

    // 3. Transformation des données
    const userProfile = {
      userId: Item.PK.S.replace('USER#', ''),
      email: Item.email?.S,
      firstName: Item.firstName?.S,
      lastName: Item.lastName?.S,
      role: Item.role?.S || 'INVESTOR',
      gender: Item.gender?.S,
      birthDate: Item.birthDate?.S,
      phone: Item.phone?.S,
      location: Item.location?.S,
      languages: Item.languages?.L?.map(lang => lang.S) || [],
      avatar: Item.avatar?.S ? JSON.parse(Item.avatar.S) : null,
      createdAt: Item.createdAt?.S,
      updatedAt: Item.updatedAt?.S
    };

    // 4. Ajout des données spécifiques au rôle
    if (userProfile.role === 'PROFESSIONAL') {
      userProfile.professional = {
        agencyName: Item.agencyName?.S,
        agencyEmail: Item.agencyEmail?.S,
        agencyPhone: Item.agencyPhone?.S,
        agencyWebsite: Item.agencyWebsite?.S,
        officeAddress: Item.officeAddress?.S,
        officeCity: Item.officeCity?.S,
        officeCountry: Item.officeCountry?.S,
        officePostalCode: Item.officePostalCode?.S,
        position: Item.position?.S,
        specializations: Item.specializations?.L?.map(spec => spec.S) || [],
        availabilityHours: Item.availabilityHours?.S,
        responseTime: Item.responseTime?.S,
        notes: Item.notes?.S
      };
    }

    if (userProfile.role === 'INVESTOR') {
      userProfile.investor = {
        investmentPreferences: Item.investmentPreferences?.L?.map(pref => pref.S) || [],
        budgetRange: Item.budgetRange?.S,
        preferredLocations: Item.preferredLocations?.L?.map(loc => loc.S) || [],
        investmentGoals: Item.investmentGoals?.S
      };
    }



    return success(200, {
      success: true,
      data: userProfile
    });

  } catch (err) {
    console.error("❌ Erreur dans get-user-profile:", err);
    return responses.serverError(err.message);
  }
}; 