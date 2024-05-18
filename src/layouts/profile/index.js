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

function Overview() {
  const { user, setUser } = useUser()
  const [ isEditing, setIsEditing ] = useState(false)

  const switchEdit = () => setIsEditing(!isEditing)

  const userInfo = {
    "Username": user.username,
    "Correo Electrónico": user.email
  };

  // Agregar información específica para el tipo de usuario
  if (user.__t === "Admin") {
    userInfo["Código QR Ethereum"] = <MDBox component="img" crossOrigin="anonymous" src={user.ethereum_qr} alt="ethereum_qr" height="5rem"/>;
    userInfo["Dirección Ethereum"] = user.ethereum_address;
    userInfo["Código QR Bitcoin"] = <MDBox component="img" crossOrigin="anonymous" src={user.btc_qr} alt="ethereum_qr" height="5rem"/>;
    userInfo["Dirección Bitcoin"] = user.btc_address;
  } else if (user.__t === "Client") {
    userInfo["Nombre completo"] = user.fullname;
    userInfo["Teléfono"] = user.phone;
    userInfo["Dirección Billetera USDT (trc20)"] = user.usd_wallet.address || user.usd_wallet._id
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
            <EditUserForm id={user.username} f={setIsEditing} />
           }
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
