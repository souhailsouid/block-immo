const { S3Client, ListObjectsV2Command, PutObjectAclCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: process.env.AWS_REGION || "eu-west-3" });
const BUCKET_NAME = "block-immo-images";

/**
 * Rendre publiques toutes les images d'une propriété
 * @param {string} propertyId - ID de la propriété
 */
const makePropertyImagesPublic = async (propertyId) => {
  try {
    console.log(`🔄 Making images public for property: ${propertyId}`);
    
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

    console.log(`📸 Found ${response.Contents.length} images to make public`);

    // 2. Rendre chaque image publique
    for (const object of response.Contents) {
      try {
        const aclCommand = new PutObjectAclCommand({
          Bucket: BUCKET_NAME,
          Key: object.Key,
          ACL: 'public-read'
        });

        await s3Client.send(aclCommand);
        console.log(`✅ Made public: ${object.Key}`);
      } catch (error) {
        console.error(`❌ Failed to make public: ${object.Key}`, error.message);
      }
    }

    console.log(`🎉 Successfully made ${response.Contents.length} images public for property ${propertyId}`);

  } catch (error) {
    console.error('❌ Error making images public:', error);
  }
};

/**
 * Rendre publiques toutes les images de toutes les propriétés
 */
const makeAllImagesPublic = async () => {
  try {
    console.log('🔄 Making all property images public...');
    
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

    console.log(`📸 Found ${response.Contents.length} total images to make public`);

    let successCount = 0;
    let errorCount = 0;

    // Rendre chaque image publique
    for (const object of response.Contents) {
      try {
        const aclCommand = new PutObjectAclCommand({
          Bucket: BUCKET_NAME,
          Key: object.Key,
          ACL: 'public-read'
        });

        await s3Client.send(aclCommand);
        console.log(`✅ Made public: ${object.Key}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to make public: ${object.Key}`, error.message);
        errorCount++;
      }
    }

    console.log(`🎉 Summary: ${successCount} success, ${errorCount} errors`);

  } catch (error) {
    console.error('❌ Error making all images public:', error);
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
  
  if (propertyId === 'all') {
    // node make-images-public.js all
    await makeAllImagesPublic();
  } else if (propertyId === 'test') {
    // node make-images-public.js test
    const testUrl = "https://block-immo-images.s3.eu-west-3.amazonaws.com/property-photos/prop_london_penthouse_001/property-prop_london_penthouse_001-1753801379369-j3f5wum6wf.png";
    await testImageAccess(testUrl);
  } else if (propertyId) {
    // node make-images-public.js prop_london_penthouse_001
    await makePropertyImagesPublic(propertyId);
  } else {
    console.log(`
🚀 Usage:
  node make-images-public.js <propertyId>     # Rendre publiques les images d'une propriété
  node make-images-public.js all              # Rendre publiques toutes les images
  node make-images-public.js test             # Tester l'accès à une image

Examples:
  node make-images-public.js prop_london_penthouse_001
  node make-images-public.js all
  node make-images-public.js test
    `);
  }
};

main().catch(console.error); 
 