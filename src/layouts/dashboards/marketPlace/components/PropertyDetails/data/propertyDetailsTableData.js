import { formatCurrencyByCountry } from 'utils/currencyMapping';

const propertyDetailsTableData = (city, country, countryCode, brutYield, netYield, pricePerSquareFoot) => [
  {
    [`${city}, ${country}`]: [countryCode, 'A mature real estate market with a high return on investment'],
  },  
  {
      [`${brutYield} % annual gross yield`]: [
      'icon',
      `With a net yield of ${netYield} % and a price per square foot of ${formatCurrencyByCountry(pricePerSquareFoot, countryCode)}`,
    ],
  },
];

export default propertyDetailsTableData;
