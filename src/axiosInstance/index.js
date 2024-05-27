import { Troubleshoot } from '@mui/icons-material';
import axios from 'axios'

export default () => {
  const token = localStorage.getItem("token");
  try {
    let debug = false
    return axios.create({
      baseURL: debug ? "http://localhost:4000" : "https://publinovva-im-backend-production.up.railway.app",  // Asegúrate de ajustar la URL base según tu configuración
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': token,
      },
    });
  } catch(err) {
    return null
  }
}