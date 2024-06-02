import { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";

import { setOpenConfigurator, useMaterialUIController } from "context";
import { useUser } from "context/userContext";
import { CircularProgress } from "@mui/material";

const AddPackageForm = () => {
    const [packageName, setPackageName] = useState('');
    const [minOpeningAmount, setMinOpeningAmount] = useState('');
    const [minInvDays, setMinInvDays] = useState('');
    const [revenueFreq, setRevenueFreq] = useState('');
    const [revenuePercentage, setRevenuePercentage] = useState('');
    const [globalAmount, setGlobalAmount] = useState('');

    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();
    const { user, setUser } = useUser()

    const [loading, setLoading] = useState(false);


    const handleAddPackage = async () => {

        try {
            setLoading(true)
            const response = await axiosInstance().post('/packages', {
                name: packageName,
                min_opening_amount: minOpeningAmount,
                min_inv_days: minInvDays,
                revenue_freq: revenueFreq,
                revenue_percentage: revenuePercentage,
                global_amount: globalAmount,
                admin_username: user.username
            });

            setOpenConfigurator(dispatch, false)
            showNotification("success", "Licencia añadido correctamente", `El ID de la licencia es ${response.data._id} `);
        } catch (error) {
            console.error('Error adding package:', error.response.data.error);
            showNotification("error", "Error al añadir la licencia", error.response.data.error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <MDBox 
            component="form"
            role="form"
            textAlign={loading ? "center": "left"}
        >
            {loading ? (
                <CircularProgress color="secondary" size={60} />
            ) : (
                <>
                    <MDBox mb={2}>
                        <MDInput
                            type="text"
                            label="Nombre de la licencia"
                            fullWidth
                            value={packageName}
                            onChange={(e) => setPackageName(e.target.value)}
                        />
                    </MDBox>
                    <MDBox mb={2}>
                        <MDInput
                            type="number"
                            label="Monto mínimo de apertura"
                            fullWidth
                            value={minOpeningAmount}
                            onChange={(e) => setMinOpeningAmount(e.target.value)}
                        />
                    </MDBox>
                    <MDBox mb={2}>
                        <MDInput
                            type="number"
                            label="Días mínimos de inversión"
                            fullWidth
                            value={minInvDays}
                            onChange={(e) => setMinInvDays(e.target.value)}
                        />
                    </MDBox>
                    <MDBox mb={2}>
                        <MDInput
                            type="number"
                            label="Frecuencia de Ingreso"
                            fullWidth
                            value={revenueFreq}
                            onChange={(e) => setRevenueFreq(e.target.value)}
                        />
                    </MDBox>
                    <MDBox mb={2}>
                        <MDInput
                            type="number"
                            label="Porcentaje de beneficio"
                            fullWidth
                            value={revenuePercentage}
                            onChange={(e) => setRevenuePercentage(e.target.value)}
                        />
                    </MDBox>
                    <MDBox mb={2}>
                        <MDInput
                            type="number"
                            label="Monto global"
                            fullWidth
                            value={globalAmount}
                            onChange={(e) => setGlobalAmount(e.target.value)}
                        />
                    </MDBox>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handleAddPackage}>
                        Añadir Licencia
                    </MDButton>
                </>
            )}
        </MDBox>
    );
};

export default AddPackageForm;