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

export default function DataTable() {

  const { user } = useUser()

  const [tableData, setTableData] = useState({
    columns: [
      { Header: 'Inversión', accessor: 'investment', width: '30%', align: 'center' },
      { Header: 'Fecha', accessor: 'date', width: '10%', align: 'center' },
      { Header: 'Días de Inversión', accessor: 'daysDiff', width: '30%', align: 'center' },
      { Header: 'Ingreso', accessor: 'revenue_amount', width: '30%', align: 'center' },
    ],
    rows: [],
  });

  const mapDataToJSX = (rows) => {
    return rows.reverse().map((dataItem) => ({
      investment: <MDCopyable variant="thin" vl={dataItem.investment} />,
      date: <span>{(new Date(dataItem.date)).toLocaleDateString()}</span>,
      daysDiff: <span>{dataItem.days_diff}</span>,
      revenue_amount: (
        <MDTypography variant="h5">
          {`$${dataItem.revenue_amount}`}
        </MDTypography>
      ),
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetching data...")
        const response = await axiosInstance().get(`/investments/revenues/${user.username}`);
        
        const dataRows = mapDataToJSX(response.data)
  
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
