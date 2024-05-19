import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import { useParams } from "react-router-dom";
import { useUser } from "context/userContext";
import { setOpenConfigurator, useMaterialUIController } from "context";
import { CircularProgress } from "@mui/material";


const SupportTicketForm = () => {
    const { user } = useUser();

    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();

    const [loading, setLoading] = useState();

    const handleSupportTicket = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance().post(`/movements/make-support-ticket/${user._id}`, {
                description: description,
                category: category,
            });

            setOpenConfigurator(dispatch, false);
            showNotification("success", "Ticket creado correctamente", `ID del ticket: ${response.data._id}`);
        } catch (error) {
            console.error('Error creating support ticket:', error.response.data.error);
            showNotification("error", "Error al crear el ticket de soporte", error.response.data.error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <MDBox
            component="form"
            role="form"
            textAlign={loading ? "center" : "left"}
        >
            {loading ? (
                <CircularProgress color="secondary" size={60} />
            ) : (
                <>
                    <MDBox mb={2}>
                        <MDInput
                            type="text"
                            label="Categoría"
                            fullWidth
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </MDBox>
                    <MDBox mb={2}>
                        <MDInput
                            type="text"
                            label="Descripción"
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </MDBox>

                    <MDBox mt={4} mb={1}>
                        <MDButton variant="gradient" color="info" fullWidth onClick={handleSupportTicket}>
                            Crear Ticket de Soporte
                        </MDButton>
                    </MDBox>
                </>
            )}
        </MDBox>

    );
};

export default SupportTicketForm;
