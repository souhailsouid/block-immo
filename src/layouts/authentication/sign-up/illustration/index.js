import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// react-router-dom components
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, signUp } from '@aws-amplify/auth';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

// Authentication layout components
import IllustrationLayout from 'layouts/authentication/components/IllustrationLayout';

import fractional_real_estate from 'assets/images/fractional_real_estate.png';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// Import the NotificationNavbar component
import NotificationNavbar from 'layouts/pages/notifications/NotificationNavbar';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

const SignUpIllustration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(true);
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
    givenName: Yup.string()
      .required('First name is required')
      .min(3, 'First name must be at least 3 characters long')
      .matches(/^[a-zA-Z]+$/, 'First name must contain only letters'),
    familyName: Yup.string()
      .required('Last name is required')
      .min(3, 'Last name must be at least 3 characters long')
      .matches(/^[a-zA-Z]+$/, 'Last name must contain only letters'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    async function checkUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          navigate('/dashboard'); // ou la page de ton choix
        }
      } catch (e) {
        // Pas d'utilisateur connecté, on affiche le formulaire
      }
    }
    checkUser();
  }, [navigate]);

  async function handleSignUp(data) {
    try {
      setIsLoading(true);
      setShowSuccessMessage(false);

      const user = await signUp({
        username: data.email,
        password: data.password,
        signUpMethod: 'email',
        options: {
          userAttributes: {
            email: data.email,
            given_name: data.givenName,
            family_name: data.familyName,
          },
        },
      });
      setShowSuccessMessage(true);
      setIsLoading(false);

      return user;
    } catch (error) {
      setIsLoading(false);

      // Gestion spécifique des erreurs Cognito
      if (error.name === 'UsernameExistsException') {
        setError('email', { type: 'manual', message: 'An account with this email already exists' });
      } else if (error.name === 'InvalidPasswordException') {
        setError('password', { type: 'manual', message: 'Password does not meet requirements' });
      } else {
        setError('root', { type: 'manual', message: error.message });
      }
    }
  }

  return (
    <MDBox>
      {/* {showSuccessMessage && ( */}
        <NotificationNavbar
          color="customBlue"
          title="Account created successfully!"
          description="Please check your email for verification."
          fontSize="medium"
          dismissible={true}
          onClose={() => setShowSuccessMessage(false)}
          showSuccessMessage={showSuccessMessage}
        />
      {/* )} */}
      {/* <Navba
        absolute
        light
        isMini
      /> */}
      <IllustrationLayout
        title="Sign Up"
        description="Create an account to get started"
        illustration={fractional_real_estate}
        isNotification={showSuccessMessage}
        message="Account created successfully, please check your email for verification."
        setNotification={setShowSuccessMessage}
      >
        <MDBox component="form" role="form" onSubmit={handleSubmit(handleSignUp)}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="First Name"
              fullWidth
              name="givenName"
              {...register('givenName')}
              error={!!errors.givenName}
              helperText={errors.givenName?.message}
              InputLabelProps={{ shrink: true }}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Last Name"
              fullWidth
              name="familyName"
              {...register('familyName')}
              error={!!errors.familyName}
              helperText={errors.familyName?.message}
              InputLabelProps={{ shrink: true }}
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
          <MDBox minHeight="10px" mb={2}>
            {errors.root && (
              <MDTypography variant="h6" color="error">
                {errors.root.message}
              </MDTypography>
            )}
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
              {isLoading ? 'Creating account...' : 'Sign up'}
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
    </MDBox>
  );
}

export default SignUpIllustration;
