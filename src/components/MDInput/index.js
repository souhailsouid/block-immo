import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for MDInput
import MDInputRoot from "components/MDInput/MDInputRoot";

const MDInput = forwardRef(({ error = false, success = false, disabled = false, shrink = false, placeholder, ...rest }, ref) => {
  const inputLabelProps = shrink ? { shrink: true } : {};
  
  return (
    <MDInputRoot 
      {...rest} 
      ref={ref} 
      placeholder={placeholder}
      InputLabelProps={inputLabelProps}
      ownerState={{ error, success, disabled, shrink }} 
    />
  );
});

// Typechecking props for the MDInput
MDInput.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
  shrink: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default MDInput;
