// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 3 PRO React components
import MDInput from "components/MDInput";

const FormField = ({ label = " ", ...rest }) => {
  return (
    <MDInput
      variant="standard"
      label={label}
      fullWidth
      InputLabelProps={{ shrink: true }}
      {...rest}
    />
  );
}

// Typechecking props for FormField
FormField.propTypes = {
  label: PropTypes.string,
};

export default FormField;
