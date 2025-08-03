const { S3Client, ListObjectsV2Command, CopyObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: process.env.AWS_REGION || "eu-west-3" });
const BUCKET_NAME = "block-immo-images";

/**
 * Copier les images simplement (sans ACL)
 * @param {string} propertyId - ID de la propriété
 */
const copyImagesSimple = async (propertyId) => {
  try {
    console.log(`🔄 Copying images for property: ${propertyId}`);
    
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

    console.log(`📸 Found ${response.Contents.length} images to copy`);

    // 2. Copier chaque image (sans ACL)
    for (const object of response.Contents) {
      try {
        const copyCommand = new CopyObjectCommand({
          Bucket: BUCKET_NAME,
          CopySource: `${BUCKET_NAME}/${object.Key}`,
          Key: object.Key
          // Pas d'ACL - on teste si le bucket est maintenant public
        });

        await s3Client.send(copyCommand);
        console.log(`✅ Copied: ${object.Key}`);
      } catch (error) {
        console.error(`❌ Failed to copy: ${object.Key}`, error.message);
      }
    }

    console.log(`🎉 Successfully copied ${response.Contents.length} images for property ${propertyId}`);

  } catch (error) {
    console.error('❌ Error copying images:', error);
  }
};

/**
 * Tester l'accessibilité d'une image
 * @param {string} imageUrl - URL de l'image
 */
const testImageAccess = async (imageUrl) => {
  try {
    const fetch = require('node-fetch');
    const response = await fetch(imageUrl, { method: 'HEAD' });
    
    console.log(`📊 ${imageUrl}`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      console.log(`   ✅ Image is publicly accessible`);
    } else {
      console.log(`   ❌ Image is not accessible`);
    }
    
    return response.status === 200;
  } catch (error) {
    console.error(`❌ Error testing image access:`, error.message);
    return false;
  }
};

// 🧪 Exécution du script
const main = async () => {
  const propertyId = process.argv[2];
  
  if (propertyId === 'test') {
    // node copy-images-simple.js test
    const testUrl = "https://block-immo-images.s3.eu-west-3.amazonaws.com/property-photos/prop_london_penthouse_001/property-prop_london_penthouse_001-1753801379369-j3f5wum6wf.png";
    await testImageAccess(testUrl);
  } else if (propertyId) {
    // node copy-images-simple.js prop_london_penthouse_001
    await copyImagesSimple(propertyId);
  } else {
    console.log(`
🚀 Usage:
  node copy-images-simple.js <propertyId>     # Copier les images d'une propriété
  node copy-images-simple.js test             # Tester l'accès à une image

Examples:
  node copy-images-simple.js prop_london_penthouse_001
  node copy-images-simple.js test
    `);
  }
};

main().catch(console.error); 
 