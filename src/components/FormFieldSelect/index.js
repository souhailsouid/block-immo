import PropTypes from 'prop-types';
import { ErrorMessage, Field } from 'formik';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { FormControl } from '@mui/material';
import MDDropdowns from 'components/MDDropdowns';

const FormFieldSelect = ({ label, name, options, multiple = false, placeholder, onChange }) => {
  return (
    <MDBox mb={1.5}>
      <Field name={name}>
        {({ field, form: { errors, touched, setFieldValue } }) => {
          const handleChange = (event) => {
            if (multiple) {
              // Pour la sélection multiple, on gère un tableau
              const values = event.target.value || [];
              setFieldValue(name, values);
            } else {
              // Pour la sélection simple, on utilise le comportement normal
              field.onChange(event);
            }
            
            // Appel du onChange personnalisé si fourni
            if (onChange) {
              onChange(event);
            }
          };

          return (
            <FormControl fullWidth error={!!errors[name] && touched[name]}>
              <MDDropdowns
                {...field}
                options={options}
                value={field.value}
                placeholder={placeholder || label}
                onChange={handleChange}
                onBlur={field.onBlur}
                name={field.name}
                multiple={multiple}
              />
            </FormControl>
          );
        }}
      </Field>
      <MDBox mt={0.75}>
        <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
          <ErrorMessage name={name} />
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

FormFieldSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  multiple: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default FormFieldSelect;
 