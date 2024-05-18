import { useUser } from "context/userContext";
import PropTypes from "prop-types";
import { Route, Navigate } from "react-router-dom";

import { useNotification } from "components/NotificationContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { user, updateUser } = useUser()
  const { showNotification } = useNotification()
  return user ? element : <Navigate to="/authentication/sign-in" replace />;
};

PrivateRoute.propTypes = {
  element: PropTypes.node,
};

export default PrivateRoute;
