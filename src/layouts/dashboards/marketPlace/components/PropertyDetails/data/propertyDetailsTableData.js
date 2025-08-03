import { formatCurrencyWithLocale } from 'utils/currencyMapping';

const propertyDetailsTableData = (city, country, countryCode, brutYield, netYield, pricePerSquareFoot, currency) => [
  {
    [`${city || 'Unknown'}, ${country || 'Unknown'}`]: [countryCode || 'US', 'A mature real estate market with a high return on investment'],
  },  
  {
      [`${brutYield || 0} % annual gross yield`]: [
      'icon',
      `With a net yield of ${netYield || 0} % and a price per square foot of ${formatCurrencyWithLocale(pricePerSquareFoot || 0, currency || 'USD')}`,
    ],
  },
];

export default propertyDetailsTableData;
