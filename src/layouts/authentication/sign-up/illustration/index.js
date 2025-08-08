import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { signUp as amplifySignUp } from '@aws-amplify/auth';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

// Authentication layout components
import IllustrationLayout from 'layouts/authentication/components/IllustrationLayout';
import { useNotification } from 'context/NotificationContext';
// Image
import fractional_real_estate from 'assets/images/fractional_real_estate.png';

// Material-UI components
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SignUpIllustration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const schema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
    firstName: Yup.string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters long')
      .matches(/^[a-zA-Z\s]+$/, 'First name must contain only letters'),
    lastName: Yup.string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters long')
      .matches(/^[a-zA-Z\s]+$/, 'Last name must contain only letters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { showNotification } = useNotification();
  async function handleSignUp(data) {
    try {
      setIsLoading(true);
      setShowSuccessMessage(false);
      setShowErrorMessage(false);
      setError('root', null);

     

      // Utiliser Amplify directement pour l'inscription
      const result = await amplifySignUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            given_name: data.firstName,
            family_name: data.lastName,
          },
          autoSignIn: true // Connexion automatique après inscription
        }
      });

     
      setShowSuccessMessage(true);
      
      // Message de confirmation
      setShowSuccessMessage(true);

      
   

    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      setShowErrorMessage(true);
      setError('root', { 
        type: 'manual', 
        message: error.message || "Connection error. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <IllustrationLayout
      backgroundSize="contain"
      title="Join BlockImmo"
      description="Create your account to start investing in real estate"
      illustration={fractional_real_estate}
    >
      <MDBox component="form" role="form" onSubmit={handleSubmit(handleSignUp)}>
        {/* Affichage d'erreur ou de succès */}
        {errors?.root && !showSuccessMessage && (
          <MDBox mb={3} p={2} borderRadius={1} sx={{
            border: '1px solid',
            borderColor: errors.root.message?.includes('Félicitations') ? 'success.main' : 'error.main'
          }}>
            <MDTypography variant="body2" color={errors.root.message?.includes('Félicitations') ? 'success.dark' : 'error'}>
              {errors.root.message}
            </MDTypography>
          </MDBox>
        )}
        {showSuccessMessage && (
          <MDBox mb={3} p={2} borderRadius={1} sx={{
            border: '1px solid',
            borderColor: 'success.main'
          }}>
            <MDTypography variant="body2" color="success">
              Account created successfully. Please sign in to continue.
            </MDTypography>
          </MDBox>
        )}

        <MDBox mb={2}>
          <MDInput
            type="text"
            label="First Name"
            fullWidth
            name="firstName"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </MDBox>

        <MDBox mb={2}>
          <MDInput
            type="text"
            label="Last Name"
            fullWidth
            name="lastName"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </MDBox>

        <MDBox mb={2}>
          <MDInput
            type="email"
            label="Email"
            fullWidth
            name="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </MDBox>

        <MDBox mb={2}>
          <MDInput
            type={showPassword ? 'text' : 'password'}
            label="Password"
            fullWidth
            name="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </MDBox>

        <MDBox mt={4} mb={1}>
          <MDButton
            variant="gradient"
            color="customBlue"
            size="large"
            fullWidth
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </MDButton>
        </MDBox>

        <MDBox mt={3} textAlign="center">
          <MDTypography variant="button" color="text">
            Already have an account?{' '}
            <MDTypography
              component={Link}
              to="/authentication/sign-in/illustration"
              variant="button"
              color="customBlue"
              fontWeight="medium"
              textGradient
            >
              Sign in
            </MDTypography>
          </MDTypography>
        </MDBox>
      </MDBox>
    </IllustrationLayout>
  );
};

export default SignUpIllustration;
