const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");

const s3Client = new S3Client({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {
  try {
    const propertyId = event.pathParameters?.id;
    if (!propertyId) return responses.badRequest("Missing property ID");

    const devMode = event.queryStringParameters?.devMode === 'true';
    
    if (!devMode) {
      const auth = await requireAuth(event);
      if (!auth.success) return responses.unauthorized();
      
      // 🔐 VÉRIFICATION DES RÔLES
      const userGroups = auth.user.groups || [];
      const canView = userGroups.includes('professional') || userGroups.includes('admin') || userGroups.includes('investor');
      
      if (!canView) {
        return responses.unauthorized("Accès refusé");
      }
    }

    // 📁 Lister les objets S3 pour cette propriété
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: `property-photos/${propertyId}/`,
      MaxKeys: 100
    });

    const response = await s3Client.send(listCommand);
    
    if (!response.Contents || response.Contents.length === 0) {
      return success(200, {
        success: true,
        data: {
          photos: [],
          count: 0,
          propertyId
        }
      });
    }

    // 🔗 Générer les URLs et métadonnées
    const photos = response.Contents.map(obj => {
      const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || "eu-west-3"}.amazonaws.com/${obj.Key}`;
      const fileName = obj.Key.split('/').pop();
      
      return {
        key: obj.Key,
        fileName,
        url,
        size: obj.Size,
        lastModified: obj.LastModified,
        etag: obj.ETag?.replace(/"/g, '')
      };
    });

    return success(200, {
      success: true,
      data: {
        photos,
        count: photos.length,
        propertyId
      }
    });

  } catch (error) {
    console.error("❌ Error in get-property-photos:", error);
    return responses.serverError(`Failed to get photos: ${error.message}`);
  }
}; 