/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useState } from "react";
import Configurator from "components/Configurator";
import ConfiguratorButton from "components/ConfiguratorButton";

// Data
import walletTransactionTableData from "layouts/transactions/transactionsTable/data/transactionsTableData";
import { setOpenConfigurator, useMaterialUIController } from "context";
import AddWalletTransaction from 'layouts/transactions/addTransaction'
import EditWalletTransaction from 'layouts/transactions/editTransaction'
import axiosInstance from "axiosInstance";

import { useNotification } from "components/NotificationContext";
import { useUser } from "context/userContext";

function Tables() {

  const [controller, dispatch] = useMaterialUIController();
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, true);

  const {user} = useUser()
  
  const [customContent, setCustomContent] = useState(null);
  const [customTitle, setCustomTitle] = useState(null);
  const [customDescription, setCustomDescription] = useState(null);

  const { showNotification } = useNotification();
  
  const handleAddClick = () => {
    handleConfiguratorOpen()
    setCustomContent(
      <AddWalletTransaction />
      )
      setCustomTitle("Realizar transacción")
      setCustomDescription("Ingresa la información del transacción")
    }
    
    const handleStateChange = async (id, movement_state) => {
      try {
        const response = await axiosInstance().put(`movements/change-state/${id}`, {movement_state})
        showNotification("success", "Tiquete actualizado correctamente", `El estado del tiquete identificado con ID ${response.data._id} se ha cambiado a ${response.data.movement_state}`);
        return true;
      } catch(error) {
        console.error('Error fetching investment data:', error.response.data.error);
        showNotification("error", "Error al editar la inversión", error.response.data.error);
        return false;
      }

    }

    const handleDeleteClick = (id) => {
      const deleteWalletTransaction = async () => {
        try {
          const response = await axiosInstance().delete(`/packages/${id}`)
          showNotification("success", "Transacción eliminada correctamente", `El ID de la transacción es ${response.data._id} `);
        } catch (error) {
            console.error('Error adding walletTransaction:', error.response.data.error);
            showNotification("error", "Error al editar la transacción", error.response.data.error);
        }

      }  
      deleteWalletTransaction()
    }

    const { columns, rows } = walletTransactionTableData(handleStateChange);
    
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Transacciones
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Configurator customDescription={customDescription} customTitle={customTitle} customContent={customContent} />
      { user.__t == "Client" &&
        <ConfiguratorButton icon="add" pos={1} f={handleAddClick} vl="Transferir entre billeteras" />
      }

      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
