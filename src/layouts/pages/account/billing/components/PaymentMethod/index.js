import { useState } from "react";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Images
import masterCardLogo from "assets/images/logos/mastercard.png";
import visaLogo from "assets/images/logos/visa.png";

// Material Dashboard 3 PRO React context
import { useMaterialUIController } from "context";

// Modal components
import AddCardModal from "./AddCardModal";

// Context
import { useNotification } from "context/NotificationContext";


const PaymentMethod = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [openModal, setOpenModal] = useState(false);
  const { showNotification } = useNotification();
  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Payment Method
        </MDTypography>
        <MDButton variant="gradient" color="dark" onClick={() => {
          setOpenModal(true);
        }}>
          
          <Icon sx={{ fontWeight: "bold" }}>add</Icon>
          &nbsp;add new card
        </MDButton>
      </MDBox>
      <MDBox p={2}>
        <Grid container spacing={3} >
          <Grid item xs={12} md={6} ml="auto" mr="auto">
            <MDBox
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={3}
              sx={{
                border: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              }}
            >
              <MDBox component="img" src={masterCardLogo} alt="master card" width="10%" mr={2} />
              <MDTypography variant="h6" fontWeight="medium">
                ****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;7852
              </MDTypography>
              <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                <Tooltip title="Edit Card" placement="top">
                  <Icon sx={{ cursor: "pointer" }} fontSize="small">
                    edit
                  </Icon>
                </Tooltip>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      
      {/* Modal pour ajouter une carte */}
      <AddCardModal 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        onSave={(cardData) => {
          showNotification('success', 'Card added successfully');
          setOpenModal(false);
        }}
      />
    </Card>
  );
}

export default PaymentMethod;
