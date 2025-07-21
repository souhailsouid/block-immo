import * as React from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import colors from 'assets/theme/base/colors';
import MDTypography from 'components/MDTypography';
import MDBox from 'components/MDBox';
import { formatCurrency } from 'utils';


const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const InvestmentSlider = styled(Slider)(({ theme }) => ({
  color: '#007bff',
  height: 5,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
    '&:before': {
      boxShadow:
        '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&::before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: '#000',
      ...theme.applyStyles('dark', {
        color: '#fff',
      }),
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
    height: 5,
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    boxShadow: 'inset 0px 0px 4px -2px #000',
    backgroundColor: '#d0d0d0',
  },
  ...theme.applyStyles('dark', {
    color: '#0a84ff',
  }),
}));

const PropertySlider = ({ value, setValue, label, min, max, step, format }) => {
  return (
    <>
      <MDBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
      >
        <MDTypography component="div" variant="body2">
          {label}
        </MDTypography>

        <MDTypography component="div" variant="body2" sx={{ fontWeight: 'bold' }}>
          {format}
        </MDTypography>
      </MDBox>

      <InvestmentSlider
        value={value}
        min={min} // Valeur de départ
        max={max} // Valeur maximale (exemple)
        step={step} // Pas d'incrément (exemple)
        aria-label={label}
        valueLabelDisplay="off"
        onChange={(_event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          color: colors.customBlue.main,
        }}
      />
    </>
  );
};

export default function CalculatorInvestmentsSlider({
  initialInvestment,
  setInitialInvestment,
  appreciationValue,
  setAppreciationValue,
  expectedAnnualRentalYield,
  setExpectedAnnualRentalYield,
}) {
  return (
    <Box sx={{ px: 2, mt: 2 }}>
      <PropertySlider
        value={initialInvestment}
        setValue={setInitialInvestment}
        label="Initial Investment"
        min={10000}
        max={1000000}
        step={1000}
        format={formatCurrency(initialInvestment, 'USD', 'en-US')}
      />

      <PropertySlider
        value={appreciationValue}
        setValue={setAppreciationValue}
        label="Property value growth (5 years)"
        min={0}
        max={100}
        step={0.5}
        format={`${appreciationValue}%`}
      />
      <PropertySlider
        value={expectedAnnualRentalYield}
        setValue={setExpectedAnnualRentalYield}
        label="Expected annual rental yield"
        min={0}
        max={50}
        step={0.1}
        format={`${expectedAnnualRentalYield}%`}
      />
    </Box>
  );
}
