import React, { useState } from 'react';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import ConfirmationCode from 'components/ConfirmationCode';

const TestConfirmation = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleConfirmationSuccess = (result) => {
    setResult(result);
    setError(null);
    setShowConfirmation(false);
  };

  const handleConfirmationError = (error) => {
    setError(error.message);
    setResult(null);
  };

  return (
    <MDBox p={3} bgcolor="warning.light" borderRadius={2}>
      <MDTypography variant="h6" color="warning.dark" mb={3}>
        🧪 Test Confirmation avec Code
      </MDTypography>

      {!showConfirmation ? (
        <MDButton
          variant="gradient"
          color="warning"
          onClick={() => setShowConfirmation(true)}
          mb={2}
        >
          🔐 Tester la confirmation avec le code 710326
        </MDButton>
      ) : (
        <ConfirmationCode
          email="souhailsouidpro@gmail.com"
          onSuccess={handleConfirmationSuccess}
          onError={handleConfirmationError}
        />
      )}

      {result && (
        <MDBox mt={3} p={2} bgcolor="success.light" borderRadius={1}>
          <MDTypography variant="h6" color="success.dark" mb={2}>
            ✅ Succès !
          </MDTypography>
          <MDTypography variant="body2" color="text.primary">
            {result.message}
          </MDTypography>
          <pre style={{ fontSize: '12px', marginTop: '10px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </MDBox>
      )}

      {error && (
        <MDBox mt={3} p={2} bgcolor="error.light" borderRadius={1}>
          <MDTypography variant="h6" color="error.dark" mb={2}>
            ❌ Erreur
          </MDTypography>
          <MDTypography variant="body2" color="error">
            {error}
          </MDTypography>
        </MDBox>
      )}
    </MDBox>
  );
};

export default TestConfirmation; 