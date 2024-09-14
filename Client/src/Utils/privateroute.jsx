import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(AuthContext);

  if (isLoggedIn === null || user === null) {
    return null;
  }
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;