import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";

import { setOpenConfigurator, useMaterialUIController } from "context";
import { useUser } from "context/userContext";

const EditPackageForm = ({id}) => {
    const [packageName, setPackageName] = useState('');
    const [minOpeningAmount, setMinOpeningAmount] = useState('');
    const [minInvDays, setMinInvDays] = useState('');
    const [revenueFreq, setRevenueFreq] = useState('');
    const [revenuePercentage, setRevenuePercentage] = useState('');
    const [globalAmount, setGlobalAmount] = useState('');
    const { user, setUser } = useUser()
    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();

    // Otros estados...
  
    const [initialPackageData, setInitialPackageData] = useState(null); // Nuevo estado
  
    useEffect(() => {
      const fetchPackageData = async (id) => {
        try {
          const response = await axiosInstance().get(`/packages/${id}`);
          const packageData = response.data;
  
          // Almacena los datos del paquete en el estado
          setInitialPackageData(packageData);
  
          // Establece los valores iniciales del formulario
          setPackageName(packageData.name || ''); // Puedes ajustar según tus necesidades
          setMinOpeningAmount(packageData.min_opening_amount || '');
          setMinInvDays(packageData.min_inv_days || '');
          setRevenueFreq(packageData.revenue_freq || '');
          setRevenuePercentage(packageData.revenue_percentage || '');
          setGlobalAmount(packageData.global_amount || '');
        } catch (error) {
          console.error('Error fetching package data:', error.response.data.error);
          // Manejar el error según tus necesidades
        }
      };
  
      // Llama a la función para obtener los datos del paquete
      fetchPackageData(id);
    }, []); // Ejecuta esta solicitud solo cuando el componente monta
  

    const handleEditPackage = async () => {

        try {
            setOpenConfigurator(dispatch, false)


            const response = await axiosInstance().put(`/packages/${id}`, {
                name: packageName,
                min_opening_amount: minOpeningAmount,
                min_inv_days: minInvDays,
                revenue_freq: revenueFreq,
                revenue_percentage: revenuePercentage,
                global_amount: globalAmount
            });

            showNotification("success", "Paquete editado correctamente", `El ID del paquete es ${response.data._id} `);
        } catch (error) {
            console.error('Error adding package:', error.response.data.error);
            showNotification("error", "Error al editar el paquete", error.response.data.error);
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
                <MDButton variant="gradient" color="info" fullWidth onClick={handleEditPackage}>
                    Edit Package
                </MDButton>
            </MDBox>
        </MDBox>
    );
};

export default EditPackageForm;