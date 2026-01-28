import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/body.css";
import "../styles/login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await API.post("/auth/login", { email, password });
 
      navigate("/entry");
   

    console.log("LOGIN SUCCESS", res.data); // 👈 ADD THIS
     
  } catch (err) {
    console.log("LOGIN ERROR", err.response); // 👈 ADD

    if (err.response?.status === 403) {
      alert("Verify your email first");
      return;
    }

    alert(err.response?.data?.msg || "Login failed");
  }
};


  const resend = async () => {
    try {
      const res = await API.post("/auth/resend", { email });
      alert(res.data.msg);
    } catch {
      alert("Error sending email");
    }
  };

  return (<div id="app">
    <div className="page">
    <div style={{ padding: "40px" }}>
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

      <button onClick={handleLogin}>Login</button>

      <p>
        No account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
<p>
        Forgot password?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/forgot")}
        >
          Forgot
        </span>
      </p>
      <span onClick={resend}>
        Resend verification email
      </span>
    </div></div></div>
  );
}

export default Login;
