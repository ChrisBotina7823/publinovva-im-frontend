// Import necessary dependencies
import { useUser } from "context/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Logout = () => {
  const { removeUser } = useUser()
  const navigate = useNavigate();

  useEffect(() => {
    const update = async () => {
      await removeUser()
    }
    update()
    // Redirect to the sign-in page
    navigate("/authentication/sign-in");
  }, [navigate]);

  // Render nothing or a loading message if needed
  return null;
};

export default Logout;
