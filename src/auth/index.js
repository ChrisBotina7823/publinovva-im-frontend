import PropTypes from "prop-types";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("miToken");
    return !!token; // Devuelve true si el token existe, false si no existe
  };

  return isAuthenticated() ? element : <Navigate to="/authentication/sign-in" replace />;
};

PrivateRoute.propTypes = {
  element: PropTypes.node,
};

export default PrivateRoute;
