/**
 * Constantes sécurisées pour les statuts de propriété
 * Sécurité : Validation, sanitization, et protection contre l'injection
 */

// 🛡️ Statuts de propriété individuelles (whitelist)
export const PROPERTY_STATUSES = {
  // Statuts de base
  ACTIVE: 'ACTIVE',
  AVAILABLE: 'available',
  OPEN: 'open',
  PENDING: 'PENDING',
  RESERVED: 'reserved',
  SOLD: 'SOLD',
  CANCELLED: 'CANCELLED',
  CLOSED: 'CLOSED',
  RENTED: 'rented',
  UNDER_CONSTRUCTION: 'under_construction',
  FUNDING: 'FUNDING',
  FUNDED: 'FUNDED',
  COMMERCIALIZED: 'COMMERCIALIZED',
  IN_PROGRESS: 'IN_PROGRESS',
};

// 🔒 Validation des statuts
export const VALID_STATUSES = Object.values(PROPERTY_STATUSES);

/**
 * Valide si un statut est autorisé
 * @param {string} status - Statut à valider
 * @returns {boolean} - True si valide
 */
export const isValidStatus = (status) => {
  if (!status || typeof status !== 'string') {
    return false;
  }
  
  // Sanitization : Supprimer les caractères dangereux
  const sanitizedStatus = status.trim();
  
  // Validation : Vérifier si dans la whitelist (insensible à la casse)
  return VALID_STATUSES.some(validStatus => 
    validStatus.toLowerCase() === sanitizedStatus.toLowerCase()
  );
};

/**
 * Sanitize et valide un statut
 * @param {string} status - Statut à sanitizer
 * @returns {string|null} - Statut valide ou null
 */
export const sanitizeStatus = (status) => {
  if (!status || typeof status !== 'string') {
    return null;
  }
  
  // Supprimer les caractères spéciaux dangereux
  const sanitized = status
    .trim()
    .replace(/[^A-Za-z_]/g, ''); // Seulement lettres et underscore
  
  // Trouver la valeur normalisée correspondante
  const normalizedStatus = VALID_STATUSES.find(validStatus => 
    validStatus.toLowerCase() === sanitized.toLowerCase()
  );
  
  return normalizedStatus || null;
};

/**
 * Configuration sécurisée des statuts de propriété
 */
