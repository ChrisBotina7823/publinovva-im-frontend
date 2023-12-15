// DataTable.js
import React, { useState, useEffect } from 'react';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import axiosInstance from 'axiosInstance';
import socket from 'socketInstance'; // Import your socket instance

export default function DataTable(handleEditClick) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Transacción", accessor: "walletTransaction", width: "30%", align: "left" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      try {
        const userId = (JSON.parse(localStorage.getItem("user"))).username;
        const response = await axiosInstance.get(`/movements/wallet-transactions/${userId}`);
        const dataRows = response.data.map((dataItem) => ({
          walletTransaction: (
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
                Editar
              </MDTypography>
            </MDBox>
          ),
        }));

        setTableData((prevTableData) => ({
          columns: prevTableData.columns,
          rows: dataRows,
        }));
      } catch (error) {
        console.error('Error al obtener los datos:', error.response.data.error);
      }
    };

    fetchData();

    // Listen for updates from the server via Socket.IO
    socket.on('walletTransactionsUpdate', fetchData);

    // Cleanup the effect
    return () => {
      socket.off('walletTransactionsUpdate', fetchData);
    };
  }, []);

  return {
    columns: tableData.columns,
    rows: tableData.rows,
  };
}
