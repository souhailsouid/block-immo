import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MDBox from 'components/MDBox';
import { Grid } from '@mui/material';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import FormFieldSelect from 'components/FormFieldSelect';
import MDButton from 'components/MDButton';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  propertyType: Yup.string().required('Property type is required'),
  status: Yup.string().required('Status is required'),
  surface: Yup.number().positive('Surface must be positive').required('Surface is required'),
  bedrooms: Yup.number()
    .positive('Number of bedrooms must be positive')
    .required('Number of bedrooms is required'),
  bathrooms: Yup.number()
    .positive('Number of bathrooms must be positive')
    .required('Number of bathrooms is required'),
  yearBuilt: Yup.number()
    .positive('Year built must be positive')
    .required('Year built is required'),
  energyClass: Yup.string().required('Energy class is required'),
});

const PropertyDetailsForm = ({ initialData = {}, onSave }) => {
  const initialValues = {
    title: initialData.title || '',
    propertyType: initialData.propertyType || '',
    status: initialData.status || '',
    surface: initialData.surface || '',
    bedrooms: initialData.bedrooms || '',
    bathrooms: initialData.bathrooms || '',
    yearBuilt: initialData.yearBuilt || '',
    energyClass: initialData.energyClass || '',
  };

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: 'Commercial Property' },
    { value: 'land', label: 'Land' },
  ];

  const statuses = [
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'under_construction', label: 'Under Construction' },
  ];

  const energyClasses = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
    { value: 'G', label: 'G' },
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        // Simuler une validation côté serveur
        const errors = {};

                  // Example of custom validation
          if (values.surface > 10000) {
            errors.surface = 'Surface cannot exceed 10,000 sq ft';
          }

        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          setSubmitting(false);
          return;
        }

        onSave(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormField label="Property Title" name="title" type="text" />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormFieldSelect
                label="Property Type"
                name="propertyType"
                options={propertyTypes}
                placeholder="Property Type"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormFieldSelect
                label="Status"
                name="status"
                options={statuses}
                placeholder="Status"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField label="Surface (sq ft)" name="surface" type="number" />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField label="Number of Bedrooms" name="bedrooms" type="number" />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField label="Number of Bathrooms" name="bathrooms" type="number" />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField label="Year Built" name="yearBuilt" type="number" />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormFieldSelect
                label="Energy Class"
                name="energyClass"
                options={energyClasses}
                placeholder="Energy Class"
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
      )}
    </Formik>
  );
};

export default PropertyDetailsForm;
 