export const STATUS_CONFIG = {
  [PROPERTY_STATUSES.ACTIVE]: {
    label: '🟢 Active - Open for Investment',
    color: 'success',
    canBuy: true,
    showProgress: false,
    icon: 'shopping_cart',
    description: 'Property is open for investment',
  },
  [PROPERTY_STATUSES.AVAILABLE]: {
    label: '🟢 Available - Open for Investment',
    color: 'success',
    canBuy: true,
    showProgress: false,
    icon: 'shopping_cart',
    description: 'Property is available for investment',
  },
  [PROPERTY_STATUSES.OPEN]: {
    label: '🟢 Open - Accepting investments',
    color: 'success',
    canBuy: true,
    showProgress: false,
    icon: 'shopping_cart',
    description: 'Property is open for investment',
  },
  [PROPERTY_STATUSES.PENDING]: {
    label: '🟣 Pending Launch',
    color: 'secondary',
    canBuy: false,
    showProgress: false,
    icon: 'schedule',
    description: 'Property will be available soon',
  },
  [PROPERTY_STATUSES.RESERVED]: {
    label: '🟡 Reserved',
    color: 'warning',
    canBuy: false,
    showProgress: false,
    icon: 'lock',
    description: 'Property is reserved',
  },
  [PROPERTY_STATUSES.SOLD]: {
    label: '🔴 Sold',
    color: 'error',
    canBuy: false,
    showProgress: false,
    icon: 'sell',
    description: 'Property has been sold',
  },
  [PROPERTY_STATUSES.CANCELLED]: {
    label: '⚫ Cancelled',
    color: 'error',
    canBuy: false,
    showProgress: false,
    icon: 'cancel',
    description: 'Property investment has been cancelled',
  },
  [PROPERTY_STATUSES.CLOSED]: {
    label: '🔴 Closed',
    color: 'error',
    canBuy: false,
    showProgress: false,
    icon: 'lock',
    description: 'Property is closed',
  },
  [PROPERTY_STATUSES.RENTED]: {
    label: '🟠 Rented',
    color: 'warning',
    canBuy: false,
    showProgress: false,
    icon: 'home',
    description: 'Property is rented',
  },
  [PROPERTY_STATUSES.UNDER_CONSTRUCTION]: {
    label: '🔧 Under Construction',
    color: 'info',
    canBuy: false,
    showProgress: false,
    icon: 'construction',
    description: 'Property is under construction',
  },
  [PROPERTY_STATUSES.FUNDING]: {
    label: '🟢 Funding',
    color: 'success',
    canBuy: true,
    showProgress: true,
    icon: 'funding',
    description: 'Property is in funding phase',
  },
  [PROPERTY_STATUSES.FUNDED]: {
    label: '🟢 Funded',
    color: 'success',
    canBuy: false,
    showProgress: false,
    icon: 'funding',
    description: 'Property is fully funded',
  },  
  [PROPERTY_STATUSES.COMMERCIALIZED]: {
    label: '🟢 Commercialized',
    color: 'success',
    canBuy: true,
    showProgress: false,
    icon: 'commercialize',
    description: 'Property is commercialized',
  },
  [PROPERTY_STATUSES.IN_PROGRESS]: {
    label: '🟡 In Progress',
    color: 'warning',
    canBuy: false,
    showProgress: false,
    icon: 'progress',
    description: 'Property is in progress',
  },
};

/**
 * Obtient la configuration sécurisée d'un statut
 * @param {string} status - Statut
 * @returns {Object|null} - Configuration ou null si invalide
 */
export const getStatusConfig = (status) => {
  const validStatus = sanitizeStatus(status);
  return validStatus ? STATUS_CONFIG[validStatus] : null;
};

/**
 * Obtient les statuts achetable de manière sécurisée
 * @returns {Array} - Liste des statuts achetable
 */
export const getBuyableStatuses = () => {
  return VALID_STATUSES.filter(status => STATUS_CONFIG[status].canBuy);
};

/**
 * Vérifie si un statut permet l'achat
 * @param {string} status - Statut à vérifier
 * @returns {boolean} - True si achat possible
 */
export const canBuyStatus = (status) => {
  const config = getStatusConfig(status);
  return config ? config.canBuy : false;
};

/**
 * Obtient la couleur sécurisée d'un statut
 * @param {string} status - Statut
 * @returns {string} - Couleur ou 'default'
 */
export const getStatusColor = (status) => {
  const config = getStatusConfig(status);
  return config ? config.color : 'default';
};

/**
 * Obtient le label sécurisé d'un statut
 * @param {string} status - Statut
 * @returns {string} - Label ou statut original
 */
export const getStatusLabel = (status) => {
  const config = getStatusConfig(status);
  return config ? config.label : status;
};

/**
 * Obtient l'icône sécurisée d'un statut
 * @param {string} status - Statut
 * @returns {string} - Icône ou 'help'
 */
export const getStatusIcon = (status) => {
  const config = getStatusConfig(status);
  return config ? config.icon : 'help';
};

/**
 * Vérifie si un statut doit afficher la date de clôture
 * @param {string} status - Statut
 * @returns {boolean} - True si doit afficher la date de clôture
 */
export const shouldShowClosingDate = (status) => {
  const config = getStatusConfig(status);
  return config ? config.canBuy : false; // Afficher la date si achat possible
};

// 🔐 Protection contre la modification
Object.freeze(PROPERTY_STATUSES);
Object.freeze(VALID_STATUSES);
Object.freeze(STATUS_CONFIG); 