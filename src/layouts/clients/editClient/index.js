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
import { useUser } from "context/userContext";

const EditClientForm = ({ id, f }) => {
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

    const [uploadPicture, setUploadPicture] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);

    const [usdAddress, setUsdAddress] = useState('');
    const [showUsdAddress, setShowUsdAddress] = useState(false);

    const [initialClientData, setInitialClientData] = useState(null);


    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();
    const { user } = useUser()


    useEffect(() => {
        const fetchClientData = async (id) => {
            try {
                const response = await axiosInstance().get(`/clients/${id}`);
                const clientData = response.data;

                setInitialClientData(clientData);

                setFullname(clientData.fullname || '');
                setCountry(clientData.country || '');
                setPhone(clientData.phone || '');
                setAccountState(clientData.account_state || '');
                setUsdBalance(clientData.usd_wallet.available_amount || 0)
                setUsername(clientData.username || '');
                setEmail(clientData.email || '');
                setUsdAddress(clientData.usd_wallet.address || clientData.usd_wallet._id || ''); // assuming usd_address is a string field
            } catch (error) {
                console.error('Error fetching client data:', error.response.data.error);
            }
        };

        fetchClientData(id);
    }, [id]);

    const handleEditClient = async () => {
        try {
            setOpenConfigurator(dispatch, false);
            if (f) f()

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
            if (showUsdAddress && usdAddress) requestData.usd_address = usdAddress;

            const response = await axiosInstance().put(`/clients/${id}`, requestData);

            if (uploadPicture && profilePicture) {
                const pictureFormData = new FormData();
                pictureFormData.append("profile_picture", profilePicture);

                axiosInstance().post(`/users/profile-picture/${id}`, pictureFormData);
            }

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
                    label="Nombre de Usuario"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Correo Electrónico"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </MDBox>

            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Nombre completo"
                    fullWidth
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="País"
                    fullWidth
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Teléfono"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </MDBox>
            {(!user.__t || user.__t == "Admin") &&
                <MDBox mb={2}>
                    <FormControl fullWidth>
                        <InputLabel id="account_state">Estado</InputLabel>
                        <Select
                            value={accountState}
                            onChange={(e) => setAccountState(e.target.value)}
                            label="Estado de cuenta"
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
            }
            {(!user.__t || user.__t == "Admin") &&
                <MDBox mb={2}>
                    <MDInput
                        type="number"
                        label="Saldo Billetera USD"
                        fullWidth
                        value={usdBalance}
                        onChange={(e) => setUsdBalance(e.target.value)}
                    />
                </MDBox>
            }

            <MDBox mb={1}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showUsdAddress}
                            onChange={() => setShowUsdAddress(!showUsdAddress)}
                            inputProps={{ 'aria-label': 'toggle-usd-address' }}
                        />
                    }
                    label="Cambiar dirección Billetera USD"
                />
            </MDBox>

            {showUsdAddress && (
                <MDBox mb={2}>
                    <MDInput
                        type="text"
                        label="Dirección Billetera USD"
                        fullWidth
                        value={usdAddress}
                        onChange={(e) => setUsdAddress(e.target.value)}
                    />
                </MDBox>
            )}

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
                    label="Contraseña Billetera de Comercio"
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

            <MDBox mb={1}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={uploadPicture}
                            onChange={() => setUploadPicture(!uploadPicture)}
                            inputProps={{ 'aria-label': 'toggle-upload-picture' }}
                        />
                    }
                    label="Subir Foto de Perfil"
                />
            </MDBox>

            {uploadPicture && (
                <MDBox mb={2}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                </MDBox>
            )}



            <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth onClick={handleEditClient}>
                    Editar Cliente
                </MDButton>
            </MDBox>
        </MDBox>
    );
};

export default EditClientForm;
