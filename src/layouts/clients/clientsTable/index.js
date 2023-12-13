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
import packageTableData from "layouts/clients/clientsTable/data/clientsTableData"; // Updated path
import { setOpenConfigurator, useMaterialUIController } from "context";
import AddClient from 'layouts/clients/addClient'; // Updated path
import EditClient from 'layouts/clients/editClient'; // Updated path
import axiosInstance from "axiosInstance";

import { useNotification } from "components/NotificationContext";

function Tables() {

  const [controller, dispatch] = useMaterialUIController();
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, true);

  
  const [customContent, setCustomContent] = useState(null);

  const { showNotification } = useNotification();
  
  const handleAddClick = () => {
    handleConfiguratorOpen()
    setCustomContent(
      <AddClient />
      )
    }
    
    const handleEditClick = (id) => {
      handleConfiguratorOpen()
      setCustomContent(
        <EditClient id={id} />
      )
    }

    const handleDeleteClick = (username) => {
      const deletePackage = async () => {
        try {
          const response = await axiosInstance.delete(`/clients/${username}`); // Updated path
          showNotification("success", "Cliente eliminado correctamente", `El cliente identificado con ${username} se ha eliminado`);
        } catch (error) {
          console.error(error)
            console.error('Error deleting client:', error.response.data.error);
            showNotification("error", "Error al eliminar el cliente", error.response.data.error);
        }

      }  
      deletePackage()
    }

    const { columns, rows } = packageTableData(handleEditClick, handleDeleteClick); // Updated function name
    
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
                  Clientes
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

      <Configurator customContent={customContent} />
      <ConfiguratorButton icon="add" f={handleAddClick} pos={1} />

      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
