function formatCurrency(value, currency = 'USD', locale = 'en-US') {
    // Si la valeur est entière, pas de décimales, sinon 2 décimales
    const hasDecimals = value % 1 !== 0;
    return value?.toLocaleString(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    });
  }
  const parseNumber = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const parsed = parseFloat(value);
    return isNaN(parsed) ? '' : parsed;
  };
export { formatCurrency, parseNumber  };
