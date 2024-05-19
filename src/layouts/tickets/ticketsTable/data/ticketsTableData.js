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
import { useUser } from 'context/userContext';
import MDCopyable from 'components/MDCopyable';
import MDBadge from 'components/MDBadge';
import { useNotification } from 'components/NotificationContext';

export default function DataTable(showNotification, handleEditClick, updateLoading) {

  const { user } = useUser()
  const colorsDict = {
    "pendiente": "warning",
    "aprobado": "success",
    "rechazado": "error",
    "remitido": "info",
    "cancelado": "error",
    "resuelto": "success",
  };

  const [tableData, setTableData] = useState({
    columns: [
      { Header: 'ID', accessor: 'id', width: '10%', align: 'center' },
      { Header: 'Fecha', accessor: 'date', width: '15%', align: 'center' },
      { Header: 'Estado', accessor: 'movement_state', width: '15%', align: 'center' },
      { Header: 'Administrador', accessor: 'admin', width: '15%', align: 'center' },
      { Header: 'Cliente', accessor: 'client', width: '15%', align: 'center' },
      { Header: 'Descripción', accessor: 'description', width: '20%', align: 'center' },
      { Header: 'Categoría de Ticket', accessor: 'category', width: '15%', align: 'center' },
      { Header: "Estado", accessor: "action", width: "30%", align: "center" },
    ],
    rows: [],
  });

  const fetchData = async () => {
    try {
      console.log("fetching data...");
      const response = await axiosInstance().get(`/movements/support-tickets/${user._id}`);
      const dataRows = response.data.reverse().map((dataItem) => ({
        id: <MDCopyable variant="thin" vl={dataItem.shortId || dataItem._id} />,
        date: <span>{(new Date(dataItem.date)).toLocaleDateString()}</span>,
        movement_state: (
          <MDBox ml={-1}>
            <MDBadge badgeContent={dataItem.movement_state} color={colorsDict[dataItem.movement_state]} variant="gradient" size="md" />
          </MDBox>
        ),
        admin: (
          <MDBox>
            <MDTypography>{dataItem.admin?.entity_name}</MDTypography>
            <MDCopyable variant="caption" vl={dataItem.admin?.shortId || dataItem.admin?._id} />
          </MDBox>
        ),
        client: (
          <MDBox>
            <MDTypography>{dataItem.client?.fullname}</MDTypography>
            <MDCopyable variant="caption" vl={dataItem.admin?.shortId || dataItem.client?._id} />
          </MDBox>
        ),
        description: <span>{dataItem.description}</span>,
        // Add category for tickets
        category: dataItem.category || '', // Assuming 'category' is available in ticket data
        action: (
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

      const columns = tableData.columns.filter((column) => column.accessor !== 'action');
      setTableData({
        columns: user.__t !== 'Client' ? [...columns, { Header: 'action', accessor: 'action', align: 'center' }] : columns,
        rows: dataRows,
      });
    } catch (error) {
      console.error('Error al obtener los datos:', error.response.data.error);
      if(error.response.status == 401) showNotification("error", "Tu sesión ha expirado", "Vuelve a iniciar sesión para continuar")
    } finally {
      updateLoading()
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
