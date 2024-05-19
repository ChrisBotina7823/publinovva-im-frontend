import axiosInstance from "axiosInstance";
import MDBox from "components/MDBox";
import { useNotification } from "components/NotificationContext";
import { useNavigate, useParams } from "react-router-dom";


export default function ActivateAccount() {
    const navigate = useNavigate();
    const {token} = useParams();
    const { showNotification } = useNotification();
    axiosInstance().get('/auth/activate-account/' + token)
        .then(response => {
            const admin = response.data.admin
            navigate("/client/sign-in/" + admin)
            showNotification("success", "Cuenta activada", "Tu cuenta ha sido activada correctamente, ahora puedes iniciar sesión");
        })
        .catch(error => {
            navigate("/admin/sign-in")
            showNotification("error", "Token inválido", "El token proporcionado no corresponde a ningún usuario");
            console.error(error)
        })
    return <MDBox></MDBox>
}