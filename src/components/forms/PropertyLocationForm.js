import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import { Grid, Card, Typography } from '@mui/material';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import LocationCascadeSelect from 'components/MDSelect/LocationCascadeSelect';
import { locationValidationSchema } from 'validations';
import { getCoordinatesFromAddress } from 'services/api/modules/location/locationService';
import { mergeInitialValues } from 'utils/formUtils';
import { DEFAULT_VALUES_PROPERTY_LOCATION } from 'constants/locationConstants';
import { onSubmitForm } from 'utils/validateForms';
import { useNotification } from 'context/NotificationContext';

const PropertyLocationForm = ({ initialData = {}, onSave, onCancel }) => {
  const { showNotification } = useNotification();

  const initialValues = mergeInitialValues(initialData, DEFAULT_VALUES_PROPERTY_LOCATION);

  // 🎯 Configuration spécifique pour ce formulaire
  const formConfig = {
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: (values) => {
      // Validation spécifique pour la localisation
      if (!values.country || !values.city) {
        showNotification(
          'Business Validation Error',
          'Country and city are required',
          'error',
          { duration: 3000, autoHide: true }
        );
        return 'Country and city are required';
      }
      
      // Validation des coordonnées si fournies
      if (values.latitude !== undefined && values.latitude !== null) {
        const latitude = parseFloat(values.latitude);
        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
          showNotification(
            'Business Validation Error',
            'Latitude must be between -90 and 90',
            'error',
            { duration: 3000, autoHide: true }
          );
          return 'Latitude must be between -90 and 90';
        }
      }
      
      if (values.longitude !== undefined && values.longitude !== null) {
        const longitude = parseFloat(values.longitude);
        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
          showNotification(
            'Business Validation Error',
            'Longitude must be between -180 and 180',
            'error',
            { duration: 3000, autoHide: true }
          );
          return 'Longitude must be between -180 and 180';
        }
      }
      
      return null;
    }
  };

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    onSubmitForm(values, onSave, {
      setSubmitting,
      setErrors,
      cleanFields: formConfig.cleanFields,
      validate: formConfig.validate
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={locationValidationSchema}
      onSubmit={handleSubmit}
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

            {/* Submit Buttons */}
            <MDBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
              <MDButton variant="outlined" color="secondary" onClick={() => onCancel(null)}>
                Cancel
              </MDButton>
              <MDButton variant="contained" color="customBlue" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Location Details'}
              </MDButton>
            </MDBox>
          </Form>
        );
      }}
    </Formik>
  );
};

PropertyLocationForm.propTypes = {
  initialData: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PropertyLocationForm;
