import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import MDBox from 'components/MDBox';
import { Grid, Card, Typography } from '@mui/material';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import MDButton from 'components/MDButton';
import * as Yup from 'yup';
import { onSubmitForm } from 'utils/validateForms';
import { mergeInitialValues } from 'utils/formUtils';

const validationSchema = Yup.object().shape({
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  postalCode: Yup.string().required('Postal code is required'),
});

const DEFAULT_VALUES = {
  address: '',
  city: '',
  country: '',
  postalCode: '',
  state: '',
  locationDescription: ''
};

const SimpleLocationForm = ({ 
  initialData = {}, 
  onSave, 
  onCancel, 
  onStepComplete,
  stepIndex,
  isLastStep = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const initialValues = mergeInitialValues(initialData, DEFAULT_VALUES);

  const formConfig = {
    cleanFields: ['updatedAt', 'createdAt', 'propertyId', 'PK', 'SK'],
    validate: (values) => {
      return null;
    }
  };

  useEffect(() => {
    setFormKey(prev => prev + 1);
  }, [initialData]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsLoading(true);
    try {
      // NE PLUS APPELER onStepComplete automatiquement
      // Les données sont maintenant sauvegardées seulement via "Save Progress"
      :', values);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <MDBox mb={3}>
        <Typography variant="h6" color="dark">
          Step {stepIndex + 1}: Location Details
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Set the property location and address
        </Typography>
      </MDBox>

      <Formik
        key={formKey}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, handleSubmit, values }) => (
          <Form onSubmit={handleSubmit} data-step={stepIndex}>
            {/* Bouton submit caché pour déclenchement externe */}
            <button type="submit" style={{ display: 'none' }} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormField 
                  label="Address" 
                  name="address" 
                  type="text" 
                  placeholder="Ex: 123 Main Street"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormField 
                  label="City" 
                  name="city" 
                  type="text" 
                  placeholder="Ex: Paris"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormField 
                  label="Country" 
                  name="country" 
                  type="text" 
                  placeholder="Ex: France"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormField 
                  label="Postal Code" 
                  name="postalCode" 
                  type="text" 
                  placeholder="Ex: 75001"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormField 
                  label="State/Province" 
                  name="state" 
                  type="text" 
                  placeholder="Ex: Île-de-France"
                />
              </Grid>

              <Grid item xs={12}>
                <FormField 
                  label="Location Description" 
                  name="locationDescription" 
                  type="text" 
                  placeholder="Ex: Central location near metro station"
                />
              </Grid>
            </Grid>

            {/* Debug: Show current values */}
            <MDBox mt={3} p={2} bgcolor="grey.100" borderRadius={1}>
              <Typography variant="caption" color="textSecondary">
                Debug - Current values: {JSON.stringify(values, null, 2)}
              </Typography>
            </MDBox>

          </Form>
        )}
      </Formik>
    </Card>
  );
};

SimpleLocationForm.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  stepIndex: PropTypes.number.isRequired,
  isLastStep: PropTypes.bool
};

export default SimpleLocationForm; 
 