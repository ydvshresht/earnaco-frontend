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
    const res = await API.get("/admin/analytics/stats");
    setData(res.data);
  };

  if (!data) return <h3>Loading analytics...</h3>;

  return (<div id="app">
    <div className="page">
         <div className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </div>
      <h2>📊 Admin Analytics</h2>

      <div className="card">👥 Users: {data.totalUsers}</div>
      <div className="card">📝 Tests: {data.totalTests}</div>
      <div className="card">🏆 Contests: {data.totalContests}</div>
      <div className="card">🎯 Attempts: {data.totalAttempts}</div>
      <div className="card">💰 Wallet Distributed: ₹{data.totalWallet}</div>

      <h3>Top Winners 🥇</h3>

      {data.topWinners.map((u, i) => (
        <div key={u._id}>
          #{i + 1} {u.fullName} → ₹{u.wallet}
        </div>
      ))}
    </div></div>
  );
}

export default AdminAnalytics;
