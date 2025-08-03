// prop-type is a library for typechecking of props
import PropTypes from 'prop-types';
import { useEffect } from 'react';

// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// NewUser page components
import FormField from 'layouts/pages/users/new-user/components/FormField';
import PhoneField from 'components/PhoneField';

const UserKYCInfo = ({ formData }) => {
  const { formField, values, errors, touched, setValues, handleCheckBirthDate } = formData;
  const { firstName, lastName,  phone, birthDate } = formField;
  const { firstName: firstNameV, lastName: lastNameV, phone: phoneV, birthDate: birthDateV } = values;

  // Validation de la date de naissance avec useEffect pour éviter les boucles infinies
  useEffect(() => {
    if (birthDateV && birthDateV.length > 0 && touched.birthDate) {
      handleCheckBirthDate(birthDateV);
    }
  }, [birthDateV, touched.birthDate, handleCheckBirthDate]);

  return (
    <MDBox>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">Identity Verification</MDTypography>
        <MDTypography variant="button" color="text">
          Financial regulations require us to verify your identity before you can invest. This helps
          protect your investment and allows us to register you as the legal owner of each property
          you invest in.
        </MDTypography>
      </MDBox>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              shrink={true}
              label={firstName.label}
              name={firstName.name}
              value={firstNameV}
              placeholder={firstName.placeholder}
              error={errors.firstName && touched.firstName}
              success={firstNameV.length > 0 && !errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              shrink={true}

              label={lastName.label}
              name={lastName.name}
              value={lastNameV}
              placeholder={lastName.placeholder}
              error={errors.lastName && touched.lastName}
              success={lastNameV.length > 0 && !errors.lastName}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <PhoneField
              label={phone.label}
              value={phoneV}
              name={phone.name}
              onChange={(value) => {
                setValues({ ...values, [phone.name]: value });
              }}
              placeholder={phone.placeholder}
              error={errors.phone && touched.phone}
              success={phoneV.length > 0 && !errors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: { xs: 0, lg: 2 } }}>
            <FormField
              type="date"
              shrink={true}
              label={birthDate.label}
              name={birthDate.name}
              value={birthDateV}
              placeholder={birthDate.placeholder}
              error={errors.birthDate && touched.birthDate}
              success={birthDateV && birthDateV.length > 0 && !errors.birthDate}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
};

// typechecking props for UserInfo
UserKYCInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default UserKYCInfo;
