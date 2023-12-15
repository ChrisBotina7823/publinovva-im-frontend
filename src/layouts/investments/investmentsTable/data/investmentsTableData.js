/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDProgress from 'components/MDProgress';
import axiosInstance from 'axiosInstance';
import socket from 'socketInstance'; // Importa el objeto socket que creamos

export default function DataTable(handleEditClick) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: 'Inversiones', accessor: 'investment', width: '30%', align: 'left' },
      { Header: 'Acciones', accessor: 'actions', align: 'center' },
    ],
    rows: [],
  });

  const mapDataToJSX = (data) => {
    return data.map((dataItem) => ({
      investment: (
        <MDBox>
          <MDTypography>{JSON.stringify(dataItem)}</MDTypography>
        </MDBox>
      ),
      actions: (
        <MDBox>
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
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetching data...")
        const response = await axiosInstance.get('/investments');
        const dataRows = mapDataToJSX(response.data);

        setTableData({
          columns: tableData.columns,
          rows: dataRows,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Escuchar eventos de actualización desde el servidor Socket.IO
    socket.on('investmentsUpdate', () => {
      fetchData();
    });

    // Limpieza del efecto
    return () => {
      socket.off('investmentsUpdate');
    };
  }, []); // Dependencias vacías para evitar ejecución continua

  return {
    columns: tableData.columns,
    rows: tableData.rows,
  };
}
