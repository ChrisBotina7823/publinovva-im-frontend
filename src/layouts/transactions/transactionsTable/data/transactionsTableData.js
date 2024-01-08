// DataTable.js
import React, { useState, useEffect } from 'react';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import axiosInstance from 'axiosInstance';
import socket from 'socketInstance'; // Import your socket instance
import { useUser } from 'context/userContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import EditTransactionForm from "layouts/transactions/editTransaction"
import MDCopyable from 'components/MDCopyable';
import MDBadge from 'components/MDBadge';
import { useNotification } from 'components/NotificationContext';

export default function DataTable(showNotification, handleEditClick, updateLoading) {
  const colorsDict = {
    "pendiente": "warning",
    "aprobado": "success",
    "rechazado": "error",
    "remitido": "info",
    "cancelado": "error",
    "resuelto": "success",
  };
  
  const { user } = useUser()
  const [tableData, setTableData] = useState({
    columns: [
      { Header: 'ID', accessor: 'id', width: '20%', align: 'center' },
      { Header: 'Cliente', accessor: 'client', width: '15%', align: 'center' },
      { Header: 'Administrador', accessor: 'admin', width: '15%', align: 'center' },
      { Header: 'Fecha', accessor: 'date', width: '15%', align: 'center' },
      { Header: 'Estado', accessor: 'movement_state', width: '15%', align: 'center' },
      { Header: 'Monto de Transacción', accessor: 'transaction_amount', width: '20%', align: 'center' },
      { Header: 'Tipo de Transacción', accessor: 'transaction_type', width: '20%', align: 'center' },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      try {
        const response = await axiosInstance().get(`/movements/wallet-transactions/${user.username}`);
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
          transaction_amount: (
            <MDBox>
              {dataItem.received_amount > 0 &&
                <MDTypography variant="h6">{`$${dataItem.received_amount}`}</MDTypography>
              }
              <MDTypography variant="caption" fontWeight="bold">{`($${dataItem.transaction_amount} solicitados)`}</MDTypography>
            </MDBox>
          ),
          transaction_type: <span>{dataItem.transaction_type}</span>,
          action: (
            <MDBox>
              {dataItem.movement_state == "pendiente" &&
                <EditTransactionForm dataItem={dataItem}/>
              }
            </MDBox>
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

    fetchData();

    // Listen for updates from the server via Socket.IO
    socket.on('movementsUpdate', fetchData);

    // Cleanup the effect
    return () => {
      socket.off('movementsUpdate', fetchData);
    };
  }, []);

  return {
    columns: tableData.columns,
    rows: tableData.rows,
  };
}
