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
import { faCircleCheck, faCircleXmark, faInfoCircle, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

export default function VerifyAccount() {
    const navigate = useNavigate();
    const {adminId} = useParams();
    
    const handleSuccessfulRedirect = (adminId) => {
        navigate("/client/sign-in/" + adminId)
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
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        Verificación necesaria
                    </MDTypography>
                    </MDBox>
                    <MDBox textAlign="center" pt={4} pb={6} px={3}>
                        <FontAwesomeIcon icon={faInfoCircle} size="4x" color="#1A73E8" />
                        <MDTypography fontSize="1.25rem" display="block" variant="button" my={2}>
                            Tu cuenta ha sido creada, verifícala ingresando al link que te hemos enviado a tu correo.
                        </MDTypography>
                        <MDButton onClick={() => handleSuccessfulRedirect(adminId)} variant="gradient" color="info">Aceptar</MDButton>
                    </MDBox>
                </Card>
            </Grid>
        </CoverLayout>
    )
}