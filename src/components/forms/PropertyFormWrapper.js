import React, { useState } from 'react';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import { Alert, Chip } from '@mui/material';
import { CheckCircle, Error, Info } from '@mui/icons-material';

const PropertyFormWrapper = ({ 
  children, 
  onSave, 
  onCancel, 
  onStepComplete,
  onPrevious,
  isLastStep = false,
  stepTitle = "Step",
  stepDescription = "Complete this step to continue",
  requirements = [],
  isStepValid = true,
  validationErrors = []
}) => {
  const [showValidation, setShowValidation] = useState(false);

  const handleSave = (formData) => {
    if (!isStepValid) {
      setShowValidation(true);
      return;
    }
    if (onSave) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
  };

  const handleStepComplete = (formData) => {
    if (!isStepValid) {
      setShowValidation(true);
      return;
    }
    if (onStepComplete) {
      onStepComplete(formData);
    }
  };

  const handleNext = () => {
    if (!isStepValid) {
      setShowValidation(true);
      return;
    }
    handleSave({});
  };

  return (
    <MDBox>
      {/* Step Header */}
      <MDBox mb={3}>
        <h3 style={{ margin: 0, color: '#344767', fontSize: '1.25rem' }}>
          {stepTitle}
        </h3>
        <p style={{ margin: '8px 0 0 0', color: '#67748e', fontSize: '0.875rem' }}>
          {stepDescription}
        </p>
      </MDBox>

      {/* Requirements Section */}
      {requirements.length > 0 && (
        <MDBox mb={3}>
          <Alert severity="info" icon={<Info />}>
            <MDBox>
              <strong>Requirements for this step:</strong>
              <MDBox mt={1} display="flex" flexWrap="wrap" gap={1}>
                {requirements.map((req, index) => (
                  <Chip
                    key={index}
                    label={req}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                ))}
              </MDBox>
            </MDBox>
          </Alert>
        </MDBox>
      )}

      {/* Validation Errors */}
      {showValidation && validationErrors.length > 0 && (
        <MDBox mb={3}>
          <Alert severity="error" icon={<Error />}>
            <MDBox>
              <strong>Please fix the following errors:</strong>
              <MDBox mt={1} component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                {validationErrors.map((error, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    {error}
                  </li>
                ))}
              </MDBox>
            </MDBox>
          </Alert>
        </MDBox>
      )}

      {/* Form Content */}
      <MDBox mb={3}>
        {React.cloneElement(children, {
          onSave: handleSave,
          onCancel: handleCancel,
          onStepComplete: handleStepComplete,
          isLastStep,
          hideButtons: true, // Hide buttons from individual forms
          onValidationChange: (isValid, errors) => {
            // This will be called by child forms to update validation state
          }
        })}
      </MDBox>

      {/* Step Actions - Clean and simple */}
      <MDBox display="flex" justifyContent="space-between" mt={3}>
        <MDButton
          variant="outlined"
          color="secondary"
          onClick={handlePrevious}
        >
          Previous
        </MDButton>
        
        <MDBox display="flex" gap={2} alignItems="center">
          {/* Validation Status */}
          {!isStepValid && (
            <Chip
              icon={<Error />}
              label="Validation Required"
              color="error"
              size="small"
            />
          )}
          
          <MDButton
            variant="outlined"
            color="info"
            onClick={() => handleStepComplete({})}
            disabled={!isStepValid}
          >
            Save Step
          </MDButton>
          <MDButton
            variant="contained"
            color="customBlue"
            onClick={handleNext}
            disabled={!isStepValid}
            startIcon={isStepValid ? <CheckCircle /> : null}
          >
            {isLastStep ? 'Create Property' : 'Next'}
          </MDButton>
        </MDBox>
      </MDBox>
    </MDBox>
  );
};

export default PropertyFormWrapper; 