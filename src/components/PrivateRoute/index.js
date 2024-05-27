import { useUser } from "context/userContext";
import PropTypes from "prop-types";
import { Route, Navigate } from "react-router-dom";

import { useNotification } from "components/NotificationContext";

const PrivateRoute = ({ element, ...rest }) => {
  const {user} = useUser()
  return user ? element : <Navigate to="/admin/sign-in" replace />;
};

PrivateRoute.propTypes = {
  element: PropTypes.node,
};

export default PrivateRoute;
