import { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import { setOpenConfigurator, useMaterialUIController } from "context";
import { useUser } from "context/userContext";
import { Checkbox, CircularProgress, FormControlLabel, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const AddClientForm = ({admin_id=null}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [recoveryToken, setRecoveryToken] = useState('');
    const [fullname, setFullname] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [iPassword, setIPassword] = useState('');
    const [usdPassword, setUsdPassword] = useState('');

    const { showNotification } = useNotification();
    const [controller, dispatch] = useMaterialUIController();

    const { user, setUser } = useUser()

    const [loading, setLoading] = useState()

    const [captchaValue, setCaptchaValue] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const navigate = useNavigate();
    const [ admin, setAdmin ] = useState(null)
    if (admin_id) {
        axiosInstance().get(`/styles/${admin_id}`)
          .then(response => {
            setAdmin(response.data)
          })
          .catch(error => {
            navigate("/admin-signin")
            console.error(error)
            showNotification("error", "Administrador no encontrado", "No se encontró ningún administrador con la url proporcionada");
          });
      }
    const handleAddClient = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance().post((admin_id ? '/auth/registration/' : '/clients'), {
                username,
                password,
                email,
                profile_picture: profilePicture,
                recovery_token: recoveryToken,
                fullname,
                country,
                phone,
                account_state: "en revision",
                admin_id: admin?._id || user._id,
                i_password: iPassword,
                usd_password: usdPassword,
            });
            if(admin_id) {
                // console.log(admin_id)
                navigate("/auth/verify-account/" + admin_id)
                // showNotification("success", "Cuenta creada", "Tu cuenta ha sido creada correctamente, ingresa a tu correo para activarla")
            } else {    
                setOpenConfigurator(dispatch, false);
                showNotification("success", "Cliente añadido correctamente", `El ID del cliente es ${response.data._id}`);
            }
        } catch (error) {
            console.error(error)
            if(error.response) {
                console.error('Error adding client:', error.response.data.error);
                showNotification("error", "Error al añadir el cliente", error.response.data.error);
            } else {
                showNotification("error", "Error al añadir el cliente", "Por favor, intenta de nuevo")
            }
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
                <Grid container>
                    <Grid item xl={admin_id ? 6 : 12} px={2} mb={2}>
                        <MDInput
                            type="text"
                            label="Usuario"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Grid>
                    <Grid item xl={admin_id ? 6 : 12} px={2} mb={2}>
                        <MDInput
                            type="password"
                            label="Contraseña"
                            fullWidth
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if(admin_id) {
                                    setUsdPassword(e.target.value)
                                    setIPassword(e.target.value)
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xl={admin_id ? 6 : 12} px={2} mb={2}>
                        <MDInput
                            type="email"
                            label="Correo Electrónico"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>

                    <Grid item xl={admin_id ? 6 : 12} px={2} mb={2}>
                        <MDInput
                            type="text"
                            label="Nombre completo"
                            fullWidth
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </Grid>
                    <Grid item xl={admin_id ? 6 : 12} px={2} mb={2}>
                        <MDInput
                            type="text"
                            label="País"
                            fullWidth
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </Grid>
                    <Grid item xl={admin_id ? 6 : 12} px={2} mb={2}>
                        <MDInput
                            type="text"
                            label="Teléfono"
                            fullWidth
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Grid>
                    { !admin_id && (
                        <>
                            <Grid item xl={admin_id ? 6 : 12} px={2} mb={2}>
                                <MDInput
                                    type="password"
                                    label="Contraseña Billetera USDT (trc20)"
                                    fullWidth
                                    value={iPassword}
                                    onChange={(e) => setIPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xl={admin_id ? 6 : 12} px={2} mb={2}>
                                <MDInput
                                    type="password"
                                    label="Contraseña Billetera de Comercio"
                                    fullWidth
                                    value={usdPassword}
                                    onChange={(e) => setUsdPassword(e.target.value)}
                                />
                            </Grid>
                        </>
                    )}

                    {!admin_id && (user && !user.__t) &&
                        <Grid item xl={admin_id ? 6 : 12} px={2} mb={2}>
                            <MDInput
                                type="text"
                                label="Username del Administrador"
                                fullWidth
                                value={adminUsername}
                                onChange={(e) => setAdminUsername(e.target.value)}
                            />
                        </Grid>
                    }

                    {admin_id && (
                        <Grid item xl={admin_id ? 6 : 12} px={2} mb={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={termsAccepted}
                                        onChange={event => setTermsAccepted(event.target.checked)}
                                        name="termsAccepted"
                                        color="primary"
                                    />
                                }
                                label="Acepto los términos y condiciones"
                            />
                        </Grid>
                    )}
                    <Grid item xl={admin_id ? 6 : 12} px={2} mb={2}>
                        {admin_id && (
                            // 6LeydPQpAAAAALS8HTNVRGsyP2IPIiMPh26-IYZn
                            // 6LeydPQpAAAAACJ57YkHbGqw05trEHdOfgcMhyln
                            <ReCAPTCHA
                                sitekey="6LcCdvQpAAAAAD1iAjHRHLpIx6LglNVZc55h8ktn"
                                onChange={value => setCaptchaValue(value)}
                            />
                        )}
                    </Grid>

                    <MDBox mx="auto" mt={2} mb={1}>
                        <MDButton disabled={admin_id && !(captchaValue && termsAccepted && username && password && email && fullname && country && phone)} variant="gradient" color="info" fullWidth onClick={handleAddClient}>
                            {admin_id ? "Registrarse" : "Añadir Cliente"} 
                        </MDButton>
                    </MDBox>
                </Grid>
            )}
        </MDBox>

    );
};

export default AddClientForm;
