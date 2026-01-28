import {  useState } from "react"
import API from "../api/api";
function Forgot() {
  const [email, setEmail] = useState("");

  const send = async () => {
    await API.post("/auth/forgot-password", { email });
    alert("Check email for reset link");
  };

  return (<div id="app">
    <div className="page">
    <>
      <input
        placeholder="Email"
        onChange={e=>setEmail(e.target.value)}
      />
      <button onClick={send}>Send Reset Link</button>
    </></div></div>
  );
}
export default Forgot;