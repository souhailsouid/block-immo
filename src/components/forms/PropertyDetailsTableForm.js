import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';

import MDBox from 'components/MDBox';
import { Grid } from '@mui/material';
import MDButton from 'components/MDButton';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import LocationCascadeSelect from 'components/MDSelect/LocationCascadeSelect';
import { propertyDetailsTableValidation } from 'validations';
import { onSubmitForm } from 'utils/validateForms';
import { mergeInitialValues } from 'utils/formUtils';
import { DEFAULT_VALUES_PROPERTY_DETAILS_TABLE } from 'utils/formInitialValues';
import { useNotification } from 'context/NotificationContext';

const PropertyDetailsTableForm = ({ initialData = {}, onSave }) => {
  const initialValues = mergeInitialValues(initialData, DEFAULT_VALUES_PROPERTY_DETAILS_TABLE);
  const { showNotification } = useNotification();
  const validateBusinessRules = (values) => {
    const errors = [];

    // Règle métier 1: Brut yield >= Net yield
    if (values.brutYield && values.netYield) {
      const brutYield = parseFloat(values.brutYield);
      const netYield = parseFloat(values.netYield);

      if (brutYield < netYield) {
        errors.push('Le rendement brut ne peut pas être inférieur au rendement net');
      }
    }

    // Règle métier 2: Price per square foot > 0
    if (values.pricePerSquareFoot) {
      const price = parseFloat(values.pricePerSquareFoot);
      if (price <= 0) {
        errors.push('Le prix au pied carré doit être supérieur à 0');
      }
    }

    // Règle métier 3: Country et City requis
    if (!values.country || !values.city) {
      errors.push('Le pays et la ville sont requis');
    }

    // Règle métier 4: Yields dans des limites raisonnables
    if (values.brutYield) {
      const brutYield = parseFloat(values.brutYield);
      if (brutYield > 50) {
        errors.push('Le rendement brut semble trop élevé (>50%). Veuillez vérifier.');
      }
    }

    return errors;
  };
  const businessErrors = initialValues ? validateBusinessRules(initialValues) : [];
  // Afficher la première erreur métier
  if (businessErrors && businessErrors.length > 0) {
    // Afficher la première erreur métier
    showNotification(
      'Erreur de validation métier',
      businessErrors[0],
      { persistent: true }
    );
    return;
  }
  // 🎯 NOUVEAU : Configuration spécifique pour ce formulaire
  const formConfig = {
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: (values) => {
      // Validation spécifique pour les yields
      if (values.brutYield && values.netYield && values.brutYield < values.netYield) {

        showNotification(
          'Business Validation Error',
          'Brut yield cannot be less than net yield',
          'error',
          { duration: 3000, autoHide: true }
        );

        return;

      }
      if (values.pricePerSquareFoot && values.pricePerSquareFoot <= 0) {
        showNotification(
          'Business Validation Error',
          'Price per square foot must be greater than 0',
          { persistent: true, type: 'error' }
        );
        return;
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
      validationSchema={propertyDetailsTableValidation}
      onSubmit={handleSubmit}
      enableReinitialize
    >

      {({ isSubmitting, handleSubmit }) => {

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
                  label="Price per Square Foot"
                  name="pricePerSquareFoot"
                  type="number"
                  step="0.01"
                  placeholder="Enter price per square foot"
                />
              </Grid>

            </Grid>
            {/* Affichage des erreurs de soumission */}

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

PropertyDetailsTableForm.propTypes = {
  initialData: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default PropertyDetailsTableForm;
