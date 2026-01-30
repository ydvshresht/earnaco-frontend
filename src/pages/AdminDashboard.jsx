import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch {
        alert("Failed to load admin stats");
      }
    };
    loadStats();
  }, []);

  if (!stats) return <h3>Loading...</h3>;

  return (
    <div className="screen">
      {/* HEADER */}
      <div className="icon-text">
        <i
          className="material-icons"
          onClick={() => navigate("/profile")}
        >
          arrow_back
        </i>
        Admin
      </div>

      <h2>⚙️ Admin Dashboard</h2>

      {/* STATS GRID */}
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
          <h3>🪙 Coins Sold</h3>
          <p>{stats.coinsSold}</p>
        </div>

        <div className="card">
          <h3>🪙 Coins in Circulation</h3>
          <p>{stats.totalCoins}</p>
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
          <h3>❓ Questions</h3>
          <p>{stats.questions}</p>
        </div>
      </div>

      {/* ADMIN ACTIONS */}
      <div className="admin-menu">

        {/* PRIMARY FLOW */}
        <button onClick={() => navigate("/admin/create-test")}>
          ➕ Create Test
        </button>

        <button onClick={() => navigate("/admin/manage-tests")}>
          🧪 Manage Tests
        </button>

        <button onClick={() => navigate("/admin/manage-contests")}>
          🏆 Manage Contests
        </button>

        {/* SECONDARY */}
        <button onClick={() => navigate("/admin/analytics")}>
          📊 Analytics
        </button>

        <button onClick={() => navigate("/admin/fraud")}>
          🚨 Fraud Monitor
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
