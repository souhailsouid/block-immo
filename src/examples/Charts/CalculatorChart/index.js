import { useState, useMemo } from 'react';

// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';

// Material Dashboard 3 PRO React 
import VerticalBarChart from 'examples/Charts/BarCharts/VerticalBarChart';

// Data
import calculatorInvestmentsBarChartData from 'layouts/pages/charts/data/verticalBarChartData';

import CalculatorInvestmentsSlider from 'layouts/pages/charts/CalculatorInvestmentsSlider';


const CalculatorInvestmentsCharts = () => {
  const [initialInvestment, setInitialInvestment] = useState(
    calculatorInvestmentsBarChartData.initialInvestment
  );
  const [appreciationValue, setAppreciationValue] = useState(20);
  const [expectedAnnualRentalYield, setExpectedAnnualRentalYield] = useState(3.9);

  // Calculer les résultats en temps réel
  const totalRentalIncome = useMemo(() => {
    return (expectedAnnualRentalYield / 100) * initialInvestment * 5;
  }, [expectedAnnualRentalYield, initialInvestment]);

  const totalAppreciation = useMemo(() => {
    return (appreciationValue / 100) * initialInvestment;
  }, [appreciationValue, initialInvestment]);

  const investmentReturn = useMemo(() => {
    return initialInvestment + totalRentalIncome + totalAppreciation;
  }, [initialInvestment, totalRentalIncome, totalAppreciation]);

  const chartData = useMemo(
    () => ({
      labels: ['2026', '2027', '2028', '2029', '2030'],
      datasets: [
        {
          label: 'Investment return',
          color: 'black',
          data: Array(5).fill(initialInvestment),
        },
        {
          label: 'Total rental income',
          color: 'warning',
          data: [
            totalRentalIncome * 0.2,
            totalRentalIncome * 0.4,
            totalRentalIncome * 0.6,
            totalRentalIncome * 0.8,
            totalRentalIncome,
          ],
        },
        {
          label: 'Value appreciation',
          color: 'success',
          data: [
            totalAppreciation * 0.2,
            totalAppreciation * 0.4,
            totalAppreciation * 0.6,
            totalAppreciation * 0.8,
            totalAppreciation,
          ],
        },
      ],
    }),
    [initialInvestment, totalRentalIncome, totalAppreciation]
  );

  return (
    <MDBox my={3}>
      <MDBox mb={6}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={10} ml="auto" mr="auto" px={2}>
            <VerticalBarChart
              icon={{ color: 'dark', component: 'leaderboard' }}
              title="Investment calculator"
              height="20rem"
              description="Projected investment return of"
              chart={chartData}
              investmentReturn={investmentReturn}
              initialInvestment={initialInvestment}
              rentalIncome={totalRentalIncome}
              appreciation={totalAppreciation}
              slider={
                <CalculatorInvestmentsSlider
                  initialInvestment={initialInvestment}
                  setInitialInvestment={setInitialInvestment}
                  appreciationValue={appreciationValue}
                  setAppreciationValue={setAppreciationValue}
                  expectedAnnualRentalYield={expectedAnnualRentalYield}
                  setExpectedAnnualRentalYield={setExpectedAnnualRentalYield}
                />
              }
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default CalculatorInvestmentsCharts;
