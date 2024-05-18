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
import adminsTableData from "layouts/admins/adminsTable/data/adminsTableData"; // Updated path
import { setOpenConfigurator, useMaterialUIController } from "context";
import AddAdmin from 'layouts/admins/addAdmin'; // Reemplaza con el componente adecuado
import EditAdmin from 'layouts/admins/editAdmin'; // Reemplaza con el componente adecuado
import axiosInstance from "axiosInstance";

import { useNotification } from "components/NotificationContext";
import { CircularProgress } from "@mui/material";
import { useUser } from "context/userContext";


function Tables() {
  const [controller, dispatch] = useMaterialUIController();
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, true);
  
  const [customContent, setCustomContent] = useState(null);
  const [customTitle, setCustomTitle] = useState(null);
  const [customDescription, setCustomDescription] = useState(null);
  
  const { showNotification } = useNotification();

  const handleAddClick = () => {
    handleConfiguratorOpen();
    setCustomContent(
      <AddAdmin /> // Reemplaza con el componente adecuado
    );
    setCustomTitle("Añadir administrador")
    setCustomDescription("Ingresa la información del administrador")
  };

  const handleEditClick = (id) => {
    handleConfiguratorOpen();
    setCustomContent(
      <EditAdmin id={id} /> // Reemplaza con el componente adecuado
    );
    setCustomTitle("Editar administrador")
    setCustomDescription("Cambia los datos del administrador")
  };

  const handleDeleteClick = (username) => {
    const deleteAdmin = async () => {
      try {
        const response = await axiosInstance().delete(`/admins/${username}`); // Reemplaza con la ruta adecuada
        showNotification(
          "success",
          "Administrador eliminado correctamente",
          `El administrador identificado con ${username} se ha eliminado`
        );
      } catch (error) {
        console.error(error);
        console.error('Error deleting admin:', error.response.data.error);
        showNotification("error", "Error al eliminar el administrador", error.response.data.error);
      }
    };

    deleteAdmin();
  };

  const [loading, setLoading] = useState(true)

  const updateLoading = () => {
    setLoading(false)
  }
  const { columns, rows } = adminsTableData(showNotification, handleEditClick, handleDeleteClick, updateLoading); // Reemplaza con la función adecuada
  
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
                  Administradores
                </MDTypography>
              </MDBox>
              <MDBox pt={3} textAlign="center">
              {loading ? (
                    <CircularProgress color="secondary" size={60} />
                ) : (
                    <>
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={true}
                      showTotalEntries={true}
                      noEndBorder
                    />
                    </>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Configurator customDescription={customDescription} customTitle={customTitle} customContent={customContent} />
      <ConfiguratorButton icon="add" pos={1} f={handleAddClick} vl="Añadir administrador" />

      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
