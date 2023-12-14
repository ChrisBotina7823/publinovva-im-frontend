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

function Tables() {
  const [customContent, setCustomContent] = useState(null);
  const { showNotification } = useNotification();

  const [controller, dispatch] = useMaterialUIController();
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, true);


  const handleEditClick = (id) => {
    handleConfiguratorOpen()
    setCustomContent(
      <EditInvestment investmentId={id} />
    );
  };


  const { columns, rows } = investmentsTableData(handleEditClick);

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
      <ConfiguratorButton icon="add" pos={1} />
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
