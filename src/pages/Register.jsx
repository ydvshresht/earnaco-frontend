import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref"); // 👈 referral from URL

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
     SEND OTP (FIXED)
  ===================== */
  const sendOtp = async () => {
    if (!email) return alert("Enter email first");

    try {
      setLoading(true);
      await API.post("/auth/send-otp", { email });
      setOtpSent(true);
      setTimer(60);
      alert("OTP sent to your email");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     VERIFY OTP & REGISTER
  ===================== */
  const verifyAndRegister = async () => {
    if (!fullName || !email || !password || !otp)
      return alert("All fields required");

    try {
      setLoading(true);

      await API.post("/auth/verify-otp-register", {
        fullName,
        email,
        password,
        otp
      });

      // 🎁 APPLY REFERRAL (OPTIONAL)
      if (referralCode) {
        try {
          await API.post("/auth/apply-referral", {
            code: referralCode
          });
        } catch (e) {
          console.log("Referral already used or invalid");
        }
      }

      alert("Registered successfully 🎉 You received 5 coins");
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
      await API.post("/auth/google-login", {
        token: credentialResponse.credential
      });

      // 🎁 APPLY REFERRAL AFTER GOOGLE SIGNUP
      if (referralCode) {
        try {
          await API.post("/auth/apply-referral", {
            code: referralCode
          });
        } catch {}
      }

      alert("Signup successful 🎉 You received 5 coins");
      navigate("/entry");
    } catch {
      alert("Google signup failed");
    }
  };

  return (
    <div className="screen">
      <h2>Create Account</h2>

      {/* 🔵 GOOGLE SIGNUP */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
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

      {referralCode && (
        <p style={{ marginTop: "10px", color: "green" }}>
          🎁 Referral applied: +1 bonus coin
        </p>
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
