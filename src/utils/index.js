function formatCurrency(value, currency = 'USD', locale = null) {
  if (!value) return '';
  
  // Si une locale spécifique est fournie, l'utiliser
  if (locale) {
    const hasDecimals = value % 1 !== 0;
    return value?.toLocaleString(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    });
  }
  
  // Sinon, utiliser la locale appropriée pour la devise
  try {
    const { formatCurrencyWithLocale } = require('./currencyMapping');
    return formatCurrencyWithLocale(value, currency);
  } catch (error) {
    // Fallback vers la fonction originale
    const hasDecimals = value % 1 !== 0;
    return value?.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    });
  }
}
  const parseNumber = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const parsed = parseFloat(value);
    return isNaN(parsed) ? '' : parsed;
  };
export { formatCurrency, parseNumber  };
