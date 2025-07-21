import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

// Dashboard layout
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

// Property forms
import PropertyDetailsForm from 'components/forms/PropertyDetailsForm';
import PropertyPriceForm from 'components/forms/PropertyPriceForm';
import PropertyLocationForm from 'components/forms/PropertyLocationForm';
import PropertyDetailsTableForm from 'components/forms/PropertyDetailsTableForm';
import PropertyTimelineForm from 'components/forms/PropertyTimelineForm';
import PropertyCalculatorForm from 'components/forms/PropertyCalculatorForm';
import PropertyContactForm from 'components/forms/PropertyContactForm';
import PropertyPhotosForm from 'components/forms/PropertyPhotosForm';
import PropertyFormWrapper from 'components/forms/PropertyFormWrapper';

// Icons
import { ArrowBack, Home, Save, CheckCircle } from '@mui/icons-material';

function getSteps() {
  return ['Basic Info', 'Location', 'Details', 'Pricing', 'Photos', 'Timeline', 'Calculator', 'Contact'];
}

function getStepContent(stepIndex, formData, onSave, onCancel, onPrevious, isLastStep, onStepComplete) {
  const stepConfigs = [
    {
      title: "Basic Information",
      description: "Enter the basic details of your property",
      component: PropertyDetailsForm,
      requirements: [
        "Property name is required",
        "Property type must be selected",
        "Basic description needed"
      ]
    },
    {
      title: "Location Details",
      description: "Set the property location and address",
      component: PropertyLocationForm,
      requirements: [
        "Address is required",
        "City and country must be specified",
        "Location description needed"
      ]
    },
    {
      title: "Property Details",
      description: "Configure detailed property specifications",
      component: PropertyDetailsTableForm,
      requirements: [
        "Property size is required",
        "Number of rooms must be specified",
        "Property features should be selected"
      ]
    },
    {
      title: "Pricing Configuration",
      description: "Set property pricing and investment details",
      component: PropertyPriceForm,
      requirements: [
        "Property price is required",
        "Currency must be selected",
        "Investment metrics needed"
      ]
    },
    {
      title: "Property Photos",
      description: "Upload photos of your property",
      component: PropertyPhotosForm,
      requirements: [
        "At least one photo is required",
        "Photos must be in JPG, PNG, or WebP format",
        "Maximum file size: 10MB per photo"
      ]
    },
    {
      title: "Funding Timeline",
      description: "Configure the funding timeline",
      component: PropertyTimelineForm,
      requirements: [
        "Timeline events must be configured",
        "Start and end dates required",
        "Funding milestones needed"
      ]
    },
    {
      title: "Investment Calculator",
      description: "Set up investment calculator parameters",
      component: PropertyCalculatorForm,
      requirements: [
        "Initial investment amount required",
        "Investment period must be set",
        "Expected returns should be configured"
      ]
    },
    {
      title: "Contact Information",
      description: "Add contact details for the property",
      component: PropertyContactForm,
      requirements: [
        "Agent name is required",
        "Contact phone or email needed",
        "Agency information required"
      ]
    }
  ];

  const config = stepConfigs[stepIndex];
  if (!config) return null;

  const Component = config.component;
  
  return (
    <PropertyFormWrapper
      onSave={onSave}
      onCancel={onCancel}
      onPrevious={onPrevious}
      isLastStep={isLastStep}
      stepTitle={config.title}
      stepDescription={config.description}
      requirements={config.requirements}
      onStepComplete={onStepComplete}
    >
      <Component formData={formData} />
    </PropertyFormWrapper>
  );
}

const AddPropertyPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [savedData, setSavedData] = useState({});
  const navigate = useNavigate();
  const steps = getSteps();
  const isLastStep = activeStep === steps.length - 1;

  // Load saved data on component mount
  useEffect(() => {
    const saved = localStorage.getItem('propertyFormData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.data || {});
        setCompletedSteps(new Set(parsed.completedSteps || []));
        setSavedData(parsed.data || {});
      } catch (error) {
         
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Auto-save data when formData changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      const dataToSave = {
        data: formData,
        completedSteps: Array.from(completedSteps),
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('propertyFormData', JSON.stringify(dataToSave));
    }
  }, [formData, completedSteps]);

  const handleStepClick = (stepIndex) => {
    // Allow navigation to completed steps or current step
    if (completedSteps.has(stepIndex) || stepIndex === activeStep || stepIndex === activeStep + 1) {
      setActiveStep(stepIndex);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleNext = (stepData) => {
    // Merge step data with existing form data
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, activeStep]));
    
    if (isLastStep) {
      // Submit the complete form
      handleSubmit();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleStepComplete = (stepData) => {
    // Save data for current step without moving to next
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    setCompletedSteps(prev => new Set([...prev, activeStep]));
  };

  const handleSaveProgress = () => {
    const dataToSave = {
      data: formData,
      completedSteps: Array.from(completedSteps),
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('propertyFormData', JSON.stringify(dataToSave));
    setSavedData(formData);
    
    // Show success message (you can add a snackbar here)
     
    console.log('Progress saved successfully!');
  };

  const handleClearProgress = () => {
    localStorage.removeItem('propertyFormData');
    setFormData({});
    setCompletedSteps(new Set());
    setSavedData({});
    setActiveStep(0);
  };

  const handleSubmit = async () => {
    try {
      // Simulate API call
       
      console.log('Submitting property data:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear saved data after successful submission
      localStorage.removeItem('propertyFormData');
      
      // Navigate to properties list or show success message
      navigate('/properties');
    } catch (error) {
       
      console.error('Error submitting property:', error);
    }
  };

  const handleCancel = () => {
    navigate('/properties');
  };

  const isStepCompleted = (stepIndex) => completedSteps.has(stepIndex);
  const isStepAccessible = (stepIndex) => {
    return stepIndex === 0 || 
           stepIndex <= activeStep + 1 || 
           completedSteps.has(stepIndex);
  };

  return (
    <DashboardLayout>
      <MDBox mb={20} height="100vh">
        <Grid container justifyContent="center" alignItems="flex-start" sx={{ height: '100%', mt: 2 }}>
          <Grid item xs={12} lg={12}>
            {/* Header */}
            <MDBox mb={3} display="flex" alignItems="center" justifyContent="space-between">
              <MDBox display="flex" alignItems="center" gap={2}>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  startIcon={<ArrowBack />}
                  onClick={handleCancel}
                >
                  Back to Properties
                </MDButton>
                <MDBox display="flex" alignItems="center" gap={1}>
                  <Home color="primary" />
                  <MDTypography variant="h4" color="dark">
                    Add New Property
                  </MDTypography>
                </MDBox>
              </MDBox>

              {/* Progress Actions */}
              <MDBox display="flex" gap={2}>
                <MDButton
                  variant="outlined"
                  color="info"
                  startIcon={<Save />}
                  onClick={handleSaveProgress}
                >
                  Save Progress
                </MDButton>
                {Object.keys(savedData).length > 0 && (
                  <MDButton
                    variant="outlined"
                    color="warning"
                    onClick={handleClearProgress}
                  >
                    Clear Progress
                  </MDButton>
                )}
              </MDBox>
            </MDBox>

            <Card sx={{ height: '100%' }}>
              {/* Interactive Stepper */}
              <MDBox mx={2} mt={2}>
                <Stepper 
                  activeStep={activeStep} 
                  alternativeLabel 
                  sx={{ 
                    background: "#4472c4", 
                    boxShadow: "linear-gradient(195deg, #4472c4, #5a8fd8)",
                    borderRadius: 2,
                    p: 2
                  }}
                >
                  {steps.map((label, index) => (
                    <Step key={label} completed={isStepCompleted(index)}>
                      <StepButton
                        onClick={() => handleStepClick(index)}
                        disabled={!isStepAccessible(index)}
                        sx={{ 
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 1
                          }
                        }}
                      >
                        <StepLabel 
                          sx={{ 
                            color: 'white',
                            '& .MuiStepLabel-iconContainer': {
                              color: isStepCompleted(index) ? '#4caf50' : 'white'
                            }
                          }}
                        >
                          {label}
                        </StepLabel>
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
              </MDBox>

              {/* Progress Indicator */}
              <MDBox mx={2} mt={1} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="body2" color="textSecondary">
                  Step {activeStep + 1} of {steps.length}
                </MDTypography>
                <MDBox display="flex" alignItems="center" gap={1}>
                  <MDTypography variant="body2" color="textSecondary">
                    Completed: {completedSteps.size}/{steps.length}
                  </MDTypography>
                  {completedSteps.size > 0 && (
                    <CheckCircle color="success" fontSize="small" />
                  )}
                </MDBox>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <MDBox>
                  {/* Step Content */}
                  <MDBox mb={3}>
                    {getStepContent(activeStep, formData, handleNext, handleCancel, handleBack, isLastStep, handleStepComplete)}
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default AddPropertyPage; 