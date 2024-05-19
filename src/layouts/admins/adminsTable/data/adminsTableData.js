import React, { useState, useEffect } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import axiosInstance from 'axiosInstance';
import socket from 'socketInstance'; // Asegúrate de importar el objeto socket que creamos
import MDAvatar from 'components/MDAvatar';
import MDCopyable from 'components/MDCopyable';
import MDBadge from 'components/MDBadge';
import { useConfirm } from 'material-ui-confirm';
import { useNotification } from 'components/NotificationContext';

export default function DataTable(showNotification, handleEditClick, handleDeleteClick, updateLoading) {
  const colorsDict = {
    "suspendido": "error",
    "activo": "success"
  }
  
  const [tableData, setTableData] = useState({
    columns: [
      { Header: 'id', accessor: 'id', width: '15%', align: 'center' },
      { Header: 'Perfil', accessor: 'profile', width: '30%', align: 'center' },
      { Header: 'Depósito Ethereum', accessor: 'ethereum_info', width: '30%', align: 'center' },
      { Header: 'Depósito Bitcoin', accessor: 'btc_info', width: '30%', align: 'center' },
      { Header: 'Estado', accessor: 'state', width: '30%', align: 'center' },
      // { Header: 'Administrador', accessor: 'admin', width: '30%', align: 'left' },
      { Header: 'action', accessor: 'action', align: 'center' },
    ],
    rows: [],
  });

  const confirm = useConfirm()
  const confirmDelete = (element) => {
    confirm({ title: "Eliminar Administrador", description: `¿Estás seguro de que quieres eliminar el administrador ${element}?\n(Esta acción no se puede revertir)` })
    .then(() => {
      console.log("a")
      handleDeleteClick(element)
    })
    .catch(() => {
    });
  }

  const mapDataToJSX = (data) => {
    console.log(data)
    return data.reverse().map((dataItem) => ({
      // admin: (
      //   <MDBox key={dataItem.username}>
      //     <MDTypography>
      //       {JSON.stringify(dataItem)}
      //     </MDTypography>
      //   </MDBox>
      // ),
      id: (
        <MDCopyable variant="thin" vl={dataItem.shortId || dataItem._id}/>
        ),
      profile: (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={dataItem.profile_picture} name={dataItem.entity_name} size="sm" />
        <MDBox ml={2} lineHeight={1}>
          <MDTypography my={0} display="block"fontWeight="medium">
            {dataItem.username}
          </MDTypography>
          <MDTypography variant="h6" display="block">{dataItem.entity_name}</MDTypography>
          <MDCopyable vl={dataItem.email} variant="caption"></MDCopyable>
        </MDBox>
      </MDBox>
      ),
      ethereum_info:(
        <MDBox>
          <MDBox sx={{height:"10vh"}} 
            crossOrigin="anonymous"
            onError={(e) => e.target.src = "https://thumbs.dreamstime.com/b/seamless-circle-diagonal-stripe-pattern-vector-soft-background-regular-white-texture-90383470.jpg"} 
            component="img" 
            src={dataItem.ethereum_qr} 
            alt="ethereum_qr"/>
          <MDCopyable variant="thin" vl={dataItem.ethereum_address}/>
        </MDBox>
      ),
      btc_info:(
        <MDBox>
          <MDBox sx={{height:"10vh"}} 
            crossOrigin="anonymous"
            onError={(e) => e.target.src = "https://thumbs.dreamstime.com/b/seamless-circle-diagonal-stripe-pattern-vector-soft-background-regular-white-texture-90383470.jpg"}
            component="img" 
            src={dataItem.btc_qr} 
            alt="btc_qr"/>
          <MDCopyable variant="thin" vl={dataItem.btc_address}/>
        </MDBox>
      ),
      state: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={dataItem.account_state} color={colorsDict[dataItem.account_state]} variant="gradient" size="lg" />
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
            onClick={() => confirmDelete(dataItem._id)}
            ml={1}
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
        console.log("fetching data...")
        const response = await axiosInstance().get('admins');
        const dataRows = mapDataToJSX(response.data);

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
    socket.on('adminsUpdate', () => {
      fetchData();
    });

    // Limpieza del efecto
    return () => {
      socket.off('adminsUpdate');
    };
  }, []); // Agrega tableData.columns al array de dependencias para que useEffect se ejecute cuando cambie

  return {
    columns: tableData.columns,
    rows: tableData.rows,
  };
}
