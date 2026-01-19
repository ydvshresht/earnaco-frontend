import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api/api";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get("/auth/me"); // cookie check
        setAuth(true);
      } catch {
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  return auth ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
