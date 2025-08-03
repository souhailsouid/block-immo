#!/usr/bin/env node

/**
 * Script pour définir un email admin dans les variables d'environnement
 * Usage: node set-admin-email.js admin@example.com
 */

const fs = require('fs');
const path = require('path');

// Récupérer l'email admin depuis les arguments
const adminEmail = process.argv[2];

if (!adminEmail) {
  console.error('❌ Usage: node set-admin-email.js admin@example.com');
  process.exit(1);
}

// Validation basique de l'email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(adminEmail)) {
  console.error('❌ Format d\'email invalide');
  process.exit(1);
}

// Chemin vers le fichier .env
const envPath = path.join(__dirname, '.env');

// Lire le fichier .env existant ou créer un nouveau
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Vérifier si ADMIN_EMAIL existe déjà
if (envContent.includes('ADMIN_EMAIL=')) {
  // Remplacer la ligne existante
  envContent = envContent.replace(
    /ADMIN_EMAIL=.*/g,
    `ADMIN_EMAIL=${adminEmail}`
  );
} else {
  // Ajouter la nouvelle ligne
  envContent += `\nADMIN_EMAIL=${adminEmail}\n`;
}

// Écrire le fichier .env
fs.writeFileSync(envPath, envContent);

console.log('✅ Email admin défini avec succès!');
console.log(`📧 ADMIN_EMAIL=${adminEmail}`);
console.log('');
console.log('🔄 Redéployez vos Lambdas pour appliquer les changements:');
console.log('   serverless deploy'); 