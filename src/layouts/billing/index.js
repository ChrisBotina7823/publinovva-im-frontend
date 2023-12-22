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

function Billing() {

  const {user, setUser} = useUser()
  const admin = user.__t === "Client" ? user.admin : user;

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

  console.log(user)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} xl={6}>
                  <MasterCard number={admin.deposit_address} holder={admin.entity_name} logo={admin.deposit_qr} expires="11/22" />
                </Grid>
                <Grid item xs={12} md={8} xl={3}>
                  { user.usd_wallet &&
                    <DefaultInfoCard
                      icon="wallet"
                      title="Billetera USD"
                      description={user.usd_wallet.address || user.usd_wallet._id }
                      value={`$${user.usd_wallet.available_amount}`}
                    />
                   }
                </Grid>
                <Grid item xs={12} md={8} xl={3}>
                  { user.i_wallet &&
                    <DefaultInfoCard
                      icon="wallet"
                      title="Billetera de Comercio"
                      description={user.i_wallet._id}
                      value={`$${user.i_wallet.available_amount}`}
                    />
                   }
                </Grid>
                {/* <Grid item xs={12}>
                  <PaymentMethod />
                </Grid> */}
              </Grid>
            </Grid>
            {/* <Grid item xs={12} lg={4}>
              <Invoices />
            </Grid> */}
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid> */}
          </Grid>
        </MDBox>
      </MDBox>
      <Configurator customDescription={customDescription} customTitle={customTitle} customContent={customContent} />
      {user.__t == "Client" &&
        <ConfiguratorButton icon="add" pos={1} f={handleAddTransactionClick} vl="Solicitar depósito/retiro"/>
      }
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
