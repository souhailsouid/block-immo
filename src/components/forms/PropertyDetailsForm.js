import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';
import MDBox from 'components/MDBox';
import { Grid, TextField } from '@mui/material';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import FormFieldSelect from 'components/FormFieldSelect';
import MDButton from 'components/MDButton';
import { propertyDetailsValidation } from 'validations';
import { onSubmitForm } from 'utils/validateForms';
import {
  PROPERTY_TYPE_OPTIONS,
  ENERGY_CLASS_OPTIONS,
} from 'constants/propertyConstants';
import { DEFAULT_VALUES_PROPERTY_DETAILS } from 'utils/formInitialValues';
import { mergeInitialValues } from 'utils/formUtils';

const PropertyDetailsForm = ({ initialData = {}, onSave, onCancel }) => {

  const initialValues = mergeInitialValues(initialData, DEFAULT_VALUES_PROPERTY_DETAILS);
  const formConfig = {
    cleanFields: ['updatedAt', 'createdAt', 'propertyId', 'PK', 'SK'],
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
      validationSchema={propertyDetailsValidation}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormField label="Property Title" name="title" type="text" />
              </Grid>

              <Grid item xs={12}>
                <MDBox mb={1.5}>
                <FormField label="Description" name="description" type="text" multiline rows={4} />
                </MDBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormFieldSelect
                  label="Property Type"
                  name="propertyType"
                  options={PROPERTY_TYPE_OPTIONS}
                  placeholder="Property Type"
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
                  options={ENERGY_CLASS_OPTIONS}
                  placeholder="Energy Class"
                />
              </Grid>
            </Grid>

            {/* Bouton de soumission */}
            <MDBox mt={3} px={2} display="flex" justifyContent="flex-end" gap={2}>
              <MDButton
                variant="outlined"
                color="secondary"
                onClick={onCancel}
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

PropertyDetailsForm.propTypes = {
  initialData: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PropertyDetailsForm;
