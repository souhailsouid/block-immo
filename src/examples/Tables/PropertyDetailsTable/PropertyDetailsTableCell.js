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

  // Gestion sécurisée du drapeau
  let Flag = null;
  try {
    if (image && image !== "icon") {
      const flagKey = image.toUpperCase();
      Flag = Flags[flagKey];
    }
  } catch (error) {
    // Gestion silencieuse de l'erreur de drapeau
  }
  
  if (image) {
    template = (
      <TableCell align="left" width="30%" sx={{ border: noBorder && 0 }}>
        <MDBox display="flex" alignItems="center" width="max-content">
          {image !== "icon" && Flag ? <Flag style={{ width: 32, height: 24 }} /> : <TrendingUpIcon sx={{ width: "1.5rem", height: "1.5rem" }} />} 
          <MDBox display="flex" flexDirection="column" ml={3} sx={{
            flexWrap: "wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto",
            maxWidth: "100%",
            // Media queries pour responsive
            "@media (max-width: 600px)": {
              ml: 1,
              maxWidth: "calc(100% - 40px)",
            },
            "@media (min-width: 601px) and (max-width: 900px)": {
              ml: 2,
              maxWidth: "calc(100% - 50px)",
            },
            "@media (min-width: 901px)": {
              ml: 3,
              maxWidth: "calc(100% - 60px)",
            },
          }}>
            <MDTypography
              variant="body2"
              fontWeight="medium"
              textTransform="capitalize"
              mb={0.5}
              sx={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
                // Media queries pour responsive
                "@media (max-width: 600px)": {
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                },
                "@media (min-width: 601px) and (max-width: 900px)": {
                  fontSize: "0.875rem",
                  lineHeight: 1.3,
                },
                "@media (min-width: 901px)": {
                  fontSize: "1rem",
                  lineHeight: 1.4,
                },
              }}
            >
              {title}:
            </MDTypography>
            <MDTypography variant="button" fontWeight="regular" textTransform="capitalize" sx={{
              flexWrap: "wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              hyphens: "auto",
              whiteSpace: "normal",
              lineHeight: 1.4,
              // Media queries pour responsive
              "@media (max-width: 600px)": {
                fontSize: "0.75rem",
                lineHeight: 1.2,
              },
              "@media (min-width: 601px) and (max-width: 900px)": {
                fontSize: "0.875rem",
                lineHeight: 1.3,
              },
              "@media (min-width: 901px)": {
                fontSize: "1rem",
                lineHeight: 1.4,
              },
            }}>
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
        <MDBox display="flex" flexDirection="column" sx={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          hyphens: "auto",
          maxWidth: "100%",
          // Media queries pour responsive
          "@media (max-width: 600px)": {
            maxWidth: "100%",
          },
          "@media (min-width: 601px) and (max-width: 900px)": {
            maxWidth: "100%",
          },
          "@media (min-width: 901px)": {
            maxWidth: "100%",
          },
        }}>
          <MDTypography
            variant="caption"
            color="text"
            fontWeight="medium"
            textTransform="capitalize"
            sx={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              hyphens: "auto",
              // Media queries pour responsive
              "@media (max-width: 600px)": {
                fontSize: "0.75rem",
                lineHeight: 1.2,
              },
              "@media (min-width: 601px) and (max-width: 900px)": {
                fontSize: "0.875rem",
                lineHeight: 1.3,
              },
              "@media (min-width: 901px)": {
                fontSize: "1rem",
                lineHeight: 1.4,
              },
            }}
          >
            {title}:
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" textTransform="capitalize" sx={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto",
            whiteSpace: "normal",
            lineHeight: 1.4,
            // Media queries pour responsive
            "@media (max-width: 600px)": {
              fontSize: "0.75rem",
              lineHeight: 1.2,
            },
            "@media (min-width: 601px) and (max-width: 900px)": {
              fontSize: "0.875rem",
              lineHeight: 1.3,
            },
            "@media (min-width: 901px)": {
              fontSize: "1rem",
              lineHeight: 1.4,
            },
          }}>
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