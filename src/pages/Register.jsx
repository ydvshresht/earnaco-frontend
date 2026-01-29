import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api/api";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  /* =====================
     OTP TIMER
  ===================== */
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* =====================
     SEND OTP
  ===================== */
  const sendOtp = async () => {
    if (!email) {
      alert("Enter email first");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/send-otp", { email });
      alert("OTP sent to your email");
      setOtpSent(true);
      setTimer(60);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     VERIFY & REGISTER
  ===================== */
  const verifyAndRegister = async () => {
    if (!fullName || !email || !password || !otp) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/verify-otp-register", {
        fullName,
        email,
        password,
        otp
      });

      alert("Registered successfully. Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     GOOGLE SIGNUP
  ===================== */
  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google-login", {
        token: credentialResponse.credential
      });

      console.log("GOOGLE SIGNUP SUCCESS", res.data);
      navigate("/entry");
    } catch (err) {
      alert("Google signup failed");
    }
  };

  return (
    <div className="screen">
      <h2>Register</h2>

      {/* 🔵 GOOGLE SIGNUP */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <GoogleLogin
          onSuccess={handleGoogleSignup}
          onError={() => alert("Google signup failed")}
        />
        <p style={{ marginTop: "10px" }}>OR</p>
      </div>

      <input
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      {!otpSent && (
        <button onClick={sendOtp} disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      )}

      {otpSent && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />

          <button onClick={verifyAndRegister} disabled={loading}>
            {loading ? "Registering..." : "Verify & Register"}
          </button>

          <br /><br />

          <button
            onClick={sendOtp}
            disabled={timer > 0 || loading}
            style={{ background: "transparent", color: "#646cff" }}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </>
      )}

      <p>
        Already registered?{" "}
        <span className="link" onClick={() => navigate("/")}>
          Login
        </span>
      </p>
    </div>
  );
}

export default Register;
