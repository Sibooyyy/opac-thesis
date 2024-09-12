import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";  // Import AuthContext

const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);  // Access login state
  
    // If the user is not logged in, redirect them to the login page
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
  
    // If logged in, allow access to the route
    return children;
  };
  
export default PrivateRoute;