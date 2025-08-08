/* eslint-disable no-undef */
import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// @material-ui core components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

// Settings page components
import FormField from 'layouts/pages/account/components/FormField';
import BasicInfoSkeleton from './BasicInfoSkeleton';

// User profile hook
import { useUserProfileDynamo } from 'hooks/useUserProfileDynamo';
import { useUserProfile } from 'hooks/useUserProfile';

// Profile service
import { profileService } from 'services/api/modules/auth/profileService';

// Notification context
import { useNotification } from 'context/NotificationContext';

// Data
import selectData from 'layouts/pages/account/settings/components/BasicInfo/data/selectData';

// Validation schema
const basicInfoValidation = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format'),
  location: Yup.string()
    .max(100, 'Location must be less than 100 characters'),
  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender'),
  birthMonth: Yup.string().required('Birth month is required'),
  birthDay: Yup.string().required('Birth day is required'),
  birthYear: Yup.string().required('Birth year is required'),
  languages: Yup.array()
    .min(1, 'At least one language must be selected')
    .of(Yup.string())
});

const BasicInfo = () => {
  const { 
    userProfile, 
    isLoading, 
    updateProfile,
    refreshProfile 
  } = useUserProfileDynamo();
  const { userProfile: userProfileHook } = useUserProfile();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);

  // Initial values for Formik
  const getInitialValues = () => {
    // Fonction pour extraire les composants de la date
    const parseBirthDate = (birthDate) => {
      if (!birthDate) return { month: 'January', day: '1', year: '1990' };
      
      try {
        const date = new Date(birthDate);
        if (isNaN(date.getTime())) return { month: 'January', day: '1', year: '1990' };
        
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        return {
          month: months[date.getMonth()] || 'January',
          day: date.getDate().toString(),
          year: date.getFullYear().toString()
        };
      } catch (error) {
        return { month: 'January', day: '1', year: '1990' };
      }
    };

    const birthDateComponents = parseBirthDate(userProfile?.birthDate);
    return ({
      firstName: userProfile?.firstName || userProfileHook?.firstName || '',
      lastName: userProfile?.lastName || userProfileHook?.lastName || '',
      email: userProfile?.email || '',
      location: userProfile?.location || '',
      phone: userProfile?.phone || '',
      gender: userProfile?.gender || 'Male',
      birthMonth: birthDateComponents.month,
      birthDay: birthDateComponents.day,
      birthYear: birthDateComponents.year,
      languages: Array.isArray(userProfile?.languages) ? userProfile.languages : ['English']
    });
  };

  // Update initial values when userProfile changes
  useEffect(() => {
    if (userProfile && !isEditing) {
      // Formik will handle the update automatically
    }
  }, [userProfile, isEditing]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setSubmitting(true);

      // Convert birth date components to ISO string
      const getMonthNumber = (monthName) => {
        const months = {
          'January': '01', 'February': '02', 'March': '03', 'April': '04',
          'May': '05', 'June': '06', 'July': '07', 'August': '08',
          'September': '09', 'October': '10', 'November': '11', 'December': '12'
        };
        return months[monthName] || '01';
      };

      const birthDate = `${values.birthYear}-${getMonthNumber(values.birthMonth)}-${values.birthDay.padStart(2, '0')}`;

      const profileData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        location: values.location,
        phone: values.phone,
        gender: values.gender,
        birthDate: birthDate,
        languages: values.languages
      };

      // Appeler la Lambda pour mettre à jour DynamoDB
      const response = await profileService.updateUserProfile(profileData);

      if (response.success) {
        // Mettre à jour le localStorage
        const updatedProfile = {
          ...(userProfile || {}),
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          fullName: `${values.firstName} ${values.lastName}`.trim(),
          location: values.location,
          phone: values.phone,
          gender: values.gender,
          birthDate: birthDate,
          languages: values.languages
        };

        updateProfile(updatedProfile);
        
        // Rafraîchir le profil depuis DynamoDB
        await refreshProfile();
        
        showNotification(
          'Success',
          response.message || 'Profile updated successfully',
          'success',
          { duration: 3000, autoHide: true }
        );
        
        setIsEditing(false);
      } else {
        showNotification(
          'Error',
          response.error || 'Failed to update profile',
          'error',
          { duration: 5000, autoHide: true }
        );
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      
      let errorMessage = 'Error updating profile';
      
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

  // Fonction utilitaire pour convertir le mois en numéro
  const getMonthNumber = (monthName) => {
    const months = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    return months[monthName] || '01';
  };

  if (isLoading) {
    return <BasicInfoSkeleton />;
  }

  return (
    <Card id="basic-info" sx={{ overflow: 'visible' }}>
      <MDBox p={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDTypography variant="h5">Profile information</MDTypography>
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
          initialValues={getInitialValues()}
          validationSchema={basicInfoValidation}
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
                  <Grid item xs={12} sm={6}>
                  <Field name="firstName">
                      {({ field, meta }) => (
                        <MDInput
                          {...field}
                          label="First Name"
                          placeholder="Enter your first name"
                          disabled={!isEditing}
                          fullWidth
                          error={meta.touched && meta.error}
                          helperText={meta.touched && meta.error ? meta.error : ''}
                          variant="standard"
                          size="medium"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: meta.touched && meta.error ? '#d32f2f' : '#e0e0e0',
                              },
                              '&:hover fieldset': {
                                borderColor: meta.touched && meta.error ? '#d32f2f' : '#bdbdbd',
                              },
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Field name="lastName">
                        {({ field, meta }) => (
                          <MDInput
                            {...field}
                            label="Last Name"
                            placeholder="Enter your last name"
                            disabled={!isEditing}
                            fullWidth
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error ? meta.error : ''}
                            variant="standard"
                            size="medium"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: meta.touched && meta.error ? '#d32f2f' : '#e0e0e0',
                                },
                                '&:hover fieldset': {
                                  borderColor: meta.touched && meta.error ? '#d32f2f' : '#bdbdbd',
                                },
                              },
                            }}
                          />
                        )}
                      </Field>
                    </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Autocomplete
                          value={values.gender}
                          options={selectData.gender}
                          onChange={(event, newValue) => setFieldValue('gender', newValue)}
                          disabled={!isEditing}
                          renderInput={(params) => (
                            <FormField {...params} label="Gender" InputLabelProps={{ shrink: true }} />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={5}>
                            <Autocomplete
                              value={values.birthMonth}
                              options={selectData.birthDate}
                              onChange={(event, newValue) => setFieldValue('birthMonth', newValue)}
                              disabled={!isEditing}
                              renderInput={(params) => (
                                <FormField
                                  {...params}
                                  label="Birth month"
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Autocomplete
                              value={values.birthDay}
                              options={selectData.days}
                              onChange={(event, newValue) => setFieldValue('birthDay', newValue)}
                              disabled={!isEditing}
                              renderInput={(params) => (
                                <FormField {...params} InputLabelProps={{ shrink: true }} />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Autocomplete
                              value={values.birthYear}
                              options={selectData.years}
                              onChange={(event, newValue) => setFieldValue('birthYear', newValue)}
                              disabled={!isEditing}
                              renderInput={(params) => (
                                <FormField {...params} InputLabelProps={{ shrink: true }} />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <Field name="email">
                      {({ field, meta }) => (
                        <MDInput
                          {...field}
                          label="Email"
                          placeholder="Enter your email"
                          disabled={true} // Email should not be editable
                          fullWidth
                          error={meta.touched && meta.error}
                          helperText={meta.touched && meta.error ? meta.error : ''}
                          variant="standard"
                          size="medium"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f5f5f5',
                              '& fieldset': {
                                borderColor: '#e0e0e0',
                              },
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <Field name="location">
                      {({ field, meta }) => (
                        <MDInput
                          {...field}
                          label="Location"
                          placeholder="Enter your location"
                          disabled={!isEditing}
                          fullWidth
                          error={meta.touched && meta.error}
                          helperText={meta.touched && meta.error ? meta.error : ''}
                          variant="standard"
                          size="medium"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: meta.touched && meta.error ? '#d32f2f' : '#e0e0e0',
                              },
                              '&:hover fieldset': {
                                borderColor: meta.touched && meta.error ? '#d32f2f' : '#bdbdbd',
                              },
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <Field name="phone">
                      {({ field, meta }) => (
                        <MDInput
                          {...field}
                          label="Phone"
                          placeholder="Enter your phone number"
                          disabled={!isEditing}
                          fullWidth
                          error={meta.touched && meta.error}
                          helperText={meta.touched && meta.error ? meta.error : ''}
                          variant="standard"
                          size="medium"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: meta.touched && meta.error ? '#d32f2f' : '#e0e0e0',
                              },
                              '&:hover fieldset': {
                                borderColor: meta.touched && meta.error ? '#d32f2f' : '#bdbdbd',
                              },
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12} md={6}></Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="h6">Languages</MDTypography>
                    <Autocomplete
                      label="Languages"
                      multiple
                      value={values.languages}
                      onChange={(event, newValue) => setFieldValue('languages', newValue)}
                      options={selectData.languages}
                      disabled={!isEditing}
                      renderInput={(params) => <FormField {...params} InputLabelProps={{ shrink: true }} />}
                    />
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
                    {isSubmitting ? 'Saving...' : 'Save Profile'}
                  </MDButton>
                </MDBox>
                )}
              </MDBox>
            </Form>
          )}}
        </Formik>
      </MDBox>
    </Card>
  );
};

export default BasicInfo;
