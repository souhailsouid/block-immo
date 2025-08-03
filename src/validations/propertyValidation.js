import * as Yup from 'yup';
import { PROPERTY_TYPES, VALIDATION_RULES } from '../constants/propertyConstants';

export const propertyDetailsValidation = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .required('Title is required'),
    
  propertyType: Yup.string()
    .oneOf(Object.values(PROPERTY_TYPES), 'Invalid property type')
    .required('Property type is required'),
    
    
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
    .required('Number of bathrooms is required'),
    
  yearBuilt: Yup.number()
    .min(VALIDATION_RULES.YEAR_BUILT.MIN, `Year built must be at least ${VALIDATION_RULES.YEAR_BUILT.MIN}`)
    .max(VALIDATION_RULES.YEAR_BUILT.MAX, `Year built cannot exceed ${VALIDATION_RULES.YEAR_BUILT.MAX}`)
    .required('Year built is required'),
    
    
  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters'),
    
});

export const propertyDetailsTableValidation = Yup.object().shape({
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    brutYield: Yup.number()
      .min(0, 'Brut yield must be positive')
      .max(100, 'Brut yield cannot exceed 100%')
      .required('Brut yield is required'),
    netYield: Yup.number()
      .min(0, 'Net yield must be positive')
      .max(100, 'Net yield cannot exceed 100%')
      .required('Net yield is required'),
    pricePerSquareFoot: Yup.number()
      .min(0, 'Price per square foot must be positive')
      .required('Price per square foot is required'),
});
  
export const propertyTimelineValidation = Yup.object().shape({
  timelineData: Yup.array()
    .of(
      Yup.object().shape({
        status: Yup.string()
          .oneOf(['completed', 'pending', 'projected'])
          .required('Status is required'),
        icon: Yup.string().required('Icon is required'),
        title: Yup.string().required('Event title is required'),
        date: Yup.date().required('Event date is required'),
        description: Yup.string().required('Event description is required'),
        badges: Yup.array().of(Yup.string()),
      })
    )
    .min(1, 'At least one timeline event is required'),
});

export const propertyPriceValidation = Yup.object().shape({
  // Property price
  propertyPrice: Yup.number()
    .positive('Property price must be positive')
    .required('Property price is required'),


  // Status
  status: Yup.string().required('Status is required'),

  // Dates
  fundingDate: Yup.date().required('Funding date is required'),
  closingDate: Yup.date().required('Closing date is required'),

  // Investment metrics
  yearlyInvestmentReturn: Yup.number()
    .positive('Yearly investment return must be positive')
    .required('Yearly investment return is required'),

  // General information
  currency: Yup.string().required('Currency is required'),
});
