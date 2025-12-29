import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.type_user !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};