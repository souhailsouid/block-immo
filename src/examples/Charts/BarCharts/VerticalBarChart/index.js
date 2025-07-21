import { useMemo } from 'react';

// porp-types is a library for typechecking of props
import PropTypes from 'prop-types';

// react-chartjs-2 components
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// @mui material components
import Card from '@mui/material/Card';

import Box from '@mui/material/Box';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// VerticalBarChart configurations
import configs from 'examples/Charts/BarCharts/VerticalBarChart/configs';

// Material Dashboard 3 PRO React base styles
import colors from 'assets/theme/base/colors';

import CalculateIcon from '@mui/icons-material/Calculate';
import { formatCurrency } from 'utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LegendItem = ({ color }) => (
  <Box
    sx={{
      width: 10,
      height: 10,
      borderRadius: '50%',
      backgroundColor: color,
      flexShrink: 0,
      border: `1px solid ${color}`,
    }}
  />
);
const InvestmentItem = ({ label, value, color }) => {
  return (
    <MDBox display="flex" flexDirection="column" alignItems="center">
      <MDBox display="flex" flexDirection="row" alignItems="center" gap={1}>
        <LegendItem color={color} />
        <MDTypography variant="caption">{label}</MDTypography>
      </MDBox>

      <MDBox mb={1}>
        <MDTypography component="div" variant="body2">
          <b>{formatCurrency(value, 'USD', 'en-US')}</b>
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}
const InvestmentInfo = ({ initialInvestment, rentalIncome, appreciation }) => {
  return (
    <MDBox display="flex" px={0} pt={0}>
      <MDBox
        width="100%"
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        {/* 1ere colonne */}
        <InvestmentItem label="Investment" value={initialInvestment} color={colors.black.main} />
        {/* 2eme colonne */}
        <InvestmentItem
          label="Total rental income"
          value={rentalIncome}
          color={colors.warning.main}
        />
        {/* 3eme colonne */}
        <InvestmentItem
          label="Value appreciation"
          value={appreciation}
          color={colors.success.main}
        />
      </MDBox>
    </MDBox>
  );
}

const VerticalBarChart = ({
  icon = { color: 'info', component: '' },
  title = '',
  description = '',
  height = '19.125rem',
  chart,
  slider,
  investmentReturn = '100',
  initialInvestment,
  rentalIncome,
  appreciation,
}) => {
  const chartDatasets = chart.datasets
    ? chart.datasets.map((dataset) => ({
        ...dataset,
        weight: 5,
        borderWidth: 0,
        borderRadius: 4,
        backgroundColor: colors[dataset.color]
          ? colors[dataset.color || 'dark'].main
          : colors.dark.main,
        fill: false,
        maxBarThickness: 35,
      }))
    : [];

  const { data, options } = configs(chart.labels || [], chartDatasets);

  const renderChart = (
    <MDBox
      py={2}
      pr={2}
      pl={icon.component ? 1 : 2}
      sx={{ border: 'none', borderRadius: '10px', boxShadow: 'none' }}
    >
      {title || description ? (
        <MDBox display="flex" px={description ? 1 : 0} pt={description ? 1 : 0}>
          {icon.component && (
            <MDBox
              width="2.25rem"
              height="2.25rem"
              bgColor={'customBlue'}
              variant="gradient"
              borderRadius="xl"
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="white"
              mt={-2}
              mr={2}
            >
              <CalculateIcon fontSize="medium" />
            </MDBox>
          )}
          <MDBox mt={icon.component ? -2 : 0}>
            {title && <MDTypography variant="h5">{title}</MDTypography>}
            <MDBox mb={2}>
              <MDTypography component="div" variant="body2">
                Projected investment return of{' '}
                <b>{formatCurrency(investmentReturn, 'USD', 'en-US')}</b> in <b>5 years</b>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      ) : null}
      <InvestmentInfo
        initialInvestment={initialInvestment}
        rentalIncome={rentalIncome}
        appreciation={appreciation}
      />
      {useMemo(
        () => (
          <MDBox height={height}>
            <Bar data={data} options={options} redraw={false} />
          </MDBox>
        ),
        [chart, height]
      )}
      {slider}
    </MDBox>
  );

  return title || description ? <Card sx={{ border: 'none', borderRadius: '10px', boxShadow: 'none' }}>{renderChart}</Card> : renderChart;
}

// Typechecking props for the VerticalBarChart
VerticalBarChart.propTypes = {
  icon: PropTypes.shape({
    color: PropTypes.oneOf([
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'error',
      'light',
      'dark',
    ]),
    component: PropTypes.node,
  }),
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default VerticalBarChart;
