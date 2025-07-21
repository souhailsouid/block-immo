// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 3 PRO React components
import { useMaterialUIController } from "context";

// Timeline context
import { TimelineProvider } from "examples/Timeline/context";

const TimelineList = ({ title, dark = false, children }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <TimelineProvider value={dark}>
      <Card sx={{ border: 'none', borderRadius: '10px', boxShadow: 'none' }}>
        <MDBox
          bgColor={dark ? "dark" : "white"}
          // variant="gradient"
          // borderRadius="xl"
          sx={{ background: ({ palette: { background } }) => darkMode && background.card }}
        >
          <MDBox pt={3} px={3}>
            <MDTypography variant="h5" color={dark ? "white" : "dark"}>
              {title}
            </MDTypography>
          </MDBox>
          <MDBox p={2}>{children}</MDBox>
        </MDBox>
      </Card>
    </TimelineProvider>
  );
}

// Typechecking props for the TimelineList
TimelineList.propTypes = {
  title: PropTypes.string.isRequired,
  dark: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default TimelineList;
