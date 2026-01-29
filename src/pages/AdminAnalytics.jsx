import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/adminAnalytics.css";

function AdminAnalytics() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await API.get("/admin/analytics/stats");
      setData(res.data);
    } catch {
      alert("Failed to load analytics");
      navigate(-1);
    }
  };

  if (!data) return <h3>Loading analytics...</h3>;

  return (
    <div className="screen">
      {/* BACK */}
      <div className="icon-text">
        <i
          className="material-icons"
          onClick={() => navigate(-1)}
        >
          arrow_back
        </i>
        Admin Analytics
      </div>

      <h2>📊 Platform Overview</h2>

      {/* STATS CARDS */}
      <div className="card">👥 Total Users: {data.totalUsers}</div>
      <div className="card">📝 Total Tests: {data.totalTests}</div>
      <div className="card">🏆 Total Contests: {data.totalContests}</div>
      <div className="card">🎯 Total Attempts: {data.totalAttempts}</div>

      {/* COIN METRICS */}
      <div className="card">
        🪙 Total Coins Distributed: {data.totalCoinsDistributed}
      </div>

      <div className="card">
        🪙 Coins in Circulation: {data.totalCoinsInWallets}
      </div>

      <h3 style={{ marginTop: "20px" }}>🏅 Top Coin Holders</h3>

      {data.topCoinUsers.length === 0 ? (
        <p>No data available</p>
      ) : (
        data.topCoinUsers.map((u, i) => (
          <div key={u._id} className="leader-row">
            #{i + 1} {u.fullName} ({u.userId}) → 🪙 {u.coins}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminAnalytics;
