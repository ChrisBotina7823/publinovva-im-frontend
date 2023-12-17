import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import { FormControlLabel, Switch } from "@mui/material";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

import { setOpenConfigurator, useMaterialUIController } from "context";
import { useUser } from "context/userContext";

const EditAdminForm = ({ id, f }) => {
    const [entityName, setEntityName] = useState('');
    const [depositAddress, setDepositAddress] = useState('');
    const [availableDays, setAvailableDays] = useState(0);
    const [accountState, setAccountState] = useState('activo');

    const [uploadProfilePicture, setUploadProfilePicture] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);

    const [uploadDepositQR, setUploadDepositQR] = useState(false);
    const [depositQR, setDepositQR] = useState(null);

    // User fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    // Toggle states
    const [showPassword, setShowPassword] = useState(false);

    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();

    const { user, updateUser } = useUser()

    useEffect(() => {
        const fetchAdminData = async (id) => {
            try {
                const response = await axiosInstance().get(`/admins/${id}`);
                const adminData = response.data;

                console.log(id)
                console.log(response)

                setEntityName(adminData.entity_name || '');
                setDepositAddress(adminData.deposit_address || '');
                setAvailableDays(adminData.available_days || 0);
                setAccountState(adminData.account_state || 'activo');

                // User fields
                setUsername(adminData.username || '');
                setEmail(adminData.email || '');
            } catch (error) {
                console.error('Error fetching admin data:', error.response.data.error);
            }
        };

        fetchAdminData(id);
    }, [id]);

    const handleEditAdmin = async () => {
        try {
            setOpenConfigurator(dispatch, false);
            if(f) f()
            await updateUser()

            const requestData = {
                entity_name: entityName,
                deposit_address: depositAddress,
                available_days: availableDays,
                account_state: accountState,
                username: username,
                email: email,
            };

            if (showPassword && password) {
                requestData.password = password;
            }

            let response = await axiosInstance().put(`/admins/${id}`, requestData);

            showNotification("success", "Administrador editado correctamente", `El ID del administrador es ${response.data._id}`);
        
            if (uploadProfilePicture && profilePicture) {
                const profilePictureFormData = new FormData();
                profilePictureFormData.append("profile_picture", profilePicture);

                response = await axiosInstance().post(`/users/profile-picture/${id}`, profilePictureFormData);
                console.log(response.data)
            }

            if (uploadDepositQR && depositQR) {
                const depositQRFormData = new FormData();
                depositQRFormData.append("deposit_qr", depositQR);

                response = await axiosInstance().post(`/admins/deposit-qr/${id}`, depositQRFormData);
                console.log(response.data)
            }

        } catch (error) {
            console.error('Error editing admin:', error.response.data.error);
            showNotification("error", "Error al editar el administrador", error.response.data.error);
        }
    };

    return (
        <MDBox component="form" role="form">

            {/* User fields */}
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

            {/* Admin-specific fields */}
            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Nombre de la entidad"
                    fullWidth
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Dirección de depósito"
                    fullWidth
                    value={depositAddress}
                    onChange={(e) => setDepositAddress(e.target.value)}
                />
            </MDBox>
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

            {/* Password toggle */}
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

                        {/* Upload Profile Picture */}
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
                <MDBox mb={2}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                </MDBox>
            )}

            {/* Upload Deposit QR */}
            <MDBox mb={1}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={uploadDepositQR}
                            onChange={() => setUploadDepositQR(!uploadDepositQR)}
                            inputProps={{ 'aria-label': 'toggle-upload-deposit-qr' }}
                        />
                    }
                    label="Subir Código QR de Depósito"
                />
            </MDBox>
            {uploadDepositQR && (
                <MDBox mb={2}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setDepositQR(e.target.files[0])}
                    />
                </MDBox>
            )}

            {/* Edit button */}
            <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth onClick={handleEditAdmin}>
                    Editar Administrador
                </MDButton>
            </MDBox>
        </MDBox>
    );
};

export default EditAdminForm;
