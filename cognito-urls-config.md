# Configuration URLs Cognito pour Vercel

## URLs à configurer dans AWS Cognito Console

### Current Deployment URL:
`https://block-immo-iif77cmrq-souhailsouids-projects.vercel.app`

### URLs à ajouter dans AWS Cognito > App Integration > App Clients > App client settings:

#### Callback URLs (Allowed redirect URIs):
```
http://localhost:3000/authentication/sign-in/illustration
https://block-immo-iif77cmrq-souhailsouids-projects.vercel.app/authentication/sign-in/illustration
```

#### Sign out URLs (Allowed logout URIs):
```
http://localhost:3000/authentication/sign-in/illustration
https://block-immo-iif77cmrq-souhailsouids-projects.vercel.app/authentication/sign-in/illustration
```

## Commandes pour les prochains déploiements:

### Pour obtenir l'URL du déploiement actuel:
```bash
vercel ls | head -3 | tail -1 | cut -d' ' -f3
```

### Variables d'environnement Vercel automatiques:
- `VERCEL_URL`: URL automatique du déploiement (sans https://)
- `VERCEL_PROJECT_PRODUCTION_URL`: URL de production principale

## Actions requises:

1. **Aller dans AWS Cognito Console**
2. **User Pools > [VotreUserPool] > App Integration > App Clients**
3. **Cliquer sur votre app client**
4. **Ajouter les URLs ci-dessus dans "Callback URLs" et "Sign out URLs"**
5. **Sauvegarder**

## Note:
Le code utilise maintenant la variable d'environnement `VERCEL_URL` automatiquement fournie par Vercel, avec un fallback vers l'URL actuelle si elle n'est pas disponible.