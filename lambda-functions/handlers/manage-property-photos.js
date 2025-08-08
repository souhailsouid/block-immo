// handlers/manage-property-photos.js
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const busboy = require("busboy");

const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");

const s3 = new S3Client({ region: process.env.AWS_REGION || "eu-west-3" });
const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" })
);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];

module.exports.handler = async (event) => {
  try {
    const propertyId = event.pathParameters?.id;
    if (!propertyId) return responses.badRequest("Missing property ID");

    // 🔐 Authentification
    const auth = await requireAuth(event);
    if (!auth.success) return responses.unauthorized();
    
    // 🔒 Vérification des rôles
    const userGroups = auth.user.groups || [];
    const canManage = userGroups.includes('professional') || userGroups.includes('admin');
    if (!canManage) return responses.forbidden("Accès réservé aux professionnels");

         // 📦 Parsing des données multipart avec busboy
     const contentType = event.headers['content-type'] || event.headers['Content-Type'];
     if (!contentType.includes('multipart/form-data')) {
       return responses.badRequest("Invalid content-type");
     }

     const parser = busboy({
       headers: { "content-type": contentType },
       limits: { fileSize: MAX_FILE_SIZE }
     });

     let photosToDelete = "[]";
     let existingPhotos = "[]";
     let reorderedPhotos = "[]";
     const newFiles = [];

     parser.on("file", (fieldname, stream, info) => {
       if (fieldname === "files") {
         
         newFiles.push({
           stream,
           filename: info.filename,
           mimeType: info.mimeType,
           encoding: info.encoding
         });
       }
     });

     parser.on("field", (fieldname, value) => {
       if (fieldname === "photosToDelete") {
         photosToDelete = value;
       } else if (fieldname === "existingPhotos") {
         existingPhotos = value;
       } else if (fieldname === "reorderedPhotos") {
         reorderedPhotos = value;
         
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

    // 🧾 Conversion des données JSON
    let photosToDeleteArr = [];
    let existingPhotosArr = [];
    let reorderedPhotosArr = [];
    
    try {
      photosToDeleteArr = JSON.parse(photosToDelete);
      existingPhotosArr = JSON.parse(existingPhotos);
      reorderedPhotosArr = JSON.parse(reorderedPhotos);
    } catch (e) {
      return responses.badRequest("Invalid JSON data in form fields");
    }

    // 🗑️ Suppression des photos
    const deletedKeys = await deletePhotos(photosToDeleteArr, propertyId);

         // 📸 Traitement des nouvelles photos
     const uploadedPhotos = await uploadNewPhotos(newFiles, propertyId, auth.user.email);

    // 🖼️ Construction de la liste finale
    let finalPhotos = [];
    
    // Cas 1: Réorganisation explicite
    if (reorderedPhotosArr.length > 0) {
      finalPhotos = reorderedPhotosArr;
    } 
    // Cas 2: Photos existantes + nouvelles
    else {
      finalPhotos = [
        ...existingPhotosArr.filter(url => !photosToDeleteArr.includes(url)),
        ...uploadedPhotos.map(photo => photo.url)
      ];
    }

    // 💾 Mise à jour DynamoDB
    const updateResult = await updatePropertyPhotos(propertyId, finalPhotos);

    return success(200, {
      success: true,
      message: "Photos updated successfully",
      data: {
        propertyId,
        newPhotos: uploadedPhotos,
        deletedPhotos: photosToDeleteArr,
        deletedCount: deletedKeys.length,
        finalPhotos,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Photo management error:", error);
    return responses.serverError("Photo update failed: " + error.message);
  }
};

// Fonctions utilitaires
async function deletePhotos(photoUrls, propertyId) {
  const deletedKeys = [];
  
  for (const url of photoUrls) {
    const key = extractS3Key(url);
    if (!key.includes(`property-photos/${propertyId}/`)) continue;

    try {
      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
      }));
      deletedKeys.push(key);
    } catch (error) {
      console.error("Delete error:", url, error);
    }
  }
  
  return deletedKeys;
}

 async function uploadNewPhotos(files, propertyId, userEmail) {
   const uploaded = [];
   
   for (const file of files) {
     if (!ALLOWED_MIME_TYPES.includes(file.mimeType)) continue;
     
     const extension = file.filename.split('.').pop() || 'jpg';
     const key = `property-photos/${propertyId}/${uuidv4()}.${extension}`;
     
     // Stream directly to S3
     const { Upload } = require("@aws-sdk/lib-storage");
     const upload = new Upload({
       client: s3,
       params: {
         Bucket: process.env.S3_BUCKET_NAME,
         Key: key,
         Body: file.stream,
         ContentType: file.mimeType,
         Metadata: {
           propertyId,
           originalName: file.filename,
           uploadedBy: userEmail
         }
       },
       partSize: 5 * 1024 * 1024 // 5MB chunks
     });

     const result = await upload.done();

     
     uploaded.push({
       url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || "eu-west-3"}.amazonaws.com/${key}`,
       key,
       filename: file.filename,
       size: result.ContentLength || 0
     });
   }
   
   return uploaded;
 }

async function updatePropertyPhotos(propertyId, photos) {
  const command = new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE,
    Key: { PK: `PROPERTY#${propertyId}`, SK: `PROPERTY#${propertyId}` },
    UpdateExpression: "SET photos = :photos, updatedAt = :now",
    ExpressionAttributeValues: {
      ":photos": photos,
      ":now": new Date().toISOString()
    },
    ReturnValues: "ALL_NEW"
  });
  
  return docClient.send(command);
}

function extractS3Key(url) {
  return url.replace(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`, '');
}