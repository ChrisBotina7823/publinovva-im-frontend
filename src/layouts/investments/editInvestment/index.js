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
import { CircularProgress, FormControlLabel } from "@mui/material";
import { Switch } from "@mui/material";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { setOpenConfigurator, useMaterialUIController } from "context";
import { DateTimePicker, MobileTimePicker, TimePicker } from "@mui/x-date-pickers";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';


const EditInvestmentForm = ({ investmentId }) => {
    const [actualStartDate, setActualStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [state, setState] = useState('');

    const [initialInvestmentData, setInitialInvestmentData] = useState(null);
    const [showState, setShowState] = useState(false);  // Nuevo estado para controlar la visibilidad del campo de estado

    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();
    const [time, setTime] = useState(dayjs());

    const [loading, setLoading] = useState()

    useEffect(() => {
        const fetchInvestmentData = async (investmentId) => {
            try {
                setLoading(true)
                const response = await axiosInstance().get(`/investments/${investmentId}`);
                const investmentData = response.data.investment;

                setInitialInvestmentData(investmentData);

                setActualStartDate(dayjs(investmentData.actual_start_date));
                setEndDate(dayjs(investmentData.end_date));
                setTime(dayjs(investmentData.end_date));
                setState(investmentData.state || '');
            } catch (error) {
                console.error('Error fetching investment data:', error.response.data.error);
            } finally {
                setLoading(false)
            }
        };

        fetchInvestmentData(investmentId);
    }, [investmentId]);

    const handleEditInvestment = async () => {
        try {
            setLoading(true)
            const requestData = {
                actual_start_date: actualStartDate.toISOString(),
                end_date: endDate.toISOString(),
                time: time.toISOString(),
                ...(showState && { state }),
            };

            const response = await axiosInstance().put(`/investments/${investmentId}`, requestData);

            setOpenConfigurator(dispatch, false);
            showNotification("success", "Inversión editada correctamente", `La inversión con ID ${response.data._id} se ha editado correctamente`);
        } catch (error) {
            console.error('Error editing investment:', error.response.data.error);
            showNotification("error", "Error al editar la inversión", error.response.data.error);
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha de Inicio Real"
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

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['TimePicker']}>
                            <MobileTimePicker
                                label="Hora de solicitud"
                                value={time}
                                onChange={(newTime) => setTime(newTime)}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

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
                </>
            )}
        </MDBox>


    );
};

export default EditInvestmentForm;
