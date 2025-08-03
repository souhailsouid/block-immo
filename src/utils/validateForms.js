/**
 * Fonction générique pour soumettre un formulaire
 * @param {Object} values - Valeurs du formulaire
 * @param {Function} onSave - Fonction de sauvegarde
 * @param {Object} options - Options de soumission
 * @param {Function} options.setSubmitting - Fonction pour gérer l'état de soumission
 * @param {Function} options.setErrors - Fonction pour gérer les erreurs
 * @param {Array} options.cleanFields - Champs à nettoyer (optionnel)
 * @param {Function} options.validate - Fonction de validation personnalisée (optionnel)
 */
export const onSubmitForm = async (values, onSave, { 
  setSubmitting, 
  setErrors, 
  cleanFields = [], 
  validate = null 
}) => {
  try {
    // Validation personnalisée si fournie
    if (validate) {
      const validationError = validate(values);
      if (validationError) {
        throw new Error(validationError);
      }
    }

    // Nettoyer les données
    const cleanValues = cleanFormData(values, cleanFields);
    // Appeler la fonction de sauvegarde
    await onSave(cleanValues);

    } catch (error) {
    // Gérer les erreurs de validation
    if (error.name === 'ValidationError') {
      setErrors(error.errors);
    } else {
      setErrors({ submit: error.message });
    }
  } finally {
    setSubmitting(false);
  }
};

/**
 * Nettoyer les données du formulaire
 * @param {Object} data - Données brutes
 * @param {Array} fieldsToClean - Champs à supprimer
 * @returns {Object} Données nettoyées
 */
export const cleanFormData = (data, fieldsToClean = []) => {
  const cleaned = { ...data };
  
  // Champs par défaut à nettoyer
  const defaultCleanFields = [
    'updatedAt', 
    'createdAt', 
    'propertyId', 
    'PK', 
    'SK',
    'id',
    '__typename'
  ];
  
  // Combiner les champs par défaut avec ceux spécifiés
  const allFieldsToClean = [...new Set([...defaultCleanFields, ...fieldsToClean])];
  
  allFieldsToClean.forEach(field => {
    delete cleaned[field];
  });
  
  // Nettoyer les valeurs vides
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  return cleaned;
};

/**
 * Valider les données avant soumission
 * @param {Object} data - Données à valider
 * @param {Object} rules - Règles de validation
 * @returns {Object|null} Erreurs de validation ou null
 */
export const validateFormData = (data, rules = {}) => {
  const errors = {};
  
  // Validation des champs requis
  if (rules.required) {
    rules.required.forEach(field => {
      if (!data[field] || data[field] === '') {
        errors[field] = `${field} is required`;
      }
    });
  }
  
  // Validation des nombres
  if (rules.numbers) {
    rules.numbers.forEach(field => {
      if (data[field] && isNaN(Number(data[field]))) {
        errors[field] = `${field} must be a number`;
      }
    });
  }
  
  // Validation des emails
  if (rules.emails) {
    rules.emails.forEach(field => {
      if (data[field] && !isValidEmail(data[field])) {
        errors[field] = `${field} must be a valid email`;
      }
    });
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Valider un email
 * @param {string} email - Email à valider
 * @returns {boolean} True si valide
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};