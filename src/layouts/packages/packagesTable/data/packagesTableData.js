import React, { useState, useEffect } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import axiosInstance from 'axiosInstance';
import socket from 'socketInstance';
import MDCopyable from 'components/MDCopyable';
import { useUser } from 'context/userContext';
import { useConfirm } from 'material-ui-confirm';
import { useNotification } from 'components/NotificationContext';

export default function DataTable(showNotification, handleEditClick, handleDeleteClick, updateLoading) {
  
  const { user } = useUser();
  const [tableData, setTableData] = useState({
    columns: [
      { Header: 'id', accessor: 'id', align: 'center' },
      { Header: 'nombre', accessor: 'name', align: 'center' },
      { Header: 'requisitos', accessor: 'requirements', align: 'center' },
      { Header: 'beneficios', accessor: 'benefits', align: 'center' },
      { Header: 'Monto Global', accessor: 'global_amount', align: 'center' },
      { Header: 'action', accessor: 'action', align: 'center' },
    ],
    rows: [],
  });

  const confirm = useConfirm()
  const confirmDelete = (element) => {
    confirm({ title: "Eliminar Paquete", description: `¿Estás seguro de que quieres eliminar el paquete ${element}?\n(Esta acción no se puede revertir)` })
    .then(() => {
      console.log("a")
      handleDeleteClick(element)
    })
    .catch(() => {
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');

        const response = await axiosInstance().get(`/packages/user/${user.username}`);
        const dataRows = response.data.reverse().map((dataItem) => ({
          id: <MDCopyable variant="thin" vl={dataItem.shortId || dataItem._id} />,
          name: <MDTypography>{dataItem.name}</MDTypography>,
          requirements: (
            <MDBox lineHeight={1}>
              <MDTypography variant="h5">{`$${dataItem.min_opening_amount}`}</MDTypography>
              <MDTypography variant="caption">{`${dataItem.min_inv_days} días mínimo`}</MDTypography>
            </MDBox>
          ),
          benefits: (
            <MDBox lineHeight={1}>
              <MDTypography variant="h5">{`${dataItem.revenue_percentage * 100}%`}</MDTypography>
              <MDTypography variant="caption">{`Cada ${dataItem.revenue_freq} días`}</MDTypography>
            </MDBox>
          ),
          global_amount: <MDTypography variant="h4">{`$${dataItem.global_amount}`}</MDTypography>,
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
              <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="error"
                fontWeight="medium"
                ml={1}
                onClick={() => confirmDelete(dataItem._id)}
              >
                Eliminar
              </MDTypography>
            </MDBox>
          ),
        }));

        const columns = tableData.columns.filter((column) => column.accessor !== 'action');
        setTableData({
          columns: user.__t !== 'Client' ? [...columns, { Header: 'action', accessor: 'action', align: 'center' }] : columns,
          rows: dataRows,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        if(error.response.status == 401) showNotification("error", "Tu sesión ha expirado", "Vuelve a iniciar sesión para continuar")
      } finally {
        updateLoading()
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
