import * as Yup from 'yup';

export const locationValidationSchema = Yup.object().shape({
    // Address fields
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
  
    // Optional fields
    additionalInfo: Yup.string(),
  
    // Coordinates (auto-generated)
    latitude: Yup.number().nullable(),
    longitude: Yup.number().nullable(),
  
    // Location description
    locationDescription: Yup.string().required('Location description is required'),
});
  
export const validateLocationForm = (values, onValidationChange) => {
  const errors = [];

  // Address validation
  if (!values.address || values.address.trim() === '') {
    errors.push('Address is required');
  }

  if (!values.city || values.city.trim() === '') {
    errors.push('City is required');
  }

  if (!values.country || values.country.trim() === '') {
    errors.push('Country is required');
  }

  if (!values.locationDescription || values.locationDescription.trim() === '') {
    errors.push('Location description is required');
  }

  const isValid = errors.length === 0;
  
  if (onValidationChange) {
    onValidationChange(isValid, errors);
  }

  return isValid;
};