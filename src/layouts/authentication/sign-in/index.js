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

import { useState } from "react";

// react-router-dom components
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { LocalSeeOutlined } from "@mui/icons-material";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import { useUser } from "context/userContext";
import { CircularProgress } from "@mui/material";

function Basic({path="/auth/superuser"}) {
  const { user, updateUser } = useUser()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification()
  const { admin_id } = useParams();
  if(path.includes("client") && !admin_id) {
    navigate("/auth/admin")
  }
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [ admin, setAdmin ] = useState(null)
  const [loading, setLoading] = useState(false)

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

  const handleSignIn = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance().post(`${path}/${admin?._id.toString() || ""}`, {
        username,
        password
      })
      const token = response.data.token;
      const newUser = response.data.user;
      await updateUser(newUser, token)
      navigate("/dashboard");
      showNotification("success", "Inicio de sesión exitoso", `Bienvenido, ${newUser.username} `);
    } catch (error) {
      console.error(error)
      if(error.response) {
        showNotification("error", "Error al iniciar sesión", error.response.data.error)
      }
    } finally {
      setLoading(false)
    }
  };
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDBox>
            { admin?.profile_picture && (
                <MDBox height={100} borderRadius="10px" id="logo-container" component="img" crossOrigin="anonymous" src={admin.profile_picture || ""} />
              )
             }
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Iniciar Sesión
            </MDTypography>
            { path.includes("admin") && (
              <MDTypography variant="h6" fontWeight="bold" color="white">Administradores</MDTypography>
            )}
            { path.includes("superuser") && (
              <MDTypography variant="h6" fontWeight="bold" color="white">Superusuario</MDTypography>
            )}
            {admin?.entity_name && (
              <MDTypography variant="h6" fontWeight="bold" color="white">{admin?.entity_name}</MDTypography>
            )}
            <MDTypography color="white" variant="caption">Investment Manager</MDTypography>
          </MDBox>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            {/* <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid> */}
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" textAlign="center">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Usuario"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Contraseña"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox> */}
            {loading ? (
              <CircularProgress color="secondary" />
            ) : (
              <>
                <MDBox mt={4} mb={1}>
                  <MDButton variant="gradient" color="info" autoFocus fullWidth onClick={handleSignIn}>
                    Iniciar Sesión
                  </MDButton>
                </MDBox>
              </>
            )}

            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
