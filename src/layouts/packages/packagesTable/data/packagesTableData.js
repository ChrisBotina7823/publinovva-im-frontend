// DataTable.js
import React, { useState, useEffect } from 'react';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import axiosInstance from 'axiosInstance';

export default function DataTable( handleEditClick, handleDeleteClick ) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Paquete", accessor: "package", width: "30%", align: "left" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/packages');
        const dataRows = response.data.map((dataItem) => ({
          package: (
            <MDTypography>
              {JSON.stringify(dataItem)}
            </MDTypography>
          ),
          action: (
            <MDBox>
              <MDTypography component="a" href="#"
                variant="caption" color="secondary" fontWeight="medium"
                onClick={ () => handleEditClick(dataItem._id) }>
                Edit
              </MDTypography>
              <MDTypography component="a" href="#"
                variant="caption" color="error" fontWeight="medium"
                onClick={ () => handleDeleteClick(dataItem._id) }
                >
                Delete
              </MDTypography>
            </MDBox>
          ),
        }));
  
        setTableData((prevTableData) => ({
          columns: prevTableData.columns,
          rows: dataRows,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [handleEditClick]);
  
  return {
    columns: tableData.columns,
    rows: tableData.rows,
  };
}
