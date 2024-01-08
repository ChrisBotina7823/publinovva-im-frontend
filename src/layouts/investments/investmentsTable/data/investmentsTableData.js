/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDProgress from 'components/MDProgress';
import axiosInstance from 'axiosInstance';
import socket from 'socketInstance'; // Importa el objeto socket que creamos
import MDCopyable from 'components/MDCopyable';
import MDBadge from 'components/MDBadge';
import { useUser } from 'context/userContext';

export default function DataTable(handleEditClick, updateLoading) {

  const colorsDict = {
    "pendiente": "warning",
    "en curso": "success",
    "rechazado": "error",
    "finalizado": "info",
  };
  const { user } = useUser()

  const [tableData, setTableData] = useState({
    columns: [
      { Header: 'ID', accessor: 'id', width: '10%', align: 'center' },
      { Header: 'Paquete', accessor: 'package', width: '15%', align: 'center' },
      { Header: 'Cliente', accessor: 'client', width: '15%', align: 'center' },
      { Header: 'Fecha de Solicitud', accessor: 'start_date', width: '30%', align: 'center' },
      { Header: 'Fecha de Inicio', accessor: 'actual_start_date', width: '30%', align: 'center' },
      { Header: 'Fecha de Fin', accessor: 'end_date', width: '30%', align: 'center' },
      { Header: 'Estado', accessor: 'state', width: '30%', align: 'center' },
      { Header: 'Monto de Inversión', accessor: 'inv_amount', width: '30%', align: 'center' },
      { Header: 'Ingresos', accessor: 'revenue', width: '30%', align: 'center' },
      { Header: 'Acción', accessor: 'action', align: 'center' },
    ],
    rows: [],
  });

  const mapDataToJSX = (data) => {
    return data.reverse().map((dataItem) => ({
      id: <MDCopyable variant="thin" vl={dataItem.shortId || dataItem._id} />,
      start_date: <span>{(new Date(dataItem.start_date)).toLocaleDateString()}</span>,
      actual_start_date: (
        <MDBox>
          {dataItem.actual_start_date && <span>{(new Date(dataItem.actual_start_date)).toLocaleDateString()}</span>}
        </MDBox>
      ),
      end_date: (<MDBox>
        <span>{(new Date(dataItem.end_date)).toLocaleDateString()}</span>
      </MDBox>),
      package: (<MDBox>
        <MDBox>
          <MDTypography>{dataItem.package?.name}</MDTypography>
          <MDCopyable variant="caption" vl={dataItem.package?._id} />
        </MDBox>
      </MDBox>),
      state: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={dataItem.state} color={colorsDict[dataItem.state]} variant="gradient" size="md" />
        </MDBox>
      ),
      client: (
        <MDBox>
          <MDTypography>{dataItem.client?.fullname}</MDTypography>
          <MDCopyable variant="caption" vl={dataItem.client?._id} />
      </MDBox>
      ),
      inv_amount: (
        <MDTypography variant="h5">
          {`$${dataItem.inv_amount}`}
        </MDTypography>
      ),
      revenue: (
        <MDTypography variant="h5">
          {`$${dataItem.revenue}`}
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
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetching data...")
        const response = await axiosInstance().get(`/investments/user/${user.username}`);
        const dataRows = mapDataToJSX(response.data);

        setTableData({
          columns: tableData.columns,
          rows: dataRows,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        localStorage.deleteItem("token")
      } finally { 
        updateLoading()
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
