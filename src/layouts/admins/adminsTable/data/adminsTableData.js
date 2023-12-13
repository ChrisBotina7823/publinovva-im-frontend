/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from 'react';
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import axiosInstance from 'axiosInstance';

export default function DataTable() {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Administrador", accessor: "admin", width: "30%", align: "left" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('admins');
        const dataRows = response.data.map((dataItem) => ({
          admin: (
            <MDBox>
              <MDTypography>
                {JSON.stringify(dataItem)}
              </MDTypography>
            </MDBox>
          ),
        }));

        setTableData({
          columns: tableData.columns,
          rows: dataRows,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures that the effect runs once when the component mounts

  return {
    columns: tableData.columns,
    rows: tableData.rows,
  };
}
