// src/layouts/pages/account/settings/components/FractionalProfile/index.js
import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// @material-ui core components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

// Custom hooks
import { useFractionalProfile } from 'hooks/useFractionalProfile';
import { useNotification } from 'context/NotificationContext';

// Validation schema
const fractionalProfileValidation = Yup.object().shape({
    companyName: Yup.string()
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name must be less than 100 characters')
        .required('Company name is required'),
    companyType: Yup.string()
        .required('Company type is required'),
    licenseNumber: Yup.string()
        .required('License number is required'),
    experienceYears: Yup.number()
        .min(0, 'Experience years must be positive')
        .max(50, 'Experience years must be less than 50')
        .required('Experience years is required'),
    businessPhone: Yup.string()
        .matches(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
    businessEmail: Yup.string()
        .email('Invalid email format')
        .required('Business email is required'),
    website: Yup.string()
        .url('Invalid URL format'),
    officeAddress: Yup.string()
        .max(200, 'Office address must be less than 200 characters'),
    totalPropertiesListed: Yup.number()
        .min(0, 'Total properties listed must be positive'),
    activeListings: Yup.number()
        .min(0, 'Active listings must be positive'),
    averageFractionSize: Yup.number()
        .min(1, 'Minimum fraction size is 1%')
        .max(100, 'Maximum fraction size is 100%'),
    averageFractionPrice: Yup.number()
        .min(0, 'Average fraction price must be positive'),
    fractionalSpecializations: Yup.array()
        .min(1, 'At least one fractional specialization is required')
        .of(Yup.string()),
    propertyTypes: Yup.array()
        .min(1, 'At least one property type is required')
        .of(Yup.string()),
    serviceAreas: Yup.array()
        .min(1, 'At least one service area is required')
        .of(Yup.string()),
    targetMarkets: Yup.array()
        .min(1, 'At least one target market is required')
        .of(Yup.string()),
    investorTypes: Yup.array()
        .min(1, 'At least one investor type is required')
        .of(Yup.string()),
    salesMethods: Yup.array()
        .min(1, 'At least one sales method is required')
        .of(Yup.string()),
    paymentMethods: Yup.array()
        .min(1, 'At least one payment method is required')
        .of(Yup.string()),
    servicesOffered: Yup.array()
        .min(1, 'At least one service offered is required')
        .of(Yup.string())
});

const FractionalProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
  const { showNotification } = useNotification();
  const [formKey, setFormKey] = useState(0);
  const {
    fractionalProfile,
    isLoading,
    error,
    updateFractionalProfile,
    refreshProfile
  } = useFractionalProfile();

  const getInitialValues = () => {
    const safeValue = (value, defaultValue = '') => {
      if (value === null || value === undefined) return defaultValue;
      if (typeof value === 'object') {
        return defaultValue;
      }
      return String(value);
    };

    const safeNumber = (value, defaultValue = '') => {
      if (value === null || value === undefined) return defaultValue;
      if (typeof value === 'object') {
        return defaultValue;
      }
      return value;
    };

    const safeArray = (value, defaultValue = []) => {
      if (!Array.isArray(value)) return defaultValue;
      return value.map(item => {
        if (typeof item === 'object') {
          return String(item);
        }
        return item;
      });
    };

    return ({
      companyName: safeValue(fractionalProfile?.companyName),
      companyType: safeValue(fractionalProfile?.companyType, 'Fractional real estate developer'),
      licenseNumber: safeValue(fractionalProfile?.licenseNumber),
      experienceYears: safeNumber(fractionalProfile?.experienceYears),
      businessPhone: safeValue(fractionalProfile?.businessPhone),
      businessEmail: safeValue(fractionalProfile?.businessEmail),
      website: safeValue(fractionalProfile?.website),
      officeAddress: safeValue(fractionalProfile?.officeAddress),
      totalPropertiesListed: safeNumber(fractionalProfile?.totalPropertiesListed),
      activeListings: safeNumber(fractionalProfile?.activeListings),
      averageFractionSize: safeNumber(fractionalProfile?.averageFractionSize),
      averageFractionPrice: safeNumber(fractionalProfile?.averageFractionPrice),
      fractionalSpecializations: safeArray(fractionalProfile?.fractionalSpecializations, ['Residential fractional']),
      propertyTypes: safeArray(fractionalProfile?.propertyTypes, ['Apartments']),
      serviceAreas: safeArray(fractionalProfile?.serviceAreas, ['Paris']),
      targetMarkets: safeArray(fractionalProfile?.targetMarkets, ['Paris']),
      investorTypes: safeArray(fractionalProfile?.investorTypes, ['Individuals']),
      salesMethods: safeArray(fractionalProfile?.salesMethods, ['Direct sale']),
      paymentMethods: safeArray(fractionalProfile?.paymentMethods, ['Bank transfer']),
      servicesOffered: safeArray(fractionalProfile?.servicesOffered, ['Property valuation'])
    });
  };
    // Update initial values when userProfile changes
    useEffect(() => {
        if (fractionalProfile && !isEditing) {
            // Formik will automatically update with new initial values
        }
    }, [fractionalProfile, isEditing]);

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            setSubmitting(true);

            // Utiliser le nouveau service via le hook
            const response = await updateFractionalProfile(values);

            if (response.success) {
                showNotification(
                    'Success',
                    response.message || 'Fractional profile updated successfully',
                    'success',
                    { duration: 3000, autoHide: true }
                );

                setIsEditing(false);
                refreshProfile();

                setFormKey(prev => prev + 1);
            } else {
                showNotification(
                    'Error',
                    response.error || 'Failed to update fractional profile',
                    'error',
                    { duration: 5000, autoHide: true }
                );
            }

        } catch (error) {
            let errorMessage = 'Error updating fractional profile';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            showNotification(
                'Error',
                errorMessage,
                'error',
                { duration: 5000, autoHide: true }
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };
    if (error) {
        return (
          <Card id="fractional-profile" sx={{ overflow: 'visible' }}>
            <MDBox p={3}>
              <MDTypography variant="h5">Professional profile</MDTypography>
              <MDTypography variant="body2" color="error">
                Error: {error}
              </MDTypography>
              <MDButton
                variant="gradient"
                color="info"
                size="small"
                onClick={refreshProfile}
                sx={{ mt: 2 }}
              >
                Retry
              </MDButton>
            </MDBox>
          </Card>
        );
      }
    if (isLoading) {
        return (
            <Card id="professional-profile" sx={{ overflow: 'visible' }}>
                <MDBox p={3}>
                    <MDTypography variant="h5">Professional profile</MDTypography>
                    <MDTypography variant="body2" color="text">
                        Loading information...
                    </MDTypography>
                </MDBox>
            </Card>
        );
    }

    return (
        <Card id="professional-profile" sx={{ overflow: 'visible' }}>
            <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <MDTypography variant="h5">Professional profile</MDTypography>
                    <MDBox display="flex" gap={1}>
                        {!isEditing ? (
                            <MDButton
                                variant="gradient"
                                color="info"
                                size="small"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </MDButton>
                        ) : (
                            <MDButton
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={handleCancel}
                            >
                                Cancel
                            </MDButton>
                        )}
                    </MDBox>
                </MDBox>

                <Formik
                 key={formKey} // ✅
                    initialValues={getInitialValues()}
                    validationSchema={fractionalProfileValidation}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                    validateOnChange={true}
                    validateOnBlur={true}
                >
                    {({ isSubmitting, handleSubmit, values, setFieldValue }) => {
                        return (
                            <Form onSubmit={handleSubmit}>
                                <MDBox component="form" pb={3} px={3}>
                                    <Grid container spacing={3}>
                                        {/* Informations de l'entreprise */}
                                        <Grid item xs={12}>
                                            <MDTypography variant="h6" mb={2}>
                                                Company information
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="companyName">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="Company name"
                                                        placeholder="Enter your company name"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="companyType">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="Company type"
                                                        placeholder="Fractional real estate developer"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="licenseNumber">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="License number"
                                                        placeholder="Enter your license number"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="experienceYears">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="Experience years"
                                                        placeholder="Enter your experience years"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                        type="number"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>

                                        {/* Contact professionnel */}
                                        <Grid item xs={12}>
                                            <MDTypography variant="h6" mb={2} mt={3}>
                                                Contact professionnel
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="businessPhone">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="Business phone"
                                                        placeholder="Enter your business phone"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="businessEmail">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="Business email"
                                                        placeholder="Enter your business email"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="website">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="Website"
                                                        placeholder="https://your-website.com"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="officeAddress">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="Office address"
                                                        placeholder="Enter your office address"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>

                                        {/* Métriques fragmentées */}
                                        <Grid item xs={12}>
                                            <MDTypography variant="h6" mb={2} mt={3}>
                                                Fractional metrics
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="totalPropertiesListed">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="Total properties listed"
                                                        placeholder="0"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                        type="number"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="activeListings">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="Active listings"
                                                        placeholder="0"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                        type="number"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="averageFractionSize">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="Average fraction size (%)"
                                                        placeholder="25"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                        type="number"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field name="averageFractionPrice">
                                                {({ field, meta }) => (
                                                    <MDInput
                                                        {...field}
                                                        label="Average fraction price (€)"
                                                        placeholder="50000"
                                                        disabled={!isEditing}
                                                        fullWidth
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                                        variant="standard"
                                                        size="medium"
                                                        type="number"
                                                    />
                                                )}
                                            </Field>
                                        </Grid>
                                    </Grid>

                                    {/* Submit Button - Only show when editing */}
                                    {isEditing && (
                                        <MDBox mt={4} display="flex" justifyContent="flex-end">
                                            <MDButton
                                                variant="contained"
                                                color="customBlue"
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Saving...' : 'Save profile'}
                                            </MDButton>
                                        </MDBox>
                                    )}
                                </MDBox>
                            </Form>
                        )
                    }}
                </Formik>
            </MDBox>
        </Card>
    );
};

export default FractionalProfile;