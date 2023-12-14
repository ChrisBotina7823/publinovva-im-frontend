import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormControlLabel } from "@mui/material";
import { Switch } from "@mui/material";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

const EditInvestmentForm = ({ investmentId }) => {
    console.log(investmentId)
    const [actualStartDate, setActualStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [state, setState] = useState('');

    const [initialInvestmentData, setInitialInvestmentData] = useState(null);
    const [showState, setShowState] = useState(false);  // Nuevo estado para controlar la visibilidad del campo de estado

    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchInvestmentData = async (investmentId) => {
            try {
                const response = await axiosInstance.get(`/investments/${investmentId}`);
                console.log(response)
                const investmentData = response.data;

                setInitialInvestmentData(investmentData);

                setActualStartDate(dayjs(investmentData.actual_start_date));
                setEndDate(dayjs(investmentData.end_date));
                setState(investmentData.state || '');
            } catch (error) {
                console.error('Error fetching investment data:', error.response.data.error);
            }
        };

        fetchInvestmentData(investmentId);
    }, [investmentId]);

    const handleEditInvestment = async () => {
        try {
            const requestData = {
                actual_start_date: actualStartDate.toISOString(),
                end_date: endDate.toISOString(),
                // Agrega el campo de estado solo si showState es verdadero
                ...(showState && { state }),
            };

            const response = await axiosInstance.put(`/investments/${investmentId}`, requestData);

            showNotification("success", "Inversión editada correctamente", `La inversión con ID ${response.data._id} se ha editado correctamente`);
        } catch (error) {
            console.error('Error editing investment:', error.response.data.error);
            showNotification("error", "Error al editar la inversión", error.response.data.error);
        }
    };

    return (
        <MDBox component="form" role="form">

            <MDBox mb={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Fecha de Inicio Actual"
                        value={actualStartDate}
                        onChange={(date) => setActualStartDate(date)}
                    />
                </LocalizationProvider>
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

            {/* Toggle para mostrar/ocultar el campo de estado */}
            <MDBox mb={1}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showState}
                            onChange={() => setShowState(!showState)}
                            inputProps={{ 'aria-label': 'toggle-state' }}
                        />
                    }
                    label="Cambiar Estado"
                />
            </MDBox>
            {showState && (
                <MDBox mb={2}>
                    <FormControl fullWidth>
                        <InputLabel id="state">Estado</InputLabel>
                        <Select
                            labelId="state"
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            sx={{ paddingY: '8px' }}
                            fullWidth
                        >
                            <MenuItem value="pendiente">Pendiente</MenuItem>
                            <MenuItem value="en curso">En Curso</MenuItem>
                            <MenuItem value="rechazado">Rechazado</MenuItem>
                            <MenuItem value="finalizado">Finalizado</MenuItem>
                        </Select>
                    </FormControl>
                </MDBox>
            )}

            <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth onClick={handleEditInvestment}>
                    Editar Inversión
                </MDButton>
            </MDBox>
        </MDBox>
    );
};

export default EditInvestmentForm;
