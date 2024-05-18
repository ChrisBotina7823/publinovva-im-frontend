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

import React, { useState } from "react";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import Configurator from "components/Configurator";
import ConfiguratorButton from "components/ConfiguratorButton";
import { useMaterialUIController, setOpenConfigurator } from "context";
import AddTransaction from "layouts/billing/addTransaction";
import { useUser } from "context/userContext";
import { formatCurrency } from "utils";
import MDTypography from "components/MDTypography";
import { Card, Chip, Divider } from "@mui/material";
import { faBitcoin, faEthereum } from "@fortawesome/free-brands-svg-icons";

function Billing() {

  const {user, setUser} = useUser()
  const admin = user ? (user.__t === "Client" ? user.admin : null) : null;

  const [controller, dispatch] = useMaterialUIController();
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, true);
  const [customContent, setCustomContent] = useState(null);
  const [customTitle, setCustomTitle] = useState(null);
  const [customDescription, setCustomDescription] = useState(null);

  const handleAddTransactionClick = () => {
    handleConfiguratorOpen();
    setCustomContent(<AddTransaction />);
    setCustomTitle("Solicitar ingreso/retiro")
    setCustomDescription("Ingresa la información de transacción")
  };
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4} mx={4}>
        <Grid container spacing={3} item xs={12} lg={12} alignItems="flex-start">
            { admin &&
              <Grid container  spacing={3} item xs={12} xl={6}>
                <Grid item xs={12} xl={12}>
                  <Card>
                    <MDBox p={2} mx={3}>
                      <MDTypography my={0} variant="h4" fontWeight="medium" textTransform="capitalize">Información de Depósito</MDTypography>
                      <MDTypography variant="body2" color="text" fontWeight="regular">{admin.entity_name}</MDTypography>
                    </MDBox>
                  </Card>
                </Grid>
                <Grid item xs={12} xl={6}>
                  <DefaultInfoCard
                    icon={faBitcoin}
                    title="Dirección Bitcoin"
                    picture={admin.btc_qr}
                    value={admin.btc_address || "---"}
                    isFontAwesome
                  />
                </Grid>
                <Grid item xs={12} xl={6}>
                  <DefaultInfoCard
                    icon={faEthereum}
                    title="Dirección Ethereum"
                    picture={admin.ethereum_qr}
                    value={admin.ethereum_address || "---"}
                    isFontAwesome
                  />
                </Grid>
              </Grid>
            }
            {user.usd_wallet && user.i_wallet &&
              <Grid container spacing={3} item xs={12} xl={6} alignItems="flex-start">
                <Grid item xs={12} xl={12}>
                  <Card >
                    <MDBox p={2} mx={3}>
                      <MDTypography my={0} variant="h4" fontWeight="medium" textTransform="capitalize">Billeteras Activas</MDTypography>
                      <MDTypography variant="body2" color="text" fontWeight="regular">{user.username}</MDTypography>
                    </MDBox>
                  </Card>
                </Grid>
                <Grid item xs={12} xl={6}>
                  <DefaultInfoCard
                    icon="wallet"
                    title="Billetera USDT (trc20)"
                    description={user.usd_wallet.address || user.usd_wallet._id }
                    value={`${formatCurrency(user.usd_wallet.available_amount)}`}
                  />
                </Grid>
                <Grid item xs={12} xl={6}>
                  <DefaultInfoCard
                    icon="wallet"
                    title="Billetera de Comercio"
                    description={user.i_wallet._id}
                    value={`${formatCurrency(user.i_wallet.available_amount)}`}
                  />
                </Grid>
              </Grid>
            }
        </Grid>
      </MDBox>
      <Configurator customDescription={customDescription} customTitle={customTitle} customContent={customContent} />
      {user?.__t == "Client" &&
        <ConfiguratorButton icon="add" pos={1} f={handleAddTransactionClick} vl="Solicitar depósito/retiro"/>
      }
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
