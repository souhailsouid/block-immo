import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FormValidationManager = ({ 
  children, 
  validationSchema, 
  initialValues, 
  onValidationChange,
  requirements = []
}) => {
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState(initialValues);

  // Validate form data against requirements
  const validateRequirements = (data) => {
    const newErrors = [];
    
    requirements.forEach(requirement => {
      // Simple requirement checking - can be extended
      if (requirement.includes('required') && !data[requirement.split(' ')[0]]) {
        newErrors.push(requirement);
      }
    });

    return newErrors;
  };

  // Validate using Yup schema if provided
  const validateWithSchema = async (data) => {
    if (!validationSchema) return [];
    
    try {
      await validationSchema.validate(data, { abortEarly: false });
      return [];
    } catch (validationError) {
      return validationError.errors;
    }
  };

  // Combined validation
  const validateForm = async (data) => {
    const requirementErrors = validateRequirements(data);
    const schemaErrors = await validateWithSchema(data);
    
    const allErrors = [...requirementErrors, ...schemaErrors];
    const valid = allErrors.length === 0;
    
    setIsValid(valid);
    setErrors(allErrors);
    
    if (onValidationChange) {
      onValidationChange(valid, allErrors);
    }
    
    return valid;
  };

  // Validate on form data change
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      validateForm(formData);
    }
  }, [formData]);

  // Pass validation state to children
  const childrenWithValidation = React.cloneElement(children, {
    formData,
    setFormData,
    isValid,
    errors,
    validateForm
  });

  return childrenWithValidation;
};

FormValidationManager.propTypes = {
  children: PropTypes.node.isRequired,
  validationSchema: PropTypes.object,
  initialValues: PropTypes.object,
  onValidationChange: PropTypes.func,
  requirements: PropTypes.arrayOf(PropTypes.string)
};

export default FormValidationManager; 