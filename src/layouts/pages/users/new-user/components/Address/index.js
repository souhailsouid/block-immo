// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// NewUser page components
import FormField from 'layouts/pages/users/new-user/components/FormField';

const Address = ({ formData }) => {
  const { values, touched, formField, errors, setValues } = formData;

  const { address1, city, zip } = formField;

  return (
    <MDBox>
      <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize" mb={3}>
        Address Information
      </MDTypography>
      <Grid container spacing={3}>
        {[address1, city, zip]?.map((field) => (
          <Grid item xs={12} md={6} key={field.name}>
            <FormField
              type={field.type}
              label={field.label}
              name={field.name}
              value={values[field.name] || ''}
              placeholder={field.label}
              error={errors[field.name] && touched[field.name]}
              success={values[field.name] && !errors[field.name]}
            />
          </Grid>
        ))}
      </Grid>
    </MDBox>
  );
};

Address.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default Address;
