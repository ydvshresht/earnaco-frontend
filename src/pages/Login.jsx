import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      console.log("LOGIN SUCCESS", res.data);
      navigate("/entry");
    } catch (err) {
      console.log("LOGIN ERROR", err.response);
      alert(err.response?.data?.msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p>
        No account?{" "}
        <span
          className="link"
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>

      <p>
        Forgot password?{" "}
        <span
          className="link"
          onClick={() => navigate("/forgot")}
        >
          Forgot
        </span>
      </p>
    </div>
  );
}

export default Login;
