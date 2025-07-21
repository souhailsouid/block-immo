import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MDBox from 'components/MDBox';
import { Grid } from '@mui/material';
import MDButton from 'components/MDButton';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import LocationCascadeSelect from 'components/MDSelect/LocationCascadeSelect';
import { parseNumber } from 'utils';

const validationSchema = Yup.object().shape({
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

const PropertyDetailsTableForm = ({ initialData = {}, onSave }) => {
  console.log('initialData_property_details_table_form', initialData);
  
  // Helper function to convert string to number safely
 

  const initialValues = {
    country: initialData.country || '',
    city: initialData.city || '',
    state: initialData.state || '',
    brutYield: parseNumber(initialData.brutYield),
    netYield: parseNumber(initialData.netYield),
    pricePerSquareFoot: parseNumber(initialData.pricePerSquareFoot),
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        // Convert string values to numbers for validation
        const processedValues = {
          ...values,
          brutYield: parseFloat(values.brutYield) || 0,
          netYield: parseFloat(values.netYield) || 0,
          pricePerSquareFoot: parseFloat(values.pricePerSquareFoot) || 0,
        };

        // Simuler une validation côté serveur
        const errors = {};

        // Example of custom validation
        if (processedValues.brutYield < processedValues.netYield) {
          errors.brutYield = 'Brut yield cannot be less than net yield';
        }

        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          setSubmitting(false);
          return;
        }

        // Pass processed values (with proper types) to onSave
        onSave(processedValues);
        setSubmitting(false);
      }}
    >
          {({ values, isSubmitting, handleSubmit }) => {
              console.log('values_property_details_table_form', values);
        return (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Location Cascade Select - Country and City only */}
              <Grid item xs={12}>
                <LocationCascadeSelect
                  initialData={initialValues}
                  countryField="country"
                  stateField="state"
                  cityField="city"
                  showState={false} // Don't show state for table form
                  showCity={true}
                />
              </Grid>

              {/* Yield Fields */}
              <Grid item xs={12} md={6}>
                <FormField
                  label="Brut Yield (%)"
                  name="brutYield"
                  type="number"
                  step="0.01"
                  placeholder="Enter brut yield percentage"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormField
                  label="Net Yield (%)"
                  name="netYield"
                  type="number"
                  step="0.01"
                  placeholder="Enter net yield percentage"
                />
              </Grid>

              {/* Price per Square Foot */}
              <Grid item xs={12} md={6}>
                <FormField
                  label="Price per Square Foot ($)"
                  name="pricePerSquareFoot"
                  type="number"
                  step="0.01"
                  placeholder="Enter price per square foot"
                />
              </Grid>
            </Grid>

            {/* Bouton de soumission */}
            <MDBox mt={3} px={2} display="flex" justifyContent="flex-end" gap={2}>
              <MDButton
                variant="outlined"
                color="secondary"
                onClick={() => onSave(null)} // Cancel
              >
                Cancel
              </MDButton>
              <MDButton
                variant="contained"
                color="customBlue"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </MDButton>
            </MDBox>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PropertyDetailsTableForm;
