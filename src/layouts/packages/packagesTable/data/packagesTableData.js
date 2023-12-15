// DataTable.js
import React, { useState, useEffect } from 'react';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import axiosInstance from 'axiosInstance';
import socket from 'socketInstance'; // Import your socket instance

export default function DataTable(handleEditClick, handleDeleteClick) {
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
        console.log("Fetching data...");
  
        const response = await axiosInstance.get('/packages');
        const dataRows = response.data.map((dataItem) => ({
          package: (
            <MDTypography key={dataItem._id}>
              {JSON.stringify(dataItem)}
            </MDTypography>
          ),
          action: (
            <MDBox key={dataItem._id}>
              <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="secondary"
                fontWeight="medium"
                onClick={() => handleEditClick(dataItem._id)}
              >
                Edit
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="error"
                fontWeight="medium"
                onClick={() => handleDeleteClick(dataItem._id)}
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
  
    // Listen for updates from the server via Socket.IO
    socket.on('packagesUpdate', fetchData);
  
    // Cleanup the effect
    return () => {
      socket.off('packagesUpdate', fetchData);
    };
  }, []);

  return {
    columns: tableData.columns,
    rows: tableData.rows,
  };
}
