// DataTable.js
import React, { useState, useEffect } from 'react';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axiosInstance from 'axiosInstance';
import socket from 'socketInstance'; // Importa tu instancia de socket

export default function DataTable(handleEditClick) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Ticket", accessor: "supportTicket", width: "30%", align: "left" },
      { Header: "Estado", accessor: "state", width: "30%", align: "left" },
    ],
    rows: [],
  });

  const fetchData = async () => {
    try {
      console.log("fetching data...");
      const userId = JSON.parse(localStorage.getItem("user")).username;
      const response = await axiosInstance.get(`/movements/support-tickets/${userId}`);
      const dataRows = response.data.map((dataItem) => ({
        supportTicket: (
          <MDTypography key={dataItem._id}>
            {JSON.stringify(dataItem)}
          </MDTypography>
        ),
        state: (
          <FormControl key={dataItem._id} fullWidth>
            <InputLabel id={`state-${dataItem._id}`}>Estado</InputLabel>
            <Select
              labelId={`state-${dataItem._id}`}
              id={`state-${dataItem._id}`}
              value={dataItem.movement_state}
              onChange={async (e) => await handleEditClick(dataItem._id, e.target.value)}
              sx={{ paddingY: '8px' }}
              fullWidth
            >
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="resuelto">Resuelto</MenuItem>
              <MenuItem value="remitido">Remitido</MenuItem>
              <MenuItem value="cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>
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

  useEffect(() => {
    fetchData();

    // Escucha actualizaciones desde el servidor a través de Socket.IO
    socket.on('movementsUpdate', fetchData);

    // Limpia el efecto
    return () => {
      socket.off('movementsUpdate', fetchData);
    };
  }, []);

  return {
    columns: tableData.columns,
    rows: tableData.rows,
  };
}
