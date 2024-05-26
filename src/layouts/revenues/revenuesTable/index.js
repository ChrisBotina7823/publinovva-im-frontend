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
import { useMaterialUIController, setOpenConfigurator } from "context";
import { useEffect, useState } from "react";
import { useNotification } from "components/NotificationContext";
import Configurator from "components/Configurator";
import ConfiguratorButton from "components/ConfiguratorButton";

// Data
import revenuesTableData from "layouts/revenues/revenuesTable/data/revenuesTableData";
import { useUser } from "context/userContext";
import { CircularProgress } from "@mui/material";
import { formatCurrency } from "utils";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import axiosInstance from "axiosInstance";
import InvestmentDetail from "../investmentDetail";

function Tables() {

  const [controller, dispatch] = useMaterialUIController();
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, true);

  const {user} = useUser()
  const [customContent, setCustomContent] = useState(null);
  const [customTitle, setCustomTitle] = useState(null);
  const [customDescription, setCustomDescription] = useState(null);

  const { showNotification } = useNotification();



  const handleInvestmentDetail = (id) => {
    handleConfiguratorOpen();
    setCustomContent(
      <InvestmentDetail id={id} />
    )
    setCustomTitle("Detalles de la inversión")
    setCustomDescription("Información detallada de la inversión")
  };
      
  
  const [loading, setLoading] = useState(true)

  const updateLoading = () => {
    setLoading(false)
  }

  const { columns, rows } = revenuesTableData(showNotification, updateLoading, handleInvestmentDetail);

  const [ sampleChart, setSampleChart ] = useState(null)
  const [ totalRevenue, setTotalRevenue ] = useState(0)
  const [ totalInvested, setTotalInvested ] = useState(0)

  try {
    useEffect(() => {
      axiosInstance().get(`/investments/report/${user._id}`)
        .then(response => {
          setTotalInvested(response.data.total_invested)
          setTotalRevenue(response.data.total_revenue)
          console.log(response.data.chart)
          setSampleChart(response.data.chart)
        })
    }, [])
  } catch(err) {
    console.log(err)
    if(err.response) {
      showNotification("error", "Error al cargar los datos", err.response.data.message)
    }
    showNotification("error", "Error al cargar los datos", "Ocurrió un error al cargar los datos de las inversiones")
  }


  // const sampleChart = {
  //   labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  //   datasets: [{ label: "Mobile apps", data: [50, 40, 300, 320, 500, 350, 200, 230, 500] }],
  // }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <MDBox>
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
                  Ingresos
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox px={2} pt={3} textAlign="center">
              {loading ? (
                    <CircularProgress color="secondary" size={60} />
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <MDBox p={2}>
                          <MDTypography variant="h3">{formatCurrency(totalInvested)}</MDTypography>
                          <MDTypography variant="h6">Total Invertido</MDTypography>
                        </MDBox>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <MDBox p={2}>
                          <MDTypography variant="h3">{formatCurrency(totalRevenue)}</MDTypography>
                          <MDTypography variant="h6">Ingresos totales</MDTypography>
                        </MDBox>
                      </Card>
                    </Grid>
                    { sampleChart && (
                      <Grid item xs={12} md={12}>
                        <DefaultLineChart icon="money" title="Ingresos Semanales" description="Un resumen de tus ingresos de los últimos 7 días (Tus inversiones generan ingresos a las 00:00 UTC)"  chart={ sampleChart } />
                      </Grid>                    
                    )}
                  </Grid>
                )}
              </MDBox>
          </Grid>
          <Grid item xs={12} md={6}>
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

      <Configurator customDescription={customDescription} customTitle={customTitle}  customContent={customContent} />

      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
