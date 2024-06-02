import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import { setOpenConfigurator, useMaterialUIController } from "context";
import { useUser } from "context/userContext";
import { CircularProgress } from "@mui/material";

const EditPackageForm = ({ id }) => {
    const [packageName, setPackageName] = useState('');
    const [minOpeningAmount, setMinOpeningAmount] = useState('');
    const [minInvDays, setMinInvDays] = useState('');
    const [revenueFreq, setRevenueFreq] = useState('');
    const [revenuePercentage, setRevenuePercentage] = useState('');
    const [globalAmount, setGlobalAmount] = useState('');
    const { user, setUser } = useUser();
    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();

    const [loading, setLoading] = useState(true);
    const [initialPackageData, setInitialPackageData] = useState(null);

    useEffect(() => {
        const fetchPackageData = async (id) => {
            try {
                setLoading(true)
                const response = await axiosInstance().get(`/packages/${id}`);
                const packageData = response.data;

                setInitialPackageData(packageData);
                setPackageName(packageData.name || '');
                setMinOpeningAmount(packageData.min_opening_amount || '');
                setMinInvDays(packageData.min_inv_days || '');
                setRevenueFreq(packageData.revenue_freq || '');
                setRevenuePercentage(packageData.revenue_percentage || '');
                setGlobalAmount(packageData.global_amount || '');
            } catch (error) {
                console.error('Error fetching package data:', error.response.data.error);
                showNotification("error", "Error al obtener datos de la licencia", error.response.data.error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackageData(id);
    }, [id]);

    const handleEditPackage = async () => {
        try {
            setLoading(true);

            const response = await axiosInstance().put(`/packages/${id}`, {
                name: packageName,
                min_opening_amount: minOpeningAmount,
                min_inv_days: minInvDays,
                revenue_freq: revenueFreq,
                revenue_percentage: revenuePercentage,
                global_amount: globalAmount
            });

            setOpenConfigurator(dispatch, false);
            showNotification("success", "Licencia editado correctamente", `El ID de la licencia es ${response.data._id}`);
        } catch (error) {
            console.error('Error editing package:', error.response.data.error);
            showNotification("error", "Error al editar la licencia", error.response.data.error);
        } finally {
            setLoading(false);
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
                    <MDBox mt={4} mb={1} textAlign="center">
                        <MDButton variant="gradient" color="info" fullWidth onClick={handleEditPackage}>
                            Editar Licencia
                        </MDButton>
                    </MDBox>
                </>
            )}
        </MDBox>
    );
};

export default EditPackageForm;
