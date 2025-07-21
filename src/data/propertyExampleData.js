export const propertyDetailsExample = {
  title: '1 Bed in Botanica Tower, Dubai Marina',
  propertyType: 'Villa',
  status: 'Available',
  surface: 1000,
  bedrooms: 1,
  bathrooms: 1,
  yearBuilt: 2020,
  energyClass: 'A',
};

export const propertyPriceExample = {
  price: 450000,
  pricePerSquareMeter: 5294,
  investmentAmount: 90000,
  financingPercentage: 80,
  monthlyRent: 2200,
  annualYield: 5.87,
  currency: 'EUR',
  paymentMethod: 'bank_transfer',
};

export const propertyLocationExample = {
  address: '123 Rue de la Paix',
  city: 'Paris',
  postalCode: '75001',
  country: 'France',
  region: 'Île-de-France',
  latitude: 48.8566,
  longitude: 2.3522,
  neighborhood: 'Le Marais',
  transportAccess: 'excellent',
};

export const propertyTimelineExample = {
  timelineData: [
    {
      status: 'completed',
      icon: 'check',
      title: 'Property funding complete!',
      date: new Date('2025-07-10'),
      description: 'The property has been fully funded by investors.',
      badges: ['check'],
    },
    {
      status: 'pending',
      icon: 'vpn_key',
      title: 'Share certificates issued',
      date: new Date('2025-07-25'),
      description: 'Your Property Share Certificates will be issued 2 weeks after the property is funded.',
      badges: ['check'],
    },
    {
      status: 'projected',
      icon: 'payments',
      title: 'First rental payment',
      date: new Date('2025-09-30'),
      description: 'We project that the first rental payment will be paid by 31 August 2025, with a guaranteed payment date no later than 30 September 2025.',
      badges: ['check'],
    },
  ],
};

export const propertyCalculatorExample = {
  initialInvestment: 117500,
  propertyValueGrowth: 20,
  annualRentalYield: 3.9,
  investmentPeriod: 5,
  calculatedResults: {
    totalReturn: 163912.50,
    rentalIncome: 22912.50,
    valueAppreciation: 23500,
    yearlyData: [
      {
        year: 2026,
        investment: 117500,
        rentalIncome: 4582.50,
        valueAppreciation: 4700,
        total: 126782.50,
      },
      {
        year: 2027,
        investment: 117500,
        rentalIncome: 9165,
        valueAppreciation: 9400,
        total: 136065,
      },
      {
        year: 2028,
        investment: 117500,
        rentalIncome: 13747.50,
        valueAppreciation: 14100,
        total: 145347.50,
      },
      {
        year: 2029,
        investment: 117500,
        rentalIncome: 18330,
        valueAppreciation: 18800,
        total: 154630,
      },
      {
        year: 2030,
        investment: 117500,
        rentalIncome: 22912.50,
        valueAppreciation: 23500,
        total: 163912.50,
      },
    ],
  },
}; 