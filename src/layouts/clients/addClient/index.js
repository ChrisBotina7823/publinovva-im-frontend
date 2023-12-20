import { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import { setOpenConfigurator, useMaterialUIController } from "context";
import { useUser } from "context/userContext";

const AddClientForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [recoveryToken, setRecoveryToken] = useState('');
    const [fullname, setFullname] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [adminUsername, setAdminUsername] = useState('');
    const [iPassword, setIPassword] = useState('');
    const [usdPassword, setUsdPassword] = useState('');

    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();

    const {user, setUser} = useUser()


    const handleAddClient = async () => {
        try {
            setOpenConfigurator(dispatch, false);
            if(user.__t == "Admin") setAdminUsername(user.username)
            console.log(adminUsername)
            const response = await axiosInstance().post('/clients', {
                username,
                password,
                email,
                profile_picture: profilePicture,
                recovery_token: recoveryToken,
                fullname,
                country,
                phone,
                account_state: "en revision", 
                admin_username: adminUsername,
                i_password: iPassword, 
                usd_password: usdPassword, 
            });
            
            showNotification("success", "Cliente añadido correctamente", `El ID del cliente es ${response.data._id}`);
        } catch (error) {
            console.error('Error adding client:', error.response.data.error);
            showNotification("error", "Error al añadir el cliente", error.response.data.error);
        }
    };

    return (
        <MDBox component="form" role="form">
            {/* Input fields for User attributes */}
            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Usuario"
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
                    label="Correo Electrónico"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </MDBox>

            {/* Input fields for Client attributes */}
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

            <MDBox mb={2}>
                <MDInput
                    type="password"
                    label="Contraseña Billetera USD"
                    fullWidth
                    value={iPassword}
                    onChange={(e) => setIPassword(e.target.value)}
                />
            </MDBox>
            <MDBox mb={2}>
                <MDInput
                    type="password"
                    label="Contraseña Billetera de Inversiones"
                    fullWidth
                    value={usdPassword}
                    onChange={(e) => setUsdPassword(e.target.value)}
                />
            </MDBox>

            { !user.__t &&
            <MDBox mb={2}>
                <MDInput
                    type="text"
                    label="Username del Administrador"
                    fullWidth
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                />
            </MDBox>
            }

            {/* Button to add the client */}
            <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth onClick={handleAddClient}>
                    Añadir Cliente
                </MDButton>
            </MDBox>
        </MDBox>
    );
};

export default AddClientForm;
