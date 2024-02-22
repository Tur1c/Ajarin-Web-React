import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";

export const ProtectedRoute = ({ children }: any) => {
  const { user } = useAuth();
  const isLogged = sessionStorage.getItem("jwt");
  
  if (!user && !isLogged) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
