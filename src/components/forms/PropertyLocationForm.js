import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import { Grid, Card, Typography } from '@mui/material';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import LocationCascadeSelect from 'components/MDSelect/LocationCascadeSelect';

const validationSchema = Yup.object().shape({
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

// Function to get coordinates from address using geocoding
const getCoordinatesFromAddress = async (address, city, country) => {
  try {
    const fullAddress = `${address}, ${city}, ${country}`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
};

const PropertyLocationForm = ({ initialData = {}, onSave, hideButtons = false, onValidationChange }) => {
  const initialValues = {
    // Address fields
    address: initialData.address || '',
    city: initialData.city || '',
    country: initialData.country || '',

    // Coordinates
    latitude: initialData.lat || initialData.latitude || null,
    longitude: initialData.lng || initialData.longitude || null,

    // Location description
    locationDescription: initialData.description || initialData.locationDescription || '',
  };

  // Custom validation function
  const validateForm = (values) => {
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        if (validateForm(values)) {
          onSave(values);
        }
        setSubmitting(false);
      }}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ values, isSubmitting, handleSubmit, setFieldValue }) => {
        // Function to update coordinates when address changes
        const updateCoordinates = async (address, city, country) => {
          if (address && city && country) {
            const coords = await getCoordinatesFromAddress(address, city, country);
            if (coords) {
              setFieldValue('latitude', coords.latitude);
              setFieldValue('longitude', coords.longitude);
            }
          }
        };

        return (
          <Form onSubmit={handleSubmit}>
            <MDBox mb={3}>
              <Typography variant="body2" color="textSecondary">
                Configure property location and address information.
              </Typography>
            </MDBox>

            <Grid container spacing={3}>
              {/* Address Information */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom mb={2}>
                    📍 Address Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <LocationCascadeSelect
                        initialData={initialValues}
                        countryField="country"
                        stateField="state"
                        cityField="city"
                        showState={false} // Don't show state for table form
                        showCity={true}
                        onLocationChange={(locationData) => {
                          // Update coordinates when location changes
                          if (locationData.latitude && locationData.longitude) {
                            setFieldValue('latitude', locationData.latitude);
                            setFieldValue('longitude', locationData.longitude);
                          }
                          // Update other fields if provided
                          if (locationData.country) {
                            setFieldValue('country', locationData.country);
                          }
                          if (locationData.city) {
                            setFieldValue('city', locationData.city);
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <FormField 
                        label="Address" 
                        name="address" 
                        placeholder="Enter address"
                        onBlur={(e) => {
                          // Update coordinates when address is entered
                          updateCoordinates(e.target.value, values.city, values.country);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Map and Coordinates */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    🗺️ Map & Coordinates
                  </Typography>

                  {/* Coordinates Display */}
                  <MDBox mb={2}>
                    <Typography variant="caption" color="grey.500" textAlign="center">
                      Coordinates:{' '}
                      {values.latitude && values.longitude
                        ? `${values.latitude.toFixed(6)}, ${values.longitude.toFixed(6)}`
                        : 'Not set - Select a location above or enter address'}
                    </Typography>
                  </MDBox>

                  {/* Coordinates Display */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormField
                        label="Latitude"
                        name="latitude"
                        type="number"
                        placeholder="25.2048"
                        disabled={false} // Enable for manual input
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormField
                        label="Longitude"
                        name="longitude"
                        type="number"
                        placeholder="55.2708"
                        disabled={false} // Enable for manual input
                      />
                    </Grid>
                  </Grid>

                  {/* Manual Coordinates Note */}
                  <MDBox mt={2}>
                    <Typography variant="caption" color="textSecondary">
                      💡 Coordinates are automatically updated when you select a location or enter an address, or you can enter them manually.
                    </Typography>
                  </MDBox>

                  {/* Update Coordinates Button */}
                  <MDBox mt={2}>
                    <MDButton
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => updateCoordinates(values.address, values.city, values.country)}
                      disabled={!values.address || !values.city || !values.country}
                    >
                      🔄 Update Coordinates from Address
                    </MDButton>
                  </MDBox>
                </Card>
              </Grid>

              {/* Full Address Display */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, backgroundColor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    📍 Full Address
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {values.address && values.city && values.country
                      ? `${values.address}, ${values.city}, ${values.country}`
                      : 'Complete the address fields above to see the full address'}
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Location Description */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  📝 Location Description
                </Typography>
                <FormField
                  label="Location Description"
                  name="locationDescription"
                  multiline
                  rows={4}
                  placeholder="Describe the neighborhood, amenities, and highlights of this location..."
                />
              </Card>
            </Grid>

            {/* Submit Buttons - Only show if not hidden */}
            {!hideButtons && (
              <MDBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
                <MDButton variant="outlined" color="secondary" onClick={() => onSave(null)}>
                  Cancel
                </MDButton>
                <MDButton variant="contained" color="customBlue" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Location Details'}
                </MDButton>
              </MDBox>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

PropertyLocationForm.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func,
  hideButtons: PropTypes.bool,
  onValidationChange: PropTypes.func,
};

export default PropertyLocationForm;
