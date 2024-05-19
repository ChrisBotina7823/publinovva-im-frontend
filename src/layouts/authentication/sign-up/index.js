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

// react-router-dom components
import { Link, useNavigate, useParams } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import AddClientForm from "layouts/clients/addClient";
import { useState } from "react";
import axiosInstance from "axiosInstance";
import { Grid } from "@mui/material";
import { useNotification } from "components/NotificationContext";

function Cover() {
  const { admin_id } = useParams()
  const [ admin, setAdmin ] = useState(null)
  const navigate = useNavigate();
  const { showNotification } = useNotification()
  if (admin_id) {
    axiosInstance().get(`/styles/${admin_id}`)
      .then(response => {
        setAdmin(response.data)
      })
      .catch(error => {
        navigate("/admin-signin")
        console.error(error)
        showNotification("error", "Administrador no encontrado", "No se encontró ningún administrador con la url proporcionada");
      });
  }
  return (
    <CoverLayout image={bgImage}>
      <Grid item xs={12} xm={8}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            { admin?.profile_picture && (
              <MDBox height={100} borderRadius="10px" id="logo-container" component="img" crossOrigin="anonymous" src={admin.profile_picture || ""} />
            )}
            {admin?.entity_name && (
              <MDTypography variant="h6" fontWeight="bold" color="white">{admin?.entity_name}</MDTypography>
            )}
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Registrarse
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Ingresa tu información para registrarte
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <AddClientForm admin_id={admin_id}></AddClientForm>
          </MDBox>
        </Card>
      </Grid>
    </CoverLayout>
  );
}

export default Cover;
