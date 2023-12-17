import React, { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import { setOpenConfigurator, useMaterialUIController } from "context";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from "@mui/material/Select";
import { FormControlLabel, Switch } from "@mui/material";
import { useUser } from "context/userContext";

const AddAdminForm = () => {
  const [entityName, setEntityName] = useState('');
  const [depositAddress, setDepositAddress] = useState('');

  // User fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  // Admin-specific fields
  const [depositQR, setDepositQR] = useState('');

  // Toggle states
  const [showPassword, setShowPassword] = useState(false);

  const { showNotification } = useNotification();
  const [controller, dispatch] = useMaterialUIController();

  const {user, setUser} = useUser()

  const handleAddAdmin = async () => {
    try {
      if (user.__t === "Admin") {
        setUsername(user.username);
      }

      const response = await axiosInstance().post('/admins', {
        username,
        password,
        email,
        profile_picture: profilePicture,
        entity_name: entityName,
        deposit_address: depositAddress,
        deposit_qr: depositQR,
      });

      setOpenConfigurator(dispatch, false);
      console.log(response.data)
      showNotification("success", "Administrador añadido correctamente", `El ID del administrador es ${response.data._id}`);
    } catch (error) {
      console.error('Error adding admin:', error.response.data.error);
      showNotification("error", "Error al añadir el administrador", error.response.data.error);
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
          type="password"
          label="Contraseña"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          type="email"
          label="Correo electrónico"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          type="text"
          label="Foto de perfil"
          fullWidth
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
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
          type="text"
          label="Código QR de depósito"
          fullWidth
          value={depositQR}
          onChange={(e) => setDepositQR(e.target.value)}
        />
      </MDBox>

      {/* Button to add the admin */}
      <MDBox mt={4} mb={1}>
        <MDButton variant="gradient" color="info" fullWidth onClick={handleAddAdmin}>
          Añadir Administrador
        </MDButton>
      </MDBox>
    </MDBox>
  );
};

export default AddAdminForm;
