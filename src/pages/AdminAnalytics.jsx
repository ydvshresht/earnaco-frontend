import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

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
    } catch (err) {
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
          style={{ cursor: "pointer" }}
        >
          arrow_back Admin Analytics
        </i>
       
      </div>

      <h2>📊 Platform Overview</h2>

      {/* BASIC STATS */}
      <div className="card">👥 Total Users: {data.totalUsers}</div>
      <div className="card">📝 Total Tests: {data.totalTests}</div>
      <div className="card">🏆 Total Contests: {data.totalContests}</div>
      <div className="card">🎯 Total Attempts: {data.totalAttempts}</div>

      {/* WALLET / COINS */}
      <div className="card">
        🪙 Total Coins in Wallets: {data.totalWallet ?? 0}
      </div>

      <h3 style={{ marginTop: "20px" }}>🏅 Top Coin Holders</h3>

      {!data.topWinners || data.topWinners.length === 0 ? (
        <p>No data available</p>
      ) : (
        data.topWinners.map((u, i) => (
          <div key={u._id} className="leader-row">
            #{i + 1} {u.fullName} → 🪙 {u.wallet}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminAnalytics;
