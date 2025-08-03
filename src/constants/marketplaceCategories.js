/**
 * Catégories d'affichage de la marketplace
 * Ces catégories déterminent comment les propriétés sont affichées dans la marketplace
 */

// 🏢 Catégories d'affichage de la marketplace
export const MARKETPLACE_CATEGORIES = {
  IN_PROGRESS: 'IN_PROGRESS',        // Propriétés en cours de commercialisation
  COMMERCIALIZED: 'COMMERCIALIZED',  // Propriétés commercialisées et disponibles
  FUNDED: 'FUNDED',                  // Propriétés entièrement financées
  SOLD: 'SOLD',                      // Propriétés vendues
};

/**
 * Configuration des catégories de marketplace
 */
export const MARKETPLACE_CATEGORY_CONFIG = {
  [MARKETPLACE_CATEGORIES.IN_PROGRESS]: {
    label: '🟡 In Progress',
    color: 'warning',
    description: 'Properties being prepared for commercialization',
    icon: 'pending',
  },
  [MARKETPLACE_CATEGORIES.COMMERCIALIZED]: {
    label: '🟢 Commercialized',
    color: 'success',
    description: 'Properties available for investment',
    icon: 'shopping_cart',
  },
  [MARKETPLACE_CATEGORIES.FUNDED]: {
    label: '🔵 Fully Funded',
    color: 'info',
    description: 'Properties that have been fully funded',
    icon: 'check_circle',
  },
  [MARKETPLACE_CATEGORIES.SOLD]: {
    label: '🔴 Sold',
    color: 'error',
    description: 'Properties that have been sold',
    icon: 'sell',
  },
};

/**
 * Valide si une catégorie de marketplace est autorisée
 * @param {string} category - Catégorie à valider
 * @returns {boolean} - True si valide
 */
export const isValidMarketplaceCategory = (category) => {
  if (!category || typeof category !== 'string') {
    return false;
  }
  
  const validCategories = Object.values(MARKETPLACE_CATEGORIES);
  const sanitizedCategory = category.trim().toUpperCase();
  
  return validCategories.includes(sanitizedCategory);
};

/**
 * Obtient la configuration d'une catégorie de marketplace
 * @param {string} category - Catégorie
 * @returns {Object|null} - Configuration ou null si invalide
 */
export const getMarketplaceCategoryConfig = (category) => {
  if (!isValidMarketplaceCategory(category)) {
    return null;
  }
  
  const validCategory = category.trim().toUpperCase();
  return MARKETPLACE_CATEGORY_CONFIG[validCategory] || null;
};

/**
 * Obtient le label d'une catégorie de marketplace
 * @param {string} category - Catégorie
 * @returns {string} - Label ou catégorie originale
 */
export const getMarketplaceCategoryLabel = (category) => {
  const config = getMarketplaceCategoryConfig(category);
  return config ? config.label : category;
};

/**
 * Obtient la couleur d'une catégorie de marketplace
 * @param {string} category - Catégorie
 * @returns {string} - Couleur ou 'default'
 */
export const getMarketplaceCategoryColor = (category) => {
  const config = getMarketplaceCategoryConfig(category);
  return config ? config.color : 'default';
};

// 🔐 Protection contre la modification
Object.freeze(MARKETPLACE_CATEGORIES);
Object.freeze(MARKETPLACE_CATEGORY_CONFIG); 