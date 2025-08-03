# 🏠 Block-Immo - Plateforme d'Investissement Immobilier Fractionné

Une application React moderne pour l'investissement immobilier fractionné, permettant aux utilisateurs d'investir dans l'immobilier à partir de 10€ par bloc.

## 🚀 Fonctionnalités Principales

### 📊 **Calculateur d'Investissement**
- **Graphiques interactifs** : Visualisation des rendements avec Chart.js
- **Sliders dynamiques** : Ajustement en temps réel des paramètres
- **Calculs automatiques** : Rendement locatif, plus-value, ROI

### 🏢 **Gestion des Propriétés**
- **Catalogue immobilier** : Propriétés disponibles à l'investissement
- **Détails complets** : Photos, localisation, rendements
- **Filtres avancés** : Par localisation, prix, rendement

### 💰 **Achat de Parts**
- **Modal d'investissement** : Interface intuitive pour acheter des blocs
- **Système de blocs** : 1 bloc = 10€ d'investissement
- **Options rapides** : Profils d'investisseur prédéfinis
- **Saisie exacte** : Montant personnalisé avec validation

### 🎨 **Interface Utilisateur**
- **Design Material-UI** : Interface moderne et responsive
- **Thème personnalisé** : Couleurs et styles adaptés à l'immobilier
- **Navigation intuitive** : Dashboard, propriétés, calculateur

## 🛠️ Technologies Utilisées

### **Frontend**
- **React 18.3.1** : Framework principal
- **Material-UI 5.16.7** : Composants UI
- **Chart.js 4.4.6** : Graphiques et visualisations
- **React Router 6.27.0** : Navigation
- **Formik 2.4.6** : Gestion des formulaires

### **Backend & Cloud**
- **AWS Lambda** : Fonctions serverless
- **AWS DynamoDB** : Base de données NoSQL
- **AWS Cognito** : Authentification et autorisation
- **AWS S3** : Stockage de fichiers
- **AWS SDK v3** : Intégration AWS

### **Outils de Développement**
- **ESLint** : Linting du code
- **Prettier** : Formatage automatique
- **React Scripts** : Build et développement

### **Intégrations**
- **Google Maps API** : Localisation des propriétés
- **AWS Amplify** : Services cloud
- **React Hook Form** : Formulaires performants

## 📦 Installation

### **Prérequis**
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Compte AWS avec accès aux services Lambda, DynamoDB, Cognito, S3

### **Installation des dépendances**
```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd block-immo

# Installer les dépendances
npm install

# Ou avec yarn
yarn install
```

### **Configuration des variables d'environnement**
Créer un fichier `.env` à la racine du projet :
```env
# AWS Configuration
REACT_APP_AWS_REGION=eu-west-1
REACT_APP_AWS_USER_POOLS_ID=votre_user_pool_id
REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID=votre_client_id
REACT_APP_AWS_IDENTITY_POOL_ID=votre_identity_pool_id

# Google Maps
REACT_APP_GOOGLE_MAPS_API_KEY=votre_clé_api_google_maps

# Lambda Functions (optionnel - utilise les noms par défaut si non définis)
REACT_APP_GET_PROPERTIES_LAMBDA=get-properties-dev
REACT_APP_CREATE_PROPERTY_LAMBDA=create-property-dev
REACT_APP_UPDATE_PROPERTY_LAMBDA=update-property-dev
REACT_APP_DELETE_PROPERTY_LAMBDA=delete-property-dev
REACT_APP_GET_PROPERTY_LAMBDA=get-property-dev
REACT_APP_SEARCH_PROPERTIES_LAMBDA=search-properties-dev
REACT_APP_GET_USER_PROPERTIES_LAMBDA=get-user-properties-dev
REACT_APP_GET_PROPERTY_STATS_LAMBDA=get-property-stats-dev
REACT_APP_UPLOAD_PROPERTY_IMAGES_LAMBDA=upload-property-images-dev
REACT_APP_DELETE_PROPERTY_IMAGE_LAMBDA=delete-property-image-dev
```

## 🚀 Lancement

### **Mode Développement**
```bash
npm start
# L'application sera accessible sur http://localhost:3000
```

### **Mode Production**
```bash
npm run build
# Génère les fichiers optimisés dans le dossier build/
```

### **Tests**
```bash
npm test
```

### **Linting**
```bash
npm run lint
```

## 📁 Structure du Projet

