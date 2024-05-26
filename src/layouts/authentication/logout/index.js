// Import necessary dependencies
import { useUser } from "context/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Logout = () => {
  const { user, removeUser } = useUser()
  const navigate = useNavigate();

  let newRoute;
  if(user) {
    if(user.__t === "Admin") {
      newRoute = "/admin/sign-in"
    } else if(user.__t === "Client") {
      newRoute = `/client/sign-in/${user.admin._id}`
    } else {
      newRoute = "/superuser/sign-in"
    }
  } else {
    newRoute = "/admin/sign-in"
  }
  useEffect(() => {
    const update = async () => {
      await removeUser()
    }
    update()
    // Redirect to the sign-in page
    navigate(newRoute);
  }, [navigate]);

  // Render nothing or a loading message if needed
  return null;
};

export default Logout;
