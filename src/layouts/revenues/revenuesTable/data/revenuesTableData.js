/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from 'react';
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import axiosInstance from 'axiosInstance';
import socket from 'socketInstance';
import data from 'layouts/dashboard/components/Projects/data';
import { useUser } from 'context/userContext';
import MDCopyable from 'components/MDCopyable';
import { useNotification } from 'components/NotificationContext';
import { formatCurrency } from 'utils';
import MDBadge from 'components/MDBadge';
import MDButton from 'components/MDButton';

export default function DataTable(showNotification, updateLoading, handleInvestmentDetail) {

  const { user } = useUser()

  const colorsDict = {
    "pendiente": "warning",
    "en curso": "success",
    "rechazado": "error",
    "finalizado": "info",
  };

  const [tableData, setTableData] = useState({
    columns: [
      { Header: 'Información', accessor: 'id', width: '15%', align: 'center' },
      { Header: 'Monto invertido', accessor: 'conditions', width: '20%', align: 'center' },
      { Header: 'Acciones', accessor: 'status', width: '15%', align: 'center' },
    ],
    rows: [],
  });

  const mapDataToJSX = (rows) => {
    return rows.reverse().map((dataItem) => ({
      id: (
        <MDBox>
          <MDCopyable variant="thin" vl={dataItem.shortId || dataItem._id} />
          <MDTypography variant="body2">{(new Date(dataItem.actual_start_date || dataItem.start_date)).toLocaleDateString()} {" - "} {(new Date(dataItem.end_date)).toLocaleDateString()} </MDTypography>
          <MDBadge color={colorsDict[dataItem.state]} variant="gradient" badgeContent={dataItem.state}/>
        </MDBox>
      ),
      conditions: (
        <>
          <MDTypography>
            {`${formatCurrency(dataItem.inv_amount)}`}
          </MDTypography>
          <MDTypography variant="body2"> {dataItem.package ? (`${dataItem.package.revenue_percentage}% cada ${dataItem.package.revenue_freq} día${dataItem.package.revenue_freq == 1 ? "" : "s"}`) : ("Sin asignar")}</MDTypography>
        </>
      ),
      status: (
        <>
          {dataItem.state != "pendiente" && (
            <MDButton size="small" onClick={() => handleInvestmentDetail(dataItem._id)} color="secondary" fullWidth>Ingresos</MDButton>
          )}
        </>
      )
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetching data...")
        const response = await axiosInstance().get(`/investments/user/${user._id}`);
        
        const dataRows = mapDataToJSX(response.data)
  
        setTableData({
          columns: tableData.columns,
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
  
    // Escuchar eventos de actualización desde el servidor Socket.IO
    socket.on('revenuesUpdate', (updatedData) => {
      fetchData();
    });
  
    // Limpieza del efecto
    return () => {
      socket.off('revenuesUpdate');
    };
  
  }, []); // Empty dependency array ensures the effect runs only once
  

  return {
    columns: tableData.columns,
    rows: tableData.rows,
  };
}
