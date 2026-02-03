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
    <div className="admin-screen">

      {/* HEADER */}
      <div className="admin-header">
        <i
          className="material-icons"
          onClick={() => navigate("/profile")}
        >
          arrow_back
        </i>
        <span>⚙️ Admin Dashboard</span>
      </div>

      {/* STATS GRID */}
      <div className="stats-grid">

        <div className="stat-card blue">
          <h4>👥 Total Users</h4>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="stat-card green">
          <h4>➕ Today’s Signup</h4>
          <p>{stats.todayUsers}</p>
        </div>

        <div className="stat-card gold">
          <h4>🪙 Coins Sold</h4>
          <p>{stats.coinsSold}</p>
        </div>

        <div className="stat-card gold">
          <h4>🪙 Coins in Circulation</h4>
          <p>{stats.totalCoins}</p>
        </div>

        <div className="stat-card purple">
          <h4>📅 Total Contests</h4>
          <p>{stats.contests}</p>
        </div>

        <div className="stat-card red">
          <h4>🚨 Fraud Cases</h4>
          <p>{stats.frauds}</p>
        </div>

        <div className="stat-card orange wide">
          <h4>❓ Questions</h4>
          <p>{stats.questions}</p>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="admin-actions">

        <div
          className="action-card"
          onClick={() => navigate("/admin/manage-contests")}
        >
          🧪 Manage Contests
          <span>›</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/admin/create-contest-wizard")}
        >
          🏆 Create Contests
          <span>›</span>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;