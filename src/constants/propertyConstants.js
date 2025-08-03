// Types de propriétés
export const PROPERTY_TYPES = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  VILLA: 'Villa',
  COMMERCIAL: 'Commercial Property',
  LAND: 'Land',
  PENTHOUSE: 'Penthouse',
  OTHER: 'Other'
}

// Statuts de propriété
export const PROPERTY_STATUSES = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RESERVED: 'reserved',
  UNDER_CONSTRUCTION: 'under_construction',
  RENTED: 'rented',
  PENDING: 'pending'
}
export const PROPERTY_STATUSES_PROPERTY = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMMERCIALIZED: 'COMMERCIALIZED',
  FUNDED: "FUNDED"
}

// Classes énergétiques
export const ENERGY_CLASSES = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G'
}

// Options pour les selects
export const PROPERTY_TYPE_OPTIONS = [
  { value: PROPERTY_TYPES.APARTMENT, label: 'Apartment' },
  { value: PROPERTY_TYPES.HOUSE, label: 'House' },
  { value: PROPERTY_TYPES.VILLA, label: 'Villa' },
  { value: PROPERTY_TYPES.COMMERCIAL, label: 'Commercial Property' },
  { value: PROPERTY_TYPES.LAND, label: 'Land' },
  { value: PROPERTY_TYPES.PENTHOUSE, label: 'Penthouse' },
  { value: PROPERTY_TYPES.OTHER, label: 'Other' }
];

export const PROPERTY_STATUS_OPTIONS = [
  { value: PROPERTY_STATUSES.AVAILABLE, label: 'Available' },
  { value: PROPERTY_STATUSES.SOLD, label: 'Sold' },
  { value: PROPERTY_STATUSES.RESERVED, label: 'Reserved' },
  { value: PROPERTY_STATUSES.UNDER_CONSTRUCTION, label: 'Under Construction' },
  { value: PROPERTY_STATUSES.RENTED, label: 'Rented' },
  { value: PROPERTY_STATUSES.PENDING, label: 'Pending' }
];

export const ENERGY_CLASS_OPTIONS = [
  { value: ENERGY_CLASSES.A, label: 'A' },
  { value: ENERGY_CLASSES.B, label: 'B' },
  { value: ENERGY_CLASSES.C, label: 'C' },
  { value: ENERGY_CLASSES.D, label: 'D' },
  { value: ENERGY_CLASSES.E, label: 'E' },
  { value: ENERGY_CLASSES.F, label: 'F' },
  { value: ENERGY_CLASSES.G, label: 'G' }
];

// Validation rules
export const VALIDATION_RULES = {
  SURFACE: {
    MIN: 1,
    MAX: 10000,
    UNIT: 'sq ft'
  },
  BEDROOMS: {
    MIN: 0,
    MAX: 20
  },
  BATHROOMS: {
    MIN: 0,
    MAX: 10
  },
  YEAR_BUILT: {
    MIN: 1800,
    MAX: new Date().getFullYear()
  }
};

export const PROPERTY_TIMELINE_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  PROJECTED: 'projected'
}

export const PROPERTY_TIMELINE_ICONS = {
  COMPLETED: 'check',
  PENDING: 'pending',
  PROJECTED: 'projected'
}

export const PROPERTY_TIMELINE_BADGES = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  PROJECTED: 'projected'
}


export const PROPERTY_STATUSES_PROPERTY_OPTIONS = [
  { value: PROPERTY_STATUSES_PROPERTY.IN_PROGRESS, label: 'In Progress' },
  { value: PROPERTY_STATUSES_PROPERTY.COMMERCIALIZED, label: 'Commercialized' },
  { value: PROPERTY_STATUSES_PROPERTY.FUNDED, label: 'Funded' }
]

export const PROPERTY_TIMELINE_STATUS_OPTIONS = [
  { value: PROPERTY_TIMELINE_STATUS.COMPLETED, label: 'Completed' },
  { value: PROPERTY_TIMELINE_STATUS.PENDING, label: 'Pending' },
  { value: PROPERTY_TIMELINE_STATUS.PROJECTED, label: 'Projected' },
]
export const PROPERTY_TIMELINE_STATUS_CONFIG = {
  [PROPERTY_TIMELINE_STATUS.COMPLETED]: {
    color: 'success',
    defaultIcon: PROPERTY_TIMELINE_ICONS.COMPLETED,
    label: PROPERTY_TIMELINE_BADGES.COMPLETED,
    description: 'Event has been completed successfully',
  },
  [PROPERTY_TIMELINE_STATUS.PENDING]: {
    color: 'info',
    defaultIcon: PROPERTY_TIMELINE_ICONS.PENDING,
    label: PROPERTY_TIMELINE_BADGES.PENDING,
    description: 'Event is currently in progress or waiting',
  },
  [PROPERTY_TIMELINE_STATUS.PROJECTED]: {
    color: 'secondary',
    defaultIcon: PROPERTY_TIMELINE_ICONS.PROJECTED,
    label: PROPERTY_TIMELINE_BADGES.PROJECTED,
    description: 'Event is planned for the future',
  },
};

