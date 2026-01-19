import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";   // ✅ FIXED
import "../styles/admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats,setStats]=useState(null);

 useEffect(()=>{
  API.get("/admin/stats")
   .then(res=>setStats(res.data));
 },[]);

 if(!stats) return <h3>Loading...</h3>;
  return (
    <div className="container">
 <div className="icon-text"><i className="material-icons" onClick={() => navigate("/profile")}>arrow_back</i>
   Admin </div>
      
      <h2>⚙️ Admin Dashboard</h2>

      <div className="grid">
        <div className="card">
     <h3>Total Users</h3>
     <p>{stats.totalUsers}</p>
    </div>

    <div className="card">
     <h3>Today's Signup</h3>
     <p>{stats.todayUsers}</p>
    </div>

    <div className="card">
     <h3>Total Deposits</h3>
     <p>₹ {stats.depositTotal}</p>
    </div>

    <div className="card">
     <h3>Total Withdrawals</h3>
     <p>₹ {stats.withdrawTotal}</p>
    </div>

    <div className="card">
     <h3>Company Profit</h3>
     <p>₹ {stats.profit}</p>
    </div>

    <div className="card">
     <h3>Total Contests</h3>
     <p>{stats.contests}</p>
    </div>

    <div className="card">
     <h3>Fraud Cases</h3>
     <p>{stats.frauds}</p>
    </div>

        <div className="card">
          ❓ Questions  
          <h3>{stats.questions}</h3>
        </div>
</div>

      <div className="admin-menu">
        <button onClick={() => navigate("/admin/questions")}>
          ➕ Add Question
        </button>

        <button onClick={() => navigate("/admin/manage-questions")}>
          📋 Manage Questions
        </button>
 <button onClick={() => navigate("/admin/manage-tests")}>
        Manage Tests
      </button>

      <button onClick={() => navigate("/admin/manage-contests")}>
        Manage Contests
      </button>
      <button onClick={() => navigate("/admin/analytics")}>
  Analytics Dashboard 📊
</button>
<button onClick={() => navigate("/admin/withdraw")}>
   Withdraw Requests 📊
</button>
<button onClick={() => navigate("/admin/fraud")}>
   Fraud 
</button>

      </div>

    </div>
  );
}

export default AdminDashboard;
