import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
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

  // Status
  status: Yup.string().required('Status is required'),

  // Dates
  fundingDate: Yup.date().nullable().required('Funding date is required'),
  closingDate: Yup.date().nullable().required('Closing date is required'),

  // Investment metrics
  yearlyInvestmentReturn: Yup.number()
    .positive('Yearly investment return must be positive')
    .required('Yearly investment return is required'),

  // General information
  currency: Yup.string().required('Currency is required'),
});

const PropertyPriceForm = ({ initialData = {}, onSave, hideButtons = false, onValidationChange }) => {
  const [validationState, setValidationState] = useState({
    isValid: true,
    errors: []
  });

  // Fonction pour convertir les dates en objets Date
  const convertToDate = (dateValue) => {
    if (!dateValue) return new Date('2025-07-18');
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'string') return new Date(dateValue);
    return new Date('2025-07-18');
  };

  const initialValues = {
    // Property price
    propertyPrice: initialData.propertyPrice || 1000000,

    // Status
    status: initialData.status || 'COMMERCIALIZED',

    // Dates - Convertir les chaînes ISO en objets Date
    fundingDate: convertToDate(initialData.fundingDate),
    closingDate: convertToDate(initialData.closingDate),

    // Investment metrics
    yearlyInvestmentReturn: initialData.yearlyInvestmentReturn || 10,

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

    // Currency validation
    if (!values.currency) {
      errors.push('Currency must be selected');
    }

    // Investment return validation
    if (!values.yearlyInvestmentReturn || values.yearlyInvestmentReturn < 0) {
      errors.push('Yearly investment return must be positive');
    }



    // Date validation
    if (!values.fundingDate) {
      errors.push('Funding date is required');
    }

    if (!values.closingDate) {
      errors.push('Closing date is required');
    }
    if (values.fundingDate && values.closingDate) {
      const fundingDate = new Date(values.fundingDate);
      const closingDate = new Date(values.closingDate);

      if (fundingDate > closingDate) {
      errors.push('Funding date cannot be after closing date');
      }
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
    { value: 'COMMERCIALIZED', label: '🟢 Commercialized - Ready for investment' },
    { value: 'IN_PROGRESS', label: '🟡 In Progress - Under development' },
    { value: 'FUNDED', label: '🔴 Funded - Fully funded' },
    { value: 'SOLD', label: '🟣 Sold - Property sold' },
    { value: 'CANCELLED', label: '⚫ Cancelled - Project cancelled' },
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
              Configure the property valuation, investment metrics, and important dates for your real estate project.
            </Typography>
          </MDBox>

          <Grid container spacing={3}>
            {/* Property Price & Currency */}
            <Grid item xs={12}>
              <Card sx={{ p: 3, mb: 3 }}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <MDBox
                    width="2rem"
                    height="2rem"
                    bgColor="info"
                    variant="gradient"
                    borderRadius="lg"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    color="white"
                    mr={2}
                  >
                    💰
                  </MDBox>
                  <Typography variant="h6" color="dark">
                    Property Valuation
                </Typography>
                </MDBox>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormField
                      label="Property Price"
                      name="propertyPrice"
                      type="number"
                      placeholder="1,000,000"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormFieldSelect 
                      label="Currency" 
                      name="currency" 
                      options={currencies}
                      required
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Investment Metrics */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, mb: 3 }}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <MDBox
                    width="2rem"
                    height="2rem"
                    bgColor="success"
                    variant="gradient"
                    borderRadius="lg"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    color="white"
                    mr={2}
                  >
                    📈
                  </MDBox>
                  <Typography variant="h6" color="dark">
                    Investment Metrics
                </Typography>
                </MDBox>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormField
                      label="Yearly Investment Return (%)"
                      name="yearlyInvestmentReturn"
                      type="number"
                      placeholder="10"
                      required
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Important Dates */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, mb: 3 }}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <MDBox
                    width="2rem"
                    height="2rem"
                    bgColor="warning"
                    variant="gradient"
                    borderRadius="lg"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    color="white"
                    mr={2}
                  >
                    📅
                  </MDBox>
                  <Typography variant="h6" color="dark">
                    Important Dates
                </Typography>
                </MDBox>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field name="fundingDate">
                      {({ field, form }) => (
                    <MDDatePicker
                          label="Funding Date"
                      name="fundingDate"
                          placeholder="Select funding date"
                          required
                          value={field.value}
                          onChange={(e) => {
                            form.setFieldValue('fundingDate', e.target.value);
                          }}
                          onBlur={field.onBlur}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="closingDate">
                      {({ field, form }) => (
                    <MDDatePicker
                          label="Closing Date"
                      name="closingDate"
                          placeholder="Select closing date"
                          required
                          value={field.value}
                          onChange={(e) => {
                            form.setFieldValue('closingDate', e.target.value);
                          }}
                          onBlur={field.onBlur}
                        />
                      )}
                    </Field>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <MDBox
                    width="2rem"
                    height="2rem"
                    bgColor="secondary"
                    variant="gradient"
                    borderRadius="lg"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    color="white"
                    mr={2}
                  >
                    🏷️
                  </MDBox>
                  <Typography variant="h6" color="dark">
                    Project Status
                </Typography>
                </MDBox>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormFieldSelect
                      label="Status"
                      name="status"
                      options={statusOptions}
                      disabled={false}
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
                {isSubmitting ? 'Saving...' : 'Save Property Pricing'}
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
