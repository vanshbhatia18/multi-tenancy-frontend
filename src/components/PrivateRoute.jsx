import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

export default function PrivateRoute({ children }) {
  const token = getToken();

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // Logged in → show the protected page
  return children;
}
