// lambda-functions/handlers/delete-photo.js
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");

const s3Client = new S3Client({ region: process.env.AWS_REGION || "eu-west-3" });
const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    console.log("🗑️ Delete photo event:", {
      method: event.httpMethod,
      path: event.path,
      body: event.body
    });

    const propertyId = event.pathParameters?.id;
    
    if (!propertyId) {
      return responses.badRequest("Property ID is required");
    }

    // 🔐 AUTHENTIFICATION ET VÉRIFICATION DES RÔLES
    const devMode = event.queryStringParameters?.devMode === 'true';
    let userId = "anonymous";
    let userEmail = "dev@localhost";

    if (!devMode) {
      const auth = await requireAuth(event);
      if (!auth.success) return responses.unauthorized();
      
      userId = auth.user.userId;
      userEmail = auth.user.email;
      
      // 🔐 VÉRIFICATION DES RÔLES - Utiliser les groupes du token JWT
      const userGroups = auth.user.groups || [];
      console.log("👥 Groupes de l'utilisateur:", userGroups);
      
      // Même logique que upload-property-photo.js : canDeleteFiles pour PROFESSIONAL || ADMIN
      const canDelete = userGroups.includes('professional') || userGroups.includes('admin');
      
      if (!canDelete) {
        console.log("❌ Accès refusé: Suppression réservée aux professionnels et admins");
        return responses.unauthorized("Accès réservé aux professionnels et administrateurs uniquement");
      }
      
      console.log("✅ Accès autorisé: Utilisateur professionnel ou admin");
    }

    // 📄 PARSER LE BODY JSON
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
      console.log("📄 Parsed request data:", requestData);
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      return responses.badRequest("Invalid JSON in request body");
    }

    const { photoUrl } = requestData;
    
    if (!photoUrl || typeof photoUrl !== 'string') {
      return responses.badRequest("photoUrl is required");
    }

    // ✅ VALIDER L'URL S3
    if (!photoUrl.startsWith('https://') || !photoUrl.includes('block-immo-images.s3.')) {
      return responses.badRequest("Invalid S3 URL");
    }

    // ✅ VÉRIFIER QUE LA PHOTO APPARTIENT À LA PROPRIÉTÉ
    if (!photoUrl.includes(`property-photos/${propertyId}/`)) {
      console.log("❌ Photo URL does not match property:", photoUrl);
      return responses.unauthorized("Photo does not belong to this property");
    }

    // ✅ EXTRACTION DU S3 KEY DEPUIS L'URL
    const s3Key = photoUrl.replace(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || "eu-west-3"}.amazonaws.com/`, '');
    console.log("🗑️ Extracted S3 key:", s3Key);

    console.log("🗑️ Deleting photo from S3:", s3Key);

    // 3. Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key
    });

    await s3Client.send(deleteCommand);
    console.log("✅ Photo deleted from S3");

    // 4. Update DynamoDB to remove photo from property
    console.log("🗄️ Updating DynamoDB to remove photo from property");
    
    // D'abord, récupérer la propriété actuelle
    const { GetCommand } = require("@aws-sdk/lib-dynamodb");
    const getCommand = new GetCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: `PROPERTY#${propertyId}`,
        SK: `PROPERTY#${propertyId}`
      }
    });

    const propertyResult = await docClient.send(getCommand);
    
    if (!propertyResult.Item) {
      console.log("❌ Property not found:", propertyId);
      return responses.notFound("Property not found");
    }

    // Filtrer la photo à supprimer de la liste
    const currentPhotos = propertyResult.Item.photos || [];
    const updatedPhotos = currentPhotos.filter(photo => photo !== photoUrl);
    
    console.log("📸 Current photos:", currentPhotos.length);
    console.log("📸 Updated photos:", updatedPhotos.length);

    // Mettre à jour avec la nouvelle liste
    const updateCommand = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: `PROPERTY#${propertyId}`,
        SK: `PROPERTY#${propertyId}`
      },
      UpdateExpression: "SET photos = :photos, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":photos": updatedPhotos,
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "ALL_NEW"
    });

    const result = await docClient.send(updateCommand);
    console.log("✅ DynamoDB updated successfully");

    return success(200, {
      success: true,
      message: "Photo deleted successfully",
      data: {
        propertyId,
        deletedPhotoUrl: photoUrl,
        deletedS3Key: s3Key,
        updatedAt: new Date().toISOString(),
        deletedBy: userEmail,
        property: result.Attributes
      }
    });

  } catch (error) {
    console.error("❌ Error in delete-photo:", error);
    return responses.serverError("Failed to delete photo: " + error.message);
  }
};