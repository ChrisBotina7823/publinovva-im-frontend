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
import { CircularProgress, FormControlLabel } from "@mui/material";
import { Switch } from "@mui/material";

import { setOpenConfigurator, useMaterialUIController } from "context";
import { useUser } from "context/userContext";
import { useNavigate } from "react-router-dom";

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
    const { user, removeUser } = useUser()

    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const fetchClientData = async (id) => {
            try {
                setLoading(true)
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
                if(error.response) {
                    console.error('Error fetching client data:', error.response.data);
                    if(error.response.status == 401) {
                        showNotification("error", "Tu sesión ha expirado", "Vuelve a iniciar sesión para continuar")
                        removeUser()
                    }
                } else {
                    console.error('Error fetching client data:', error);
                    showNotification("error", "Error al obtener datos del cliente", "Inténtalo de nuevo más tarde")
                }
            } finally {
                setLoading(false)
            }
        };

        fetchClientData(id);
    }, [id]);

    const navigate = useNavigate()

    const handleEditClient = async () => {
        try {
            setLoading(true)
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


            const path =  "client/sign-in/"+user.admin?._id;
            const response = await axiosInstance().put(`/clients/${id}`, requestData);

            if (uploadPicture && profilePicture) {
                const pictureFormData = new FormData();
                pictureFormData.append("profile_picture", profilePicture);

                axiosInstance().post(`/users/profile-picture/${id}`, pictureFormData);
            }

            if(user.__t == "Client" && showPassword) {
                navigate(path)
                showNotification("success", "Usuario editado con éxito", "Contraseña cambiada correctamente. Inicia sesión nuevamente")
                return
            }

            setOpenConfigurator(dispatch, false);
            showNotification("success", "Cliente editado correctamente", `El ID del cliente es ${response.data._id}`);
        } catch (error) {
            console.error(error)
            if(error.response) {
                showNotification("error", "Error al editar el cliente", error.response.data.error);
            }
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
                                label="Saldo Billetera USDT (trc20)"
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
                            label="Cambiar dirección Billetera USDT (trc20)"
                        />
                    </MDBox>

                    {showUsdAddress && (
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Dirección Billetera USDT (trc20)"
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
                                type="text"
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
                                type="text"
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
                            label="Contraseña Billetera USDT (trc20)"
                        />
                    </MDBox>

                    {showUsdPassword && (
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Contraseña USDT"
                                fullWidth
                                value={usdPassword}
                                onChange={(e) => setUsdPassword(e.target.value)}
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

                </>
            )}
        </MDBox>
    );
};

export default EditClientForm;
