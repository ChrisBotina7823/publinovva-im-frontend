  import React, { useState, useEffect } from 'react';
  import MDBox from 'components/MDBox';
  import MDTypography from 'components/MDTypography';
  import axiosInstance from 'axiosInstance';
  import socket from 'socketInstance'; // Importa el objeto socket que creamos

  export default function DataTable(handleEditClick, handleDeleteClick) {
    const [tableData, setTableData] = useState({
      columns: [
        { Header: 'Cliente', accessor: 'client', width: '30%', align: 'left' },
        { Header: 'action', accessor: 'action', align: 'center' },
      ],
      rows: [],
    });

    const mapDataToJSX = (data) => {
      return data.map((dataItem) => ({
        client: (
          <MDTypography key={dataItem.username}>
            {JSON.stringify(dataItem)}
          </MDTypography>
        ),
        action: (
          <MDBox key={dataItem.username}>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="secondary"
              fontWeight="medium"
              onClick={() => handleEditClick(dataItem.username)}
            >
              Edit
            </MDTypography>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="error"
              fontWeight="medium"
              onClick={() => handleDeleteClick(dataItem.username)}
            >
              Delete
            </MDTypography>
          </MDBox>
        ),
      }));
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get('/admins/clients');
          const dataRows = mapDataToJSX(response.data);

          setTableData((prevTableData) => ({
            columns: prevTableData.columns,
            rows: dataRows,
          }));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();

      // Escuchar eventos de actualización desde el servidor Socket.IO
      socket.on('clientsUpdate', () => {
        fetchData()
      });

      // Limpieza del efecto
      return () => {
        socket.off('clientsUpdate');
      };
    }, []);

    return {
      columns: tableData.columns,
      rows: tableData.rows,
    };
  }
