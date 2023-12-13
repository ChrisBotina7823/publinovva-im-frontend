// DataTable.js
import React, { useState, useEffect } from 'react';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import axiosInstance from 'axiosInstance';

export default function DataTable(handleEditClick, handleDeleteClick) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Transacción", accessor: "walletTransaction", width: "30%", align: "left" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = (JSON.parse(localStorage.getItem("user"))).username
        const response = await axiosInstance.get(`/movements/wallet-transactions/${userId}`);
        const dataRows = response.data.map((dataItem) => ({
          walletTransaction: (
            <MDTypography>
              {JSON.stringify(dataItem)}
            </MDTypography>
          ),
          action: (
            <MDBox>
              <MDTypography component="a" href="#"
                variant="caption" color="secondary" fontWeight="medium"
                onClick={() => handleEditClick(dataItem._id)}>
                Editar
              </MDTypography>
              <MDTypography component="a" href="#"
                variant="caption" color="error" fontWeight="medium"
                onClick={() => handleDeleteClick(dataItem._id)}
              >
                Eliminar
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
  }, [handleEditClick]);

  return {
    columns: tableData.columns,
    rows: tableData.rows,
  };
}
