import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api/api";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* =====================
     EMAIL + PASSWORD LOGIN
  ===================== */
 const handleLogin = async () => {
  if (!email || !password) {
    alert("Email and password are required");
    return;
  }

  try {
    setLoading(true);

    const res = await API.post("/auth/login", {
      email,
      password
    });

    console.log("LOGIN SUCCESS", res.data);
    navigate("/entry");

  } catch (err) {
    const msg = err.response?.data?.msg;

    if (msg === "Please login using Google") {
      alert("This account was created using Google. Please use Google Login.");
    } else if (msg === "Account not verified") {
      alert("Please verify your account first.");
    } else {
      alert(msg || "Invalid email or password");
    }

  } finally {
    setLoading(false);
  }
};

  /* =====================
     GOOGLE LOGIN
  ===================== */
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google-login", {
        token: credentialResponse.credential
      });

      console.log("GOOGLE LOGIN SUCCESS", res.data);
      navigate("/entry");
    } catch {
      alert("Google login failed");
    }
  };

  return (
    <div className="auth-screen ">
      {/* TITLE */}
      <h2>Login to Earnaco</h2>

      {/* EMAIL */}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      {/* PASSWORD */}
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      {/* LOGIN BUTTON */}
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* GOOGLE LOGIN */}
      <div className="divider">
        <span>OR</span>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => alert("Google login failed")}
        />
      </div>

      {/* LINKS */}
      <p className="auth-links">
        No account?{" "}
        <span className="link" onClick={() => navigate("/register")}>
          Register
        </span>
      </p>

      <p className="auth-links">
        Forgot password?{" "}
        <span className="link" onClick={() => navigate("/forgot")}>
          Reset
        </span>
      </p>

      {/* 🔐 LEGAL CONSENT (VERY IMPORTANT) */}
      <div className="legal-box">
        <p className="footer-links">
          By continuing, you agree to Earnaco’s{" "}
          <a href="/terms" target="_blank">Terms of Service</a>,{" "}
          <a href="/privacy" target="_blank">Privacy Policy</a>,{" "}
          <a href="/refund" target="_blank">Refund Policy</a> and{" "}
          <a href="/disclaimer" target="_blank">Disclaimer</a>.
        </p>

        <p className="legal-note">
          Coins are virtual, non-withdrawable, and used only for contests.
          Watching ads and referrals provide promotional rewards only.
        </p>
      </div>
    </div>
  );
}

export default Login;
