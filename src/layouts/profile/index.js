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
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";

import EditUserForm from "layouts/profile/editProfile";

import { useState } from "react"
import { useUser } from 'context/userContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBitcoin, faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faUsd } from "@fortawesome/free-solid-svg-icons";
import CustomIcon from "components/CustomIcon";
import { CopyAll, OpenInNew } from "@mui/icons-material";
import MDCopyable from "components/MDCopyable";

function Overview() {
  const { user, setUser } = useUser()
  const [ isEditing, setIsEditing ] = useState(false)

  const switchEdit = () => setIsEditing(!isEditing)

  const userInfo = {
    "Usuario": user._id,
    "Correo Electrónico": user.email
  };

  // Agregar información específica para el tipo de usuario
  if (user.__t === "Admin") {
    userInfo["Billetera Ethereum"] = (
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} textAlign="center">
          <MDBox component="img" crossOrigin="anonymous" src={user.ethereum_qr} alt="ethereum_qr" width="90%"/>
        </Grid>
        <Grid item flexDirection="column" xs={12} md={8}>
            {user.ethereum_link && (
              <>
                <MDTypography variant="h6">Link de pago</MDTypography>
                <a target="_blank" href={user.ethereum_link}>
                  <MDTypography variant="body2" textTransform="capitalize">
                    {user.ethereum_link}
                    <OpenInNew />
                  </MDTypography>
                </a>
              </>
            )}
            {user.ethereum_address && (
              <>
              <MDTypography variant="h6">Dirección</MDTypography>
                <MDCopyable showIcon>
                  <MDTypography display="inline" variant="body2">
                    {user.ethereum_address}
                  </MDTypography>
                </MDCopyable>
              </>
            )}
        </Grid>
      </Grid>
    )
    userInfo["Billetera USDT (trc20)"] = (
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} textAlign="center">
          <MDBox component="img" crossOrigin="anonymous" src={user.usdt_qr} alt="usdt_qr" width="90%"/>
        </Grid>
        <Grid item flexDirection="column" xs={12} md={8}>
          {user.usdt_link && (
            <>
              <MDTypography variant="h6">Link de pago</MDTypography>
              <a target="_blank" href={user.usdt_link}>
                <MDTypography variant="body2" textTransform="capitalize">
                  {user.usdt_link}
                  <OpenInNew />
                </MDTypography>
              </a>
            </>
          )}
          {user.usdt_address && (
            <>
            <MDTypography variant="h6">Dirección</MDTypography>
              <MDCopyable showIcon>
                <MDTypography display="inline" variant="body2">
                  {user.usdt_address}
                </MDTypography>
              </MDCopyable>
            </>
          )}
        </Grid>
      </Grid>
    )
    userInfo["Billetera Bitcoin"] = (
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} textAlign="center">
          <MDBox component="img" crossOrigin="anonymous" src={user.btc_qr} alt="btc_qr" width="85%"/>
        </Grid>
        <Grid item flexDirection="column" md={8} xs={12}>
          {user.btc_link && (
              <>
                <MDTypography variant="h6">Link de pago</MDTypography>
                <a target="_blank" href={user.btc_link}>
                  <MDTypography variant="body2" textTransform="capitalize">
                    {user.btc_link}
                    <OpenInNew />
                  </MDTypography>
                </a>
              </>
            )}
            {user.btc_address && (
              <>
              <MDTypography variant="h6">Dirección</MDTypography>
                <MDCopyable showIcon>
                  <MDTypography display="inline" variant="body2">
                    {user.btc_address}
                  </MDTypography>
                </MDCopyable>
              </>
            )}
        </Grid>
      </Grid>
    )
  } else if (user.__t === "Client") {
    userInfo["Nombre completo"] = user.fullname;
    userInfo["Teléfono"] = user.phone;
    userInfo["Dirección Billetera USDT (trc20)"] = user.usd_wallet.address || user.usd_wallet._id
    userInfo["País"] = user.country
  }

  return (
    <DashboardLayout> 
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header fn={switchEdit} isEditing={isEditing}>
        <MDBox mt={5} mb={3}>
          { !isEditing && 
            <ProfileInfoCard
              title="Información del Perfil"
              info={userInfo}
              shadow={false}
            />
           }
           {isEditing && 
            <EditUserForm id={user._id} f={setIsEditing} />
           }
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
