import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/wallet-ui.css";

function Wallet() {
  const [coins, setCoins] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/me")
      .then(res => setCoins(res.data.coins))
      .catch(() => alert("Failed to load wallet"));
  }, []);

  const watchAd = async () => {
    try {
      const res = await API.post("/wallet/watch-ad");
      alert(res.data.msg);
      setCoins(res.data.coins);
    } catch (err) {
      alert(err.response?.data?.msg || "Ad failed");
    }
  };

  return (
    <div className="wallet-screen">

      {/* BACK */}
      <i
        className="material-icons back-btn"
        onClick={() => navigate("/entry")}
      >
        arrow_back
      </i>

      {/* TITLE */}
      <h1 className="wallet-title">My Coins</h1>

      {/* BALANCE */}
      <div className="coin-balance">
        <span className="coin">🪙</span>
        <span className="coin-count">{coins}</span>
        <p>Available Coins</p>
      </div>

      {/* BUY COINS */}
      <div className="wallet-card">
        <div className="card-left">
          <div className="card-icon">$</div>
          <div>
            <h3>Buy Coins</h3>
            <p>Purchase using real money</p>
          </div>
        </div>
        <button onClick={() => navigate("/buy-coins")}>Buy</button>
      </div>

      {/* WATCH AD */}
      <div className="wallet-card">
        <div className="card-left">
          <div className="card-icon">▶</div>
          <div>
            <h3>Watch Ad</h3>
            <p>Get 1 free coin</p>
          </div>
        </div>
        <button onClick={watchAd}>Watch</button>
      </div>

      {/* REFER */}
      <div className="wallet-card">
        <div className="card-left">
          <div className="card-icon">👥</div>
          <div>
            <h3>Refer & Earn</h3>
            <p>Invite friends & earn coins</p>
          </div>
        </div>
        <button onClick={() => navigate("/refer")}>Refer</button>
      </div>

      {/* QUICK ACTIONS */}
      <h4 className="section">Quick Actions</h4>

      <div
        className="quick-card"
        onClick={() => navigate("/transactions")}
      >
        <div className="card-left">
          <div className="card-icon">🧾</div>
          <div>
            <h3>Coin History</h3>
            <p>All coin credits & debits</p>
          </div>
        </div>
        <span className="arrow">›</span>
      </div>
    </div>
  );
}

export default Wallet;
