const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {
  console.log("=== DÉBUT FONCTION get-user-profile ===");
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    // 1. Authentification
    const auth = await requireAuth(event);
    if (!auth.success) return responses.unauthorized();

    const userId = auth.userId;

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
      return responses.notFound("Profil utilisateur");
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

    console.log("✅ Profil utilisateur récupéré avec succès");
    console.log("🔍 Item brut de DynamoDB:", JSON.stringify(Item, null, 2));
    console.log("🔍 Avatar brut:", Item.avatar);
    console.log("🔍 Avatar parsé:", userProfile.avatar);

    return success(200, {
      success: true,
      data: userProfile
    });

  } catch (err) {
    console.error("❌ Erreur dans get-user-profile:", err);
    return responses.serverError(err.message);
  }
}; 