```
block-immo/
├── public/                 # Fichiers publics
├── src/
│   ├── assets/            # Images, thèmes, styles
│   │   ├── images/        # Images et logos
│   │   └── theme/         # Configuration des thèmes
│   ├── components/        # Composants réutilisables
│   │   ├── MDBox/         # Composants Material Design
│   │   ├── forms/         # Formulaires
│   │   └── BuySharesModal/ # Modal d'achat de parts
│   ├── services/          # Services API et Lambda
│   │   └── api/           # Architecture API complète
│   │       ├── config/    # Configuration AWS et Lambda
│   │       ├── modules/   # Services par domaine métier
│   │       ├── utils/     # Utilitaires API
│   │       └── examples/  # Exemples d'utilisation
│   ├── examples/          # Exemples de composants
│   │   ├── Charts/        # Graphiques et visualisations
│   │   └── Cards/         # Cartes d'interface
│   ├── layouts/           # Layouts et pages
│   │   ├── dashboards/    # Tableaux de bord
│   │   ├── pages/         # Pages principales
│   │   └── properties/    # Pages des propriétés
│   ├── utils/             # Utilitaires et helpers
│   └── App.js             # Composant principal
├── lambda-functions/      # Fonctions AWS Lambda
│   ├── get-properties.js  # Récupération des propriétés
│   ├── create-property.js # Création de propriété
│   └── utils/             # Utilitaires Lambda
├── package.json           # Dépendances et scripts
└── README.md             # Documentation
```

## 🏗️ Architecture API

### **Services Lambda AWS**
L'application utilise une architecture serverless avec AWS Lambda pour toutes les opérations backend :

- **get-properties** : Récupération et filtrage des propriétés
- **create-property** : Création de nouvelles propriétés
- **update-property** : Mise à jour des propriétés
- **delete-property** : Suppression de propriétés
- **upload-property-images** : Upload d'images vers S3
- **buy-shares** : Achat de parts d'investissement
- **get-portfolio** : Récupération du portfolio utilisateur

### **Base de Données DynamoDB**
Structure de données optimisée pour les requêtes immobilières :

```
Table: real_estate_app
├── PK: AGENT#agentId
│   └── SK: PROPERTY#propertyId
├── PK: PROPERTY#propertyId
│   └── SK: METADATA
└── PK: CITY#cityName
    └── SK: PROPERTY#propertyId
```

### **Authentification AWS Cognito**
- Gestion des utilisateurs et sessions
- Tokens JWT sécurisés
- Rôles et permissions

## 🎯 Fonctionnalités Clés

### **Calculateur d'Investissement**
- **Investissement initial** : De 10€ à 100K€
- **Rendement locatif** : Calcul automatique sur 5 ans
- **Plus-value** : Estimation de l'appréciation
- **ROI total** : Visualisation graphique des retours

### **Modal d'Achat de Parts**
- **Options rapides** : Découverte (10€), Débutant (50€), etc.
- **Saisie exacte** : Montant personnalisé avec validation
- **Calculs en temps réel** : Pourcentage de propriété, rendements
- **Validation** : Limites min/max avec feedback

### **Interface Responsive**
- **Mobile-first** : Optimisé pour tous les écrans
- **Accessibilité** : Conforme aux standards WCAG
- **Performance** : Chargement optimisé

## 🔧 Scripts Disponibles

```bash
npm start          # Lance le serveur de développement
npm run build      # Build de production
npm test           # Lance les tests
npm run lint       # Vérifie le code avec ESLint
npm run eject      # Éjecte la configuration (irréversible)
npm run install:clean # Réinstalle proprement les dépendances
```

## 📈 Roadmap

### **Phase 1 - MVP** ✅
- [x] Calculateur d'investissement
- [x] Modal d'achat de parts
- [x] Interface de base
- [x] Graphiques interactifs
- [x] Architecture Lambda AWS

### **Phase 2 - Fonctionnalités Avancées** 🚧
- [x] Authentification utilisateur (AWS Cognito)
- [x] Gestion des propriétés (DynamoDB)
- [x] Upload d'images (S3)
- [ ] Portfolio personnel
- [ ] Historique des transactions
- [ ] Notifications en temps réel

### **Phase 3 - Optimisations** 📋
- [ ] PWA (Progressive Web App)
- [ ] Optimisations de performance
- [ ] Tests automatisés
- [ ] Documentation API complète
- [ ] Monitoring et alertes

## 🤝 Contribution

### **Guidelines**
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### **Standards de Code**
- **ESLint** : Respecter les règles de linting
- **Prettier** : Formatage automatique
- **Architecture Lambda** : Suivre les patterns établis
- **Tests** : Ajouter des tests pour les nouvelles fonctionnalités

## 📞 Support

Pour toute question ou problème :
- **Issues GitHub** : [Créer une issue](https://github.com/souhailsouid/block-immo/issues)
- **Documentation** : Consulter le README et les exemples
- **AWS Services** : Vérifier la configuration des services AWS

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails. 