
/**
 * Fusionne les données initiales avec les valeurs par défaut
 * @param {Object} initialData - Données initiales
 * @param {Object} defaults - Valeurs par défaut
 * @returns {Object} Valeurs fusionnées
 */
export const mergeInitialValues = (initialData = {}, defaults) => {
  return Object.keys(defaults).reduce((acc, key) => {
    const value = initialData[key] !== undefined ? initialData[key] : defaults[key];
    
    // Conversion des dates ISO string en objets Date pour les MDDatePicker
    if ((key === 'fundingDate' || key === 'closingDate') && value && typeof value === 'string') {
      try {
        acc[key] = new Date(value);
      } catch (error) {
        acc[key] = value; // Garde la valeur originale si la conversion échoue
      }
    } else {
      acc[key] = value;
    }
    
    return acc;
  }, {});
};

/**
 * Nettoie les valeurs vides d'un objet
 * @param {Object} values - Valeurs à nettoyer
 * @returns {Object} Valeurs nettoyées
 */
export const cleanEmptyValues = (values) => {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

/**
 * Valide et transforme les valeurs avant soumission
 * @param {Object} values - Valeurs du formulaire
 * @returns {Object} Valeurs transformées
 */
export const transformFormValues = (values) => {
  return {
    ...values,
    // Conversion des nombres
    surface: values.surface ? Number(values.surface) : null,
    bedrooms: values.bedrooms ? Number(values.bedrooms) : null,
    bathrooms: values.bathrooms ? Number(values.bathrooms) : null,
    yearBuilt: values.yearBuilt ? Number(values.yearBuilt) : null,
    price: values.price ? Number(values.price) : null,
    latitude: values.latitude ? Number(values.latitude) : null,
    longitude: values.longitude ? Number(values.longitude) : null,
    
    // Nettoyage des chaînes
    title: values.title?.trim(),
    city: values.city?.trim(),
    description: values.description?.trim(),
    address: values.address?.trim(),
    postalCode: values.postalCode?.trim()
  };
};