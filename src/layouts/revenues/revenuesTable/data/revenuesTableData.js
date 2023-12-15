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

export default function DataTable() {

  const user = JSON.parse(localStorage.getItem("user"))

  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Ingresos", accessor: "revenue", width: "30%", align: "left" },
    ],
    rows: [],
  });

  const mapDataToJSX = (rows) => {
    return rows.map((dataItem) => ({
      revenue: (
        <MDBox>
          <MDTypography>
            {JSON.stringify(dataItem)}
          </MDTypography>
        </MDBox>
      ),
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetching data...")
        const response = await axiosInstance.get(`/investments/revenues/${user.username}`);
        
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
