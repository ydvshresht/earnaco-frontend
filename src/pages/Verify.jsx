import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import API from "../api/api";

function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await API.get(`/auth/verify/${token}`);
        alert("✅ Email verified! Login now");
        navigate("/");
      } catch {
        alert("❌ Invalid or expired link");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return <h2>Verifying your email...</h2>;
}

export default Verify;
