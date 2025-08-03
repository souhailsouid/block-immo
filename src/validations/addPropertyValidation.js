import * as Yup from 'yup';
import { PROPERTY_TYPES, PROPERTY_STATUSES, ENERGY_CLASSES, VALIDATION_RULES } from '../constants/propertyConstants';

export const addPropertyValidation = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .required('Title is required'),
    
  propertyType: Yup.string()
    .oneOf(Object.values(PROPERTY_TYPES), 'Invalid property type')
    .required('Property type is required'),
    
  status: Yup.string()
    .oneOf(Object.values(PROPERTY_STATUSES), 'Invalid status')
    .required('Status is required'),
    
  surface: Yup.number()
    .min(VALIDATION_RULES.SURFACE.MIN, `Surface must be at least ${VALIDATION_RULES.SURFACE.MIN} ${VALIDATION_RULES.SURFACE.UNIT}`)
    .max(VALIDATION_RULES.SURFACE.MAX, `Surface cannot exceed ${VALIDATION_RULES.SURFACE.MAX} ${VALIDATION_RULES.SURFACE.UNIT}`)
    .required('Surface is required'),
    
  bedrooms: Yup.number()
    .min(VALIDATION_RULES.BEDROOMS.MIN, `Bedrooms must be at least ${VALIDATION_RULES.BEDROOMS.MIN}`)
    .max(VALIDATION_RULES.BEDROOMS.MAX, `Bedrooms cannot exceed ${VALIDATION_RULES.BEDROOMS.MAX}`)
    .required('Number of bedrooms is required'),
    
  bathrooms: Yup.number()
    .min(VALIDATION_RULES.BATHROOMS.MIN, `Bathrooms must be at least ${VALIDATION_RULES.BATHROOMS.MIN}`)
    .max(VALIDATION_RULES.BATHROOMS.MAX, `Bathrooms cannot exceed ${VALIDATION_RULES.BATHROOMS.MAX}`)
    .nullable(),
    
  yearBuilt: Yup.number()
    .min(VALIDATION_RULES.YEAR_BUILT.MIN, `Year built must be at least ${VALIDATION_RULES.YEAR_BUILT.MIN}`)
    .max(VALIDATION_RULES.YEAR_BUILT.MAX, `Year built cannot exceed ${VALIDATION_RULES.YEAR_BUILT.MAX}`)
    .nullable(),
    
  energyClass: Yup.string()
    .oneOf(Object.values(ENERGY_CLASSES), 'Invalid energy class')
    .nullable(),
    
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
    
  // Location fields
  country: Yup.string()
    .required('Country is required'),
    
  state: Yup.string()
    .required('State/Region is required'),
    
  city: Yup.string()
    .required('City is required'),
}); 
 