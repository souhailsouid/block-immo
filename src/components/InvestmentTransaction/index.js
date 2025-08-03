// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

const InvestmentTransaction = ({ color, icon, propertyName, description, value, blocks, status }) => {
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'check_circle';
      case 'PENDING':
        return 'schedule';
      case 'FAILED':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <MDBox key={propertyName} component="li" py={1} pr={2} mb={1}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDBox display="flex" alignItems="center">
          <MDBox mr={2}>
            <MDButton variant="outlined" color={color} iconOnly circular>
              <Icon sx={{ fontWeight: "bold" }}>{icon}</Icon>
            </MDButton>
          </MDBox>
          <MDBox display="flex" flexDirection="column">
            <MDTypography variant="button" fontWeight="medium" gutterBottom>
              {propertyName}
            </MDTypography>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              {description}
            </MDTypography>
            <MDBox display="flex" alignItems="center" gap={1} mt={0.5}>
              <MDTypography variant="caption" color="text" fontWeight="regular">
                {blocks} blocks
              </MDTypography>
              <MDBox display="flex" alignItems="center" gap={0.5}>
                <Icon fontSize="small" color={getStatusColor(status)}>
                  {getStatusIcon(status)}
                </Icon>
                <MDTypography variant="caption" color={getStatusColor(status)} fontWeight="medium">
                  {status}
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
        <MDTypography variant="button" color={color} fontWeight="medium" textGradient>
          {value}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

// Typechecking props of the InvestmentTransaction
InvestmentTransaction.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]).isRequired,
  icon: PropTypes.node.isRequired,
  propertyName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  blocks: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};

export default InvestmentTransaction; 