import ReactPhoneInput from 'react-phone-input-mui';
import { styled } from '@mui/material/styles';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import { ErrorMessage } from 'formik';

// Styled components avec le même style que MDInput
const StyledPhoneInput = styled(MDInput)(({ theme, ownerState }) => {
  const { palette, functions } = theme;
  const { error, success, disabled } = ownerState;

  const { grey, transparent, error: colorError, success: colorSuccess } = palette;
  const { pxToRem } = functions;

  // styles for the input with error={true}
  const errorStyles = () => ({
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23F44335' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='4.5'/%3E%3Cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3E%3Ccircle cx='6' cy='8.2' r='.6' fill='%23F44335' stroke='none'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `right ${pxToRem(12)} center`,
    backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,

    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline, &:after': {
        borderColor: colorError.main,
      },
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: colorError.main,
      fontSize: '12px',
    },
    '& .MuiFormHelperText-root': {
      color: colorError.main,
      fontSize: '12px !important',
    },
  });

  // styles for the input with success={true}
  const successStyles = () => ({
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 8'%3E%3Cpath fill='%234CAF50' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `right ${pxToRem(12)} center`,
    backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,

    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline, &:after': {
        borderColor: colorSuccess.main,
      },
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: colorSuccess.main,
    },
  });

  return {
    backgroundColor: disabled ? `${grey[200]} !important` : transparent.main,
    pointerEvents: disabled ? 'none' : 'auto',
    ...(error && errorStyles()),
    ...(success && successStyles()),
  };
});

const PhoneField = ({ label, value, name, defaultCountry = 'fr', onChange, error, ...rest }) => {
  return (
    <MDBox
      mb={1.5}
      sx={{
        // Styles pour ReactPhoneInput
        '& .react-tel-input': {
          '& .MuiGrid-root > .MuiGrid-item': {
            padding: '0 !important',
          },
          '& .MuiGrid-container': {
            margin: '0 !important',
          },
          '& .MuiGrid-item': {
            padding: '0 !important',
          },
        },
      }}
    >
      <ReactPhoneInput
        value={value}
        name={name}
        onChange={onChange}
        defaultCountry={defaultCountry}
        component={StyledPhoneInput}
        inputExtraProps={{
          paddingTop: 30,
          label: label,
          variant: 'standard',
          fullWidth: true,
          error: !!error,
          success: !error && value && value.length > 10, // Succès si numéro valide
          helperText: error || '',
          margin: 'normal',
          autoComplete: 'tel',
          name: 'phone',
          ownerState: {
            error: !!error,
            success: !error && value && value.length > 10,
            disabled: false,
          },
        }}
        sx={{
          '& .MuiGrid-root > .MuiGrid-item': {
            padding: '0 !important',
          },
          '& .MuiGrid-container': {
            margin: '0 !important',
          },
        }}
      />
      <MDBox mt={-0.5}>
        <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
          <ErrorMessage name={name} />
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default PhoneField;
