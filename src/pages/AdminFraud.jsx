import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/fraud.css";
import { useNavigate } from "react-router-dom";
function AdminFraud() {
  const [logs, setLogs] = useState([]);
const navigate = useNavigate();
 

 useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await API.get("/admin/fraud");
    setLogs(res.data);
  };

  const block = async (id) => {
    await API.post(`/admin/block/${id}`);
    alert("User blocked");
    fetchLogs();
  };


 return(<div id="app">
  <div className="page">
     <div className="icon-text"> <i className="material-icons" onClick={() => navigate("/admin")}>arrow_back</i>
</div>
   <h2>Fraud Logs</h2>

   {logs.map(l=>(
    <div key={l._id} className="card">
     <p>User: {l.user?.email}</p>
     <p>Reason: {l.reason}</p>
     <p>Severity: {l.severity}</p>
     <p>Action: {l.action}</p>
     <p>{new Date(l.createdAt).toLocaleString()}</p>
      <button onClick={() => block(l.user._id)}>
            Block User
          </button>
    </div>
    
   ))}
  </div></div>
 );
}

export default AdminFraud;


