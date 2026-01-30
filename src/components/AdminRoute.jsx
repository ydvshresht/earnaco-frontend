import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await API.get("/auth/me");
        setIsAdmin(res.data.role === "admin");
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <div>Checking access...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/entry" replace={true} />;
  }

  return <>{children}</>;
}

export default AdminRoute;
