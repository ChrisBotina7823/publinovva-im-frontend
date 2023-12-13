// Import necessary dependencies
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user")

    // Redirect to the sign-in page
    navigate("/authentication/sign-in");
  }, [navigate]);

  // Render nothing or a loading message if needed
  return null;
};

export default Logout;
