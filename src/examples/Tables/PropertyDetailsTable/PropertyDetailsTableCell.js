// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import TableCell from "@mui/material/TableCell";

// Material Dashboard 3 PRO React components
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import * as Flags from 'country-flag-icons/react/3x2';

const PropertyDetailsTableCell = ({ 
  title = "",
  content = "",
  image = "",
  noBorder = false 
}) => {
  let template;
  const Flag = Flags[image.toUpperCase()];
  
  if (image) {
    template = (
      <TableCell align="left" width="30%" sx={{ border: noBorder && 0 }}>
        <MDBox display="flex" alignItems="center" width="max-content">
          {image !== "icon" ? <Flag  style={{ width: 32, height: 24 }} /> : <TrendingUpIcon sx={{ width: "1.5rem", height: "1.5rem" }} />} 
          <MDBox display="flex" flexDirection="column" ml={3}>
            <MDTypography
              variant="body2"
              fontWeight="medium"
              textTransform="capitalize"
              mb={0.5}
            >
              {title}:
            </MDTypography>
            <MDTypography variant="button" fontWeight="regular" textTransform="capitalize">
              {content}
            </MDTypography>
          </MDBox>
        </MDBox>
      </TableCell>
    );
  }
 
  else {
    template = (
      <TableCell align="center" sx={{ border: noBorder && 0 }}>
        <MDBox display="flex" flexDirection="column">
          <MDTypography
            variant="caption"
            color="text"
            fontWeight="medium"
            textTransform="capitalize"
          >
            {title}:
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" textTransform="capitalize">
            {content}
          </MDTypography>
        </MDBox>
      </TableCell>
    );
  }
  

  return template;
}


PropertyDetailsTableCell.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  image: PropTypes.string,
  noBorder: PropTypes.bool,
};

export default PropertyDetailsTableCell;