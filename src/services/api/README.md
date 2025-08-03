# 🚀 Architecture API - Block-Immo

## 📁 Structure des Services API

```
src/services/
├── api/
│   ├── config/
│   │   ├── axiosConfig.js          # Configuration Axios
│   │   ├── awsConfig.js            # Configuration AWS Amplify
│   │   └── endpoints.js            # Constantes des endpoints
│   ├── interceptors/
│   │   ├── authInterceptor.js      # Intercepteur d'authentification
│   │   ├── errorInterceptor.js     # Gestion des erreurs
│   │   └── responseInterceptor.js  # Transformation des réponses
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── authService.js      # Service d'authentification
│   │   │   └── authTypes.js        # Types TypeScript
│   │   ├── properties/
│   │   │   ├── propertyService.js  # Service des propriétés
│   │   │   └── propertyTypes.js    # Types des propriétés
│   │   ├── investments/
│   │   │   ├── investmentService.js # Service des investissements
│   │   │   └── investmentTypes.js   # Types des investissements
│   │   ├── users/
│   │   │   ├── userService.js      # Service des utilisateurs
│   │   │   └── userTypes.js        # Types des utilisateurs
│   │   └── kyc/
│   │       ├── kycService.js       # Service KYC
│   │       └── kycTypes.js         # Types KYC
│   ├── utils/
│   │   ├── apiUtils.js             # Utilitaires API
│   │   ├── validationUtils.js      # Validation des données
│   │   └── errorUtils.js           # Gestion des erreurs
│   └── index.js                    # Point d'entrée principal
```

## 🎯 Modules API Principaux

### **1. Authentification (Auth)**
- Connexion/Déconnexion
- Inscription
- Gestion des tokens
- Récupération de mot de passe

### **2. Propriétés (Properties)**
- CRUD des propriétés
- Recherche et filtrage
- Upload d'images
- Géolocalisation

### **3. Investissements (Investments)**
- Achat de parts
- Portfolio utilisateur
- Historique des transactions
- Calculs de rendement

### **4. Utilisateurs (Users)**
- Profil utilisateur
- Préférences
- Notifications
- Paramètres

### **5. KYC (Know Your Customer)**
- Vérification d'identité
- Documents requis
- Statut de validation

## 🔧 Configuration

### **Environnements**
- Development: `http://localhost:3001/api`
- Staging: `https://staging-api.block-immo.com`
- Production: `https://api.block-immo.com`

### **Authentification**
- JWT Tokens via AWS Cognito
- Refresh tokens automatiques
- Gestion des sessions

### **Gestion d'Erreurs**
- Intercepteurs centralisés
- Messages d'erreur localisés
- Retry automatique
- Fallback graceful

## 📊 Monitoring et Logs

- Logs structurés
- Métriques de performance
- Alertes automatiques
- Dashboard de monitoring 