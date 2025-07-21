import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MDBox from 'components/MDBox';
import { Grid, Card, Typography, Slider } from '@mui/material';
import MDButton from 'components/MDButton';
import { formatCurrency } from 'utils';

const validationSchema = Yup.object().shape({
  initialInvestment: Yup.number()
    .min(10000, 'Initial investment must be at least $10,000')
    .max(1000000, 'Initial investment cannot exceed $1,000,000')
    .required('Initial investment is required'),
  propertyValueGrowth: Yup.number()
    .min(0, 'Property value growth cannot be negative')
    .max(100, 'Property value growth cannot exceed 100%')
    .required('Property value growth is required'),
  annualRentalYield: Yup.number()
    .min(0, 'Annual rental yield cannot be negative')
    .max(50, 'Annual rental yield cannot exceed 50%')
    .required('Annual rental yield is required'),
  investmentPeriod: Yup.number()
    .min(1, 'Investment period must be at least 1 year')
    .max(30, 'Investment period cannot exceed 30 years')
    .required('Investment period is required'),
});

const PropertyCalculatorForm = ({ initialData = {}, onSave, hideButtons = false }) => {
  const initialValues = {
    initialInvestment: initialData.initialInvestment || 117500,
    propertyValueGrowth: initialData.propertyValueGrowth || 20,
    annualRentalYield: initialData.annualRentalYield || 3.9,
    investmentPeriod: initialData.investmentPeriod || 5,
  };

  // Fonction de calcul des résultats
  const calculateResults = (values) => {
    const { initialInvestment, propertyValueGrowth, annualRentalYield, investmentPeriod } = values;

    // Calcul de l'appréciation de valeur
    const valueAppreciation = (initialInvestment * propertyValueGrowth) / 100;

    // Calcul du revenu locatif total
    const rentalIncome = (initialInvestment * annualRentalYield * investmentPeriod) / 100;

    // Calcul du retour total
    const totalReturn = initialInvestment + rentalIncome + valueAppreciation;

    // Calcul des données annuelles pour le graphique
    const yearlyData = [];
    for (let year = 1; year <= investmentPeriod; year++) {
      const yearRentalIncome = (initialInvestment * annualRentalYield * year) / 100;
      const yearValueAppreciation =
        (initialInvestment * propertyValueGrowth * year) / investmentPeriod / 100;
      const yearTotal = initialInvestment + yearRentalIncome + yearValueAppreciation;

      yearlyData.push({
        year: new Date().getFullYear() + year,
        investment: initialInvestment,
        rentalIncome: yearRentalIncome,
        valueAppreciation: yearValueAppreciation,
        total: yearTotal,
      });
    }

    return {
      totalReturn,
      rentalIncome,
      valueAppreciation,
      yearlyData,
    };
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const calculatedResults = calculateResults(values);
    const formData = {
      ...values,
      calculatedResults,
    };

    onSave(formData);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, handleSubmit, setFieldValue }) => {
        // Calculer directement les résultats sans hooks
        const calculatedResults = calculateResults(values);

        return (
          <Form onSubmit={handleSubmit}>
            <MDBox mb={3}>
              <Typography variant="body2" color="textSecondary">
                Configure the investment parameters to calculate projected returns.
              </Typography>
            </MDBox>

            <Grid container spacing={3}>
              {/* Résultats calculés */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Projected Results
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <MDBox textAlign="center">
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          {formatCurrency(calculatedResults.totalReturn, 'USD')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Total Return in {values.investmentPeriod} years
                        </Typography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <MDBox textAlign="center">
                            <Typography variant="h6" color="text">
                              {formatCurrency(values.initialInvestment, 'USD')}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Investment
                            </Typography>
                          </MDBox>
                        </Grid>
                        <Grid item xs={4}>
                          <MDBox textAlign="center">
                            <Typography variant="h6" color="warning.main">
                              {formatCurrency(calculatedResults.rentalIncome, 'USD')}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Rental Income
                            </Typography>
                          </MDBox>
                        </Grid>
                        <Grid item xs={4}>
                          <MDBox textAlign="center">
                            <Typography variant="h6" color="success.main">
                              {formatCurrency(calculatedResults.valueAppreciation, 'USD')}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Value Appreciation
                            </Typography>
                          </MDBox>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Paramètres d'investissement */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Initial Investment
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {formatCurrency(values.initialInvestment, 'USD')}
                  </Typography>
                  <Slider
                    value={values.initialInvestment}
                    onChange={(_, newValue) => setFieldValue('initialInvestment', newValue)}
                    min={10000}
                    max={1000000}
                    step={1000}
                    marks={[
                      { value: 10000, label: '$10K' },
                      { value: 500000, label: '$500K' },
                      { value: 1000000, label: '$1M' },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => formatCurrency(value, 'USD')}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Investment Period
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {values.investmentPeriod} years
                  </Typography>
                  <Slider
                    value={values.investmentPeriod}
                    onChange={(_, newValue) => setFieldValue('investmentPeriod', newValue)}
                    min={1}
                    max={30}
                    step={1}
                    marks={[
                      { value: 1, label: '1Y' },
                      { value: 15, label: '15Y' },
                      { value: 30, label: '30Y' },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} years`}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Property Value Growth ({values.investmentPeriod} years)
                  </Typography>
                  <Typography variant="h4" color="success.main" gutterBottom>
                    {values.propertyValueGrowth}%
                  </Typography>
                  <Slider
                    value={values.propertyValueGrowth}
                    onChange={(_, newValue) => setFieldValue('propertyValueGrowth', newValue)}
                    min={0}
                    max={100}
                    step={0.5}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Expected Annual Rental Yield
                  </Typography>
                  <Typography variant="h4" color="warning.main" gutterBottom>
                    {values.annualRentalYield}%
                  </Typography>
                  <Slider
                    value={values.annualRentalYield}
                    onChange={(_, newValue) => setFieldValue('annualRentalYield', newValue)}
                    min={0}
                    max={50}
                    step={0.1}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 25, label: '25%' },
                      { value: 50, label: '50%' },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                </Card>
              </Grid>

              {/* Données annuelles pour le graphique */}
              <Grid item xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Yearly Projection Data
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    This data will be used to generate the investment growth chart.
                  </Typography>
                  <MDBox maxHeight={200} overflow="auto">
                    <Grid container spacing={1}>
                      {calculatedResults.yearlyData.map((yearData, index) => (
                        <Grid item xs={12} key={index}>
                          <MDBox
                            p={1}
                            bgcolor="grey.50"
                            borderRadius={1}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" fontWeight="bold">
                              {yearData.year}
                            </Typography>
                            <Typography variant="body2">
                              Total: {formatCurrency(yearData.total, 'USD')}
                            </Typography>
                          </MDBox>
                        </Grid>
                      ))}
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>

            {/* Submit Buttons */}
            {!hideButtons && (
              <MDBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
                <MDButton variant="outlined" color="secondary" onClick={() => onSave(null)}>
                  Cancel
                </MDButton>
                <MDButton
                  variant="contained"
                  color="customBlue"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Calculator'}
                </MDButton>
              </MDBox>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

PropertyCalculatorForm.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func,
  hideButtons: PropTypes.bool,
};

export default PropertyCalculatorForm;
