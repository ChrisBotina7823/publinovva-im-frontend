import axios from 'axios'

const token = localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',  // Asegúrate de ajustar la URL base según tu configuración
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': token,
    },
});

export default axiosInstance