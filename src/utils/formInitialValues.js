export const DEFAULT_VALUES_PROPERTY_DETAILS = {
    title: '',
    propertyType: '',
    surface: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    energyClass: '',
    description: '',
};
  export const DEFAULT_VALUES_PROPERTY_DETAILS_TABLE = {
    country: '',
    city: '',
    state: '',
    brutYield: 0,
    netYield: 0,
    pricePerSquareFoot: 0,
  };

  export const DEFAULT_VALUES_PROPERTY_TIMELINE = {
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

export const DEFAULT_VALUES_PROPERTY_PRICE = {
  propertyPrice: "",
  status: 'closed',
  fundingDate: "",
  closingDate: "",
  yearlyInvestmentReturn: "",
  currency: "",
};
