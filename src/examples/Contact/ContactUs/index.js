import { useState } from 'react';
// @mui material components
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

// Material Kit 2 PRO React components
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

// Images
import bgImage from 'assets/images/office-dark.jpg';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const ContactUsTwo = ({ toggleModal, onFormSuccess }) => {
  const schema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters long'),
    subject: Yup.string()
      .required('Subject is required')
      .min(3, 'Subject must be at least 3 characters long'),
    message: Yup.string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters long'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset, // Ajout de reset pour vider le formulaire
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleContact(data) {
    try {
      setIsSuccess(true);

      // Appel de la fonction de succès passée en prop
      if (onFormSuccess) {
        onFormSuccess();
      }

      // Reset du formulaire
      reset();
    } catch (error) {
      setError('root', { type: 'manual', message: error.message });
    }
  }

  return (
    <MDBox component="section" py={{ xs: 0, lg: 6 }}>
      <Container>
        <Grid container item py={6} px={6}>
          <MDBox
            width="100%"
            bgColor="white"
            borderRadius="xl"
            shadow="xl"
            mb={6}
            sx={{ overflow: 'hidden' }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} lg={7}>
                <MDBox component="form" p={2} method="post" onSubmit={handleSubmit(handleContact)}>
                  <MDBox px={3} py={{ xs: 2, sm: 6 }}>
                    {/* <MDBox
                      mb={2}
                      sx={{
                        transition: 'all 0.3s ease',
                        minHeight: 'auto',
                      }}
                    > */}
                    {/* {isSuccess && (
                        <MDAlert
                          color="customBlue"
                          variant="gradient"
                          fontSize="medium"
                          dismissible
                          onClose={() => setIsSuccess(false)}
                        >
                          Message sent successfully !
                        </MDAlert>
                      )} */}
                    {/* </MDBox> */}
                    <MDTypography variant="h4" color="customBlue">
                      How can we help you?
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={0.5} pb={3} px={3}>
                    <Grid container py={2}>
                      <Grid item xs={12} pr={1} mb={3}>
                        <MDBox
                          sx={{
                            minHeight: errors.name ? '80px' : '60px',
                            transition: 'min-height 0.3s ease',
                          }}
                        >
                          {' '}
                          {/* Espace réservé pour helperText */}
                          <MDInput
                            variant="standard"
                            label="My name is"
                            placeholder="Full Name"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            {...register('name')}
                            error={!!errors.name}
                            helperText={errors.name?.message || ''}
                            name="name"
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} pr={1} mb={3}>
                        <MDBox
                          sx={{
                            minHeight: errors.name ? '80px' : '60px',
                            transition: 'min-height 0.3s ease',
                          }}
                        >
                          {' '}
                          {/* Espace réservé pour helperText */}
                          <MDInput
                            {...register('subject')}
                            error={!!errors.subject}
                            helperText={errors.subject?.message || ''}
                            name="subject"
                            variant="standard"
                            label="I'm looking for"
                            placeholder="What you love"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} pr={1} mb={3}>
                        <MDBox sx={{ minHeight: '120px' }}>
                          {' '}
                          {/* Plus d'espace pour le textarea */}
                          <MDInput
                            variant="standard"
                            label="Your message"
                            placeholder="I want to say that..."
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            multiline
                            rows={4}
                            {...register('message')}
                            error={!!errors.message}
                            helperText={errors.message?.message || ''}
                            name="message"
                          />
                        </MDBox>
                      </Grid>
                      <Grid
                        container
                        item
                        xs={12}
                        md={12}
                        justifyContent="space-between"
                        textAlign="right"
                        ml="auto"
                        pt={{ sm: 2, md: 6 }}
                      >
                        <MDButton variant="gradient" color="info" onClick={toggleModal}>
                          Cancel
                        </MDButton>
                        <MDButton variant="gradient" color="customBlue" type="submit">
                          Send Message
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                </MDBox>
              </Grid>
              <Grid
                item
                xs={12}
                lg={5}
                position="relative"
                px={0}
                sx={{
                  backgroundImage: ({
                    palette: { gradients },
                    functions: { rgba, linearGradient },
                  }) =>
                    `${linearGradient(rgba(gradients.customBlue.main, 0.8), rgba(gradients.customBlue.state, 0.8))}, url(${bgImage})`,
                  backgroundSize: 'cover',
                }}
              >
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  height="100%"
                >
                  <MDBox py={6} pl={6} pr={{ xs: 6, sm: 12 }} my="auto">
                    <IconButton
                      onClick={toggleModal}
                      sx={{
                        position: 'absolute',
                        top: { xs: 8, md: 32 },
                        right: { xs: 8, md: 16 },
                        zIndex: 10,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.3)',
                        },
                      }}
                      size="medium"
                      aria-label="close"
                    >
                      <CloseIcon fontSize="medium" />
                    </IconButton>
                    <MDTypography variant="h3" color="white" mb={1}>
                      Contact Information
                    </MDTypography>
                    <MDTypography Typography variant="body2" color="white" opacity={0.8} mb={3}>
                      Fill up the form and our Team will get back to you within 24 hours.
                    </MDTypography>
                    <MDBox display="flex" p={1}>
                      <MDTypography variant="button" color="white">
                        <i className="fas fa-phone" />
                      </MDTypography>
                      <MDTypography
                        component="span"
                        variant="button"
                        color="white"
                        opacity={0.8}
                        ml={2}
                        fontWeight="regular"
                      >
                        (+40) 772 100 200
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" color="white" p={1}>
                      <MDTypography variant="button" color="white">
                        <i className="fas fa-envelope" />
                      </MDTypography>
                      <MDTypography
                        component="span"
                        variant="button"
                        color="white"
                        opacity={0.8}
                        ml={2}
                        fontWeight="regular"
                      >
                        contact@get-block.com
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" color="white" p={1}>
                      <MDTypography variant="button" color="white">
                        <i className="fas fa-map-marker-alt" />
                      </MDTypography>
                      <MDTypography
                        component="span"
                        variant="button"
                        color="white"
                        opacity={0.8}
                        ml={2}
                        fontWeight="regular"
                      >
                        Dyonisie Wolf Bucharest, RO 010458
                      </MDTypography>
                    </MDBox>
                    <MDBox mt={3}>
                      <MDButton variant="text" color="white" size="large" iconOnly>
                        <i className="fab fa-facebook" style={{ fontSize: '1.25rem' }} />
                      </MDButton>
                      <MDButton variant="text" color="white" size="large" iconOnly>
                        <i className="fab fa-twitter" style={{ fontSize: '1.25rem' }} />
                      </MDButton>
                      <MDButton variant="text" color="white" size="large" iconOnly>
                        <i className="fab fa-dribbble" style={{ fontSize: '1.25rem' }} />
                      </MDButton>
                      <MDButton variant="text" color="white" size="large" iconOnly>
                        <i className="fab fa-instagram" style={{ fontSize: '1.25rem' }} />
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </Grid>
      </Container>
    </MDBox>
  );
}

export default ContactUsTwo;
