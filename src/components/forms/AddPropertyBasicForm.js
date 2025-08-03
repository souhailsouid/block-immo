import React from 'react';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import MDBox from 'components/MDBox';
import { Grid, Card, Typography } from '@mui/material';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import FormFieldSelect from 'components/FormFieldSelect';
import MDButton from 'components/MDButton';
import LocationCascadeSelect from 'components/MDSelect/LocationCascadeSelect';
import { addPropertyValidation } from 'validations/addPropertyValidation';
import {
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_STATUS_OPTIONS,
  ENERGY_CLASS_OPTIONS,
} from '../../constants/propertyConstants';
import { DEFAULT_VALUES_ADD_PROPERTY } from 'utils/addPropertyInitialValues';
import { mergeInitialValues } from 'utils/formUtils';

const AddPropertyBasicForm = ({ 
  initialData = {}, 
  onSubmit,
  isSubmitting = false
}) => {
  const initialValues = mergeInitialValues(initialData, DEFAULT_VALUES_ADD_PROPERTY);

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    console.log('📝 Formulaire soumis avec les valeurs:', values);
    console.log('🔍 Erreurs de validation:', setErrors);
    onSubmit(values);
  };

  return (
    <Card sx={{ p: 3 }}>
      <MDBox mb={3}>
        <Typography variant="h5" color="dark" gutterBottom>
          Create New Property
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Step 1: Basic Information
        </Typography>
      </MDBox>

      <Formik
        initialValues={initialValues}
        validationSchema={addPropertyValidation}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting: formikSubmitting, errors }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormField 
                  label="Property Title" 
                  name="title" 
                  type="text" 
                  placeholder="Ex: Modern apartment in Paris"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormFieldSelect
                  label="Property Type"
                  name="propertyType"
                  options={PROPERTY_TYPE_OPTIONS}
                  placeholder="Select property type"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormFieldSelect
                  label="Status"
                  name="status"
                  options={PROPERTY_STATUS_OPTIONS}
                  placeholder="Select status"
                  required
                />
              </Grid>

              {/* Location Section */}
              <Grid item xs={12}>
                <MDBox mb={2}>
                  <Typography variant="h6" color="dark" gutterBottom>
                    Location
                  </Typography>
                </MDBox>
                <LocationCascadeSelect
                  initialData={initialValues}
                  countryField="country"
                  stateField="state"
                  cityField="city"
                  showState={true}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormField 
                  label="Surface (sq ft)" 
                  name="surface" 
                  type="number" 
                  placeholder="Ex: 120"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormField 
                  label="Number of Bedrooms" 
                  name="bedrooms" 
                  type="number" 
                  placeholder="Ex: 3"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormField 
                  label="Number of Bathrooms" 
                  name="bathrooms" 
                  type="number" 
                  placeholder="Ex: 2"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormField 
                  label="Year Built" 
                  name="yearBuilt" 
                  type="number" 
                  placeholder="Ex: 2020"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormFieldSelect
                  label="Energy Class"
                  name="energyClass"
                  options={ENERGY_CLASS_OPTIONS}
                  placeholder="Select energy class"
                />
              </Grid>

              <Grid item xs={12}>
                <FormField 
                  label="Description" 
                  name="description" 
                  type="textarea" 
                  placeholder="Describe your property..."
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>

            <MDBox mt={4} display="flex" justifyContent="flex-end">
              <MDButton
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting || formikSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Property'}
              </MDButton>
            </MDBox>

            {/* Affichage des erreurs de validation */}
            {errors.submit && (
              <MDBox mt={2}>
                <Typography color="error" variant="body2">
                  {errors.submit}
                </Typography>
              </MDBox>
            )}
          </Form>
        )}
      </Formik>
    </Card>
  );
};

AddPropertyBasicForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool
};

export default AddPropertyBasicForm;
