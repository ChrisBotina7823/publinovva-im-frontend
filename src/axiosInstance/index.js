import axios from 'axios'

export default () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: 'http://localhost:4000',  // Asegúrate de ajustar la URL base según tu configuración
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': token,
    },
});
}