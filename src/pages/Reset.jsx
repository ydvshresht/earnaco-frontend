import { useParams, useNavigate  } from "react-router-dom";
import {  useState } from "react"
import API from "../api/api";
function Reset() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
const navigate = useNavigate();
  const reset = async () => {
    await API.post(`/auth/reset/${token}`, { password });
    alert("Password updated");
    navigate("/");
  };

  return (<div id="app">
    <div className="paghe">
    <>
      <input
        type="password"
        placeholder="New password"
        onChange={e=>setPassword(e.target.value)}
      />
      <button onClick={reset}>Update</button>
    </>
    </div></div>
  );
}
export default Reset;