import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import { Grid, Card, Typography } from '@mui/material';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import FormFieldSelect from 'components/FormFieldSelect';
import MDDatePicker from 'components/MDDatePicker';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
  // Property price
  propertyPrice: Yup.number()
    .positive('Property price must be positive')
    .required('Property price is required'),

  // Funding
  numberOfInvestors: Yup.number()
    .positive('Number of investors must be positive')
    .required('Number of investors is required'),

  // Status
  status: Yup.string().required('Status is required'),

  // Dates
  fundingDate: Yup.date().required('Funding date is required'),
  closingDate: Yup.date().required('Closing date is required'),

  // Investment metrics
  yearlyInvestmentReturn: Yup.number()
    .positive('Yearly investment return must be positive')
    .required('Yearly investment return is required'),
  currentValuation: Yup.number()
    .positive('Current valuation must be positive')
    .required('Current valuation is required'),

  // General information
  currency: Yup.string().required('Currency is required'),
});

const PropertyPriceForm = ({ initialData = {}, onSave, hideButtons = false, onValidationChange }) => {
  const [validationState, setValidationState] = useState({
    isValid: true,
    errors: []
  });

  const initialValues = {
    // Property price
    propertyPrice: initialData.propertyPrice || 1000000,

    // Funding
    numberOfInvestors: initialData.numberOfInvestors || 534,

    // Status
    status: initialData.status || 'closed',

    // Dates
    fundingDate: initialData.fundingDate || new Date('2025-07-18'),
    closingDate: initialData.closingDate || new Date('2025-07-18'),

    // Investment metrics
    yearlyInvestmentReturn: initialData.yearlyInvestmentReturn || 10,
    currentValuation: initialData.currentValuation || 1010000,

    // General information
    currency: initialData.currency || 'USD',
  };

  // Custom validation function
  const validateForm = (values) => {
    const errors = [];

    // Property price validation
    if (!values.propertyPrice || values.propertyPrice <= 0) {
      errors.push('Property price must be greater than 0');
    }

    // Number of investors validation
    if (!values.numberOfInvestors || values.numberOfInvestors <= 0) {
      errors.push('Number of investors must be greater than 0');
    }

    // Currency validation
    if (!values.currency) {
      errors.push('Currency must be selected');
    }

    // Investment return validation
    if (!values.yearlyInvestmentReturn || values.yearlyInvestmentReturn < 0) {
      errors.push('Yearly investment return must be positive');
    }

    // Current valuation validation
    if (!values.currentValuation || values.currentValuation <= 0) {
      errors.push('Current valuation must be greater than 0');
    }

    // Date validation
    if (!values.fundingDate) {
      errors.push('Funding date is required');
    }

    if (!values.closingDate) {
      errors.push('Closing date is required');
    }

    if (values.fundingDate && values.closingDate && values.fundingDate > values.closingDate) {
      errors.push('Funding date cannot be after closing date');
    }

    const isValid = errors.length === 0;
    
    setValidationState({ isValid, errors });
    
    if (onValidationChange) {
      onValidationChange(isValid, errors);
    }

    return isValid;
  };

  const currencies = [
    { value: 'USD', label: 'Dollar US ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'Livre Sterling (£)' },
    { value: 'CHF', label: 'Franc Suisse (CHF)' },
    { value: 'AED', label: 'Dirham (AED)' },
  ];

  const statusOptions = [
    { value: 'open', label: '🟢 Open' },
    { value: 'funding', label: '🟡 Funding' },
    { value: 'closed', label: '🔴 Closed' },
    { value: 'sold', label: '🟣 Sold' },
    { value: 'cancelled', label: '⚫ Cancelled' },
  ];

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
      {({ isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <MDBox mb={3}>
            <Typography variant="body2" color="textSecondary">
              Configure property price and funding information.
            </Typography>
          </MDBox>

          <Grid container spacing={3}>
            {/* Property price */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Property price
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormField
                      label="Property price"
                      name="propertyPrice"
                      type="number"
                      placeholder="1000000"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormFieldSelect label="Currency" name="currency" options={currencies} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Funding */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Funding
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormField
                      label="Number of investors"
                      name="numberOfInvestors"
                      type="number"
                      placeholder="534"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormFieldSelect
                      label="Status"
                      name="status"
                      options={statusOptions}
                      disabled={true}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Important dates */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Important dates
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MDDatePicker
                      label="Funding date"
                      name="fundingDate"
                      placeholder="Funding date"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MDDatePicker
                      label="Closing date"
                      name="closingDate"
                      placeholder="Closing date"
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Investment metrics */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Investment metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormField
                      label="Yearly investment return (%)"
                      name="yearlyInvestmentReturn"
                      type="number"
                      placeholder="10"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      label="Current valuation"
                      name="currentValuation"
                      type="number"
                      placeholder="1010000"
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          {/* Submit Buttons - Only show if not hidden */}
          {!hideButtons && (
            <MDBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
              <MDButton variant="outlined" color="secondary" onClick={() => onSave(null)}>
                Cancel
              </MDButton>
              <MDButton variant="contained" color="customBlue" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Price Details'}
              </MDButton>
            </MDBox>
          )}
        </Form>
      )}
    </Formik>
  );
};

PropertyPriceForm.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func,
  hideButtons: PropTypes.bool,
};

export default PropertyPriceForm;
