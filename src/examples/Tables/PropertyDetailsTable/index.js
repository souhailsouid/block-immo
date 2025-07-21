import { useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Material Dashboard 3 PRO React components
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

// Material Dashboard 3 PRO React examples
import PropertyDetailsTableCell from "examples/Tables/PropertyDetailsTable/PropertyDetailsTableCell";

const PropertyDetailsTable = ({ 
  title = "", 
  rows = [{}], 
  shadow = true 
}) => {
  const renderTableCells = rows.map((row, key) => {
    const tableRows = [];
    const rowKey = `row-${key}`;
    Object.entries(row).map(([cellTitle, cellContent]) => {

    return (
      Array.isArray(cellContent)
        ? tableRows.push(
          <PropertyDetailsTableCell
            key={cellContent[1]}
            title={cellTitle}
            content={cellContent[1]}
            image={cellContent[0]}
            noBorder={key === rows.length - 1}
          />
        )
        : tableRows.push(
          <PropertyDetailsTableCell
            key={cellContent}
            title={cellTitle}
            content={cellContent}
            noBorder={key === rows.length - 1}
          />
        )
      )
    });

    return <TableRow key={rowKey}>{tableRows}</TableRow>;

  });

  return (
    <TableContainer sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <Table>
        {title ? (
          <TableHead>
            <MDBox component="tr" width="max-content" display="block" mb={1.5}>
              <MDTypography variant="h6" component="td">
                {title}
              </MDTypography>
            </MDBox>
          </TableHead>
        ) : null}
        <TableBody>{useMemo(() => renderTableCells, [rows])}</TableBody>
      </Table>
    </TableContainer>
  );
}

// Typechecking props for the PropertyDetailsTable
PropertyDetailsTable.propTypes = {
  title: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.object),
  shadow: PropTypes.bool,
};

export default PropertyDetailsTable;
