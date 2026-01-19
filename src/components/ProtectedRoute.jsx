import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    API.get("/auth/me")
      .then(() => setAuth(true))
      .catch(() => setAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return auth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
