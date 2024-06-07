import { Card, CircularProgress, Grid } from "@mui/material";
import axiosInstance from "axiosInstance";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNotification } from "components/NotificationContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CoverLayout from "../components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import MDButton from "components/MDButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function ActivateAccount() {
    const navigate = useNavigate();
    const {token} = useParams();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(true)
    const [admin, setAdmin] = useState("")  
    useEffect(() => {
        const activateAcccount = async () => {
            try {
                const response = await axiosInstance().get('/auth/activate-account/' + token)
                const admin = response.data.admin
                // console.log(admin)
                setAdmin(admin)
                setSuccess(true)
            } catch(err) {
                setSuccess(false)
            } finally {
                setLoading(false)
    
            }
        }
        activateAcccount()
    }, [])

    const [ success, setSuccess ] = useState(false)
    
    const handleSuccessfulRedirect = (admin) => {
        navigate("/client/sign-in/" + admin._id)
    }
    const handleUnsuccessfulRedirect = () => {
        navigate("/admin/sign-in")
    }
    return (
        <CoverLayout image={bgImage}>
            {loading ? (
                <>
                    <MDTypography variant="h4" textAlign="center">Validando cuenta...</MDTypography>
                    <CircularProgress color="secondary" size={60} />
                </>
            ) : (
                <Grid item xs={12} xm={8}>
                <Card>
                  <MDBox
                    variant="gradient"
                    bgColor={ success ? "info" : "error"}
                    borderRadius="lg"
                    coloredShadow="success"
                    mx={2}
                    mt={-3}
                    p={3}
                    mb={1}
                    textAlign="center"
                  >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        {success ? (
                            "Cuenta activada correctamente"
                        ) : (
                            "Error al activar cuenta"
                        )}
                    </MDTypography>
                  </MDBox>
                  <MDBox textAlign="center" pt={4} pb={6} px={3}>
                        <FontAwesomeIcon icon={success ? faCircleCheck : faCircleXmark} size="4x" color={success ? "#1A73E8" : "#E53935"} />
                        <MDTypography display="block" variant="button" my={2}>
                            {success ? (
                                "Tu cuenta ha sido activada correctamente, ahora puedes iniciar sesión"
                            ) : (
                                "Hubo un error al activar tu cuenta, por favor intenta nuevamente"
                            )}
                        </MDTypography>
                        {success ? (
                            <MDButton onClick={() => handleSuccessfulRedirect(admin)} variant="gradient" color={success ? "info" : "error"}>Iniciar sesión</MDButton>
                        ) : (
                            <MDButton onClick={() => handleUnsuccessfulRedirect()} variant="gradient" color={success ? "info" : "error"}>Regresar</MDButton>
                        )}
                  </MDBox>
                </Card>
              </Grid>
            )}
        </CoverLayout>
    )
}