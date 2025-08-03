const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { createReadStream } = require("fs");
const { pipeline } = require("stream/promises");
const busboy = require("busboy");
const { v4: uuidv4 } = require("uuid");
const { responses, success } = require("../utils/response");
const { requireAuth } = require("../utils/auth");

const s3 = new S3Client({ 
  region: process.env.AWS_REGION || "eu-west-3"
});

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });
const docClient = DynamoDBDocumentClient.from(client);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];

module.exports.handler = async (event) => {
  try {
    console.log("📦 Event details:", {
      isBase64Encoded: event.isBase64Encoded,
      bodyLength: event.body ? event.body.length : 0,
      contentType: event.headers["content-type"]
    });

    // 1. Validate input
    const propertyId = event.pathParameters?.id;
    if (!propertyId) return responses.badRequest("Missing property ID");
    
    const contentType = event.headers["content-type"] || event.headers["Content-Type"];
    if (!contentType?.includes("multipart/form-data")) {
      return responses.badRequest("Invalid content type");
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
      
      // Même logique que verify-roles-secure.js : canUploadFiles pour PROFESSIONAL || ADMIN
      const canUpload = userGroups.includes('professional') || userGroups.includes('admin');
      
      if (!canUpload) {
        console.log("❌ Accès refusé: Upload réservé aux professionnels et admins");
        return responses.unauthorized("Accès réservé aux professionnels et administrateurs uniquement");
      }
      
      console.log("✅ Accès autorisé: Utilisateur professionnel ou admin");
    }

    // 2. Process multipart data
    const parser = busboy({
      headers: { "content-type": contentType },
      limits: { fileSize: MAX_FILE_SIZE }
    });

    let fileStream;
    let fileInfo = {};
    let existingPhotosJson = null;

    parser.on("file", (fieldname, stream, info) => {
      if (fieldname === "file") {
        console.log("📁 New file detected:", info.filename);
        fileInfo = {
          filename: info.filename,
          mimeType: info.mimeType,
          encoding: info.encoding
        };
        fileStream = stream;
      } else if (fieldname === "existingPhotos") {
        // Les photos existantes à conserver
        stream.on("data", (chunk) => {
          try {
            existingPhotosJson = JSON.parse(chunk.toString());
            console.log("📸 Existing photos to keep:", existingPhotosJson);
          } catch (e) {
            console.warn("⚠️ Could not parse existing photos");
          }
        });
      } else if (fieldname === "photosToDelete") {
        // Les photos à supprimer de S3
        stream.on("data", (chunk) => {
          try {
            const photosToDelete = JSON.parse(chunk.toString());
            console.log("🗑️ Photos to delete from S3:", photosToDelete);
            // Stocker pour suppression après upload
            event.photosToDelete = photosToDelete;
          } catch (e) {
            console.warn("⚠️ Could not parse photos to delete");
          }
        });
      }
    });

    // 3. Handle stream errors
    parser.on("error", (err) => {
      console.error("Busboy error:", err);
      throw new Error("File processing failed");
    });

    // 4. Start processing
    const bodyBuffer = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : Buffer.from(event.body, "binary");
    
    parser.write(bodyBuffer);
    parser.end();

    // 5. Process new file (if any)
    let newPhotoUrl = null;
    if (fileStream && fileInfo.mimeType) {
      // Validate file metadata
      if (!ALLOWED_MIME_TYPES.includes(fileInfo.mimeType)) {
        return responses.badRequest("Unsupported file type");
      }

      // Generate unique filename
      const extension = fileInfo.filename.split(".").pop() || "bin";
      const s3Key = `property-photos/${propertyId}/${uuidv4()}.${extension}`;

      // Stream directly to S3
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3Key,
          Body: fileStream,
          ContentType: fileInfo.mimeType,
          Metadata: {
            propertyId,
            originalName: fileInfo.filename,
            uploadedBy: userEmail
          }
        },
        partSize: 5 * 1024 * 1024 // 5MB chunks
      });

      const result = await upload.done();
      console.log("S3 upload result:", result);

      // Generate URL
      newPhotoUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || "eu-west-3"}.amazonaws.com/${s3Key}`;
      console.log("✅ New photo uploaded:", newPhotoUrl);
    }

    // 6. SUPPRIMER LES PHOTOS DE S3 SI NÉCESSAIRE
    let deletedPhotos = [];
    if (event.photosToDelete && Array.isArray(event.photosToDelete)) {
      console.log("🗑️ Deleting photos from S3:", event.photosToDelete.length);
      
      const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
      
      for (const photoUrl of event.photosToDelete) {
        try {
          // Extraire la clé S3 depuis l'URL
          const s3Key = photoUrl.replace(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || "eu-west-3"}.amazonaws.com/`, '');
          
          // Vérifier que la photo appartient à cette propriété
          if (s3Key.includes(`property-photos/${propertyId}/`)) {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME,
              Key: s3Key
            });
            
            await s3.send(deleteCommand);
            deletedPhotos.push(photoUrl);
            console.log("✅ Deleted from S3:", s3Key);
          } else {
            console.warn("⚠️ Photo does not belong to this property:", photoUrl);
          }
        } catch (error) {
          console.error("❌ Failed to delete photo:", photoUrl, error.message);
        }
      }
    }

    // 7. Build final photo list
    let finalPhotoUrls = [];
    
    // Add existing photos (if any)
    if (existingPhotosJson && Array.isArray(existingPhotosJson)) {
      finalPhotoUrls = existingPhotosJson.filter(url => 
        typeof url === 'string' && url.startsWith('https://') && url.includes('block-immo-images')
      );
      console.log("📸 Existing photos to keep:", finalPhotoUrls.length);
    }
    
    // Add new photo (if any)
    if (newPhotoUrl) {
      finalPhotoUrls.push(newPhotoUrl);
      console.log("📸 Added new photo to list");
    }

    console.log("📸 Final photo list:", {
      total: finalPhotoUrls.length,
      existing: finalPhotoUrls.length - (newPhotoUrl ? 1 : 0),
      new: newPhotoUrl ? 1 : 0,
      deleted: deletedPhotos.length
    });

    // 7. Update DynamoDB with final list (TOUJOURS, même sans nouvelle photo)
    console.log("🗄️ Updating DynamoDB with final photo list");
    
    const updateCommand = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: `PROPERTY#${propertyId}`,
        SK: `PROPERTY#${propertyId}`
      },
      UpdateExpression: "SET photos = :photos, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":photos": finalPhotoUrls,
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "ALL_NEW"
    });

    const result = await docClient.send(updateCommand);
    console.log("✅ DynamoDB update successful");

    return success(200, {
      success: true,
      message: `Successfully updated property photos (${finalPhotoUrls.length} total)`,
      data: {
        propertyId,
        photos: finalPhotoUrls,
        count: finalPhotoUrls.length,
        newPhotoUrl,
        deletedPhotos,
        deletedCount: deletedPhotos.length,
        updatedAt: new Date().toISOString(),
        updatedBy: userEmail,
        property: result.Attributes
      }
    });

  } catch (error) {
    console.error("❌ Upload failed:", error);
    return responses.serverError("File processing error: " + error.message);
  }
};