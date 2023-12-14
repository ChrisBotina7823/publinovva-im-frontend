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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Billing page components
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";

function Billing() {

  const user = JSON.parse(localStorage.getItem("user"))

  const admin = user.__t == "Client" ? user.admin : user

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
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
                      description={user.usd_wallet._id}
                      value={`$${user.usd_wallet.available_amount}`}
                    />
                   }
                </Grid>
                <Grid item xs={12} md={8} xl={3}>
                  { user.i_wallet &&
                    <DefaultInfoCard
                      icon="wallet"
                      title="Billetera de Inversiones"
                      description={user.i_wallet._id}
                      value={`$${user.i_wallet.available_amount}`}
                      value_additional={`($${user.i_wallet.investment_amount} en inversión)`}
                    />
                   }
                </Grid>
                <Grid item xs={12}>
                  <PaymentMethod />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Invoices />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
