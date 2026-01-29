import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/wallet.css";

function Wallet() {
  const [coins, setCoins] = useState(0);
  const navigate = useNavigate();

  /* =====================
     LOAD COIN BALANCE
  ===================== */
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await API.get("/wallet");
        setCoins(res.data.coins);
      } catch {
        alert("Failed to load wallet");
      }
    };
    fetchWallet();
  }, []);

  /* =====================
     WATCH AD → +1 COIN
  ===================== */
  const watchAd = async () => {
    try {
      await API.post("/wallet/watch-ad");
      alert("+1 coin added 🪙");
      setCoins((prev) => prev + 1);
    } catch {
      alert("Ad reward failed");
    }
  };

  return (
    <div className="screen">
      {/* BACK */}
      <i
        className="material-icons"
        onClick={() => navigate("/entry")}
      >
        arrow_back
      </i>

      <h1>My Coins</h1>

      {/* COIN BALANCE */}
      <div className="balance">
        
      </div>
      <div className="balance-text">🪙 {coins}</div>
<p>Available Coins</p> 
      {/* BUY COINS */}
      <div className="card">
        <div className="left-part">
          <div className="icon-box">
            <i className="material-icons">paid</i>
          </div>
          <div>
            <div className="text-title">Buy Coins</div>
            <div className="sub-text">Purchase using real money</div>
          </div>
        </div>
        <button
          className="action-btn"
          onClick={() => navigate("/buy-coins")}
        >
          Buy
        </button>
      </div>

      {/* WATCH AD */}
      <div className="card">
        <div className="left-part">
          <div className="icon-box">
            <i className="material-icons">smart_display</i>
          </div>
          <div>
            <div className="text-title">Watch Ad</div>
            <div className="sub-text">Get 1 free coin</div>
          </div>
        </div>
        <button className="action-btn" onClick={watchAd}>
          Watch
        </button>
      </div>

      {/* REFER */}
      <div className="card">
        <div className="left-part">
          <div className="icon-box">
            <i className="material-icons">group</i>
          </div>
          <div>
            <div className="text-title">Refer & Earn</div>
            <div className="sub-text">Invite friends & earn coins</div>
          </div>
        </div>
        <button
          className="action-btn"
          onClick={() => navigate("/refer")}
        >
          Refer
        </button>
      </div>

      {/* QUICK ACTIONS */}
      <div className="section-title">Quick Actions</div>

      <div
        className="quick-card"
        onClick={() => navigate("/transactions")}
      >
        <div className="left-part">
          <div className="quick-icon">
            <i className="material-icons">receipt_long</i>
          </div>
          <div>
            <div className="text-title">Coin History</div>
            <div className="sub-text">
              All coin credits & debits
            </div>
          </div>
        </div>
        <div>›</div>
      </div>
    </div>
  );
}

export default Wallet;
