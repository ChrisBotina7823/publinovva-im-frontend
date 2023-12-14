import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from "@mui/material/Select"
import { FormControlLabel } from "@mui/material";
import { Switch } from "@mui/material";

import { setOpenConfigurator, useMaterialUIController } from "context";

const EditClientForm = ({ id }) => {
    const [fullname, setFullname] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [accountState, setAccountState] = useState('');
    const [usdBalance, setUsdBalance] = useState(0);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showIPassword, setShowIPassword] = useState(false);
    const [showUsdPassword, setShowUsdPassword] = useState(false);

    const [password, setPassword] = useState('');
    const [iPassword, setIPassword] = useState('');
    const [usdPassword, setUsdPassword] = useState('');

    const [initialClientData, setInitialClientData] = useState(null);


    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();


    useEffect(() => {
        const fetchClientData = async (id) => {
            try {
                const response = await axiosInstance.get(`/clients/${id}`);
                console.log(response)
                const clientData = response.data;

                setInitialClientData(clientData);

                setFullname(clientData.fullname || '');
                setCountry(clientData.country || '');
                setPhone(clientData.phone || '');
                setAccountState(clientData.account_state || '');
                setUsdBalance(clientData.usd_wallet.available_amount || 0)
                setUsername(clientData.username || '');
                setEmail(clientData.email || '');
            } catch (error) {
                console.error('Error fetching client data:', error.response.data.error);
            }
        };

        fetchClientData(id);
    }, [id]);

    const handleEditClient = async () => {
        try {
            setOpenConfigurator(dispatch, false);

            const requestData = {
                username,
                email,
                fullname,
                country,
                phone,
                account_state: accountState,
                usd_balance: usdBalance,
            };

            if (showPassword && password) requestData.password = password;
            if (showIPassword && iPassword) requestData.i_password = iPassword;
            if (showUsdPassword && usdPassword) requestData.usd_password = usdPassword;

            const response = await axiosInstance.put(`/clients/${id}`, requestData);

            showNotification("success", "Cliente editado correctamente", `El ID del cliente es ${response.data._id}`);
        } catch (error) {
            console.error('Error editing client:', error.response.data.error);
            showNotification("error", "Error al editar el cliente", error.response.data.error);
        }
    };

    return (
        <MDBox component="form" role="form">

            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Username"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </MDBox>

            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Full Name"
                    fullWidth
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Country"
                    fullWidth
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Phone"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <FormControl fullWidth>
                    <InputLabel id="account_state">Estado</InputLabel>
                    <Select
                        value={accountState}
                        onChange={(e) => setAccountState(e.target.value)}
                        label="Account State"
                        labelId="account_state"
                        sx={{ paddingY: '8px' }}
                        fullWidth
                    >
                        <MenuItem value="en revision">En Revisión</MenuItem>
                        <MenuItem value="activo">Activo</MenuItem>
                        <MenuItem value="suspendido">Suspendido</MenuItem>
                    </Select>
                </FormControl>
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="number"
                    label="Saldo Billetera USD"
                    fullWidth
                    value={usdBalance}
                    onChange={(e) => setUsdBalance(e.target.value)}
                />
            </MDBox>

            <MDBox mb={1}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            inputProps={{ 'aria-label': 'toggle-password' }}
                        />
                    }
                    label="Cambiar Contraseña"
                />
            </MDBox>
            {showPassword && (
                <MDBox mb={2}>
                    <MDInput
                        type="password"
                        label="Contraseña perfil"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </MDBox>
            )}

            <MDBox mb={1}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showIPassword}
                            onChange={() => setShowIPassword(!showIPassword)}
                            inputProps={{ 'aria-label': 'toggle-i-password' }}
                        />
                    }
                    label="Contraseña Billetera de Inversiones"
                />
            </MDBox>
            {showIPassword && (
                <MDBox mb={2}>
                    <MDInput
                        type="password"
                        label="Contraseña Inversiones"
                        fullWidth
                        value={iPassword}
                        onChange={(e) => setIPassword(e.target.value)}
                    />
                </MDBox>
            )}

            <MDBox mb={1}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showUsdPassword}
                            onChange={() => setShowUsdPassword(!showUsdPassword)}
                            inputProps={{ 'aria-label': 'toggle-usd-password' }}
                        />
                    }
                    label="Contraseña Billetera USD"
                />
            </MDBox>

            {showUsdPassword && (
                <MDBox mb={2}>
                    <MDInput
                        type="password"
                        label="Contraseña USD"
                        fullWidth
                        value={showUsdPassword}
                        onChange={(e) => setShowUsdPassword(e.target.value)}
                    />
                </MDBox>
            )}



            <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth onClick={handleEditClient}>
                    Edit Client
                </MDButton>
            </MDBox>
        </MDBox>
    );
};

export default EditClientForm;
