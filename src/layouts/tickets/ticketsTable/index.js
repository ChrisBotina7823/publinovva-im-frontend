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
import TicketTableData from "layouts/tickets/ticketsTable/data/ticketsTableData";
import { setOpenConfigurator, useMaterialUIController } from "context";
import AddTicket from 'layouts/tickets/addTicket'
import EditTicket from 'layouts/tickets/editTicket'
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
      <AddTicket />
      )
    }
    
    const handleEditClick = (id) => {
      handleConfiguratorOpen()
      setCustomContent(
        <EditTicket id={id} />
      )
    }

    const handleDeleteClick = (id) => {
      const deleteTicket = async () => {
        try {
          const response = await axiosInstance.delete(`/packages/${id}`)
          showNotification("success", "Transacción eliminada correctamente", `El ID de la transacción es ${response.data._id} `);
        } catch (error) {
            console.error('Error adding Ticket:', error.response.data.error);
            showNotification("error", "Error al editar la transacción", error.response.data.error);
        }

      }  
      deleteTicket()
    }

    const { columns, rows } = TicketTableData(handleEditClick, handleDeleteClick);
    
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
                  Tickets de Soporte
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
