import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import { CircularProgress, FormControlLabel, Grid, Switch } from "@mui/material";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

import { setOpenConfigurator, useMaterialUIController } from "context";
import { useUser } from "context/userContext";
import MDTypography from "components/MDTypography";

const EditAdminForm = ({ id, f }) => {

    // USER FIELDS

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    // Admin fields
    const [entityName, setEntityName] = useState('');
    const [availableDays, setAvailableDays] = useState(0);
    const [accountState, setAccountState] = useState('activo');
    // Profile picture
    const [uploadProfilePicture, setUploadProfilePicture] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewProfilePicture, setPreviewProfilePicture] = useState(null);
    
    // ADMIN WALLETS

    // Addresses
    const [ethereumAddress, setEthereumAddress] = useState('');
    const [bitcoinAddress, setBitcoinAddress] = useState('');
    const [usdtAddress, setUsdtAddress] = useState('');
    // QR codes
    const [uploadEthereumQR, setUploadEthereumQR] = useState(false);
    const [uploadBitcoinQR, setUploadBitcoinQR] = useState(false);
    const [uploadUsdtQR, setUploadUsdtQR] = useState(false);
    const [ethereumQR, setEthereumQR] = useState(null);
    const [bitcoinQR, setBitcoinQR] = useState(null);
    const [usdtQR, setUsdtQR] = useState(null);
    const [previewUsdtQR, setPreviewUsdtQR] = useState(null);
    const [previewEthereumQR, setPreviewEthereumQR] = useState(null);
    const [previewBitcoinQR, setPreviewBitcoinQR] = useState(null);
    // Links
    const [ethereumLink, setEthereumLink] = useState('');
    const [bitcoinLink, setBitcoinLink] = useState('');
    const [usdtLink, setUsdtLink] = useState('');


    // Toggle password
    const [showPassword, setShowPassword] = useState(false);

    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();

    const { user, updateUser } = useUser()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchAdminData = async (id) => {
            try {
                setLoading(true)
                const response = await axiosInstance().get(`/admins/${id}`);
                const adminData = response.data;

                // User fields
                setUsername(adminData.username || '');
                setEmail(adminData.email || '');
                setEntityName(adminData.entity_name || '');
                setAvailableDays(adminData.available_days || 0);
                setAccountState(adminData.account_state || 'activo');
                
                setBitcoinAddress(adminData.btc_address || '');
                setBitcoinLink(adminData.btc_link || '');
                setEthereumAddress(adminData.ethereum_address || '');
                setEthereumLink(adminData.ethereum_link || '');
                setUsdtAddress(adminData.usdt_address || '');
                setUsdtLink(adminData.usdt_link || '');

            } catch (error) {
                console.error('Error fetching admin data:', error.response.data.error);
                if(error.response.status == 401) showNotification("error", "Tu sesión ha expirado", "Vuelve a iniciar sesión para continuar")
            } finally {
                setLoading(false)
            }
        };

        fetchAdminData(id);
    }, [id]);

    const handleEditAdmin = async () => {
        try {
            setLoading(true)
            if (f) f()
            await updateUser()

            const requestData = {
                entity_name: entityName,
                available_days: availableDays,
                account_state: accountState,
                username: username,
                email: email,
                ethereum_address: ethereumAddress,
                btc_address:bitcoinAddress,
                usdt_address:usdtAddress,
                ethereum_link: ethereumLink,
                btc_link: bitcoinLink,
                usdt_link: usdtLink
            };

            // console.log(requestData)

            if (showPassword && password) {
                requestData.password = password;
            }

            let response = await axiosInstance().put(`/admins/${id}`, requestData);

            setOpenConfigurator(dispatch, false);
            showNotification("success", "Administrador editado correctamente", `El ID del administrador es ${response.data._id}`);

            if (uploadProfilePicture && profilePicture) {
                const profilePictureFormData = new FormData();
                profilePictureFormData.append("profile_picture", profilePicture);
                response = await axiosInstance().post(`/users/profile-picture/${id}`, profilePictureFormData);
            }
            if (uploadEthereumQR && ethereumQR) {
                const ethereumQRFormData = new FormData();
                ethereumQRFormData.append("ethereum_qr", ethereumQR);
                response = await axiosInstance().post(`/admins/files/ethereum_qr/${id}`, ethereumQRFormData);
            }
            if (uploadBitcoinQR && bitcoinQR) {
                const bitcoinQRFormData = new FormData();
                bitcoinQRFormData.append("btc_qr", bitcoinQR);
                response = await axiosInstance().post(`/admins/files/btc_qr/${id}`, bitcoinQRFormData);
            }
            if (uploadUsdtQR && usdtQR) {
                const usdtQRFormData = new FormData();
                usdtQRFormData.append("usdt_qr", usdtQR);
                response = await axiosInstance().post(`/admins/files/usdt_qr/${id}`, usdtQRFormData);
            }

        } catch (error) {
            console.error('Error editing admin:', error.response.data.error);
            showNotification("error", "Error al editar el administrador", error.response.data.error);
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
                    <MDTypography variant="h6" mb={2}>Información de Usuario</MDTypography>
                    <Grid flexDirection="column" container paddingX={4} paddingY={2} spacing={2}>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Nombre de usuario"
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Correo electrónico"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </MDBox>

                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Nombre de la entidad"
                                fullWidth
                                value={entityName}
                                onChange={(e) => setEntityName(e.target.value)}
                            />
                        </MDBox>
                        { user && !user.__t &&
                            <>
                                <MDBox mb={2}>
                                    <MDInput
                                        type="number"
                                        label="Días disponibles"
                                        fullWidth
                                        value={availableDays}
                                        onChange={(e) => setAvailableDays(e.target.value)}
                                    />
                                </MDBox>
                                <MDBox mb={2}>
                                    <FormControl fullWidth>
                                        <InputLabel id="account_state">Estado de la cuenta</InputLabel>
                                        <Select
                                            value={accountState}
                                            onChange={(e) => setAccountState(e.target.value)}
                                            label="Estado de la cuenta"
                                            labelId="account_state"
                                            sx={{ paddingY: '8px' }}
                                            fullWidth
                                        >
                                            <MenuItem value="activo">Activo</MenuItem>
                                            <MenuItem value="suspendido">Suspendido</MenuItem>
                                        </Select>
                                    </FormControl>
                                </MDBox>
                            </>
                        }

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
                                    label="Nueva Contraseña"
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
                                        checked={uploadProfilePicture}
                                        onChange={() => setUploadProfilePicture(!uploadProfilePicture)}
                                        inputProps={{ 'aria-label': 'toggle-upload-profile-picture' }}
                                    />
                                }
                                label="Subir Foto de Perfil"
                            />
                        </MDBox>
                        {uploadProfilePicture && (
                            <>
                                <MDBox mb={2}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            setProfilePicture(e.target.files[0])
                                            setPreviewProfilePicture(URL.createObjectURL(e.target.files[0]))
                                        }}
                                    />
                                </MDBox>
                                {previewProfilePicture &&
                                    <div style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                                        <img
                                            src={previewProfilePicture}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                objectPosition: 'center'
                                            }}
                                        />
                                    </div>
                                }
                            </>
                        )}
                    </Grid>

                    <MDTypography variant="h6" mb={2}>Billeteras de Depósito</MDTypography>
                    <Grid container flexDirection={"column"} spacing={2} paddingX={4} paddingY={2}>

                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Dirección USDT"
                                fullWidth
                                value={usdtAddress}
                                onChange={(e) => setUsdtAddress(e.target.value)}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Link de pago USDT"
                                fullWidth
                                value={usdtLink}
                                onChange={(e) => setUsdtLink(e.target.value)}
                            />

                        </MDBox>

                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Dirección Ethereum"
                                fullWidth
                                value={ethereumAddress}
                                onChange={(e) => setEthereumAddress(e.target.value)}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Link de pago Ethereum"
                                fullWidth
                                value={ethereumLink}
                                onChange={(e) => setEthereumLink(e.target.value)}
                            />
                        </MDBox>

                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Dirección Bitcoin"
                                fullWidth
                                value={bitcoinAddress}
                                onChange={(e) => setBitcoinAddress(e.target.value)}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Link de pago Bitcoin"
                                fullWidth
                                value={bitcoinLink}
                                onChange={(e) => setBitcoinLink(e.target.value)}
                            />
                        </MDBox>


                        <MDBox mb={1}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={uploadUsdtQR}
                                        onChange={() => setUploadUsdtQR(!uploadUsdtQR)}
                                        inputProps={{ 'aria-label': 'toggle-upload-usdt-qr' }}
                                    />
                                }
                                label="Subir Código QR USDT"
                            />
                        </MDBox>
                        {uploadUsdtQR && (
                            <>
                                <MDBox mb={2}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            setUsdtQR(e.target.files[0])
                                            setPreviewUsdtQR(URL.createObjectURL(e.target.files[0]))
                                        }}
                                    />
                                </MDBox>
                                {previewUsdtQR &&
                                    <div style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                                        <img 
                                            src={previewUsdtQR} 
                                            alt="Preview" 
                                            style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover', 
                                            objectPosition: 'center' 
                                            }} 
                                        />
                                    </div>
                                }
                            </>
                        )}
                        <MDBox mb={1}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={uploadEthereumQR}
                                        onChange={() => setUploadEthereumQR(!uploadEthereumQR)}
                                        inputProps={{ 'aria-label': 'toggle-upload-ethereum-qr' }}
                                    />
                                }
                                label="Subir Código QR Ethereum"
                            />
                        </MDBox>
                        {uploadEthereumQR && (
                            <>
                                <MDBox mb={2}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            setEthereumQR(e.target.files[0])
                                            setPreviewEthereumQR(URL.createObjectURL(e.target.files[0]))
                                        }}
                                    />
                                </MDBox>
                                {previewEthereumQR &&
                                    <div style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                                        <img 
                                            src={previewEthereumQR} 
                                            alt="Preview" 
                                            style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover', 
                                            objectPosition: 'center' 
                                            }} 
                                        />
                                    </div>
                                }
                            </>
                        )}
                        <MDBox mb={1}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={uploadBitcoinQR}
                                        onChange={() => setUploadBitcoinQR(!uploadBitcoinQR)}
                                        inputProps={{ 'aria-label': 'toggle-upload-bitcoin-qr' }}
                                    />
                                }
                                label="Subir Código QR Bitcoin"
                            />
                        </MDBox>
                        {uploadBitcoinQR && (
                            <>
                                <MDBox mb={2}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            setBitcoinQR(e.target.files[0])
                                            setPreviewBitcoinQR(URL.createObjectURL(e.target.files[0]))
                                        }}
                                    />
                                </MDBox>
                                {previewBitcoinQR &&
                                    <div style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                                        <img 
                                            src={previewBitcoinQR} 
                                            alt="Preview" 
                                            style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover', 
                                            objectPosition: 'center' 
                                            }} 
                                        />
                                    </div>
                                }
                            </>
                        )}
                    </Grid>
                    <MDBox mt={4} mb={1}>
                        <MDButton variant="gradient" color="info" fullWidth onClick={handleEditAdmin}>
                            Editar Administrador
                        </MDButton>
                    </MDBox>
                </>
            )}
        </MDBox>
    );
};

export default EditAdminForm;
