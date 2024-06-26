import { useUser } from "context/userContext";
import PropTypes from "prop-types";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = () => {
    const { token } = useUser()
    return !!token;
  };

  return isAuthenticated() ? element : <Navigate to="/authentication/sign-in" replace />;
};

PrivateRoute.propTypes = {
  element: PropTypes.node,
};

export default PrivateRoute;
