import { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";

import { setOpenConfigurator, useMaterialUIController } from "context";

const AddPackageForm = () => {
    const [packageName, setPackageName] = useState('');
    const [minOpeningAmount, setMinOpeningAmount] = useState('');
    const [minInvDays, setMinInvDays] = useState('');
    const [revenueFreq, setRevenueFreq] = useState('');
    const [revenuePercentage, setRevenuePercentage] = useState('');
    const [globalAmount, setGlobalAmount] = useState('');

    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();

    const handleAddPackage = async () => {

        try {
            
            const storedUser = localStorage.getItem("user");
            const user = JSON.parse(storedUser);
            console.log(user.username);
            
            const response = await axiosInstance.post('/packages', {
                name: packageName,
                min_opening_amount: minOpeningAmount,
                min_inv_days: minInvDays,
                revenue_freq: revenueFreq,
                revenue_percentage: revenuePercentage,
                global_amount: globalAmount,
                admin_username: user.username
            });
            
            setOpenConfigurator(dispatch, false)
            showNotification("success", "Paquete añadido correctamente", `El ID del paquete es ${response.data._id} `);
        } catch (error) {
            console.error('Error adding package:', error.response.data.error);
            showNotification("error", "Error al añadir el paquete", error.response.data.error);
        }
    };

    return (
        <MDBox component="form" role="form">
            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Package Name"
                    fullWidth
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="number"
                    label="Minimum Opening Amount"
                    fullWidth
                    value={minOpeningAmount}
                    onChange={(e) => setMinOpeningAmount(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="number"
                    label="Minimum Investment Days"
                    fullWidth
                    value={minInvDays}
                    onChange={(e) => setMinInvDays(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="number"
                    label="Revenue Frequency"
                    fullWidth
                    value={revenueFreq}
                    onChange={(e) => setRevenueFreq(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="number"
                    label="Revenue Percentage"
                    fullWidth
                    value={revenuePercentage}
                    onChange={(e) => setRevenuePercentage(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="number"
                    label="Global Amount"
                    fullWidth
                    value={globalAmount}
                    onChange={(e) => setGlobalAmount(e.target.value)}
                />
            </MDBox>
            <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth onClick={handleAddPackage}>
                    Add Package
                </MDButton>
            </MDBox>
        </MDBox>
    );
};

export default AddPackageForm;