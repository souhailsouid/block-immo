const { S3Client, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: process.env.AWS_REGION || "eu-west-3" });
const BUCKET_NAME = "block-immo-images";

/**
 * Supprimer toutes les images d'une propriété
 * @param {string} propertyId - ID de la propriété
 */
const deletePropertyImages = async (propertyId) => {
  try {
    console.log(`🗑️ Deleting all images for property: ${propertyId}`);
    
    // 1. Lister les images de la propriété
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `property-photos/${propertyId}/`,
      MaxKeys: 100
    });

    const response = await s3Client.send(listCommand);
    
    if (!response.Contents || response.Contents.length === 0) {
      console.log(`ℹ️ No images found for property ${propertyId}`);
      return;
    }

    console.log(`📸 Found ${response.Contents.length} images to delete`);

    // 2. Supprimer chaque image
    for (const object of response.Contents) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: object.Key
        });

        await s3Client.send(deleteCommand);
        console.log(`✅ Deleted: ${object.Key}`);
      } catch (error) {
        console.error(`❌ Failed to delete: ${object.Key}`, error.message);
      }
    }

    console.log(`🎉 Successfully deleted ${response.Contents.length} images for property ${propertyId}`);

  } catch (error) {
    console.error('❌ Error deleting images:', error);
  }
};

/**
 * Supprimer toutes les images de toutes les propriétés
 */
const deleteAllPropertyImages = async () => {
  try {
    console.log('🗑️ Deleting all property images...');
    
    // Lister tous les objets dans property-photos/
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'property-photos/',
      MaxKeys: 1000
    });

    const response = await s3Client.send(listCommand);
    
    if (!response.Contents || response.Contents.length === 0) {
      console.log('ℹ️ No property images found');
      return;
    }

    console.log(`📸 Found ${response.Contents.length} total images to delete`);

    let successCount = 0;
    let errorCount = 0;

    // Supprimer chaque image
    for (const object of response.Contents) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: object.Key
        });

        await s3Client.send(deleteCommand);
        console.log(`✅ Deleted: ${object.Key}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to delete: ${object.Key}`, error.message);
        errorCount++;
      }
    }

    console.log(`🎉 Summary: ${successCount} deleted, ${errorCount} errors`);

  } catch (error) {
    console.error('❌ Error deleting all images:', error);
  }
};

// 🧪 Exécution du script
const main = async () => {
  const propertyId = process.argv[2];
  
  if (propertyId === 'all') {
    // node delete-corrupted-images.js all
    await deleteAllPropertyImages();
  } else if (propertyId) {
    // node delete-corrupted-images.js prop_london_penthouse_001
    await deletePropertyImages(propertyId);
  } else {
    console.log(`
🚀 Usage:
  node delete-corrupted-images.js <propertyId>     # Supprimer les images d'une propriété
  node delete-corrupted-images.js all              # Supprimer toutes les images

Examples:
  node delete-corrupted-images.js prop_london_penthouse_001
  node delete-corrupted-images.js all
    `);
  }
};

main().catch(console.error); 
 