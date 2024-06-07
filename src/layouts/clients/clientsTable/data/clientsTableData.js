  import React, { useState, useEffect } from 'react';
  import MDBox from 'components/MDBox';
  import MDTypography from 'components/MDTypography';
  import axiosInstance from 'axiosInstance';
  import socket from 'socketInstance'; // Importa el objeto socket que creamos
import MDCopyable from 'components/MDCopyable';
import MDAvatar from 'components/MDAvatar';
import MDBadge from 'components/MDBadge';
import { useConfirm } from 'material-ui-confirm';
import { useNotification } from 'components/NotificationContext';
import { formatCurrency } from 'utils';

  export default function DataTable(showNotification, handleEditClick, handleDeleteClick, setLoading) {

    const colorsDict = {
      "en revision": "secondary",
      "suspendido": "error",
      "activo": "success"
    }

    const [tableData, setTableData] = useState({
      columns: [
        // { Header: 'Cliente', accessor: 'client', width: '30%', align: 'center' },
        { Header: 'id', accessor: 'id', width: '15%', align: 'center' },
        { Header: 'Perfil', accessor: 'profile', width: '30%', align: 'center' },
        { Header: 'Datos Personales', accessor: 'personal_data', width: '30%', align: 'center' },
        { Header: 'Saldo USD', accessor: 'usd_balance', width: '30%', align: 'center' },
        { Header: 'Estado', accessor: 'state', width: '30%', align: 'center' },
        { Header: 'action', accessor: 'action', align: 'center' },
      ],
      rows: [],
    });

    const confirm = useConfirm()
    const confirmDelete = (element) => {
      confirm({ title: "Eliminar Cliente", description: `¿Estás seguro de que quieres eliminar el cliente ${element}?\n(Esta acción no se puede revertir)` })
      .then(() => {
        handleDeleteClick(element)
      })
      .catch(() => {
      });
    }

    const mapDataToJSX = (data) => {
      // console.log(data)
      return data.reverse().map((dataItem) => ({
        // client: (
        //   <MDTypography key={dataItem.username}>
        //     {JSON.stringify(dataItem)}
        //   </MDTypography>
        // ),
        id: (
          <MDBox>
            <MDCopyable variant="thin" vl={dataItem.shortId || dataItem._id}/>
            {dataItem.suspended &&
              <MDBadge size="lg" variant="gradient" fontWeight="bold" color="error" badgeContent="INACTIVA"/>
            }
          </MDBox>

        ),
        profile: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={dataItem.profile_picture} name={dataItem.fullname} size="sm" />
            <MDBox ml={2} lineHeight={1}>
              <MDTypography my={0} display="block"fontWeight="medium">
                {dataItem.username}
              </MDTypography>
              <MDTypography variant="h6" display="block">{dataItem.fullname}</MDTypography>
              <MDCopyable vl={dataItem.email} variant="caption"></MDCopyable>
            </MDBox>
          </MDBox>
        ),
        personal_data: (
          <MDBox lineHeight={1}>
            <MDTypography >{dataItem.country}</MDTypography>
            <MDCopyable variant="caption" vl={dataItem.phone}></MDCopyable>
          </MDBox>
        ),
        usd_balance: (
          <MDTypography variant="h5">
            {`${formatCurrency(dataItem.usd_wallet.available_amount)}`}
          </MDTypography>
        ),
        state: (
          <MDBox ml={-1}>
            <MDBadge badgeContent={dataItem.account_state} color={colorsDict[dataItem.account_state]} variant="gradient" size="md" />
          </MDBox>
        ),
        action: (
          <MDBox key={dataItem.username}>
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
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance().get('/admins/clients');
          const dataRows = mapDataToJSX(response.data);

          setTableData((prevTableData) => ({
            columns: prevTableData.columns,
            rows: dataRows,
          }));
        } catch (error) {
          console.error('Error fetching data:', error);
          if(error.response.status == 401) showNotification("error", "Tu sesión ha expirado", "Vuelve a iniciar sesión para continuar")
        } finally {
          setLoading()
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
