import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import authService from 'services/authService';

import MDSnackbar from 'components/MDSnackbar';
const ConfirmationCode = ({ email, onSuccess, onError, handleSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(false);
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
    handleSuccess();
    try {
      setResendLoading(true);

     const result = await authService.resendConfirmationCode(email);

      
     if (result && result.success) {
       setResendSuccess(true);
       setResendError(false);
     } else {
       setResendError(true);
       setResendSuccess(false);
     }
    } catch (error) {
      setResendError(true);
      setResendSuccess(false);
      setError('root', { 
        type: 'manual', 
        message: error.message || 'Error during resend code' 
      });
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
   < MDSnackbar title="Code confirmation resent successfully!" type="success" onClose={() => {}}  />
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
            color="customBlue"
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
            color="customBlue"
            size="small"
            onClick={handleResendCode}
            disabled={resendLoading}
          >
            {resendLoading ? 'Sending...' : 'Resend code'}
          </MDButton>
        </MDBox>

       {resendSuccess && <MDBox mt={2} textAlign="center">
          <MDTypography variant="body2" color="success" fontWeight="bold">
            Code resent successfully! Check your email.
          </MDTypography>
        </MDBox>
        }
        {resendError && <MDBox mt={2} textAlign="center">
          <MDTypography variant="body2" color="error" fontWeight="bold">
            {errors.root.message}
          </MDTypography>
        </MDBox>
        }
      </MDBox>
    </MDBox>
  );
};

ConfirmationCode.propTypes = {
  email: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  handleSuccess: PropTypes.func,
};

export default ConfirmationCode; 