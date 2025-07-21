import { useState } from 'react';

// formik components
import { Formik, Form } from 'formik';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';

// NewUser page components
import UserKYCInfo from 'layouts/onboarding/kyc/steps/forms';
import KYCFile from 'layouts/onboarding/kyc/steps/kyc-file';
import Address from 'layouts/pages/users/new-user/components/Address';

// NewUser layout schemas for form and form feilds
import validations from 'layouts/pages/users/new-user/schemas/validations';
import form from 'layouts/pages/users/new-user/schemas/form';
import initialValues from 'layouts/pages/users/new-user/schemas/initialValues';

function getSteps() {
  return ['User Info', 'Address', 'Document'];
}

function getStepContent(stepIndex, formData) {
  switch (stepIndex) {
    case 0:
      return <UserKYCInfo formData={formData} />;
    case 1:
      return <Address formData={formData} />;
    case 2:
      return <KYCFile formData={formData} />;
    default:
      return null;
  }
}

const KYCSteps = ({ onClose, setShowSuccessModal, setShow }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const { formId, formField } = form;
  const currentValidation = validations[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  const sleep = (ms) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  const handleBack = () => setActiveStep(activeStep - 1);

  // Fonction pour vérifier la date de majorité
  const handleCheckBirthDate = (birthDateValue, setFieldError) => {
    if (!birthDateValue) return true; // Pas d'erreur si pas de valeur

    const birthDate = new Date(birthDateValue);
    const today = new Date();

    // Calculer l'âge
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Ajuster l'âge si l'anniversaire n'est pas encore passé cette année
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setFieldError('birthDate', 'You must be at least 18 years old');
      return false;
    }
    return true;
  };
  const submitForm = async (values, actions) => {
    await sleep(1000);
    setShow(false);
    setShowSuccessModal(true);
    actions.setSubmitting(false);
    actions.resetForm();

    setActiveStep(0);
  };

  const handleSubmit = (values, actions) => {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  return (
    <MDBox py={3} mb={20} height="65vh">
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%', mt: 8 }}>
        <Grid item xs={12} lg={8}>
          <Formik
            initialValues={initialValues}
            // validationSchema={currentValidation}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, setValues, setFieldError }) => (
              <Form id={formId} autoComplete="off">
                <Card sx={{ height: '100%' }}>
                  <MDBox mx={2} mt={2} >
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ background: "#4472c4", boxShadow: "linear-gradient(195deg, #4472c4, #5a8fd8)" }}>
                      {steps.map((label) => (
                        <Step key={label} >
                          <StepLabel >{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </MDBox>
                  <MDBox p={3}>
                    <MDBox>
                      {getStepContent(activeStep, {
                        values,
                        touched,
                        formField,
                        errors,
                        setValues,
                        handleCheckBirthDate: (birthDateValue) =>
                          handleCheckBirthDate(birthDateValue, setFieldError),
                      })}
                      <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
                        {activeStep === 0 ? (
                          <MDButton variant="gradient" color="light" onClick={onClose}>
                            Do later
                          </MDButton>
                        ) : (
                          <MDButton variant="gradient" color="light" onClick={handleBack}>
                            back
                          </MDButton>
                        )}
                        <MDButton
                          disabled={isSubmitting}
                          type="submit"
                          variant="gradient"
                          color="customBlue"
                        >
                          {isLastStep ? 'send' : 'next'}
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                </Card>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default KYCSteps;
