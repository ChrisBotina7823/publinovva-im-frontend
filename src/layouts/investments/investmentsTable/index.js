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
import { useMaterialUIController, setOpenConfigurator } from "context";

// Data
import investmentsTableData from "layouts/investments/investmentsTable/data/investmentsTableData";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";

import EditInvestment from 'layouts/investments/editInvestment';
import { CircularProgress } from "@mui/material";

function Tables() {
  const [customContent, setCustomContent] = useState(null);
  const [customTitle, setCustomTitle] = useState(null);
  const [customDescription, setCustomDescription] = useState(null);

  const { showNotification } = useNotification();

  const [controller, dispatch] = useMaterialUIController();
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, true);


  const handleEditClick = (id) => {
    handleConfiguratorOpen()
    setCustomContent(
      <EditInvestment investmentId={id} />
    );
    setCustomTitle("Editar Inversión")
    setCustomDescription("Cambia los datos de la inversión")

  };

  const [loading, setLoading] = useState(true)

  const updateLoading = () => {
    setLoading(false)
  }
  const { columns, rows } = investmentsTableData(showNotification, handleEditClick, updateLoading);

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
                  Inversiones
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
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
