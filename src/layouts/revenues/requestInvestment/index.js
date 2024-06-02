import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useUser } from "context/userContext";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import dayjs from "dayjs";
import MDTypography from "components/MDTypography";
import { Divider } from "@mui/material";
import { setOpenConfigurator, useMaterialUIController } from "context";
import { formatCurrency } from "utils";

const InvestmentRequestForm = () => {
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [endDate, setEndDate] = useState(dayjs());
    const [invAmount, setInvAmount] = useState('');
    const { user } = useUser();
    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axiosInstance().get(`/packages/user/${user._id}`);
                setPackages(response.data);
            } catch (error) {
                console.error('Error fetching packages:', error.response.data.error);
            }
        };

        fetchPackages();
    }, []);

    const handleInvestmentRequest = async () => {
        try {
            
            const response = await axiosInstance().post(`/investments/${user._id}`, {
                package_id: selectedPackage,
                end_date: endDate.format("YYYY-MM-DD"),
                inv_amount: invAmount,
            });

            setOpenConfigurator(dispatch, false);
            showNotification("success", "Solicitud de inversión realizada correctamente", `El ID de la inversión es ${response.data._id}`);
            
        } catch (error) {
            console.error('Error requesting investment:', error.response.data.error);
            showNotification("error", "Error al solicitar la inversión", error.response.data.error);
        }
    };

    return (
        <MDBox component="form" role="form">
            <MDBox mb={2}>
                <FormControl fullWidth>
                    <InputLabel id="package-selector-label">Seleccionar Licencia</InputLabel>
                    <Select
                        labelId="package-selector-label"
                        id="package-selector"
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        sx={{ paddingY: '8px' }}
                    >
                        {packages.map((inv_package) => (
                            <MenuItem key={inv_package._id} value={inv_package._id}>
                                <MDBox spacing={0} >
                                    <MDTypography fontSize={14} fontWeight="bold">
                                        {inv_package.name}
                                        <MDTypography variant="caption">
                                            {` (${inv_package._id})`}
                                        </MDTypography>
                                    </MDTypography>
                                    <MDTypography variant="caption">
                                    <MDTypography variant="caption" fontWeight="regular"> - Beneficios: </MDTypography>
                                        {`${inv_package.revenue_percentage}% del monto invertido cada ${inv_package.revenue_freq} días`}
                                    </MDTypography>
                                    <br/>
                                    <MDTypography variant="caption">
                                        <MDTypography variant="caption" fontWeight="regular"> - Requisitos: </MDTypography>
                                        {`${formatCurrency(inv_package.min_opening_amount)}, ${inv_package.min_inv_days} días mínimo`}
                                    </MDTypography>
                                </MDBox>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </MDBox>
            <MDBox mb={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Fecha de Fin"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                    />
                </LocalizationProvider>
            </MDBox>
            <MDTypography variant="caption">
                {`Disponible billetera de comercio: ${formatCurrency(user.i_wallet.available_amount)}`}
            </MDTypography>
            <MDBox mb={2}>
                <MDInput
                    type="number"
                    label="Investment Amount"
                    fullWidth
                    value={invAmount}
                    onChange={(e) => setInvAmount(e.target.value)}
                />
            </MDBox>
            <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth onClick={handleInvestmentRequest}>
                    Request Investment
                </MDButton>
            </MDBox>
        </MDBox>
    );
};

export default InvestmentRequestForm;
