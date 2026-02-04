import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/wallet.css";
import adImage from "../assets/ad.jpg"; 

function Wallet() {
  const [coins, setCoins] = useState(0);
  const navigate = useNavigate();
const [showAd, setShowAd] = useState(false);
const [timeLeft, setTimeLeft] = useState(15);

  /* =====================
     LOAD COIN BALANCE
  ===================== */
 useEffect(() => {
  const fetchCoins = async () => {
    try {
      const res = await API.get("/auth/me");
      setCoins(res.data.coins);
    } catch (err) {
      console.error(err);
      alert("Failed to load wallet");
    }
  };

  fetchCoins();
}, []);

    

  /* =====================
     WATCH AD → +1 COIN
  ===================== */
  const startAd = () => {
  setTimeLeft(15);
  setShowAd(true);
};

useEffect(() => {
  if (!showAd) return;

  if (timeLeft === 0) {
    finishAd();
    return;
  }

  const timer = setTimeout(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [showAd, timeLeft]);
const finishAd = async () => {
  try {
    const res = await API.post("/wallet/watch-ad");
    alert(res.data.msg);

    if (typeof res.data.coins === "number") {
      setCoins(res.data.coins);
    }
  } catch (err) {
    if (err.response?.status === 429) {
      alert(err.response.data.msg);
    } else {
      alert("Ad reward failed");
    }
  } finally {
    setShowAd(false);
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
      <div className="balance-text">🪙 {coins}<p>Available Coins</p> </div>

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
      <button
  className="action-btn"
  onClick={startAd}
  disabled={showAd}
>
  {showAd ? "Watching..." : "Watch"}
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
      {showAd && (
  <div className="ad-overlay">
    <img src={adImage} alt="Advertisement" />
    <div className="ad-timer">
      Ad ends in {timeLeft}s
    </div>
  </div>
)}

    </div>
  );
}

export default Wallet;
