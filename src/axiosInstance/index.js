import axios from 'axios'

export default () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: "https://publinovva-im-backend-production.up.railway.app",  // Asegúrate de ajustar la URL base según tu configuración
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': token,
    },
});
}