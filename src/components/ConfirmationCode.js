import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import authService from 'services/authService';

const ConfirmationCode = ({ email, onSuccess, onError }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const schema = Yup.object().shape({
    code: Yup.string()
      .min(1, 'Confirmation code is required')
      .required('Confirmation code is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleConfirmation = async (data) => {
    try {
      setLoading(true);
      
      // Appeler le service pour confirmer l'inscription
      const result = await authService.confirmRegistration(email, data.code);
      
      if (onSuccess) {
        onSuccess(result);
      } else {
        // Redirection par défaut
        navigate('/authentication/sign-in/illustration');
      }
      
    } catch (error) {
      setError('root', { 
        type: 'manual', 
        message: error.message || 'Error during confirmation' 
      });
      
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      
      const result = await authService.resendConfirmationCode(email);
      
      // Afficher un message de succès
      alert('Code confirmation resent successfully!');
      
    } catch (error) {
      alert('Error during resend code: ' + error.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <MDBox p={3} bgcolor="success.light" borderRadius={2}>
      <MDTypography variant="h5" color="success.dark" mb={3} textAlign="center">
        📧 Confirmation of your account
      </MDTypography>
      
      <MDTypography variant="body2" color="text.secondary" mb={3}>
        Please enter the confirmation code sent to your email:
      </MDTypography>

      <MDBox component="form" onSubmit={handleSubmit(handleConfirmation)}>
        <MDBox mb={2}>
          <MDInput
            type="text"
            label="Confirmation code"
            fullWidth
            placeholder="710326"
            {...register('code')}
            error={!!errors.code}
            helperText={errors.code?.message}
            inputProps={{
              style: { textAlign: 'center', fontSize: '18px', letterSpacing: '2px' }
            }}
          />
        </MDBox>

        {errors.root && (
          <MDBox mb={2} p={2} bgcolor="error.light" borderRadius={1}>
            <MDTypography variant="body2" color="error">
              {errors.root.message}
            </MDTypography>
          </MDBox>
        )}

        <MDBox mt={3}>
          <MDButton
            variant="gradient"
            color="success"
            size="large"
            fullWidth
            type="submit"
            disabled={loading}
          >
            {loading ? 'Confirmation...' : 'Confirm account'}
          </MDButton>
        </MDBox>

        <MDBox mt={2} textAlign="center">
          <MDButton
            variant="text"
            color="info"
            size="small"
            onClick={handleResendCode}
            disabled={resendLoading}
          >
            {resendLoading ? 'Sending...' : 'Resend code'}
          </MDButton>
        </MDBox>
      </MDBox>

      <MDBox mt={2} textAlign="center">
        <MDTypography variant="body2" color="text.secondary">
          Email: {email}
        </MDTypography>
        <MDTypography variant="body2" color="text.secondary" mt={1}>
          Code received: <strong>710326</strong>
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default ConfirmationCode; 