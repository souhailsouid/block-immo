const { S3Client, ListObjectsV2Command, CopyObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: process.env.AWS_REGION || "eu-west-3" });
const BUCKET_NAME = "block-immo-images";

/**
 * Copier les images avec ACL public
 * @param {string} propertyId - ID de la propriété
 */
const copyImagesPublic = async (propertyId) => {
  try {
    console.log(`🔄 Copying images as public for property: ${propertyId}`);
    
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

    console.log(`📸 Found ${response.Contents.length} images to copy as public`);

    // 2. Copier chaque image avec ACL public
    for (const object of response.Contents) {
      try {
        const copyCommand = new CopyObjectCommand({
          Bucket: BUCKET_NAME,
          CopySource: `${BUCKET_NAME}/${object.Key}`,
          Key: object.Key,
          ACL: 'public-read'
        });

        await s3Client.send(copyCommand);
        console.log(`✅ Copied as public: ${object.Key}`);
      } catch (error) {
        console.error(`❌ Failed to copy: ${object.Key}`, error.message);
      }
    }

    console.log(`🎉 Successfully copied ${response.Contents.length} images as public for property ${propertyId}`);

  } catch (error) {
    console.error('❌ Error copying images as public:', error);
  }
};

/**
 * Copier toutes les images de toutes les propriétés
 */
const copyAllImagesPublic = async () => {
  try {
    console.log('🔄 Copying all property images as public...');
    
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

    console.log(`📸 Found ${response.Contents.length} total images to copy as public`);

    let successCount = 0;
    let errorCount = 0;

    // Copier chaque image avec ACL public
    for (const object of response.Contents) {
      try {
        const copyCommand = new CopyObjectCommand({
          Bucket: BUCKET_NAME,
          CopySource: `${BUCKET_NAME}/${object.Key}`,
          Key: object.Key,
          ACL: 'public-read'
        });

        await s3Client.send(copyCommand);
        console.log(`✅ Copied as public: ${object.Key}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to copy: ${object.Key}`, error.message);
        errorCount++;
      }
    }

    console.log(`🎉 Summary: ${successCount} success, ${errorCount} errors`);

  } catch (error) {
    console.error('❌ Error copying all images as public:', error);
  }
};

// 🧪 Exécution du script
const main = async () => {
  const propertyId = process.argv[2];
  
  if (propertyId === 'all') {
    // node copy-images-public.js all
    await copyAllImagesPublic();
  } else if (propertyId) {
    // node copy-images-public.js prop_london_penthouse_001
    await copyImagesPublic(propertyId);
  } else {
    console.log(`
🚀 Usage:
  node copy-images-public.js <propertyId>     # Copier les images d'une propriété en public
  node copy-images-public.js all              # Copier toutes les images en public

Examples:
  node copy-images-public.js prop_london_penthouse_001
  node copy-images-public.js all
    `);
  }
};

main().catch(console.error); 
 